
from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_db, get_current_user

from app.models.user import User
from app.models.cart import Cart
from app.models.product import Product
from app.models.cart_items import CartItem

from app.schemas.cart import CartItemCreate, CartItemUpdate


router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)

# Creation d'un panier
@router.post("/items")
def add_to_cart(
        item_data: CartItemCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    # Vérifier la quantité
    if item_data.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="La quantité doit être supérieure à 0"
        )

    # Vérifier que le produit est disponible
    product = db.query(Product).filter(
        Product.id == item_data.product_id,
        Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Produit introuvable"
        )

    # Vérifier le stock
    if item_data.quantity > product.stock:
        raise HTTPException(
            status_code=400,
            detail="Stock insuffisant"
        )

    # Récupérer ou créer le panier
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.flush()

    # Vérifier si le produit est déjà dans le panier
    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product.id
    ).first()

    if cart_item:
        new_quantity = cart_item.quantity + item_data.quantity

        if new_quantity > product.stock:
            raise HTTPException(
                status_code=400,
                detail="Stock insuffisant"
            )

        cart_item.quantity = new_quantity

    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=product.id,
            quantity=item_data.quantity
        )

        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)

    return {
        "message": "Produit ajouté au panier",
        "cart_item_id": cart_item.id,
        "product_id": product.id,
        "quantity": cart_item.quantity
    }

# Afficher le panier
@router.get("")
def get_cart(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        return {
            "id": None,
            "items": [],
            "total": 0
        }

    items = []
    total = Decimal("0")

    for cart_item in cart.items:
        product = cart_item.product

        unit_price = product.price
        subtotal = unit_price * cart_item.quantity

        items.append({
            "id": cart_item.id,
            "product_id": product.id,
            "product_name": product.name,
            "quantity": cart_item.quantity,
            "unit_price": unit_price,
            "subtotal": subtotal
        })

        total += subtotal

    return {
        "id": cart.id,
        "items": items,
        "total": total
    }

# Modification de la quantite dans le panier
@router.put("/items/{item_id}")
def update_cart_item(
        item_id: int,
        item_data: CartItemUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    if item_data.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="La quantité doit être supérieure à 0"
        )

    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Panier introuvable"
        )

    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail="Article introuvable dans le panier"
        )

    product = db.query(Product).filter(
        Product.id == cart_item.product_id,
        Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Produit introuvable"
        )

    if item_data.quantity > product.stock:
        raise HTTPException(
            status_code=400,
            detail="Stock insuffisant"
        )

    cart_item.quantity = item_data.quantity

    db.commit()
    db.refresh(cart_item)

    return {
        "message": "Quantité mise à jour",
        "cart_item_id": cart_item.id,
        "quantity": cart_item.quantity
    }

# Suppression d'un produit dans le panier
@router.delete("/items/{item_id}")
def remove_cart_item(
        item_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Panier introuvable"
        )

    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail="Article introuvable dans le panier"
        )

    db.delete(cart_item)
    db.commit()

    return {
        "message": "Article supprimé du panier"
    }