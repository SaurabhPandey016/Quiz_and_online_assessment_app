import { AppError } from '../errors/custom.error.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    // Compile and combine multiple Zod payload structural validation errors cleanly
    const errorMessages = result.error.errors
      .map(err => `${err.path.join('.')} field: ${err.message}`)
      .join(' | ');
      
    return next(new AppError(errorMessages, 400));
  }

  // Inject fully parsed, verified, and sanitized parameters directly into req.validated
  req.validated = result.data;
  next();
};
