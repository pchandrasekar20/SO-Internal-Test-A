-- Initialize Stocks Database
-- This script runs when PostgreSQL container starts for the first time

-- Create necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Create any additional indexes or configurations here
-- The Prisma migrations will handle the table creation

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Stocks database initialized successfully';
END $$;