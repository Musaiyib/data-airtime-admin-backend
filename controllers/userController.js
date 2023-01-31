import bcrypt from "bcryptjs";
import { UserModel } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import EmailValidator from "email-validator";
import { WalletModel } from "../models/walletModel.js";

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
export const handleNewUser = asyncHandler(async (req, res) => {
  const { email, password, name, role, pin, mobile } = req.body;
  if (!email || !password || !name || !pin || !mobile)
    return res.status(400).json({ msg: "All are required" });

  // validating email
  if (validateEmail(email) === false) {
    return res.status(400).json("Invalid email");
  }

  // check if user exist in database
  const emailDuplicate = await UserModel.findOne({ email });
  if (emailDuplicate) return res.status(409).json("User already exist");

  try {
    // encrypting the password
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    //create and store new user
    const createUser = await UserModel.create({
      email,
      password: hashedPwd,
      role,
      name,
      pin,
      mobile,
    });

    if (createUser) {
      if (await WalletModel.create({ user: createUser._id })) {
        return res.status(201).json({
          _id: createUser._id,
          name: createUser.name,
          email: createUser.email,
          role: createUser.role,
          code: 200,
          pin: createUser.pin,
          mobile: createUser.mobile,
          token: generateToken(createUser._id, createUser.role),
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//login user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  // validating email
  if (validateEmail(email) === false) {
    return res.status(400).json("Invalid email");
  }

  //check if user exist
  const user = await UserModel.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ message: `User with this email is: ${email} not found` });

  try {
    //validating user password
    const validatePassword = await bcrypt.compare(password, user.password);

    //log user in
    const wallet = await WalletModel.find(user._id);
    if (validatePassword && wallet) {
      return res.status(200).json({
        _id: user._id,
        email: user.email,
        name: user.name,
        code: 200,
        role: user.role,
        pin: user.pin,
        mobile: user.mobile,
        token: generateToken(user._id, user.role),
        wallet: wallet[0].balance,
      });
    } else {
      return res.status(409).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
  }
});

// get me
export const getWalletBalance = asyncHandler(async (req, res) => {
  try {
    const wallet = await WalletModel.findOne({ user: req.params.id });
    if (!wallet) {
      return res.status(404).json({ error: "wallet not found" });
    }
    const { balance } = wallet;
    res.status(200).json(balance);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving wallet balance" });
  }
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
