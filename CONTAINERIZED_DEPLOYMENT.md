# Containerized Deployment Guide

## Overview

This Stocks API application can now be deployed using Docker containers with a complete setup for development, testing, and production environments. The deployment includes:

- **Backend**: Node.js/Express API with PostgreSQL
- **Frontend**: React/Vite application with Nginx
- **Database**: PostgreSQL with health checks
- **Orchestration**: Docker Compose for multi-container deployment
- **Scripts**: Automated deployment and testing tools

## Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+ (or `docker compose` command)
- At least 2GB RAM available for containers
- Ports 3000, 3001, 5173, and 5432 available

### One-Command Deployment

```bash
# Make scripts executable and start the full stack
chmod +x deploy.sh smoke-test.sh
./deploy.sh build
./deploy.sh start-prod
./deploy.sh setup-db
./smoke-test.sh
```

After completion:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs

## Detailed Deployment Steps

### 1. Environment Setup

#### Development Environment
```bash
# Start development environment with hot reload
./deploy.sh start-dev

# Access development services
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Database: localhost:5432
```

#### Production Environment
```bash
# Build and start production environment
./deploy.sh build
./deploy.sh start-prod

# Access production services
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
```

### 2. Database Setup

```bash
# Run database migrations
./deploy.sh migrate

# Seed with sample data
./deploy.sh seed

# Or do both at once
./deploy.sh setup-db
```

### 3. Verification

```bash
# Check service status
./deploy.sh status

# Run health checks
./deploy.sh health

# Run comprehensive smoke tests
./smoke-test.sh
```

## Docker Configuration

### Backend Dockerfile

Located at `backend/Dockerfile`, the backend uses a multi-stage build:

```dockerfile
# Development stage
FROM node:18-alpine AS development
# Includes all dev dependencies for hot reload

# Build stage  
FROM base AS builder
# Compiles TypeScript to JavaScript

# Production stage
FROM node:18-alpine AS production
# Optimized production image with non-root user
```

**Key Features:**
- Multi-stage builds for optimization
- Non-root user for security
- Health checks built-in
- Production-ready with proper logging

### Frontend Dockerfile

Located at `frontend/Dockerfile`, includes:

```dockerfile
# Development stage with Vite dev server
FROM node:18-alpine AS development

# Build stage
FROM base AS builder
# Builds optimized production bundle

# Production stage with Nginx
FROM nginx:alpine AS production
# Serves static files with optimized Nginx config
```

**Key Features:**
- Vite for fast development and building
- Nginx for production serving
- Static asset optimization
- API proxy configuration

### Docker Compose Services

#### Production (`docker-compose.yml`)
```yaml
services:
  postgres:    # PostgreSQL 15 with persistent storage
  backend:     # Node.js API with health checks
  frontend:    # Nginx serving React app
  redis:       # Optional Redis for caching
```

#### Development (`docker-compose.dev.yml`)
```yaml
services:
  postgres:    # Development database
  backend:     # Backend with hot reload
  frontend:    # Frontend with Vite dev server
```

## Environment Configuration

### Backend Environment Files

- `.env.development` - Development settings
- `.env.production` - Production settings
- `.env.example` - Template for custom configuration

**Key Variables:**
```bash
NODE_ENV=production|development
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
CORS_ORIGIN=http://localhost:3001
LOG_LEVEL=info|debug|warn|error
```

### Frontend Environment Files

- `.env.development` - Development API URL
- `.env.production` - Production API URL

**Key Variables:**
```bash
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Stocks API
```

## Deployment Scripts

### deploy.sh

Comprehensive deployment management script:

```bash
# Build all images
./deploy.sh build

# Build specific service
./deploy.sh build backend

# Start environments
./deploy.sh start-dev
./deploy.sh start-prod

# Stop all services
./deploy.sh stop

# Database operations
./deploy.sh migrate
./deploy.sh seed
./deploy.sh setup-db

# Monitoring
./deploy.sh logs [service]
./deploy.sh status
./deploy.sh health

# Cleanup
./deploy.sh cleanup
```

### smoke-test.sh

End-to-end testing script that verifies:

- ✅ Backend health endpoint
- ✅ Frontend accessibility  
- ✅ API documentation
- ✅ All API endpoints (low-pe, largest-declines)
- ✅ Pagination and sorting
- ✅ CORS headers
- ✅ Error handling
- ✅ Database connectivity
- ✅ Basic performance

```bash
# Run with default URLs
./smoke-test.sh

# Custom URLs
./smoke-test.sh --backend-url http://api.example.com --frontend-url http://app.example.com
```

## Cloud Deployment

### Container Registry

