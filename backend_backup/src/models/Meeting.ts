import mongoose, { Schema, Document } from "mongoose";

export interface IMeeting extends Document {
  title: string;
  meetingId: string;
  host: string;
  participants: string[];
  status: string;
}

const meetingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: String,
        ref: "User",
      },
    ],

    meetingId: {
      type: String,
      required: true,
      unique: true,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    status: {
        type: String,
        default: "scheduled",
    },

    summary: {
      type: String,
      default: "",
    },

    transcript: {
      type: String,
      default: "",
    },

    actionItems: [
      {
        type: String,
      },
    ],


  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);