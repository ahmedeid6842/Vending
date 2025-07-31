import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const orderSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'product',
  },
  name: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

interface IUserSchema {
  userName: string;
  password: string;
  role: 'buyer' | 'seller' | 'admin';
  deposit: number;
  orders: (typeof orderSchema)[];
}

export interface IUserDocument extends IUserSchema, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  generateAuthToken(): string;
  comparePassword(userPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    minlength: 8,
    maxlength: 255,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer',
  },
  deposit: {
    type: Number,
    required: true,
    default: 0,
  },
  orders: [orderSchema],
});

userSchema.pre('save', async function (next) {
  /**
   * DONE: pre saving user docuemnt check if password is changed
   * DONE: if it's , then hash the password before save it
   */
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(
    parseInt(process.env.SALT_WORK_FACTOR as string)
  );
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  return next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (!update || typeof update !== 'object') return next();

  const passwordToUpdate =
    ('$set' in update && update.$set?.password) ||
    ('password' in update && (update as any).password);

  if (!passwordToUpdate) return next();

  const salt = await bcrypt.genSalt(
    parseInt(process.env.SALT_WORK_FACTOR as string)
  );
  const hash = await bcrypt.hash(passwordToUpdate, salt);

  // If using $set, update inside it; otherwise update directly
  if ('$set' in update && update.$set) {
    update.$set.password = hash;
  } else {
    (update as any).password = hash;
  }

  return next();
});

userSchema.methods.generateAuthToken = function () {
  /**
   * DONE: create access token
   * DONE: set the access token expiration to 15 minute, so session will long for 15 minutes
   */
  const token = jwt.sign(
    { _id: this._id, userName: this.userName, role: this.role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '15m' }
  );
  return token;
};

userSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(userPassword, this.password).catch(_e => false);
};

export const UserModel = mongoose.model<IUserDocument>('user', userSchema);
