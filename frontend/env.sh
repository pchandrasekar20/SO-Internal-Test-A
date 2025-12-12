#!/bin/sh

# Environment setup script for frontend
# This script can be used to set environment variables at runtime

echo "Starting frontend with environment: ${NODE_ENV:-production}"

# You can add more environment-specific setup here
# For example, setting API URLs based on environment

exec "$@"