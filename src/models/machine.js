const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
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
machineSchema.pre('remove', async function (next) {
    await this.model('product').deleteMany({ machineID: this._id });
    next();
});

module.exports.machineSchema = machineSchema;
module.exports.MachineModel = mongoose.model('machine', machineSchema);