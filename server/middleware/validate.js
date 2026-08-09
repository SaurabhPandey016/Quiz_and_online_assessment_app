import { AppError } from '../errors/custom.error.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    // FIXED: Safely access result.error.issues to extract error strings cleanly
    const errorMessages = result.error.issues
      .map(err => `${err.path.join('.')} field: ${err.message}`)
      .join(' | ');
      
    return next(new AppError(errorMessages, 400));
  }

  // Bind the fully sanitized and typed parameters directly to the request object
  req.validated = result.data;
  next();
};
