import mongoose from "mongoose";

const AirtimePlanSchema = mongoose.Schema(
  {
    network: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { type: Number, default: Date.now() },
  }
);

export const AirtimePlanModel = mongoose.model(
  "AirtimePlan",
  AirtimePlanSchema
);
