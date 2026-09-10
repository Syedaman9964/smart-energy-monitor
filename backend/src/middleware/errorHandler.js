/**
 * Global HTTP Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};

export default errorHandler;
