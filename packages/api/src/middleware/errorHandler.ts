import type { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode ?? 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  if (statusCode === 500) {
    console.error('[Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    error: { message, code: err.code },
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, error: { message: 'Route not found' } });
}

export function createError(message: string, statusCode: number, code?: string): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.code = code;
  return err;
}
