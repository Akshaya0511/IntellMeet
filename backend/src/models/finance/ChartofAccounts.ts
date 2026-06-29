import mongoose, { Schema, Document } from "mongoose";

export interface IChartOfAccounts extends Document {
  accountCode: string;
  accountName: string;
  accountType: string;
  balance: number;
  status: string;
}

const chartOfAccountsSchema = new Schema(
  {
    accountCode: {
      type: String,
      required: true,
      unique: true,
    },

    accountName: {
      type: String,
      required: true,
    },

    accountType: {
      type: String,
      required: true,
    },

    balance: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IChartOfAccounts>(
  "ChartOfAccounts",
  chartOfAccountsSchema
);