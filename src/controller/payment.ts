import {Request,Response} from 'express';
import { updateProductService } from "../services/product";
import { updateUserService, addOrderToUserService } from "../services/user";
import { paymentChange } from "../utils/payment";
import { IUserDocument } from '../models/user';

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

    if (Number(req.user?.deposit) < req.orderTotalCost) {
        return res.status(400).send({ path: 'deposit', message: `your order totla cost ${req.orderTotalCost} exceed your deposit ${req.user?.deposit}, you need to pay more` })
    }

    if(req.user){
        req.user.deposit -= req?.orderTotalCost;
        await updateUserService({ _id: req.user?._id }, { $inc: { deposit: -req.orderTotalCost } })
    }

    for (const product of req.orderedProducts) {
        await updateUserService({ _id: product.sellerID }, { $inc: { deposit: product.totalCost } })
        await updateProductService({ _id: product._id }, { $inc: { amountAvailable: -product.quantity } })
    }

    let order = req.orderedProducts.map(product => {
        const { totalCost, quantity } = product;
        const plainProduct = product.toObject(); 
        return { ...plainProduct, totalCost, quantity };
    });

    await addOrderToUserService(req.user?._id, order);

    let remainingChange = paymentChange(req.user?.deposit || 0);
    return res.status(201).send({ message: "ordered succesfully", order, orderTotalCost: req.orderTotalCost, remainingChange })
}

export const resetPaymentController = async (req: Request, res: Response) => {
    /**
     * DONE: user must be authenticated with buyer role
     * DONE: if there is deposit in coins [5,10,..100]
     * DONE: set the user deposit to zero
     */
    let remainingChange = paymentChange(req.user?.deposit || 0);

    await updateUserService({ _id: req.user?._id }, { $set: { deposit: 0 } });

    return res.status(201).send({ message: "your deposit reset succesfull", remainingChange });
}