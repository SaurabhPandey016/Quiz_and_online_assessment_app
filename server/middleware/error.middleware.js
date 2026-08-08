export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Translate Prisma unique constraint error codes (e.g. duplicate email addresses)
  if (err.code === 'P2002') {
    return res.status(409).json({
      status: 'fail',
      message: `Database constraint violation: The value entered for [${err.meta?.target?.join(', ') || 'Unique Column'}] already exists.`,
    });
  }

  // Translate Prisma missing entity lookups
  if (err.code === 'P2025') {
    return res.status(404).json({
      status: 'fail',
      message: err.meta?.cause || 'The requested database record entry was not found.',
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // Hide stack traces on production instances to secure architectural endpoints
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
