# Vita-Life Infrastructure Setup Guide

## Overview

This document provides detailed instructions for setting up the production infrastructure for the Vita-Life web application on AWS, ensuring HIPAA compliance and optimal performance.

## Architecture Overview

```
Internet Gateway
    ↓
Application Load Balancer (ALB)
    ↓
ECS Fargate Cluster
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   Web Tier      │   App Tier      │   Data Tier     │
│                 │                 │                 │
│ CloudFront CDN  │ ECS Services    │ DocumentDB      │
│ S3 Static Files │ Auto Scaling    │ ElastiCache     │
│ Route 53 DNS    │ Load Balancer   │ S3 Backups      │
└─────────────────┴─────────────────┴─────────────────┘
```

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- Terraform or AWS CDK (optional but recommended)
- Domain name registered
- SSL certificate (can be generated via AWS Certificate Manager)

## Step 1: Network Infrastructure

### VPC Setup
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=vita-life-vpc}]'

# Create Internet Gateway
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=vita-life-igw}]'

# Attach Internet Gateway to VPC
aws ec2 attach-internet-gateway --vpc-id vpc-xxxxxxxxx --internet-gateway-id igw-xxxxxxxxx
```

### Subnet Configuration
```bash
# Public Subnets (for Load Balancer)
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b

# Private Subnets (for Application)
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.10.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.20.0/24 --availability-zone us-east-1b

# Database Subnets
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.30.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.40.0/24 --availability-zone us-east-1b
```

### Security Groups
```bash
# ALB Security Group
aws ec2 create-security-group --group-name vita-life-alb-sg --description "Security group for ALB" --vpc-id vpc-xxxxxxxxx

# ECS Security Group
aws ec2 create-security-group --group-name vita-life-ecs-sg --description "Security group for ECS" --vpc-id vpc-xxxxxxxxx

# Database Security Group
aws ec2 create-security-group --group-name vita-life-db-sg --description "Security group for Database" --vpc-id vpc-xxxxxxxxx
```

## Step 2: Database Setup

### DocumentDB Cluster
```bash
# Create DocumentDB subnet group
aws docdb create-db-subnet-group \
    --db-subnet-group-name vita-life-docdb-subnet-group \
    --db-subnet-group-description "Subnet group for Vita-Life DocumentDB" \
    --subnet-ids subnet-xxxxxxxxx subnet-yyyyyyyyy

# Create DocumentDB cluster
aws docdb create-db-cluster \
    --db-cluster-identifier vita-life-docdb-cluster \
    --engine docdb \
    --master-username vitalife \
    --master-user-password [SECURE_PASSWORD] \
    --vpc-security-group-ids sg-xxxxxxxxx \
    --db-subnet-group-name vita-life-docdb-subnet-group \
    --storage-encrypted \
    --kms-key-id alias/aws/docdb
```

### ElastiCache Redis
```bash
# Create ElastiCache subnet group
aws elasticache create-cache-subnet-group \
    --cache-subnet-group-name vita-life-redis-subnet-group \
    --cache-subnet-group-description "Subnet group for Vita-Life Redis" \
    --subnet-ids subnet-xxxxxxxxx subnet-yyyyyyyyy

# Create Redis cluster
aws elasticache create-replication-group \
    --replication-group-id vita-life-redis \
    --description "Redis cluster for Vita-Life" \
    --num-cache-clusters 2 \
    --cache-node-type cache.t3.micro \
    --engine redis \
    --cache-subnet-group-name vita-life-redis-subnet-group \
    --security-group-ids sg-xxxxxxxxx \
    --at-rest-encryption-enabled \
    --transit-encryption-enabled
```

## Step 3: Container Infrastructure

### ECS Cluster
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name vita-life-cluster --capacity-providers FARGATE --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1
```

### Task Definition
```json
{
  "family": "vita-life-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "vita-life-app",
      "image": "ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/vita-life:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:vita-life/mongodb-uri"
        },
        {
          "name": "REDIS_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:vita-life/redis-url"
        },
        {
          "name": "NEXTAUTH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:vita-life/nextauth-secret"
        },
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:vita-life/openai-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/vita-life-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### ECS Service
```bash
# Create ECS service
aws ecs create-service \
    --cluster vita-life-cluster \
    --service-name vita-life-service \
    --task-definition vita-life-app:1 \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxxx,subnet-yyyyyyyyy],securityGroups=[sg-xxxxxxxxx],assignPublicIp=DISABLED}" \
    --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/vita-life-tg/xxxxxxxxx,containerName=vita-life-app,containerPort=3000
