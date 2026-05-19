import { Response } from 'express';
import { IApiResponse, IPaginationMeta } from '../types';

/**
 * Standard utility to send successful responses conforming to global wrapper formatting.
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T,
  path: string,
  pagination?: IPaginationMeta
): void => {
  const response: IApiResponse<T> = {
    success: true,
    data,
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
      path,
      ...(pagination ? { pagination } : {}),
    },
  };

  res.status(statusCode).json(response);
};
export default sendResponse;
