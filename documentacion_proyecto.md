# Documentación del Proyecto: PanaderiApp

## Índice

1. [Introducción](#introducción)
2. [Backend](#backend)
   - [Tecnologías](#tecnologías-backend)
   - [Estructura](#estructura-del-backend)
   - [API REST](#api-rest)
   - [Autenticación](#autenticación)
   - [Base de Datos](#base-de-datos)
3. [Frontend](#frontend)
   - [Tecnologías](#tecnologías-frontend)
   - [Estructura](#estructura-del-frontend)
   - [Componentes Clave](#componentes-clave)
   - [Seguridad HTTPS](#seguridad-https)
4. [Despliegue](#despliegue)
   - [Infraestructura como Código](#infraestructura-como-código)
   - [Contenedores Docker](#contenedores-docker)
   - [Redes y Seguridad](#redes-y-seguridad)
   - [Dominio y DNS](#dominio-y-dns)
5. [Instrucciones de Desarrollo y Despliegue](#instrucciones-de-desarrollo-y-despliegue)
   - [Configuración del Entorno Local](#configuración-del-entorno-local)
   - [Despliegue en Producción](#despliegue-en-producción)
   - [Actualización de la Aplicación](#actualización-de-la-aplicación)
   - [Mantenimiento de Certificados SSL](#mantenimiento-de-certificados-ssl)
6. [Guía de Resolución de Problemas](#guía-de-resolución-de-problemas)
   - [Problemas de Conexión](#problemas-de-conexión)
   - [Errores de Certificados SSL](#errores-de-certificados-ssl)
   - [Problemas de Base de Datos](#problemas-de-base-de-datos)
   - [Errores en el Despliegue con Terraform](#errores-en-el-despliegue-con-terraform)
7. [Conclusión](#conclusión)
   - [Arquitectura General](#arquitectura-general)
   - [Flujo de Datos](#flujo-de-datos)
   - [Escalabilidad](#escalabilidad)
   - [Mantenimiento](#mantenimiento)

## Introducción

PanaderiApp es una aplicación web full-stack diseñada para la gestión integral de panaderías. Facilita la administración de productos, pedidos y clientes, optimizando los procesos diarios del negocio. El sistema permite realizar un seguimiento detallado de inventario, gestión de pedidos recurrentes y generación automática de facturas.

La arquitectura del proyecto sigue un enfoque de microservicios, con frontend y backend separados, lo que permite el desarrollo independiente de cada componente y facilita el mantenimiento y la escalabilidad.

## Backend

### Tecnologías Backend

El backend de PanaderiApp se basa en Django y Django REST Framework, proporcionando una API RESTful robusta y segura. Las principales tecnologías utilizadas son:

- **Django**: Framework web en Python que sigue el patrón MVT (Modelo-Vista-Plantilla)
- **Django REST Framework**: Extensión de Django para crear APIs RESTful
- **MySQL**: Sistema de gestión de bases de datos relacional
- **JWT**: Para autenticación basada en tokens
- **Gunicorn**: Servidor WSGI para entornos de producción

### Estructura del Backend

La estructura del backend sigue las convenciones de Django, organizada en aplicaciones que encapsulan funcionalidades específicas:

```
backend/
├── api/                 # Aplicación principal
│   ├── models.py        # Modelos de datos
│   ├── views.py         # Vistas para usuarios y productos
│   ├── views_factura.py # Vistas específicas para facturas
│   ├── serializers.py   # Serializadores para API REST
│   └── urls.py          # Enrutamiento de la API
└── backend/             # Configuración del proyecto
    ├── settings.py      # Configuración general
    └── urls.py          # URLs globales
```

### API REST

El backend expone endpoints RESTful para todas las operaciones CRUD:

| Endpoint              | Métodos               | Descripción                                |
|-----------------------|-----------------------|--------------------------------------------|
| `/api/token/`         | POST                  | Obtención de tokens JWT                    |
| `/api/token/refresh/` | POST                  | Renovación de tokens JWT                   |
| `/api/productos/`     | GET, POST             | Listado y creación de productos            |
| `/api/productos/:id/` | GET, PUT, DELETE      | Operaciones sobre productos específicos    |
| `/api/pedidos/`       | GET, POST             | Gestión de pedidos                         |
| `/api/factura-pdf/:id/` | GET                 | Generación de facturas en PDF              |

### Autenticación

La autenticación se implementa mediante JWT (JSON Web Tokens), ofreciendo:

- Tokens de acceso de corta duración
- Tokens de refresco para renovar sesiones
- Roles de usuario (administrador, cliente, panadero)
- Protección de rutas según el rol del usuario

### Base de Datos

El modelo de datos incluye las siguientes entidades principales:

- **Usuarios**: Administradores, clientes y panaderos
- **Productos**: Catálogo de productos de panadería
- **Pedidos**: Órdenes realizadas por clientes
- **Detalles de pedido**: Productos incluidos en cada pedido

La base de datos MySQL se ejecuta en AWS RDS, ofreciendo alta disponibilidad, copias de seguridad automáticas y rendimiento optimizado.

#### Estructura de Tablas

```sql
-- Tabla de Usuarios
CREATE TABLE `Usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `es_panadero` tinyint(1) NOT NULL,
  `es_cliente` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);

-- Tabla de Productos
CREATE TABLE `Productos` (
  `producto_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(300) NOT NULL,
  `precio` decimal(6,2) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  PRIMARY KEY (`producto_id`)
);

-- Tabla de Pedidos
CREATE TABLE `Pedidos` (
  `pedido_id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime(6) NOT NULL,
  `cliente_id` bigint NOT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `recurrente` tinyint(1) NOT NULL,
  `pagada` tinyint(1) NOT NULL,
  PRIMARY KEY (`pedido_id`),
  KEY `Pedidos_cliente_id_afbb0de7_fk_Usuarios_id` (`cliente_id`),
  CONSTRAINT `Pedidos_cliente_id_afbb0de7_fk_Usuarios_id` FOREIGN KEY (`cliente_id`) REFERENCES `Usuarios` (`id`)
);

-- Tabla de Detalles de Pedido
CREATE TABLE `Detalles_Pedido` (
  `detalle_id` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `pedido_id` int NOT NULL,
  `producto_id` int NOT NULL,
  PRIMARY KEY (`detalle_id`),
  KEY `Detalles_Pedido_pedido_id_2b0d0091_fk_Pedidos_pedido_id` (`pedido_id`),
  KEY `Detalles_Pedido_producto_id_51a8f8ab_fk_Productos_producto_id` (`producto_id`),
  CONSTRAINT `Detalles_Pedido_pedido_id_2b0d0091_fk_Pedidos_pedido_id` FOREIGN KEY (`pedido_id`) REFERENCES `Pedidos` (`pedido_id`),
  CONSTRAINT `Detalles_Pedido_producto_id_51a8f8ab_fk_Productos_producto_id` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`)
);
```

#### Inicialización de Datos

El proyecto incluye un script SQL completo para inicializar la base de datos con datos de ejemplo:

- Usuarios con diferentes roles (administrador, panadero, cliente)
- Catálogo de productos de panadería con precios y categorías
- Pedidos de ejemplo con sus correspondientes detalles
- Relaciones correctamente establecidas entre las tablas

Para entornos de desarrollo, se proporciona un archivo `docker-compose.yaml` que configura una base de datos MySQL local y ejecuta automáticamente el script de inicialización:

```yaml
services:
  db:
    image: mysql:8
    container_name: base_de_datos
    restart: always
    environment:
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PWD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PWD}
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  db_data:
    driver: local
```

Para utilizar este archivo, es necesario crear un archivo `.env` con las siguientes variables:
```
DB_NAME=panaderia
DB_USER=admin
DB_PWD=panaderia1234
DB_ROOT_PWD=rootpassword
```

Y luego iniciar la base de datos con:
```bash
cd db_panaderia
docker-compose up -d
```

## Frontend

### Tecnologías Frontend

El frontend está desarrollado con React y utiliza:

- **React**: Biblioteca JavaScript para interfaces de usuario
- **React Router**: Para navegación entre componentes
- **Axios**: Cliente HTTP para comunicarse con la API
- **Bootstrap**: Framework CSS para diseño responsive
- **Vite**: Herramienta de compilación rápida y eficiente

### Estructura del Frontend

La aplicación frontend sigue una arquitectura basada en componentes:

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas de la aplicación
│   ├── api.js          # Cliente API centralizado
│   ├── App.jsx         # Componente raíz
│   └── main.jsx        # Punto de entrada
├── public/             # Recursos estáticos
└── ssl_certs/          # Certificados SSL
```

### Componentes Clave

El frontend incluye varios componentes fundamentales:

- **Layout**: Estructura general de la aplicación con navegación
- **CarritoPedidos**: Gestión del carrito de compra
- **ListaArticulos**: Visualización y gestión de productos
- **ProtectedRoute**: Componente de seguridad para rutas protegidas
- **RegistroArticulo**: Formulario para crear/editar productos

### Seguridad HTTPS

La aplicación implementa HTTPS mediante:

- Certificados SSL generados con Let's Encrypt/Certbot
- Configuración de Apache para TLS
- Redirección automática de HTTP a HTTPS
- Headers de seguridad adecuados

## Despliegue

### Infraestructura como Código

Todo el despliegue se gestiona mediante Terraform, permitiendo:

- Aprovisionamiento reproducible de la infraestructura
- Control de versiones de la configuración
- Despliegues consistentes entre entornos
- Fácil escalado y modificación

La infraestructura se define en varios archivos:

```
terraform/
├── main.tf       # Recursos principales (EC2, RDS)
├── network.tf    # Configuración de red (VPC, subredes)
├── variables.tf  # Variables para personalización
└── s3.tf         # Recursos de almacenamiento S3
```

### Contenedores Docker

Tanto el frontend como el backend se despliegan como contenedores Docker:

- **Backend**: Contiene Django, Gunicorn y dependencias necesarias
- **Frontend**: Implementa un servidor Apache con la aplicación React compilada

Los Dockerfiles incluyen:
- Construcción multi-etapa para optimizar tamaño
- Configuraciones específicas para producción
- Soporte para HTTPS en el frontend
- Variables de entorno para configuración dinámica

### Redes y Seguridad

La arquitectura de red en AWS incluye:

- **VPC dedicada** con subredes públicas y privadas
- **Security Groups** para control granular de tráfico
- Acceso a internet mediante **NAT Gateway**
- **RDS** en subred privada para mayor seguridad

Las instancias EC2 utilizan claves SSH para acceso seguro y los security groups limitan el acceso a los puertos necesarios:
- Frontend: 80 (HTTP), 443 (HTTPS), 22 (SSH)
- Backend: 8000 (API), 22 (SSH)
- RDS: 3306 (MySQL, solo desde backend)

### Dominio y DNS

Para el acceso a la aplicación se utiliza:

- **DuckDNS** como proveedor de DNS dinámico
- Actualización automática del registro DNS cada 5 minutos
- Certificado SSL vinculado al dominio panaderiapp.duckdns.org
- Redirección automática a HTTPS

#### Configuración de DuckDNS

Se ha implementado un script automatizado (`duckdns_scrip.sh`) para configurar y mantener actualizado el registro DNS:

```bash
#!/bin/bash
# Script para configurar DuckDNS en la instancia EC2 frontend

# Instalar dependencias
sudo apt-get update
sudo apt-get install -y cron curl

# Crear directorio y script de actualización
mkdir -p /home/ubuntu/duckdns
cat > /home/ubuntu/duckdns/duck.sh << 'EOF'
#!/bin/bash
echo url="https://www.duckdns.org/update?domains=panaderiapp&token=YOUR_TOKEN&ip=" | curl -k -o ~/duckdns/duck.log -K -
EOF

# Establecer permisos y programar con cron
chmod 700 /home/ubuntu/duckdns/duck.sh
crontab -l | { cat; echo "*/5 * * * * ~/duckdns/duck.sh"; } | crontab -
```

El script realiza las siguientes acciones:
1. Instala las dependencias necesarias (cron y curl)
2. Crea un directorio dedicado para DuckDNS
3. Genera un script de actualización que contacta con DuckDNS para mantener la IP actualizada
4. Programa la ejecución del script cada 5 minutos mediante cron

Este enfoque asegura que la dirección IP pública de la instancia EC2 siempre esté asociada al dominio `panaderiapp.duckdns.org`, incluso si cambia.

## Instrucciones de Desarrollo y Despliegue

### Configuración del Entorno Local

#### Requisitos Previos
- Docker y Docker Compose
- Node.js v16+ y npm
- Python 3.11+
- Git

#### Configuración del Backend
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/panaderiapp.git
   cd panaderiapp/backend
   ```

2. Crear un entorno virtual de Python:
   ```bash
   python -m venv env
   source env/bin/activate  # En Windows: env\Scripts\activate
   ```

3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Configurar la base de datos local:
   ```bash
   cd ../db_panaderia
   docker-compose up -d
   ```

5. Aplicar migraciones y crear superusuario:
   ```bash
   cd ../backend
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. Ejecutar el servidor de desarrollo:
   ```bash
   python manage.py runserver
   ```

#### Configuración del Frontend
1. Instalar dependencias:
   ```bash
   cd ../frontend
   npm install
   ```

2. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Edita .env para usar la URL correcta del backend
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Acceder a la aplicación en `http://localhost:5173`

### Despliegue en Producción

#### Usando Terraform
1. Configurar credenciales de AWS:
   ```bash
   export AWS_ACCESS_KEY_ID="tu-access-key"
   export AWS_SECRET_ACCESS_KEY="tu-secret-key"
   export AWS_DEFAULT_REGION="us-east-1"
   ```

2. Inicializar Terraform:
   ```bash
   cd terraform
   terraform init
   ```

3. Validar la configuración:
   ```bash
   terraform validate
   ```

4. Planificar el despliegue:
   ```bash
   terraform plan -out=tfplan
   ```

5. Aplicar la configuración:
   ```bash
   terraform apply tfplan
   ```

6. Obtener las direcciones IP de las instancias:
   ```bash
   terraform output frontend_ip
   terraform output backend_ip
   ```

#### Despliegue Manual de Contenedores
1. Construir y publicar las imágenes:
   ```bash
   # Backend
   cd backend
   docker build -t panaderiapp-backend:latest .
   
   # Frontend
   cd ../frontend
   docker build -t panaderiapp-frontend:latest .
   ```

2. Conectarse a las instancias y ejecutar los contenedores:
   ```bash
   # Backend
   docker run -d --name backend \
     -e DB_HOST=endpoint-rds \
     -e DB_USER=admin \
     -e DB_PASSWORD=panaderia1234 \
     -e DB_NAME=panaderia \
     -p 8000:8000 \
     panaderiapp-backend:latest
   
   # Frontend
   docker run -d --name frontend \
     -p 80:80 \
     -p 443:443 \
     panaderiapp-frontend:latest
   ```

### Actualización de la Aplicación

#### Backend
1. Actualizar el código:
   ```bash
   cd backend
   git pull
   ```

2. Reconstruir y reiniciar el contenedor:
   ```bash
   docker build -t panaderiapp-backend:latest .
   docker stop backend
   docker rm backend
   docker run -d --name backend -p 8000:8000 [opciones] panaderiapp-backend:latest
   ```

#### Frontend
1. Actualizar el código:
   ```bash
   cd frontend
   git pull
   ```

2. Reconstruir y reiniciar el contenedor:
   ```bash
   docker build -t panaderiapp-frontend:latest .
   docker stop frontend
   docker rm frontend
   docker run -d --name frontend -p 80:80 -p 443:443 [opciones] panaderiapp-frontend:latest
   ```

### Mantenimiento de Certificados SSL

#### Renovación Manual de Certificados
1. En el servidor frontend:
   ```bash
   sudo certbot renew
   ```

2. Copiar los certificados renovados:
   ```bash
   sudo cp /etc/letsencrypt/live/panaderiapp.duckdns.org/fullchain.pem /path/to/project/frontend/ssl_certs/
   sudo cp /etc/letsencrypt/live/panaderiapp.duckdns.org/privkey.pem /path/to/project/frontend/ssl_certs/
   ```

3. Reiniciar el contenedor frontend:
   ```bash
   docker stop frontend
   docker rm frontend
   docker run -d --name frontend -p 80:80 -p 443:443 [opciones] panaderiapp-frontend:latest
   ```

#### Automatización de la Renovación
1. Crear script de renovación (`renew_ssl.sh`):
   ```bash
   #!/bin/bash
   sudo certbot renew --quiet
   sudo cp /etc/letsencrypt/live/panaderiapp.duckdns.org/fullchain.pem /path/to/project/frontend/ssl_certs/
   sudo cp /etc/letsencrypt/live/panaderiapp.duckdns.org/privkey.pem /path/to/project/frontend/ssl_certs/
   docker stop frontend
   docker rm frontend
   docker run -d --name frontend -p 80:80 -p 443:443 [opciones] panaderiapp-frontend:latest
   ```

2. Agregar permiso de ejecución y programar con cron:
   ```bash
   chmod +x renew_ssl.sh
   crontab -e
   # Agregar: 0 3 1 * * /path/to/renew_ssl.sh
   ```

## Guía de Resolución de Problemas

### Problemas de Conexión

#### El frontend no puede conectar con el backend
1. **Verificar que el backend está en ejecución**:
   ```bash
   docker ps | grep backend
   ```

2. **Comprobar reglas de security group**:
   - Verificar que el puerto 8000 está abierto desde la subred del frontend.
   - Comprobar desde la consola de AWS que la regla de entrada está correctamente configurada.

3. **Verificar la configuración de proxy en Apache**:
   ```bash
   docker exec -it frontend cat /usr/local/apache2/conf/conf.d/app.conf
   ```
   - Asegurarse de que la IP del backend es correcta en las directivas ProxyPass.

4. **Comprobar logs de Apache**:
   ```bash
   docker logs frontend
   ```

#### Problemas con las peticiones CORS
1. **Verificar configuración CORS en el backend**:
   - Comprobar la configuración en `settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://panaderiapp.duckdns.org",
       "http://localhost:5173",
   ]
   ```

2. **Inspeccionar cabeceras de respuesta**:
   - Usar las herramientas de desarrollo del navegador para verificar que las cabeceras CORS están presentes en las respuestas.

### Errores de Certificados SSL

#### Certificado no válido o expirado
1. **Comprobar fecha de vencimiento**:
   ```bash
   openssl x509 -in /path/to/project/frontend/ssl_certs/fullchain.pem -noout -enddate
   ```

2. **Renovar el certificado**:
   ```bash
   sudo certbot renew --force-renewal -d panaderiapp.duckdns.org
   ```

3. **Verificar que los certificados se copiaron correctamente**:
   ```bash
   ls -la /path/to/project/frontend/ssl_certs/
   ```

#### Problemas con la configuración SSL en Apache
1. **Verificar la configuración SSL**:
   ```bash
   docker exec -it frontend cat /usr/local/apache2/conf/conf.d/ssl.conf
   ```

2. **Comprobar que los módulos SSL están habilitados**:
   ```bash
   docker exec -it frontend apachectl -M | grep ssl
   ```

### Problemas de Base de Datos

#### No se puede conectar a la base de datos
1. **Verificar credenciales**:
   - Revisar variables de entorno o configuración en `settings.py`

2. **Comprobar reglas de security group**:
   - Verificar que el puerto 3306 está abierto desde la subred del backend.

3. **Verificar estado de RDS**:
   - Comprobar en la consola de AWS que la instancia RDS está en estado "Available".

4. **Probar conexión manualmente**:
   ```bash
   docker exec -it backend mysql -h endpoint-rds -u admin -p
   ```

#### Errores en migraciones
1. **Ver logs de migraciones**:
   ```bash
   docker exec -it backend python manage.py showmigrations
   ```

2. **Aplicar migraciones específicas**:
   ```bash
   docker exec -it backend python manage.py migrate api
   ```

### Errores en el Despliegue con Terraform

#### Error "No se puede crear el recurso"
1. **Verificar límites de servicio**:
   - Comprobar cuotas de AWS para instancias EC2, RDS, etc.

2. **Revisar mensajes de error**:
   ```bash
   terraform plan -out=tfplan
   ```

3. **Verificar estado actual**:
   ```bash
   terraform state list
   ```

#### Problemas para destruir recursos
1. **Forzar eliminación**:
   ```bash
   terraform destroy -target=aws_instance.frontend
   ```

2. **Eliminar recursos manualmente** en la consola de AWS y luego:
   ```bash
   terraform refresh
   ```

## Conclusión

### Arquitectura General

PanaderiApp implementa una arquitectura de tres capas:

1. **Capa de presentación**: Frontend React servido por Apache
2. **Capa de aplicación**: API REST Django alojada en contenedor Docker
3. **Capa de datos**: MySQL en AWS RDS

Esta separación proporciona:
- Desarrollo independiente de componentes
- Mayor testabilidad
- Mejor rendimiento mediante optimización específica

### Flujo de Datos

El flujo de información sigue un patrón claro:

1. El cliente accede a través del dominio DuckDNS
2. Las peticiones las recibe el servidor Apache (frontend)
3. Las solicitudes a la API se redirigen mediante proxy al backend
4. El backend procesa las peticiones y se comunica con la base de datos
5. Los datos retornan siguiendo la misma ruta en sentido inverso

### Escalabilidad

La arquitectura está diseñada para ser escalable:

- **Horizontalmente**: Añadiendo más instancias frontend/backend
- **Verticalmente**: Aumentando recursos de las instancias existentes
- **Base de datos**: Utilizando las características de escalado de AWS RDS

### Mantenimiento

El mantenimiento del sistema incluye:

- **Renovación de certificados SSL**: Automatizado mediante cron
- **Actualizaciones de software**: Simplificadas gracias a Docker
- **Gestión de infraestructura**: Centralizada en Terraform
- **Monitorización**: Posible integración con AWS CloudWatch

La combinación de estas tecnologías y prácticas resulta en una aplicación robusta, segura y fácil de mantener, que proporciona todas las funcionalidades necesarias para la gestión eficiente de una panadería.
