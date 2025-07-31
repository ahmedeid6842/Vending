import { IOrderedProduct } from "../middleware/payment";
import { IUserDocument } from "../models/user";
import { paymentChange } from "../utils/payment";
import { updateProductService } from "./product";
import { updateUserService } from "./user";

export const depositPaymentService = async (user: IUserDocument, amount: number) => {
    const updatedUser = await updateUserService({ _id: user._id }, { $inc: { deposit: amount } }) as IUserDocument;
    return {
        success: true,
        message: "Deposit successful",
        data: {
            accountBalance: updatedUser.deposit
        }
    };
}

export const buyPaymentService = async (user: IUserDocument, orderTotalCost: number, orderedProducts: IOrderedProduct[]) => {

    if (Number(user.deposit) < orderTotalCost) {
        // TODO: Error Handling
        return {
            success: false,
            error: {
                path: 'deposit',
                message: `Your order total cost ${orderTotalCost} exceeds your deposit ${user.deposit}. Please deposit more.`,
            }
        };
    }

    await updateUserService({ _id: user._id }, { $inc: { deposit: -orderTotalCost } });
    user.deposit -= orderTotalCost;

    for (const product of orderedProducts) {
        await updateUserService({ _id: product.sellerID }, { $inc: { deposit: product.totalCost } });
        await updateProductService({ _id: product._id }, { $inc: { amountAvailable: -product.quantity } });
    }

    const order = orderedProducts.map(product => {
        const { totalCost, quantity } = product;
        const plainProduct = product.toObject(); // Handles Mongoose docs
        return { ...plainProduct, totalCost, quantity };
    });

    const remainingChange = paymentChange(user.deposit);

    return {
        success: true,
        message: "Your order has been placed successfully.",
        data: {
            order,
            orderTotalCost,
            remainingChange
        }
    };
}

export const resetPaymentService = async (user: IUserDocument) => {
    let remainingChange = paymentChange(user.deposit || 0);

    await updateUserService({ _id: user._id }, { $set: { deposit: 0 } });

    return {
        success: true,
        message: "Your deposit has been reset successfully.",
        data: {
            remainingChange
        }
    };
}