from django.shortcuts import render
from .models import Usuario, Producto, Pedido, PedidoDetalle
from rest_framework import generics, viewsets
from .serializers import UsuarioSerializer, ProductoSerializer, PedidoSerializer, PedidoDetalleSerializer, PedidoConDetallesSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .custom_jwt_serializers import CustomTokenObtainPairSerializer
from datetime import date



class CreateUsuarioView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [AllowAny]

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoConDetallesSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        usuario_id = self.request.query_params.get('usuario')
        if usuario_id:
            queryset = queryset.filter(cliente_id=usuario_id)
        return queryset

class PedidoDetalleViewSet(viewsets.ModelViewSet):
    queryset = PedidoDetalle.objects.all()
    serializer_class = PedidoDetalleSerializer
    permission_classes = [AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class PedidosFuturosView(generics.ListAPIView, generics.DestroyAPIView):
    serializer_class = PedidoConDetallesSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        usuario_id = self.request.query_params.get('usuario')
        hoy = date.today()
        qs = Pedido.objects.filter(fecha_entrega__gt=hoy)
        if usuario_id:
            qs = qs.filter(cliente_id=usuario_id)
        return qs

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class PedidosPasadosView(generics.ListAPIView):
    serializer_class = PedidoConDetallesSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        usuario_id = self.request.query_params.get('usuario')
        hoy = date.today()
        qs = Pedido.objects.filter(fecha_entrega__lte=hoy)
        if usuario_id:
            qs = qs.filter(cliente_id=usuario_id)
        return qs