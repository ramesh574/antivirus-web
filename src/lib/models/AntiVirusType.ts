import mongoose, { Schema, Document } from 'mongoose';

export interface IAntiVirusType extends Document {
  antivirustypeIDP: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  validityInMonths: number;
  maxDevices: number;
  features: string[];
  image?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AntiVirusTypeSchema = new Schema<IAntiVirusType>(
  {
    antivirustypeIDP: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: 'fa-shield-alt',
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    validityInMonths: {
      type: Number,
      required: true,
      min: 1,
    },
    maxDevices: {
      type: Number,
      default: 1,
      min: 1,
    },
    features: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AntiVirusType ||
  mongoose.model<IAntiVirusType>('AntiVirusType', AntiVirusTypeSchema);
