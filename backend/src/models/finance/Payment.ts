import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  paymentNumber: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  status: string;
}

const paymentSchema = new Schema(
  {
    paymentNumber: {
      type: String,
      required: true,
      unique: true,
    },

    invoiceId: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      default: "Bank Transfer",
    },

    status: {
      type: String,
      default: "Completed",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>(
  "Payment",
  paymentSchema
);