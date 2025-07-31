import mongoose from "mongoose";
import { ProductModel } from './product'; // adjust the path

interface IMachine {
    name: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    products: mongoose.Types.ObjectId[];
}

interface IMachineDocument extends IMachine, mongoose.Document {
    _id: mongoose.Types.ObjectId;
}

export const machineSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
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
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }]
});

machineSchema.index({ location: '2dsphere' });

//DONE: cascade delete products when vending machine is deleted
machineSchema.pre('remove', async function (this: IMachineDocument, next) {
    await ProductModel.deleteMany({ machineID: this._id });
    next();
});

export const MachineModel = mongoose.model<IMachineDocument>('machine', machineSchema);