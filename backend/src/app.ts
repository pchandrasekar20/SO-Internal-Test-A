import express, { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from '@/middleware/errorHandler';
import { requestLogger } from '@/middleware/requestLogger';
import { swaggerDef } from '@/docs/swagger';
import stocksRoutes from '@/routes/stocks';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDef));

app.use('/api/stocks', stocksRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

app.use(errorHandler);

export default app;
