# S3 bucket para alojar el frontend (React) o archivos/media del backend
resource "aws_s3_bucket" "frontend" {
  bucket = var.frontend_bucket_name
  force_destroy = true
  tags = {
    Name = "frontend-bucket"
  }
}

# Desbloquea las políticas públicas para el bucket (necesario para permitir acceso público)
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Configuración de sitio web estático (opcional, si usas S3 para el frontend)
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

# Permite acceso público de solo lectura a los archivos del bucket
resource "aws_s3_bucket_policy" "frontend_public" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.frontend]
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}

output "frontend_bucket_website_url" {
  value = aws_s3_bucket_website_configuration.frontend.website_endpoint
}
