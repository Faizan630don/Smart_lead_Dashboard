import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { NotFoundError } from './utils/errors';
import { env } from './config/env';
import { logger } from './utils/logger';

const app = express();

// Set trust proxy (useful for reverse proxies like Nginx/Heroku/AWS Load Balancers)
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware configuration (morgan writes logs through our custom logger)
const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
app.use(
  morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: morganStream,
  })
);

// Base route test
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    message: 'Smart Leads Dashboard Backend API is running.',
    version: '1.0.0'
  });
});

// Mounting all application routes under /api
app.use('/api', routes);

// Catch-all route handler for undefined endpoints
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('The requested API resource does not exist'));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
