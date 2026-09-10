/**
 * ============================================================================
 * WATTVISION - GLOBAL HTTP ERROR HANDLER
 * ============================================================================
 * Prevents information disclosure (stack traces, paths, secrets) to clients
 * while preserving detailed logging on the server.
 */

import config from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
  const isDev = config.nodeEnv === 'development';
  const statusCode = err.status || err.statusCode || 500;

  // Log error on server
  console.error(`[SERVER ERROR] [${req.method} ${req.path}]`, err.stack || err.message);

  // Return clean, user-friendly response without leaking internals
  res.status(statusCode).json({
    success: false,
    error: isDev || statusCode < 500 ? err.message : 'Internal Server Error. Please contact system administrator.',
    code: err.code || 'SERVER_ERROR',
    timestamp: new Date().toISOString()
  });
};

export default errorHandler;
