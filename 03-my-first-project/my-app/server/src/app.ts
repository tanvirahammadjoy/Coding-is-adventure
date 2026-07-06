import express, { Application, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { env } from './config/env';
import { configurePassport } from './passport/jwt.strategy';
import routes from './routes';
import { notFound } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// Security & parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// Passport (stateless JWT, no sessions)
app.use(passport.initialize());
configurePassport(passport);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'OK', uptime: process.uptime() });
});

// API routes
app.use('/api/v1', routes);

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
