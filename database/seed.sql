-- Database seed script
-- This file populates the database with initial sample data

-- Insert sample users
INSERT INTO users (email, name) VALUES
  ('user1@example.com', 'John Doe'),
  ('user2@example.com', 'Jane Smith'),
  ('user3@example.com', 'Bob Johnson')
ON CONFLICT (email) DO NOTHING;

-- Insert sample stocks
INSERT INTO stocks (symbol, name, last_price) VALUES
  ('AAPL', 'Apple Inc.', 189.95),
  ('GOOGL', 'Alphabet Inc.', 140.20),
  ('MSFT', 'Microsoft Corporation', 378.91),
  ('AMZN', 'Amazon.com Inc.', 175.30),
  ('TSLA', 'Tesla Inc.', 242.84),
  ('META', 'Meta Platforms Inc.', 348.94),
  ('NVIDIA', 'NVIDIA Corporation', 875.00),
  ('JPM', 'JPMorgan Chase & Co.', 198.15)
ON CONFLICT (symbol) DO NOTHING;

-- Associate some stocks with users (optional sample data)
-- This assumes users and stocks have been inserted successfully
INSERT INTO user_stocks (user_id, stock_id)
SELECT u.id, s.id FROM users u, stocks s
WHERE u.email = 'user1@example.com' AND s.symbol IN ('AAPL', 'GOOGL', 'MSFT')
ON CONFLICT (user_id, stock_id) DO NOTHING;

INSERT INTO user_stocks (user_id, stock_id)
SELECT u.id, s.id FROM users u, stocks s
WHERE u.email = 'user2@example.com' AND s.symbol IN ('TSLA', 'META')
ON CONFLICT (user_id, stock_id) DO NOTHING;
