import {Request,Response} from 'express';
import { updateProductService } from "../services/product";
import { updateUserService, addOrderToUserService } from "../services/user";
import { paymentChange } from "../utils/payment";
import { IUserDocument } from '../models/user';
import { buyPaymentService, resetPaymentService } from '../services/payment';

export const depositPaymentController = async (req: Request, res: Response) => {
    /**
     * DONE: user must be authenticated with buyer role
     * DONE: validate requst body and verify the coins condition
     * DONE: add deposit value to user collection
     */

    req.user = await updateUserService({ _id: req.user?._id }, { $inc: { deposit: req.body.amount } }) as IUserDocument;

    return res.status(201).send({ message: "Deposit successful", accountBalance: req.user?.deposit });
}

export const buyPaymentController = async (req: Request, res: Response) => {
    /**
     * DONE: user must be authenticated with buyer role
     * DONE: check product's existence for both prodcutID and amount Available and calculate order cost
     * DONE: check if user's deposit is enough for the order or no
     * DONE: subtract order cost from buyer deposit
     * DONE: iterate over the ordered product
     *  DONE: add product cost to seller deposit
     *  DONE: subtract product's amount availble from product's ordered quantity
     * DONE: add order to the buyer embeded order order collection 
     *  DONE: destructure orderTotalCost while you add the order
     */
    const user = req.user;
    const orderTotalCost = req.orderTotalCost;
    const orderedProducts = req.orderedProducts;
  
    const result = await buyPaymentService(user, orderTotalCost, orderedProducts);
  
    if (!result.success) {
      return res.status(400).send(result.error);
    }
  
    return res.status(201).send({
      message: result.message,
      ...result.data
    });
}

export const resetPaymentController = async (req: Request, res: Response) => {
    /**
     * DONE: user must be authenticated with buyer role
     * DONE: if there is deposit in coins [5,10,..100]
     * DONE: set the user deposit to zero
     */
    const result = await resetPaymentService(req.user);

    return res.status(201).send({ message: result.message, ...result?.data });
}