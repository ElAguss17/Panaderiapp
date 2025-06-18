# main.tf vacío. Toda la definición de red está en network.tf.

# Definimos primero la base de datos para que se cree antes que las instancias EC2
resource "aws_db_subnet_group" "default" {
  name       = "main-db-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
  tags = {
    Name = "main-db-subnet-group"
  }
}

resource "aws_security_group" "db" {
  name        = "db-sg"
  description = "Permite acceso MySQL solo desde el backend"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    security_groups = [aws_security_group.backend.id]
    description = "Permite acceso MySQL desde backend"
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "default" {
  allocated_storage    = 20
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t4g.micro"
  identifier           = "panaderiapp-db"  # Identificador personalizado para la URL del punto de enlace
  db_name              = "panaderia"
  username             = "admin"
  password             = "panaderia1234"
  db_subnet_group_name = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.backend.id]
  skip_final_snapshot  = true
  publicly_accessible  = false
}

# Security Group para backend
resource "aws_security_group" "backend" {
  name        = "backend-sg"
  description = "Permite trafico interno, desde el frontend y SSH"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Permite trafico HTTP backend"
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Permite SSH"
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Security Group para frontend
resource "aws_security_group" "frontend" {
  name        = "frontend-sg"
  description = "Permite trafico HTTP/HTTPS y SSH"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Permite trafico HTTP"
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Permite trafico HTTPS"
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Permite SSH"
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Ahora que la base de datos está definida, creamos las instancias EC2
# Instancia EC2 para el backend (Django) - Con dependencia explícita de la base de datos
resource "aws_instance" "backend" {
  ami           = var.backend_ami_id
  instance_type = var.backend_instance_type
  subnet_id     = aws_subnet.public_a.id
  vpc_security_group_ids = [aws_security_group.backend.id]
  key_name      = var.ec2_key_name
  private_ip    = "10.0.1.20"
  user_data_replace_on_change = true 
  # Aseguramos que la base de datos se cree antes
  depends_on = [aws_db_instance.default]
  
  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y docker.io nano curl cron
    systemctl start docker
    systemctl enable docker
    
    docker run -d --restart always --name backend -p 8000:8000 \
      -e DB_HOST=${aws_db_instance.default.address} \
      -e DB_PORT=3306 \
      -e DB_USER=admin \
      -e DB_PWD=panaderia1234 \
      -e DB_NAME=panaderia \
      agustin17/panaderiapp-backend:latest
  EOF
  


  tags = {
    Name = "backend-ec2"
  }
}

# Instancia EC2 para el frontend
resource "aws_instance" "frontend" {
  ami           = var.frontend_ami_id
  instance_type = var.frontend_instance_type
  subnet_id     = aws_subnet.public_a.id
  vpc_security_group_ids = [aws_security_group.frontend.id]
  key_name      = var.ec2_key_name
  private_ip    = "10.0.1.10"
  user_data_replace_on_change = true
  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y docker.io nano curl cron
    systemctl start docker
    systemctl enable docker
    docker run -d --restart always --name frontend -p 80:80 agustin17/panaderiapp-frontend:https
  EOF
  
  tags = {
    Name = "frontend-ec2"
  }
}

resource "aws_key_pair" "default" {
  key_name   = "ssh-key-panaderiapp"
  public_key = file("~/.ssh/id_rsa.pub") # Cambia la ruta si tu clave pública está en otro sitio
}

output "db_endpoint" {
  value = aws_db_instance.default.endpoint
}

output "frontend_public_ip" {
  value = aws_instance.frontend.public_ip
  description = "IP pública dinámica de la instancia frontend"
}
