from django.urls import path
from . import views
from rest_framework import routers
from .views import ProductoViewSet, PedidoViewSet, PedidoDetalleViewSet, UsuarioViewSet, CustomTokenObtainPairView, PedidosFuturosView, PedidosPasadosView, PanDiarioView
from api.views import CreateUsuarioView

router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'pedidosdetalle', PedidoDetalleViewSet)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('pedidos-futuros/', PedidosFuturosView.as_view(), name='pedidos-futuros'),
    path('pedidos-futuros/<int:pk>/', PedidosFuturosView.as_view(), name='pedidos-futuros-detail'),
    path('pedidos-pasados/', PedidosPasadosView.as_view(), name='pedidos-pasados'),
    path('pan-diario/', PanDiarioView.as_view(), name='pan-diario'),
] + router.urls