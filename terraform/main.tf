# main.tf vacío. Toda la definición de red está en network.tf.

# Instancia EC2 para el backend (Django)
resource "aws_instance" "backend" {
  ami           = var.backend_ami_id # ID de la AMI, variable
  instance_type = var.backend_instance_type
  subnet_id     = aws_subnet.private.id
  vpc_security_group_ids = [aws_security_group.backend.id]
  key_name      = var.ec2_key_name
  private_ip    = "10.0.2.10"
  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y docker.io
    systemctl start docker
    systemctl enable docker
    docker run -d --restart always --env-file /home/ubuntu/.env --name backend -p 8000:8000 agustin17/panaderiapp-backend:latest
  EOF
  tags = {
    Name = "backend-ec2"
  }
}

# Instancia EC2 para el frontend 
resource "aws_instance" "frontend" {
  ami           = var.frontend_ami_id # ID de la AMI, variable
  instance_type = var.frontend_instance_type
  subnet_id     = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.frontend.id]
  key_name      = var.ec2_key_name
  private_ip    = "10.0.1.10"
  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y docker.io
    systemctl start docker
    systemctl enable docker
    docker run -d --restart always -e VITE_API_URL=http://10.0.2.1:8000 --name frontend -p 80:80 agustin17/panaderiapp-frontend:latest
  EOF
  tags = {
    Name = "frontend-ec2"
  }
}

# Security Group para backend
resource "aws_security_group" "backend" {
  name        = "backend-sg"
  description = "Permite trafico interno y desde el frontend"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    security_groups = [aws_security_group.frontend.id]
    description = "Permite trafico desde el frontend"
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
  description = "Permite trafico HTTP/HTTPS"
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
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "default" {
  key_name   = "ssh-key-panaderiapp"
  public_key = file("~/.ssh/id_rsa.pub") # Cambia la ruta si tu clave pública está en otro sitio
}
