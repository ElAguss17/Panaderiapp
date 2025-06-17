#Network
variable "vpc_cidr" {
  description = "CIDR principal para la VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_a_cidr" {
  description = "CIDR para la subred pública en us-east-1a."
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_a_cidr" {
  description = "CIDR para la subred privada en us-east-1a."
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_subnet_b_cidr" {
  description = "CIDR para la subred privada en us-east-1c."
  type        = string
  default     = "10.0.3.0/24"
}



#EC2
variable "backend_ami_id" {
  description = "ID de la AMI para la instancia EC2 del backend (Django). Ubuntu 22.04 LTS us-east-1 x86_64."
  type        = string
  default     = "ami-053b0d53c279acc90"
}

variable "backend_instance_type" {
  description = "Tipo de instancia EC2 para el backend."
  type        = string
  default = "t2.micro"
}

variable "frontend_ami_id" {
  description = "ID de la AMI para la instancia EC2 del frontend (opcional). Ubuntu 22.04 LTS us-east-1 x86_64."
  type        = string
  default     = "ami-053b0d53c279acc90"
}

variable "frontend_instance_type" {
  description = "Tipo de instancia EC2 para el frontend."
  type        = string
  default = "t2.micro"
}

variable "ec2_key_name" {
  description = "Nombre del par de claves SSH para acceder a las instancias EC2."
  type        = string
  default = "ssh-key-panaderiapp"
}
