import mongoose, { Schema, Document } from 'mongoose';

export interface IAntiVirusKey extends Document {
  antivirustypeIDF: string;
  key: string;
  isActive: boolean;
  isIssue: boolean;
  orderIDF: string;
  expiryDate: Date;
  validityInMonths: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const AntiVirusKeySchema = new Schema<IAntiVirusKey>(
  {
    antivirustypeIDF: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isIssue: {
      type: Boolean,
      default: false,
    },
    orderIDF: {
      type: String,
      default: '',
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    validityInMonths: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AntiVirusKey ||
  mongoose.model<IAntiVirusKey>('AntiVirusKey', AntiVirusKeySchema);
