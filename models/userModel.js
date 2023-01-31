import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    lowercase: true,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  password: {
    type: String,
    required: true,
    minLenght: 8,
  },
  pin: {
    type: Number,
    required: true,
    minLenght: 4,
  },
  mobile: {
    type: String,
    required: true,
    minLenght: 11,
  },
});

export const UserModel = mongoose.model("User", UserSchema);
