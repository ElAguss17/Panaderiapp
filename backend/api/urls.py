from django.urls import path
from . import views
from rest_framework import routers
from .views import ProductoViewSet, PedidoViewSet, PedidoDetalleViewSet, UsuarioViewSet
from api.views import CreateUsuarioView  # Quita los ViewSet de aquí

router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'pedidosdetalle', PedidoDetalleViewSet)

urlpatterns = router.urls