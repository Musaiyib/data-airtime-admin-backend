import mongoose from "mongoose";

const DataSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    plan: {
      type: String,
      required: true,
    },
    network: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { type: Number, default: Date.now() },
  }
);

export const DataModel = mongoose.model("Data", DataSchema);
