const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { required } = require("joi");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        minlength: 8,
        maxlength: 255,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['buyer', 'seller',"admin"],
        default: 'buyer'
    },
    deposit: {
        type: Number,
        required: true,
        default: 0
    },
    orders: [new mongoose.Schema({

        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'product'
        },
        name: {
            type: String,
            minlength: 5,
            maxlength: 255,
            required: true
        },
        totalCost: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }

    })]
})

userSchema.pre('save', async function (next) {
    /**
     * DONE: pre saving user docuemnt check if password is changed 
     * DONE: if it's , then hash the password before save it
     */
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR));
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    return next();
})

userSchema.pre('findOneAndUpdate', async function (next) {
    /**
     * DONE: check if password is going to be updated 
     * DONE: if it's ,then hash the password
     */
    const newPassword = this.getUpdate().$set?.password;
    if (!newPassword) return next();
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR));
    const hash = await bcrypt.hash(newPassword, salt);
    this.set({ password: hash })
    return next();
})

userSchema.methods.generateAuthToken = function () {
    /**
     * DONE: create access token
     * DONE: set the access token expiration to 15 minute, so session will long for 15 minutes 
     */
    const token = jwt.sign({ _id: this._id, userName: this.userName, role: this.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    return token;
}

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password).catch((e) => false);
}

module.exports.UserModel = mongoose.model('user', userSchema)