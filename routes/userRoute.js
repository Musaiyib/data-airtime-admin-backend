import express from "express";
// import {
// } from "../controllers/subscriptionController.js";
import {
  handleNewUser,
  getUsers,
  login,
  getWalletBalance,
  fundWallet,
} from "../controllers/userController.js";
const userRoute = express.Router();

// get/login elcom
userRoute.route("/").post(login);

userRoute.route("/allusers").get(getUsers);

// registering elcom
userRoute.route("/register").post(handleNewUser);
userRoute.route("/wallet/balance/:id").get(getWalletBalance).post(fundWallet);

export default userRoute;
