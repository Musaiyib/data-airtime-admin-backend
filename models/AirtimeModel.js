import mongoose from "mongoose";

const AirtimeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    amount: {
      type: Number,
      required: true,
    },
    network: {
      type: String,
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

export const AirtimeModel = mongoose.model("Airtime", AirtimeSchema);
