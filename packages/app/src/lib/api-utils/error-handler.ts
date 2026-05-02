import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function createError(message: string, statusCode: number, code?: string): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

export function apiError(err: unknown): NextResponse {
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Erreur de validation',
          code: 'VALIDATION_ERROR',
          details: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
        },
      },
      { status: 400 }
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const fields = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'champ inconnu';
      return NextResponse.json(
        { success: false, error: { message: `Valeur déjà existante sur le champ : ${fields}`, code: 'CONFLICT' } },
        { status: 409 }
      );
    }
  }

  const appErr = err as AppError;
  const statusCode = appErr.statusCode ?? 500;
  const message = statusCode === 500 ? 'Erreur interne du serveur' : appErr.message;

  if (statusCode === 500) {
    console.error('[Error]', err);
  }

  return NextResponse.json(
    { success: false, error: { message, code: appErr.code ?? 'UNKNOWN_ERROR' } },
    { status: statusCode }
  );
}
