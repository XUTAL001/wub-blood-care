/**
 * WUB BloodConnect - Centralized Error Handler
 */

function errorHandler(err, req, res, next) {
  console.error('[SERVER ERROR]', err);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred. Please try again.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
}

module.exports = errorHandler;
