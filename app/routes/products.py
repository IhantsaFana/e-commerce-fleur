from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_admin
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

# reserver pour les administrateurs (utilise la fonction require_admin dans dependencies.py)
@router.post(
    "",
    response_model=ProductResponse,
    status_code=201
)
def create_product(
        product: ProductCreate,
        db: Session = Depends(get_db),
        current_user=Depends(require_admin)
    ):
    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        stock=product.stock,
        image=product.image
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@router.get("",response_model=list[ProductResponse])
def get_products(
        db: Session = Depends(get_db)
    ):
    products = db.query(Product).filter(
        Product.is_active == True
    ).all()

    return products

@router.get("/{product_id}",response_model=ProductResponse)
def get_product(
        product_id: int,
        db: Session = Depends(get_db)
    ):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Produit introuvable"
        )

    return product

# reserver pour les administrateurs (utilise la fonction require_admin dans dependencies.py)
@router.put("/{product_id}",response_model=ProductResponse)
def update_product(
        product_id: int,
        product_data: ProductUpdate,
        db: Session = Depends(get_db),
        current_user=Depends(require_admin)
    ):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Produit introuvable"
        )

    update_data = product_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product

# reserver pour les administrateurs (utilise la fonction require_admin dans dependencies.py)
@router.delete("/{product_id}")
def delete_product(
        product_id: int,
        db: Session = Depends(get_db),
        current_user=Depends(require_admin)
    ):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Produit introuvable"
        )

    product.is_active = False

    db.commit()

    return {
        "message": "Produit désactivé avec succès"
    }