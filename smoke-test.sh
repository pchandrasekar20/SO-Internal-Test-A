#!/bin/bash

# End-to-End Smoke Test Script for Stocks API Application
# This script verifies that all components are working correctly after deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"
API_BASE="http://localhost:3000/api"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    ((TESTS_PASSED++))
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    ((TESTS_FAILED++))
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Test functions
test_backend_health() {
    print_info "Testing backend health endpoint..."
    
    if curl -f -s "$BACKEND_URL/health" > /dev/null; then
        local response=$(curl -s "$BACKEND_URL/health")
        if echo "$response" | grep -q '"status":"ok"'; then
            print_success "Backend health check passed"
            return 0
        else
            print_error "Backend health check failed - invalid response"
            echo "Response: $response"
            return 1
        fi
    else
        print_error "Backend health check failed - no response"
        return 1
    fi
}

test_frontend_health() {
    print_info "Testing frontend accessibility..."
    
    if curl -f -s "$FRONTEND_URL" > /dev/null; then
        local response=$(curl -s "$FRONTEND_URL")
        if echo "$response" | grep -q "Stocks API\|stocks\| Stocks "; then
            print_success "Frontend is accessible"
            return 0
        else
            print_warning "Frontend is accessible but content check failed"
            return 0
        fi
    else
        print_error "Frontend health check failed - no response"
        return 1
    fi
}

test_api_documentation() {
    print_info "Testing API documentation..."
    
    if curl -f -s "$BACKEND_URL/api-docs" > /dev/null; then
        print_success "API documentation is accessible"
        return 0
    else
        print_error "API documentation check failed"
        return 1
    fi
}

test_low_pe_endpoint() {
    print_info "Testing /api/stocks/low-pe endpoint..."
    
    if curl -f -s "${API_BASE}/stocks/low-pe?limit=5" > /dev/null; then
        local response=$(curl -s "${API_BASE}/stocks/low-pe?limit=5")
        
        # Check if response contains expected structure
        if echo "$response" | grep -q '"data"\|"stocks"\|"results"'; then
            print_success "Low PE endpoint working"
            
            # Check if we have actual data
            local count=$(echo "$response" | grep -o '"symbol"' | wc -l)
            if [[ $count -gt 0 ]]; then
                print_success "Low PE endpoint returns data ($count stocks)"
            else
                print_warning "Low PE endpoint returns no data - may need seeding"
            fi
            return 0
        else
            print_error "Low PE endpoint - invalid response structure"
            echo "Response: $response"
            return 1
        fi
    else
        print_error "Low PE endpoint failed"
        return 1
    fi
}

test_largest_declines_endpoint() {
    print_info "Testing /api/stocks/largest-declines endpoint..."
    
    if curl -f -s "${API_BASE}/stocks/largest-declines?limit=5" > /dev/null; then
        local response=$(curl -s "${API_BASE}/stocks/largest-declines?limit=5")
        
        # Check if response contains expected structure
        if echo "$response" | grep -q '"data"\|"stocks"\|"results"'; then
            print_success "Largest declines endpoint working"
            
            # Check if we have actual data
            local count=$(echo "$response" | grep -o '"symbol"' | wc -l)
            if [[ $count -gt 0 ]]; then
                print_success "Largest declines endpoint returns data ($count stocks)"
            else
                print_warning "Largest declines endpoint returns no data - may need seeding"
            fi
            return 0
        else
            print_error "Largest declines endpoint - invalid response structure"
            echo "Response: $response"
            return 1
        fi
    else
        print_error "Largest declines endpoint failed"
        return 1
    fi
}

test_pagination() {
    print_info "Testing pagination functionality..."
    
    local response1=$(curl -s "${API_BASE}/stocks/low-pe?limit=5&page=1")
    local response2=$(curl -s "${API_BASE}/stocks/low-pe?limit=5&page=2")
    
    # Check if pagination metadata is present
    if echo "$response1" | grep -q '"page"\|"total"\|"totalPages"'; then
        print_success "Pagination metadata present"
    else
        print_warning "Pagination metadata not found"
    fi
}

