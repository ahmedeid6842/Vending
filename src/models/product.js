const mongoose = require("mongoose");

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
    }
})

productSchema.index({ location: '2dsphere' });


module.exports.ProductModel = mongoose.model('product', productSchema)