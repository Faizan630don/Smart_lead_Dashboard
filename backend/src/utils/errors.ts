/**
 * Base custom error class for application errors
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: any;

  constructor(message: string, statusCode: number, code: string, details: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    
    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * ValidationError (400 Bad Request)
 */
export class ValidationError extends AppError {
  constructor(message: string, details: any = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * UnauthorizedError (401 Unauthorized)
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required', details: any = null) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

/**
 * ForbiddenError (403 Forbidden)
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied', details: any = null) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

/**
 * NotFoundError (404 Not Found)
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details: any = null) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

/**
 * InternalServerError (500 Internal Server Error)
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected error occurred', details: any = null) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}
