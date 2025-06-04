from django.contrib import admin
from django.urls import path, include
from api.views import CreateUsuarioView, ProductoViewSet, PedidoViewSet, PedidoDetalleViewSet, UsuarioViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'productos', ProductoViewSet) 


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUsuarioView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path("api/", include(router.urls)), 
    # path("api/", include("api.urls")), 
]