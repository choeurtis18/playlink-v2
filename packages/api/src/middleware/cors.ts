import cors from 'cors';

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((o) => o.trim());

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
