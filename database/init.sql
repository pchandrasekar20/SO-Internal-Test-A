-- Database initialization script
-- This file creates the initial database schema

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create stocks table (for Finnhub integration)
CREATE TABLE IF NOT EXISTS stocks (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  last_price DECIMAL(10, 2),
  last_updated TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on symbol for faster lookups
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);

-- Create user_stocks table for tracking user's favorite stocks
CREATE TABLE IF NOT EXISTS user_stocks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stock_id INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, stock_id)
);

-- Create index on user_id and stock_id
CREATE INDEX IF NOT EXISTS idx_user_stocks_user_id ON user_stocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stocks_stock_id ON user_stocks(stock_id);