test_sorting() {
    print_info "Testing sorting functionality..."
    
    # Test ascending sort
    local response_asc=$(curl -s "${API_BASE}/stocks/low-pe?sortBy=peRatio&sortOrder=asc&limit=3")
    
    # Test descending sort
    local response_desc=$(curl -s "${API_BASE}/stocks/low-pe?sortBy=peRatio&sortOrder=desc&limit=3")
    
    # Basic validation - just ensure both requests succeed
    if [[ -n "$response_asc" ]] && [[ -n "$response_desc" ]]; then
        print_success "Sorting requests successful"
    else
        print_error "Sorting requests failed"
    fi
}

test_cors() {
    print_info "Testing CORS headers..."
    
    local headers=$(curl -s -I -X OPTIONS "$BACKEND_URL/api/stocks/low-pe")
    
    if echo "$headers" | grep -qi "Access-Control"; then
        print_success "CORS headers present"
    else
        print_warning "CORS headers not found (may be normal in some configurations)"
    fi
}

test_error_handling() {
    print_info "Testing error handling..."
    
    # Test 404
    local not_found=$(curl -s -w "%{http_code}" "$BACKEND_URL/nonexistent")
    local status_code=$(echo "$not_found" | tail -c 4)
    
    if [[ "$status_code" == "404" ]]; then
        print_success "404 error handling works"
    else
        print_error "404 error handling failed (status: $status_code)"
    fi
}

test_database_connectivity() {
    print_info "Testing database connectivity..."
    
    # Check if we can get data from any endpoint (which requires DB access)
    if curl -f -s "${API_BASE}/stocks/low-pe?limit=1" > /dev/null; then
        print_success "Database connectivity confirmed"
    else
        print_error "Database connectivity failed"
    fi
}

run_performance_test() {
    print_info "Running basic performance test..."
    
    # Simple timing test
    local start_time=$(date +%s.%N)
    curl -s "${API_BASE}/stocks/low-pe?limit=10" > /dev/null
    local end_time=$(date +%s.%N)
    
    local response_time=$(echo "$end_time - $start_time" | bc)
    
    if (( $(echo "$response_time < 2.0" | bc -l) )); then
        print_success "Performance test passed (${response_time}s)"
    else
        print_warning "Performance test slow (${response_time}s)"
    fi
}

# Main test execution
main() {
    print_header "Stocks API - End-to-End Smoke Test"
    
    print_info "Backend URL: $BACKEND_URL"
    print_info "Frontend URL: $FRONTEND_URL"
    print_info "API Base: $API_BASE"
    echo
    
    # Wait for services to be ready
    print_info "Waiting for services to be ready..."
    sleep 5
    
    # Run all tests
    echo "Running basic connectivity tests..."
    test_backend_health
    test_frontend_health
    test_api_documentation
    
    echo
    echo "Running API endpoint tests..."
    test_low_pe_endpoint
    test_largest_declines_endpoint
    test_pagination
    test_sorting
    test_cors
    test_error_handling
    test_database_connectivity
    
    echo
    echo "Running performance tests..."
    run_performance_test
    
    # Final report
    echo
    print_header "Test Results"
    echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
    echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
    echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
    
    if [[ $TESTS_FAILED -eq 0 ]]; then
        echo
        print_success "All tests passed! The Stocks API deployment is successful."
        echo
        print_info "You can now:"
        echo "  • View the frontend at: $FRONTEND_URL"
        echo "  • Access API documentation at: $BACKEND_URL/api-docs"
        echo "  • Test the API endpoints directly"
        exit 0
    else
        echo
        print_error "Some tests failed. Please check the deployment."
        echo
        print_info "Common troubleshooting steps:"
        echo "  1. Check that all containers are running: docker ps"
        echo "  2. Check logs: ./deploy.sh logs"
        echo "  3. Verify environment variables"
        echo "  4. Run database migrations: ./deploy.sh migrate"
        echo "  5. Seed the database: ./deploy.sh seed"
        exit 1
    fi
}

# Help function
show_help() {
    echo "Stocks API - End-to-End Smoke Test"
    echo
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -b, --backend-url URL    Backend URL (default: http://localhost:3000)"
    echo "  -f, --frontend-url URL   Frontend URL (default: http://localhost:3001)"
    echo "  -h, --help              Show this help message"
    echo
    echo "Examples:"
    echo "  $0                      Run tests with default URLs"
    echo "  $0 -b http://api.example.com -f http://app.example.com"
    echo
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -b|--backend-url)
            BACKEND_URL="$2"
            shift 2
            ;;
        -f|--frontend-url)
            FRONTEND_URL="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main