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

CREATE TABLE IF NOT EXISTS realtime_newsletters (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title JSON,
  summary JSON,
  content JSON NOT NULL,
  published_at DATETIME NULL,
  domain VARCHAR(255),
  tags JSON,
  status ENUM('pending', 'processing', 'completed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 이메일 전송 이력 추적 테이블 (중복 방지용)
CREATE TABLE IF NOT EXISTS newsletter_deliveries (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  realtime_newsletter_id BIGINT NOT NULL,
  subscriber_id INT NOT NULL,
  status ENUM('pending', 'sent', 'failed') NOT NULL DEFAULT 'pending',
  sent_at DATETIME NULL,
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_delivery (realtime_newsletter_id, subscriber_id),
  INDEX idx_status (status),
  INDEX idx_realtime_newsletter_id (realtime_newsletter_id),
  INDEX idx_subscriber_id (subscriber_id),
  FOREIGN KEY (realtime_newsletter_id) REFERENCES realtime_newsletters(id) ON DELETE CASCADE,
  FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




------------------------------------

CREATE DATABASE IF NOT EXISTS management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE management_db;

CREATE TABLE IF NOT EXISTS feature_flags (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  service_name VARCHAR(100) NOT NULL UNIQUE,
  is_maintenance TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_service_name (service_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
