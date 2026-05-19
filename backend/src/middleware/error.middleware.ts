import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { IApiResponse } from '../types';
import { logger } from '../utils/logger';
import { env } from '../config/env';

/**
 * Global Express Error Handling Middleware.
 * Catches all errors and formats them into standard ApiResponse format.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let details: any = null;

  // Check if error is a custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  }
  // Mongoose CastError (e.g., invalid ObjectId format)
  else if (err.name === 'CastError') {
    statusCode = 400;
    code = 'BAD_REQUEST';
    message = `Invalid value for field: ${err.path}`;
    details = env.NODE_ENV === 'development' ? err.reason : null;
  }
  // Mongoose Validation Error
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Database validation failed';
    const validationDetails: Record<string, string> = {};
    for (const key in err.errors) {
      validationDetails[key] = err.errors[key].message;
    }
    details = validationDetails;
  }
  // MongoDB Duplicate Key Error (code 11000)
  else if (err.code === 11000) {
    statusCode = 409;
    code = 'CONFLICT';
    const keys = Object.keys(err.keyValue || {});
    message = keys.length > 0 
      ? `A record with this ${keys.join(', ')} already exists.` 
      : 'Duplicate key conflict occurred.';
    details = err.keyValue;
  }
  // Other standard errors
  else if (err instanceof Error) {
    message = err.message;
    if (env.NODE_ENV === 'development') {
      details = { stack: err.stack };
    }
  }

  // Log the error
  logger.error(`${req.method} ${req.path} failed with code ${code}: ${message}`, err);

  const response: IApiResponse<null> = {
    success: false,
    data: null,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: req.originalUrl || req.path,
    },
  };

  res.status(statusCode).json(response);
};
export default errorHandler;
