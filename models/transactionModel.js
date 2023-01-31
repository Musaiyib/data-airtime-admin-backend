import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    plan: {
      type: String,
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
    timestamps: { type: Date, default: Date.now() },
  }
);

export const TransactionModel = mongoose.model(
  "Transaction",
  TransactionSchema
);
