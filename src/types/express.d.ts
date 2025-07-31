import 'express';
import { IUserDocument } from '../models/user';
import { IOrderedProduct } from '../middleware/payment';

declare global {
    namespace Express {
        interface Request {
            user: IUserDocument;
            orderTotalCost: number | 0;
            orderedProducts: IOrderedProduct[];
        }
    }
}