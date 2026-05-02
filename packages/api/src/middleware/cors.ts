import cors from 'cors';

const corsOrigin = process.env.CORS_ORIGIN;

const allowedOrigins = corsOrigin
  ? corsOrigin.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  throw new Error('CORS_ORIGIN must be configured in production');
}

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const err = new Error(`CORS: origin ${origin} not allowed`) as Error & { statusCode: number };
      err.statusCode = 403;
      callback(err);
    }
  },
  credentials: true,
});
