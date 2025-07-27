import mongoose from "mongoose";
import { MachineModel } from "./machine";

interface IProduct {
    name: string;
    cost: number;
    amountAvailable: number;
    sellerID: mongoose.Types.ObjectId;
    machineID: mongoose.Types.ObjectId;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    createdAt?: Date | null;
}

export interface IProductDocument extends IProduct, mongoose.Document {
    _id: mongoose.Types.ObjectId;
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    amountAvailable: {
        type: Number,
        required: true,
        default: 0
    },
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    machineID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'vendingMachine'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true })

productSchema.index({ location: '2dsphere' });

//DONE: added index to createdAt with expiration so the product will be removed after 30 days from createdAt is set
productSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

productSchema.post('findOneAndUpdate', async function (product, next) {
    /**
     * DONE: if product amount available is zero - then remove that product from the vending machine products list
     * DONE: if the product amount available is increased - then add to set that product id to vending machine products list
     */
    if (product.amountAvailable == 0) {
        await MachineModel.findOneAndUpdate(
            { _id: product.machineID },
            { $pull: { products: product._id } },
        );
        product.createdAt = new Date();
        await product.save();
    } else if (product.amountAvailable > 0) {
        await MachineModel.findOneAndUpdate(
            { _id: product.machineID },
            { $addToSet: { products: product._id } },
        );
        product.createdAt = null;
        await product.save();
    }
})

export const ProductModel = mongoose.model<IProductDocument>('product', productSchema)