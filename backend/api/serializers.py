from rest_framework import serializers
from .models import Usuario,Producto,Pedido,PedidoDetalle # Importa tu modelo personalizado

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        exclude = ["groups", "user_permissions", "is_active", "is_staff"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        #  crear el usuario
        usuario = Usuario.objects.create_user(**validated_data)
        return usuario

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    
    
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = "__all__"

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = "__all__"

class PedidoDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedidoDetalle
        fields = "__all__"

class PedidoDetalleConProductoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer()
    class Meta:
        model = PedidoDetalle
        fields = ['detalle_id', 'producto', 'cantidad']

class PedidoConDetallesSerializer(serializers.ModelSerializer):
    detalles = PedidoDetalleConProductoSerializer(many=True, read_only=True)
    class Meta:
        model = Pedido
        fields = '__all__'