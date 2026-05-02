import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Erreur de validation',
        code: 'VALIDATION_ERROR',
        details: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
      },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const fields = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'champ inconnu';
      res.status(409).json({
        success: false,
        error: { message: `Valeur déjà existante sur le champ : ${fields}`, code: 'CONFLICT' },
      });
      return;
    }
  }

  const statusCode = (err as AppError).statusCode ?? 500;
  const message = statusCode === 500 ? 'Erreur interne du serveur' : err.message;

  if (statusCode === 500) {
    console.error('[Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    error: { message, code: (err as AppError).code ?? 'UNKNOWN_ERROR' },
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, error: { message: 'Route introuvable' } });
}

export function createError(message: string, statusCode: number, code?: string): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.code = code;
  return err;
}
