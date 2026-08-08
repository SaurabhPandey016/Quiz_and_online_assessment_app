export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    
    // Set status to 'fail' for 4xx client errors, or 'error' for 5xx system faults
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // Identifies explicitly expected, controlled operational execution runtime exceptions
    this.isOperational = true; 
    
    Error.captureStackTrace(this, this.constructor);
  }
}
