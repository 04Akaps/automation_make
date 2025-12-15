CREATE DATABASE IF NOT EXISTS newsletters_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE newsletters_db;

CREATE TABLE IF NOT EXISTS newsletters (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title JSON,
  summary JSON,
  content JSON NOT NULL,
  status ENUM('progress', 'published') NOT NULL DEFAULT 'progress',
  published_at DATETIME NULL,
  domain VARCHAR(255),
  tags JSON,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  status ENUM('active', 'cancelled') NOT NULL DEFAULT 'active',
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  subscribed_at DATETIME NOT NULL,
  cancelled_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_stripe_customer_id (stripe_customer_id),
  INDEX idx_subscribed_at (subscribed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
