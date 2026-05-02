import 'dotenv/config';
import express from 'express';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { router } from './routes/index.js';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3002', 10);

app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[API] Running on http://localhost:${PORT}`);
});

export default app;
