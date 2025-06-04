from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password

# Tabla de Usuarios
class UsuarioManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("El usuario debe tener un nombre de usuario")
        extra_fields.setdefault('is_active', True)
        usuario_obj = self.model(username=username, **extra_fields)
        usuario_obj.set_password(password)
        usuario_obj.save(using=self._db)
        return usuario_obj

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = [
        ('admin', 'Admin'),
        ('panadero', 'Panadero'),
        ('cliente', 'Cliente'),
    ]
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=255)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    telefono = models.CharField(max_length=20)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    direccion = models.CharField(max_length=100, blank=True, null=True)
    prioridad = models.PositiveSmallIntegerField(blank=True, null=True)
    tienda = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['nombre', 'apellido', 'user_type']

    def __str__(self):
        return self.username

    @property
    def id(self):
        return self.user_id

    class Meta:
        db_table = 'Usuarios'
        constraints = [
            models.CheckConstraint(check=models.Q(prioridad__gte=1, prioridad__lte=5), name='prioridad_entre_1_y_5')
        ]

# Tabla de Productos
class Producto(models.Model):
    producto_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'Productos'

    def __str__(self):
        return self.nombre

# Tabla de Pedidos
class Pedido(models.Model):
    pedido_id = models.AutoField(primary_key=True)
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='pedidos')
    fecha = models.DateTimeField(auto_now_add=True)
    fecha_entrega = models.DateField(null=True, blank=True)  # Fecha de la primera entrega
    fecha_fin = models.DateField(null=True, blank=True)  # Fecha de la última entrega (opcional)
    recurrente = models.BooleanField(default=False)  # ¿Es un pedido diario hasta fecha_fin?

    class Meta:
        db_table = 'Pedidos'

    def __str__(self):
        return f"Pedido {self.pedido_id} de {self.cliente}"

# Tabla de Detalles de Pedidos
class PedidoDetalle(models.Model):
    detalle_id = models.AutoField(primary_key=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()

    class Meta:
        db_table = 'PedidosDetalle'

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} (Pedido {self.pedido.pedido_id})"