```

## Step 4: Load Balancer Setup

### Application Load Balancer
```bash
# Create ALB
aws elbv2 create-load-balancer \
    --name vita-life-alb \
    --subnets subnet-xxxxxxxxx subnet-yyyyyyyyy \
    --security-groups sg-xxxxxxxxx \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4

# Create target group
aws elbv2 create-target-group \
    --name vita-life-tg \
    --protocol HTTP \
    --port 3000 \
    --vpc-id vpc-xxxxxxxxx \
    --target-type ip \
    --health-check-path /api/health \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3

# Create listener
aws elbv2 create-listener \
    --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:loadbalancer/app/vita-life-alb/xxxxxxxxx \
    --protocol HTTPS \
    --port 443 \
    --certificates CertificateArn=arn:aws:acm:us-east-1:ACCOUNT:certificate/xxxxxxxxx \
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/vita-life-tg/xxxxxxxxx
```

## Step 5: CDN and Static Assets

### CloudFront Distribution
```json
{
  "CallerReference": "vita-life-cdn-2024",
  "Comment": "CDN for Vita-Life application",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 2,
    "Items": [
      {
        "Id": "vita-life-alb",
        "DomainName": "vita-life-alb-xxxxxxxxx.us-east-1.elb.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "https-only",
          "OriginSslProtocols": {
            "Quantity": 1,
            "Items": ["TLSv1.2"]
          }
        }
      },
      {
        "Id": "vita-life-s3",
        "DomainName": "vita-life-static-assets.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "vita-life-alb",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": true,
      "Cookies": {
        "Forward": "all"
      },
      "Headers": {
        "Quantity": 1,
        "Items": ["Authorization"]
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CacheBehaviors": {
    "Quantity": 1,
    "Items": [
      {
        "PathPattern": "/static/*",
        "TargetOriginId": "vita-life-s3",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "ForwardedValues": {
          "QueryString": false,
          "Cookies": {
            "Forward": "none"
          }
        }
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
```

## Step 6: Monitoring and Logging

### CloudWatch Log Groups
```bash
# Create log groups
aws logs create-log-group --log-group-name /ecs/vita-life-app
aws logs create-log-group --log-group-name /aws/lambda/vita-life-functions
aws logs create-log-group --log-group-name /aws/apigateway/vita-life-api
```

### CloudWatch Alarms
```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
    --alarm-name "vita-life-high-cpu" \
    --alarm-description "Alarm when CPU exceeds 70%" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 70 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2

# High memory alarm
aws cloudwatch put-metric-alarm \
    --alarm-name "vita-life-high-memory" \
    --alarm-description "Alarm when memory exceeds 80%" \
    --metric-name MemoryUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2
```

## Step 7: Security Configuration

### WAF Setup
```bash
# Create WAF web ACL
aws wafv2 create-web-acl \
    --name vita-life-waf \
    --scope CLOUDFRONT \
    --default-action Allow={} \
    --rules file://waf-rules.json \
    --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=vita-life-waf
```

### Secrets Manager
```bash
# Store database credentials
aws secretsmanager create-secret \
    --name vita-life/mongodb-uri \
    --description "MongoDB connection string for Vita-Life" \
    --secret-string "mongodb://username:password@cluster-endpoint:27017/vita-life?ssl=true"

# Store Redis URL
aws secretsmanager create-secret \
    --name vita-life/redis-url \
    --description "Redis connection URL for Vita-Life" \
    --secret-string "redis://cluster-endpoint:6379"

# Store NextAuth secret
aws secretsmanager create-secret \
    --name vita-life/nextauth-secret \
    --description "NextAuth secret for Vita-Life" \
    --generate-secret-string SecretStringTemplate='{"secret":""}',GenerateStringKey='secret',PasswordLength=32,ExcludeCharacters='"@/\'
```

## Step 8: Backup Configuration

### Automated Backups
```bash
# Create backup vault
aws backup create-backup-vault --backup-vault-name vita-life-backup-vault

# Create backup plan
aws backup create-backup-plan --backup-plan file://backup-plan.json
```

### Cross-Region Replication
```bash
# Set up DocumentDB cross-region backup
aws docdb create-global-cluster \
    --global-cluster-identifier vita-life-global-cluster \
    --source-db-cluster-identifier vita-life-docdb-cluster
```

## Step 9: Auto Scaling Configuration

### ECS Auto Scaling
```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/vita-life-cluster/vita-life-service \
    --min-capacity 2 \
    --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
    --policy-name vita-life-cpu-scaling \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/vita-life-cluster/vita-life-service \
    --policy-type TargetTrackingScaling \
    --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

## Step 10: DNS Configuration

### Route 53 Setup
```bash
# Create hosted zone
aws route53 create-hosted-zone --name vita-life.com --caller-reference vita-life-$(date +%s)

# Create A record for main domain
aws route53 change-resource-record-sets --hosted-zone-id Z123456789 --change-batch file://dns-records.json
```

## Environment Variables

### Production Environment Variables
```bash
# Application
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=[FROM_SECRETS_MANAGER]
REDIS_URL=[FROM_SECRETS_MANAGER]

# Authentication
NEXTAUTH_URL=https://vita-life.com
NEXTAUTH_SECRET=[FROM_SECRETS_MANAGER]
JWT_SECRET=[FROM_SECRETS_MANAGER]

# AI Services
OPENAI_API_KEY=[FROM_SECRETS_MANAGER]

# Security
ENCRYPTION_KEY=[FROM_SECRETS_MANAGER]

# Monitoring
NEW_RELIC_LICENSE_KEY=[FROM_SECRETS_MANAGER]
DATADOG_API_KEY=[FROM_SECRETS_MANAGER]

# HIPAA Compliance
AUDIT_LOG_ENABLED=true
DATA_RETENTION_DAYS=2555
```

## Health Checks

### Application Health Check Endpoint
```javascript
// /api/health endpoint
export default async function handler(req, res) {
  try {
    // Check database connectivity
    await connectToDatabase();
    
    // Check Redis connectivity
    await connectToRedis();
    
    // Check external services
    const openaiStatus = await checkOpenAIStatus();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        openai: openaiStatus ? 'connected' : 'degraded'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
```

## Disaster Recovery

### RTO/RPO Targets
- **Recovery Time Objective (RTO):** 4 hours
- **Recovery Point Objective (RPO):** 1 hour

### DR Procedures
1. **Database Recovery:** Restore from automated backups
2. **Application Recovery:** Deploy from container registry
3. **DNS Failover:** Update Route 53 records to DR region
4. **Data Synchronization:** Sync any lost data from backups

## Cost Optimization

### Reserved Instances
- DocumentDB: 1-year reserved instances for 30% savings
- ElastiCache: 1-year reserved instances for 25% savings

### Auto Scaling Policies
- Scale down during low-traffic hours (2 AM - 6 AM EST)
- Scale up during peak hours (9 AM - 9 PM EST)

### Storage Optimization
- Use S3 Intelligent Tiering for static assets
- Implement lifecycle policies for log retention

## Security Compliance

### HIPAA Requirements
- ✅ Encryption at rest and in transit
- ✅ Access logging and monitoring
- ✅ User access controls
- ✅ Data backup and recovery
- ✅ Incident response procedures
- ✅ Business associate agreements

### Security Best Practices
- Regular security assessments
- Vulnerability scanning
- Penetration testing
- Security training for team
- Incident response plan

## Maintenance Windows

### Scheduled Maintenance
- **Time:** Sundays 2:00 AM - 4:00 AM EST
- **Frequency:** Monthly
- **Activities:**
  - Security patches
  - Database maintenance
  - Performance optimization
  - Backup verification

### Emergency Maintenance
- **Response Time:** < 2 hours for critical issues
- **Communication:** Status page and email notifications
- **Rollback Plan:** Automated rollback within 15 minutes

This infrastructure setup provides a robust, scalable, and HIPAA-compliant foundation for the Vita-Life application, ensuring high availability, security, and performance for users.