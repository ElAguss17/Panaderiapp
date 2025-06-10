from django.shortcuts import render
from .models import Usuario, Producto, Pedido, PedidoDetalle
from rest_framework import generics, viewsets
from .serializers import UsuarioSerializer, ProductoSerializer, PedidoSerializer, PedidoDetalleSerializer, PedidoConDetallesSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .custom_jwt_serializers import CustomTokenObtainPairSerializer
from datetime import date
from rest_framework.views import APIView
from rest_framework.response import Response



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
        user = self.request.user
        hoy = date.today()
        qs = Pedido.objects.filter(fecha_entrega__lte=hoy)
        #validar el usuarios para que solo admin y panaderos vean todos las facturas 
        if hasattr(user, 'tipo_usuario') and user.tipo_usuario == 'cliente':
            qs = qs.filter(cliente=user)
        return qs

class PanDiarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from datetime import date as dt_date
        fecha = request.query_params.get('fecha')
        if not fecha:
            fecha = dt_date.today()
        detalles = PedidoDetalle.objects.filter(
            pedido__fecha_entrega=fecha
        ).select_related('producto', 'pedido__cliente')

        resultado = {}
        for detalle in detalles:
            prioridad = str(detalle.pedido.cliente.prioridad)
            if prioridad not in resultado:
                resultado[prioridad] = {}
            prod_id = detalle.producto.producto_id
            if prod_id not in resultado[prioridad]:
                resultado[prioridad][prod_id] = {
                    "producto_id": prod_id,
                    "nombre": detalle.producto.nombre,
                    "cantidad_total": 0
                }
            resultado[prioridad][prod_id]["cantidad_total"] += detalle.cantidad

        resultado_final = {p: list(prods.values()) for p, prods in resultado.items()}
        return Response(resultado_final)