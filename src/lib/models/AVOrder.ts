import mongoose, { Schema, Document } from 'mongoose';

export interface IAVOrder extends Document {
  orderIDP: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  antivirusType: string;
  keyID?: string;
  key?: string;
  price: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AVOrderSchema = new Schema<IAVOrder>(
  {
    orderIDP: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    antivirusType: {
      type: String,
      required: true,
      trim: true,
    },
    keyID: {
      type: String,
      default: '',
      trim: true,
    },
    key: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'pending',
      trim: true,
    },
    paymentStatus: {
      type: String,
      default: 'pending',
      trim: true,
    },
    orderStatus: {
      type: String,
      default: 'pending',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AVOrder ||
  mongoose.model<IAVOrder>('AVOrder', AVOrderSchema);