#### Docker Hub
```bash
# Tag and push images
docker tag stocks-backend:latest yourusername/stocks-backend:v1.0.0
docker tag stocks-frontend:latest yourusername/stocks-frontend:v1.0.0

docker push yourusername/stocks-backend:v1.0.0
docker push yourusername/stocks-frontend:v1.0.0
```

#### Amazon ECR
```bash
# Create repositories
aws ecr create-repository --repository-name stocks-backend
aws ecr create-repository --repository-name stocks-frontend

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag stocks-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/stocks-backend:v1.0.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/stocks-backend:v1.0.0
```

### Cloud Platform Deployment

#### AWS ECS
1. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name stocks-api-cluster
   ```

2. **Create Task Definitions**
   - Backend task definition with DATABASE_URL environment variable
   - Frontend task definition with VITE_API_URL pointing to backend
   - PostgreSQL using RDS instance

3. **Create Services**
   - Backend service with Application Load Balancer
   - Frontend service with CloudFront distribution
   - Use RDS PostgreSQL instead of containerized DB

#### Google Cloud Run
1. **Build and Push Images**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/stocks-backend
   gcloud builds submit --tag gcr.io/PROJECT-ID/stocks-frontend
   ```

2. **Deploy Backend**
   ```bash
   gcloud run deploy stocks-backend \
     --image gcr.io/PROJECT-ID/stocks-backend \
     --platform managed \
     --region us-central1 \
     --set-env-vars DATABASE_URL="postgresql://..." \
     --allow-unauthenticated
   ```

3. **Deploy Frontend**
   ```bash
   gcloud run deploy stocks-frontend \
     --image gcr.io/PROJECT-ID/stocks-frontend \
     --platform managed \
     --region us-central1 \
     --set-env-vars VITE_API_URL="https://stocks-backend-xyz.a.run.app" \
     --allow-unauthenticated
   ```

#### Azure Container Instances
```bash
# Deploy backend
az container create \
  --resource-group stocks-rg \
  --name stocks-backend \
  --image yourregistry/stocks-backend:latest \
  --ports 3000 \
  --environment-variables \
    DATABASE_URL="postgresql://..." \
    NODE_ENV="production"

# Deploy frontend  
az container create \
  --resource-group stocks-rg \
  --name stocks-frontend \
  --image yourregistry/stocks-frontend:latest \
  --ports 3000 \
  --environment-variables \
    VITE_API_URL="http://stocks-backend:3000"
```

### Kubernetes Deployment

Create Kubernetes manifests:

#### backend-deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: stocks-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: stocks-backend
  template:
    metadata:
      labels:
        app: stocks-backend
    spec:
      containers:
      - name: backend
        image: stocks-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
---
apiVersion: v1
kind: Service
metadata:
  name: stocks-backend-service
spec:
  selector:
    app: stocks-backend
  ports:
    - port: 3000
      targetPort: 3000
  type: LoadBalancer
```

#### frontend-deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: stocks-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: stocks-frontend
  template:
    metadata:
      labels:
        app: stocks-frontend
    spec:
      containers:
      - name: frontend
        image: stocks-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: VITE_API_URL
          value: "http://stocks-backend-service:3000"
---
apiVersion: v1
kind: Service
metadata:
  name: stocks-frontend-service
spec:
  selector:
    app: stocks-frontend
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

Deploy to Kubernetes:
```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl get pods -w
```

## Database Setup for Cloud

### Managed PostgreSQL Services

#### AWS RDS
```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier stocks-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username stocks_user \
  --master-user-password SecurePassword123 \
  --allocated-storage 20

# Get connection string
DATABASE_URL="postgresql://stocks_user:SecurePassword123@stocks-db.xyz.us-east-1.rds.amazonaws.com:5432/stocks_db"
```

#### Google Cloud SQL
```bash
# Create Cloud SQL instance
gcloud sql instances create stocks-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database and user
gcloud sql databases create stocks_db --instance=stocks-db
gcloud sql users create stocks_user --instance=stocks-db --password=SecurePassword123
```

#### Azure Database for PostgreSQL
```bash
# Create PostgreSQL server
az postgres server create \
  --resource-group stocks-rg \
  --name stocks-db-server \
  --location eastus \
  --admin-user stocks_user \
  --admin-password SecurePassword123 \
  --sku-name B_Gen5_1
```

## Security Considerations

### Production Security Checklist

- [ ] **Environment Variables**: Use secure secret management
- [ ] **Database**: Use SSL connections, rotate credentials
- [ ] **CORS**: Configure proper allowed origins
- [ ] **Containers**: Run as non-root users
- [ ] **Images**: Scan for vulnerabilities
- [ ] **Network**: Use private networks where possible
- [ ] **Monitoring**: Set up logging and alerting
- [ ] **Backups**: Configure automated database backups
- [ ] **Updates**: Keep base images updated
- [ ] **HTTPS**: Use SSL/TLS in production

### Container Security

```bash
# Scan images for vulnerabilities
docker scout cves stocks-backend:latest
docker scout cves stocks-frontend:latest

