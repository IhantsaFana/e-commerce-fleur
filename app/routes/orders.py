import os

from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from fastapi.responses import FileResponse

from app.dependencies import get_db, get_current_user, require_admin

from app.models.user import User
from app.models.cart import Cart
from app.models.order import Order
from app.models.payment import Payment
from app.models.order_item import OrderItem

from app.schemas.order import OrderResponse, OrderListResponse, OrderDetailResponse, OrderStatusUpdate

from app.schemas.payment import PaymentCreate, PaymentResult

from app.services.invoice import generate_invoice

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

# Creation de commande
@router.post("",response_model=OrderResponse, status_code=201)
def create_order(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    # 1. Récupérer le panier
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart or not cart.items:
        raise HTTPException(
            status_code=400,
            detail="Le panier est vide"
        )

    # 2. Vérifier le stock et calculer le total
    total = Decimal("0")
    order_items_data = []

    for cart_item in cart.items:

        product = cart_item.product

        if not product or not product.is_active:
            raise HTTPException(
                status_code=400,
                detail=f"Le produit {cart_item.product_id} n'est plus disponible"
            )

        if cart_item.quantity > product.stock:
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuffisant pour {product.name}"
            )

        unit_price = product.price
        subtotal = unit_price * cart_item.quantity

        total += subtotal

        order_items_data.append({
            "product_id": product.id,
            "quantity": cart_item.quantity,
            "unit_price": unit_price,
            "subtotal": subtotal,
            "product": product
        })

    # 3. Créer la commande
    order = Order(
        user_id=current_user.id,
        status="pending",
        total=total
    )

    db.add(order)
    db.flush()

    # 4. Créer les lignes de commande
    for item_data in order_items_data:

        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data["product_id"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            subtotal=item_data["subtotal"]
        )

        db.add(order_item)

        # 5. Diminuer le stock
        item_data["product"].stock -= item_data["quantity"]

    # 6. Vider le panier
    for cart_item in cart.items:
        db.delete(cart_item)

    # 7. Valider la transaction
    db.commit()

    db.refresh(order)

    return order

# Lister tous les commandes
@router.get("",response_model=list[OrderListResponse])
def get_orders(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return orders

# Lister une commande specifique
@router.get("/{order_id}",response_model=OrderDetailResponse)
def get_order(
        order_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Commande introuvable"
        )

    return order

# Changer le status du commande(envoyer ou livrer) accessible admin seulement apres payement
@router.put("/{order_id}/status", response_model=OrderDetailResponse)
def update_order_status(
        order_id: int,
        status_data: OrderStatusUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(require_admin)
    ):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Commande introuvable"
        )

    allowed_statuses = {
        "shipped",
        "delivered"
    }

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Statut de commande invalide"
        )

    # Vérifier la transition
    if status_data.status == "shipped":
        if order.status != "confirmed":
            raise HTTPException(
                status_code=400,
                detail="La commande doit être confirmée avant expédition"
            )

    if status_data.status == "delivered":
        if order.status != "shipped":
            raise HTTPException(
                status_code=400,
                detail="La commande doit être expédiée avant livraison"
            )

    order.status = status_data.status

    db.commit()
    db.refresh(order)

    return order

# Payment avec generation de facture
@router.post("/{order_id}/pay", response_model=PaymentResult)
def pay_order(
        order_id: int,
        payment_data: PaymentCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    # 1. Vérifier que la commande appartient à l'utilisateur
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Commande introuvable"
        )

    # 2. Vérifier que la commande peut être payée
    if order.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Cette commande ne peut pas être payée"
        )

    # 3. Vérifier qu'il n'existe pas déjà un paiement
    existing_payment = db.query(Payment).filter(
        Payment.order_id == order.id
    ).first()

    if existing_payment:
        raise HTTPException(
            status_code=400,
            detail="Cette commande est déjà payée"
        )

    # 4. Créer le paiement
    payment = Payment(
        order_id=order.id,
        amount=order.total,
        payment_method=payment_data.payment_method,
        status="paid"
    )

    db.add(payment)

    # 5. Confirmer la commande
    order.status = "confirmed"

    # 6. Valider la transaction
    db.commit()

    # 7. Actualiser le paiement
    db.refresh(payment)

    # 8. Générer la facture
    invoice_path = generate_invoice(order)

    # 9. Retourner le paiement et la facture
    return {
        "payment": payment,
        "invoice": invoice_path
    }

# Annulation d'une commande
@router.post("/{order_id}/cancel", response_model=OrderDetailResponse)
def cancel_order(
        order_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    # Vérifier que la commande appartient au client
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Commande introuvable"
        )

    # Une commande déjà payée ne peut pas être annulée
    if order.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Cette commande ne peut plus être annulée"
        )

    # Annulation
    order.status = "cancelled"

    db.commit()
    db.refresh(order)

    return order

# Affichage du facture (telechargement)
@router.get("/{order_id}/invoice")
def get_invoice(
        order_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Commande introuvable"
        )

    if order.status == "pending":
        raise HTTPException(
            status_code=400,
            detail="La commande n'est pas encore payée"
        )

    invoice_path = f"invoices/facture_{order.id}.pdf"

    if not os.path.exists(invoice_path):
        raise HTTPException(
            status_code=404,
            detail="Facture introuvable"
        )

    return FileResponse(
        path=invoice_path,
        media_type="application/pdf",
        filename=f"facture_{order.id}.pdf"
    )