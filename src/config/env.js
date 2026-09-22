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
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
