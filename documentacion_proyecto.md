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
5. [Conclusión](#conclusión)
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
