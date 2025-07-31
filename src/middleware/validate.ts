// middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate =
    (schema: Joi.Schema, target: 'body' | 'query' | 'params' = 'body') =>
        (req: Request, res: Response, next: NextFunction) => {
            const { error } = schema.validate(req[target], { abortEarly: false });
            if (error) {
                return res.status(422).json({
                    message: 'Validation failed',
                    details: error.details.map((d) => ({ path: d.path.join('.'), message: d.message })),
                });
            }
            next();
        };
