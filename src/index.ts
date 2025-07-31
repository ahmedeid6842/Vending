import { Request, Response } from 'express';

import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import { isAuthenticated } from './middleware/isAuthenticated';
import { role } from './middleware/role';
import { errorHandler } from './middleware/errorHandler';

import { log } from './utils/logger';
import { initDB } from './config/connectRedis';

import { User } from './routes/user';
import { Product } from './routes/product';
import { Payment } from './routes/payment';
import { Machine } from './routes/machine';

const app = express();

import './utils/cache';
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(helmet());
app.use(compression());

//DONE: uncaught execption handling
process.on('uncaughtException', ex => {
  log.error(ex.message);
  throw ex;
});

//DONE: unhandeled promise rejections
process.on('unhandledRejection', (ex: any) => {
  log.error(ex.message);
  throw ex;
});

app.use('/user', User);
app.use('/product', Product);
app.use('/payment', isAuthenticated, role('buyer'), Payment);
app.use('/machine', Machine);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `the endpoint ${req.url} you trying to access not found`,
  });
});
app.use(errorHandler);

const port = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(async () => {
    return await initDB();
  })
  .then(() => {
    log.info('connected to Databases 🤝');
    app.listen(port, () => log.info(`listening on port ${port} 🚀🎯`));
  });
