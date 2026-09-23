import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { aiRoutes } from './routes/ai.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Root health check for Render monitoring
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'hospital-ai-microservice',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/ai', aiRoutes);

export default app;
