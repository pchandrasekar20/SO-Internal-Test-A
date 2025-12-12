#!/bin/bash

# Deployment helper script for Stocks API application
# This script provides commands for building, deploying, and managing the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
DEV_COMPOSE_FILE="docker-compose.dev.yml"
PROJECT_NAME="stocks-api"
BACKEND_PORT=3000
FRONTEND_PORT=3001

# Helper functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    print_success "Docker Compose is available"
}

# Build all images
build_images() {
    print_header "Building Docker Images"
    check_docker
    check_docker_compose
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f $COMPOSE_FILE build --no-cache
    else
        docker compose -f $COMPOSE_FILE build --no-cache
    fi
    
    print_success "All images built successfully"
}

# Build specific service
build_service() {
    local service=$1
    if [[ -z "$service" ]]; then
        print_error "Please specify a service (backend, frontend, postgres)"
        exit 1
    fi
    
    print_header "Building $service Service"
    check_docker
    check_docker_compose
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f $COMPOSE_FILE build --no-cache $service
    else
        docker compose -f $COMPOSE_FILE build --no-cache $service
    fi
    
    print_success "$service image built successfully"
}

# Start development environment
start_dev() {
    print_header "Starting Development Environment"
    check_docker
    check_docker_compose
    
    # Create necessary directories
    mkdir -p backend/logs
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f $DEV_COMPOSE_FILE up -d postgres
        sleep 5
        docker-compose -f $DEV_COMPOSE_FILE up -d
    else
        docker compose -f $DEV_COMPOSE_FILE up -d postgres
        sleep 5
        docker compose -f $DEV_COMPOSE_FILE up -d
    fi
    
    print_success "Development environment started"
    print_info "Backend: http://localhost:3000"
    print_info "Frontend: http://localhost:5173"
    print_info "API Docs: http://localhost:3000/api-docs"
}

# Start production environment
start_prod() {
    print_header "Starting Production Environment"
    check_docker
    check_docker_compose
    
    # Create necessary directories
    mkdir -p backend/logs
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f $COMPOSE_FILE up -d postgres
        sleep 10
        docker-compose -f $COMPOSE_FILE up -d
    else
        docker compose -f $COMPOSE_FILE up -d postgres
        sleep 10
        docker compose -f $COMPOSE_FILE up -d
    fi
    
    print_success "Production environment started"
    print_info "Backend: http://localhost:3000"
    print_info "Frontend: http://localhost:3001"
    print_info "API Docs: http://localhost:3000/api-docs"
}

# Stop all services
stop() {
    print_header "Stopping Services"
    check_docker_compose
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f $COMPOSE_FILE down
        docker-compose -f $DEV_COMPOSE_FILE down
    else
        docker compose -f $COMPOSE_FILE down
        docker compose -f $DEV_COMPOSE_FILE down
    fi
    
    print_success "All services stopped"
}

# Show logs
logs() {
    local service=$1
    check_docker_compose
    
    if [[ -n "$service" ]]; then
        if command -v docker-compose &> /dev/null; then
            docker-compose -f $COMPOSE_FILE logs -f $service
        else
            docker compose -f $COMPOSE_FILE logs -f $service
        fi
    else
        if command -v docker-compose &> /dev/null; then
            docker-compose -f $COMPOSE_FILE logs -f
        else
            docker compose -f $COMPOSE_FILE logs -f
        fi
    fi
}

# Run database migrations
migrate() {
    print_header "Running Database Migrations"
    check_docker_compose
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f $COMPOSE_FILE exec backend npm run db:migrate
    else
        docker compose -f $COMPOSE_FILE exec backend npm run db:migrate
    fi
    
    print_success "Migrations completed"
}

# Seed database
seed() {
    print_header "Seeding Database"
    check_docker_compose
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f $COMPOSE_FILE exec backend npm run db:seed
    else
        docker compose -f $COMPOSE_FILE exec backend npm run db:seed
    fi
    
    print_success "Database seeded"
}

# Setup database (migrate + seed)
setup_db() {
    print_header "Setting Up Database"
    migrate
    seed
}

# Clean up everything
cleanup() {
    print_header "Cleaning Up"
    check_docker
    check_docker_compose
    
    print_warning "This will remove all containers, networks, and volumes!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v docker-compose &> /dev/null; then
            docker-compose -f $COMPOSE_FILE down -v --remove-orphans
            docker-compose -f $DEV_COMPOSE_FILE down -v --remove-orphans
        else
            docker compose -f $COMPOSE_FILE down -v --remove-orphans
            docker compose -f $DEV_COMPOSE_FILE down -v --remove-orphans
        fi
        
        # Remove unused images
        docker image prune -f
        
        print_success "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Show status
status() {
    print_header "Service Status"
    check_docker_compose
    
    if command -v docker-compose &> /dev/null; then
        docker-compose -f $COMPOSE_FILE ps
        echo
        docker-compose -f $DEV_COMPOSE_FILE ps
    else
        docker compose -f $COMPOSE_FILE ps
        echo
        docker compose -f $DEV_COMPOSE_FILE ps
    fi
}

# Health check
health() {
    print_header "Health Check"
    
    # Check backend
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_error "Backend is not responding"
    fi
    
    # Check frontend
    if curl -f http://localhost:3001 > /dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend is not responding"
    fi
    
    # Check database
    if command -v docker-compose &> /dev/null; then
        if docker-compose -f $COMPOSE_FILE exec -T postgres pg_isready -U stocks_user > /dev/null 2>&1; then
            print_success "Database is healthy"
        else
            print_error "Database is not responding"
        fi
    else
        if docker compose -f $COMPOSE_FILE exec -T postgres pg_isready -U stocks_user > /dev/null 2>&1; then
            print_success "Database is healthy"
        else
            print_error "Database is not responding"
        fi
    fi
}

# Show help
help() {
    echo "Stocks API Deployment Script"
    echo
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  build              Build all Docker images"
    echo "  build <service>    Build specific service (backend, frontend, postgres)"
    echo "  start-dev          Start development environment"
    echo "  start-prod         Start production environment"
    echo "  stop               Stop all services"
    echo "  logs [service]     Show logs (optionally for specific service)"
    echo "  migrate            Run database migrations"
    echo "  seed               Seed database with sample data"
    echo "  setup-db           Run migrations and seed database"
    echo "  status             Show service status"
    echo "  health             Check service health"
    echo "  cleanup            Remove all containers, networks, and volumes"
    echo "  help               Show this help message"
    echo
    echo "Examples:"
    echo "  $0 build"
    echo "  $0 build backend"
    echo "  $0 start-dev"
    echo "  $0 logs backend"
    echo "  $0 health"
    echo
    echo "Services:"
    echo "  Backend:  http://localhost:3000"
    echo "  Frontend: http://localhost:5173 (dev) or http://localhost:3001 (prod)"
    echo "  API Docs: http://localhost:3000/api-docs"
}

# Main script logic
case "${1:-help}" in
    build)
        if [[ -n "${2:-}" ]]; then
            build_service $2
        else
            build_images
        fi
        ;;
    start-dev)
        start_dev
        ;;
    start-prod)
        start_prod
        ;;
    stop)
        stop
        ;;
    logs)
        logs $2
        ;;
    migrate)
        migrate
        ;;
    seed)
        seed
        ;;
    setup-db)
        setup_db
        ;;
    status)
        status
        ;;
    health)
        health
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        help
        exit 1
        ;;
esac