from django.http import HttpResponse, Http404
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from .models import Pedido

def factura_pdf(request, pedido_id):
    try:
        pedido = Pedido.objects.select_related('cliente').prefetch_related('detalles__producto').get(pk=pedido_id)
    except Pedido.DoesNotExist:
        raise Http404("Pedido no encontrado")

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="factura_{pedido_id}.pdf"'
    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4
    y = height - 50

    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, y, f"Factura Pedido #{pedido.pedido_id}")
    y -= 30
    p.setFont("Helvetica", 12)
    p.drawString(50, y, f"Cliente: {pedido.cliente.nombre} {pedido.cliente.apellido} ({pedido.cliente.username})")
    y -= 20
    p.drawString(50, y, f"Fecha de entrega: {pedido.fecha_entrega}")
    y -= 20
    p.drawString(50, y, f"Pagada: {'Sí' if pedido.pagada else 'No'}")
    y -= 30
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y, "Productos:")
    y -= 20
    p.setFont("Helvetica", 12)
    p.drawString(60, y, "Producto")
    p.drawString(260, y, "Cantidad")
    p.drawString(360, y, "Precio")
    p.drawString(460, y, "Subtotal")
    y -= 15
    p.line(50, y, 550, y)
    y -= 15
    total = 0
    for detalle in pedido.detalles.all():
        if y < 100:
            p.showPage()
            y = height - 50
        nombre = detalle.producto.nombre
        cantidad = detalle.cantidad
        precio = float(detalle.producto.precio)
        subtotal = cantidad * precio
        total += subtotal
        p.drawString(60, y, nombre)
        p.drawString(260, y, str(cantidad))
        p.drawString(360, y, f"{precio:.2f} €")
        p.drawString(460, y, f"{subtotal:.2f} €")
        y -= 20
    y -= 10
    p.line(50, y, 550, y)
    y -= 30
    p.setFont("Helvetica-Bold", 14)
    p.drawString(360, y, "Total:")
    p.drawString(460, y, f"{total:.2f} €")
    p.showPage()
    p.save()
    return response
