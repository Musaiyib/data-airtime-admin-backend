import express from "express";
import { getAllTrx, userTrx } from "../controllers/transactionController.js";
const trxRoute = express.Router();

// get all transaction
trxRoute.route("/").get(getAllTrx);

trxRoute.route("/:id").get(userTrx);

export default trxRoute;
