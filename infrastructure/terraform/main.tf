
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# AWS Provider Configuration
provider "aws" {
  region  = "ap-south-1"
  profile = "globalshop"
}

# 1. Create S3 Bucket
resource "aws_s3_bucket" "website" {
  bucket = "globalshop-255291984550-ap-south-1"

  tags = {
    Project     = "GlobalShop"
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}

# 2. Block Public Access
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 3. Bucket Ownership Controls
resource "aws_s3_bucket_ownership_controls" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# 4. Enable S3 Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 5. CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "globalshop-oac"
  description                       = "Access control for GlobalShop S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# 6. CloudFront Distribution
resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "GlobalShop CDN"
  price_class         = "PriceClass_100"
  default_root_object = "index.html"

  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                = "globalshop-s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }

  default_cache_behavior {
    target_origin_id        = "globalshop-s3-origin"
    viewer_protocol_policy  = "redirect-to-https"
    allowed_methods         = ["GET", "HEAD"]
    cached_methods          = ["GET", "HEAD"]
    compress                = true
    cache_policy_id         = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  # React SPA routing
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
  cloudfront_default_certificate = true
  minimum_protocol_version       = "TLSv1.2_2021"
}

  tags = {
    Project = "GlobalShop"
  }
}

# 7. S3 Bucket Policy - CloudFront Only
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "AllowCloudFrontReadOnly"
        Effect = "Allow"

        Principal = {
          Service = "cloudfront.amazonaws.com"
        }

        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.website.arn}/*"

        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.website.arn
          }
        }
      }
    ]
  })

  depends_on = [
    aws_s3_bucket_public_access_block.website
  ]
}

# 8. Terraform Outputs
output "s3_bucket_name" {
  value = aws_s3_bucket.website.bucket
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.website.domain_name
}
