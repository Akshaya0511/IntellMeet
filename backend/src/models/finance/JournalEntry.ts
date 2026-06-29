import mongoose, { Schema, Document } from "mongoose";

export interface IJournalEntry extends Document {
  entryNumber: string;
  date: Date;
  description: string;
  debit: number;
  credit: number;
  status: string;
}

const journalEntrySchema = new Schema(
  {
    entryNumber: {
      type: String,
      required: true,
      unique: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    description: {
      type: String,
      required: true,
    },

    debit: {
      type: Number,
      default: 0,
    },

    credit: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Posted",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJournalEntry>(
  "JournalEntry",
  journalEntrySchema
);