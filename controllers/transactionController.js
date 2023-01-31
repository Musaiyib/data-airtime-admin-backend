import bcrypt from "bcryptjs";
import { UserModel } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import EmailValidator from "email-validator";
import { TransactionModel } from "../models/transactionModel.js";

// generating token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const validateEmail = (val) => {
  return EmailValidator.validate(val);
};

// register user
export const userTrx = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!userId) return res.status(400).json({ msg: "userId ID is required" });

  // check if userId exist in database
  const trx = await TransactionModel.find({ user: userId });

  try {
    if (trx) {
      return res.status(200).json(trx);
    }
  } catch (error) {
    console.log(error);
  }
});

//login user
export const getAllTrx = asyncHandler(async (req, res) => {
  const trx = await TransactionModel.find();

  try {
    if (trx) {
      return res.status(200).json(trx);
    }
  } catch (error) {
    console.log(error);
  }
});

// get me
export const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);

  res.status(200).json({
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    pin: user.pin,
    mobile: user.mobile,
  });
});

//get all users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json({ users });
});

//update user
export const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // const user = await User.findById(id);
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role)
    return res.status(400).json({ msg: "All are required" });

  // validating email
  if (validateEmail(email) === false) {
    return res.status(400).json("Invalid email");
  }

  if (!req.user) {
    res.status(404).json({ message: "User not found" });
  }

  if (req.user._id.toString() !== id && req.user.role !== "admin") {
    return res.status(401).json("User not authorized");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);

  const update = await User.findByIdAndUpdate(
    id,
    { email, name, password: hashedPwd },
    {
      new: true,
    }
  );
  // const users = await User.find();

  res
    .status(200)
    .json({ _id: update._id, email: update.email, name: update.name });
  // res.status(200).json({ _id: update._id, email: user.email, name: user.name });
});

//delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (req.user._id.toString() !== id && req.user.role !== "admin") {
    return res.status(401).json("User not authorized");
  }

  if (!req.user) {
    res.status(404).json("User not found");
  }
  await req.user.remove();
  // const users = await User.find();
  res
    .status(200)
    .json(`User with ${req.user.email} has been deleted successfully`);
});
