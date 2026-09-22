/**
 * WUB BloodConnect - Secure File Upload Middleware (Multer)
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const config = require('../config/env');

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
const DOCS_DIR = path.join(UPLOADS_DIR, 'documents');
const AVATARS_DIR = path.join(UPLOADS_DIR, 'avatars');

[UPLOADS_DIR, DOCS_DIR, AVATARS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'id_card_document') {
      cb(null, DOCS_DIR);
    } else {
      cb(null, AVATARS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Invalid file type. Only JPG, PNG, WEBP and PDF files are allowed.'));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE_MB * 1024 * 1024
  },
  fileFilter
});

module.exports = upload;
