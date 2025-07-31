//DONE: internal server errors with express-async-erros
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { log } from '../utils/logger';

export const errorHandler = async (
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  log.error(error);
  return res.status(500).send('something went wrong');
};
