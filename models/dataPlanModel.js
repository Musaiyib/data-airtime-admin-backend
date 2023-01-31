import mongoose from "mongoose";

const DataPlanSchema = mongoose.Schema(
  {
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
    duration: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { type: Number, default: Date.now() },
  }
);

export const DataPlanModel = mongoose.model("DataPlan", DataPlanSchema);
