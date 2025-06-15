#Network
variable "vpc_cidr" {
  description = "CIDR principal para la VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR para la subred pública."
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR para la subred privada."
  type        = string
  default     = "10.0.2.0/24"
}



# Bucket
variable "frontend_bucket_name" {
  description = "Nombre del bucket para el frontend."
  type        = string
  default     = "frontend-panaderiapp"
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
