import cors from 'cors';

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((o) => o.trim());

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
});
