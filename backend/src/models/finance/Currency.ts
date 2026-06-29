import mongoose, { Schema, Document } from "mongoose";

export interface ICurrency extends Document {
  currencyCode: string;
  currencyName: string;
  symbol: string;
  exchangeRate: number;
  status: string;
}

const currencySchema = new Schema(
  {
    currencyCode: {
      type: String,
      required: true,
      unique: true,
    },

    currencyName: {
      type: String,
      required: true,
    },

    symbol: {
      type: String,
      required: true,
    },

    exchangeRate: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICurrency>(
  "Currency",
  currencySchema
);