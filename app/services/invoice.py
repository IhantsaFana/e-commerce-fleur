from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from app.models.order import Order


INVOICE_DIR = Path("invoices")
INVOICE_DIR.mkdir(exist_ok=True)


def generate_invoice(order: Order) -> str:
    filename = f"facture_{order.id}.pdf"
    filepath = INVOICE_DIR / filename

    pdf = canvas.Canvas(
        str(filepath),
        pagesize=A4
    )

    width, height = A4

    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawString(
        50,
        height - 50,
        "FACTURE"
    )

    pdf.setFont("Helvetica", 11)

    pdf.drawString(
        50,
        height - 90,
        f"Commande : #{order.id}"
    )

    pdf.drawString(
        50,
        height - 110,
        f"Nom : {order.user.lastname}"
    )

    pdf.drawString(
        50,
        height - 130,
        f"Prenom : {order.user.firstname}"
    )

    pdf.drawString(
        50,
        height - 150,
        f"Date : {order.created_at}"
    )

    y = height - 180

    pdf.setFont("Helvetica-Bold", 11)

    pdf.drawString(50, y, "Produit")
    pdf.drawString(300, y, "Quantité")
    pdf.drawString(380, y, "Prix")
    pdf.drawString(460, y, "Sous-total")

    y -= 25

    pdf.setFont("Helvetica", 10)

    for item in order.items:

        pdf.drawString(
            50,
            y,
            item.product.name
        )

        pdf.drawString(
            300,
            y,
            str(item.quantity)
        )

        pdf.drawString(
            380,
            y,
            f"{item.unit_price} Ar"
        )

        pdf.drawString(
            460,
            y,
            f"{item.subtotal} Ar"
        )

        y -= 20

    y -= 20

    pdf.setFont("Helvetica-Bold", 13)

    pdf.drawString(
        380,
        y,
        f"TOTAL : {order.total} Ar"
    )

    y -= 40

    pdf.setFont("Helvetica", 10)

    pdf.drawString(
        50,
        y,
        "Statut du paiement : PAID"
    )

    pdf.save()

    return str(filepath)