# Run containers as non-root (already configured)
# Use health checks (already configured)
# Keep images updated
docker pull node:18-alpine
```

## Monitoring and Logging

### Health Checks

All services include health checks:

```bash
# Manual health check
./deploy.sh health

# Individual service health
curl http://localhost:3000/health  # Backend
curl http://localhost:3001/health  # Frontend
```

### Log Management

```bash
# View logs
./deploy.sh logs              # All services
./deploy.sh logs backend      # Backend only
./deploy.sh logs frontend     # Frontend only

# Follow logs in real-time
./deploy.sh logs -f backend
```

### Monitoring Setup

For production, consider integrating:

- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and alerting
- **ELK Stack**: Centralized logging
- **Jaeger**: Distributed tracing
- **DataDog/New Relic**: APM solutions

## Performance Optimization

### Backend Optimizations

- Connection pooling configured in Prisma
- Health checks for load balancer integration
- Graceful shutdown handling
- Proper CORS configuration

### Frontend Optimizations

- Vite for fast development and optimized builds
- Nginx serving static files with compression
- Static asset caching headers
- API proxy configuration

### Database Optimizations

- PostgreSQL tuned for containerized deployment
- Persistent volumes for data durability
- Health checks for database availability
- Proper indexing on frequently queried fields

## Backup and Recovery

### Database Backups

```bash
# Manual backup
./deploy.sh exec postgres pg_dump -U stocks_user stocks_db > backup.sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
./deploy.sh exec postgres pg_dump -U stocks_user stocks_db > "backup_${DATE}.sql"
```

### Application Backups

```bash
# Backup Docker images
docker save stocks-backend:latest | gzip > stocks-backend.tar.gz
docker save stocks-frontend:latest | gzip > stocks-frontend.tar.gz

# Backup Docker Compose configuration
cp docker-compose.yml docker-compose.yml.backup
cp docker-compose.dev.yml docker-compose.dev.yml.backup
```

## Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check logs
./deploy.sh logs backend

# Check environment variables
./deploy.sh exec backend env

# Verify port availability
netstat -tulpn | grep :3000
```

#### Database Connection Issues
```bash
# Check database container
./deploy.sh logs postgres

# Test database connectivity
./deploy.sh exec postgres pg_isready -U stocks_user

# Check database logs
./deploy.sh logs postgres
```

#### Frontend Can't Reach Backend
```bash
# Check CORS configuration
curl -H "Origin: http://localhost:3001" http://localhost:3000/health

# Verify API URL in frontend
./deploy.sh exec frontend env | grep VITE_API_URL
```

#### Migration Failures
```bash
# Reset database (careful!)
./deploy.sh exec backend npm run db:reset

# Re-run migrations
./deploy.sh migrate

# Check migration logs
./deploy.sh logs backend | grep migrate
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Monitor database performance
./deploy.sh exec postgres psql -U stocks_user -d stocks_db -c "
  SELECT query, mean_time, calls 
  FROM pg_stat_statements 
  ORDER BY mean_time DESC 
  LIMIT 10;
"
```

## Maintenance

### Regular Tasks

- **Weekly**: Update base Docker images
- **Monthly**: Review and rotate credentials
- **Quarterly**: Security vulnerability scans
- **As needed**: Update application dependencies

### Update Procedure

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild images
./deploy.sh build

# 3. Deploy updates
./deploy.sh stop
./deploy.sh start-prod

# 4. Run migrations if needed
./deploy.sh migrate

# 5. Verify deployment
./smoke-test.sh
```

## Support and Documentation

### Useful Commands

```bash
# Show all available commands
./deploy.sh help

# Show smoke test options
./smoke-test.sh --help

# Check Docker version
docker --version
docker-compose --version
```

### Documentation Links

- **API Documentation**: http://localhost:3000/api-docs
- **Frontend**: http://localhost:3001
- **Backend Health**: http://localhost:3000/health

### Getting Help

1. Check the smoke test output: `./smoke-test.sh`
2. Review container logs: `./deploy.sh logs`
3. Verify health status: `./deploy.sh health`
4. Check service status: `./deploy.sh status`
5. Review this deployment guide
6. Check the main README.md for additional context

## Version Information

- **Node.js**: 18+ (Alpine Linux)
- **React**: 18.2.0
- **Express**: 4.18.2
- **PostgreSQL**: 15
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **TypeScript**: 5.3.3
- **Vite**: 5.0.8

---

**Last Updated**: $(date +%Y-%m-%d)
**Version**: 1.0.0 with Docker deployment