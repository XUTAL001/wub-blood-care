const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'wub_bloodconnect_default_super_secret_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DATABASE_URL: process.env.DATABASE_URL,
  PGHOST: process.env.PGHOST || 'localhost',
  PGUSER: process.env.PGUSER || 'postgres',
  PGPASSWORD: process.env.PGPASSWORD || 'postgres',
  PGDATABASE: process.env.PGDATABASE || 'wub_bloodconnect',
  PGPORT: parseInt(process.env.PGPORT, 10) || 5432,
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DBNAME: process.env.MONGODB_DBNAME || 'wub_bloodcare',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD || 'super123',
  MODERATOR_PASSWORD: process.env.MODERATOR_PASSWORD || 'mod123',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM || 'WUB BloodCare <no-reply@wub.edu.bd>'
};
