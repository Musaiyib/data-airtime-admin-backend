import asyncHandler from "express-async-handler";
import { AirtimePlanModel } from "../models/AirtimePlanModel.js";
import { DataModel } from "../models/dataModel.js";
import { DataPlanModel } from "../models/dataPlanModel.js";
import { TransactionModel } from "../models/transactionModel.js";
import { WalletModel } from "../models/walletModel.js";

// buy airtime
export const buyAirtime = asyncHandler(async (req, res) => {
  const { user, amount, phone, network } = req.body;
  if (!user || !amount || !phone || !network)
    return res.status(400).json("All fields are required");

  const { balance } = await WalletModel.findOne({ user });
  if (balance < amount) {
    return res
      .status(400)
      .json({ error: "Can't purchase Airtime, low balance" });
  }
  try {
    const data = {
      user,
      amount,
      phone,
      network,
    };
    //create and store new user
    const createDataBuy = await AirtimePlanModel.create(data);
    await WalletModel.findOneAndUpdate(
      { user },
      { $set: { balance: balance - amount } },
      { new: true }
    );
    const createAirtimeTrx = await TransactionModel.create(data);
    if (createDataBuy && createAirtimeTrx) {
      return res
        .status(201)
        .json({ code: 200, message: "Airtime purchase successful" });
    } else {
      res.status(400).json("Airtime purchase failed");
    }
  } catch (error) {
    res.status(500).json("An unexpected error occurred");
  }
});

// buy data
export const buyData = asyncHandler(async (req, res) => {
  const { user, plan, amount, phone, network } = req.body;
  if (!user || !amount || !phone || !plan || !network)
    return res.status(400).json({ error: "All fields are required" });

  const { balance } = await WalletModel.findOne({ user });
  if (!balance) {
    return res.status(400).json({ error: "Can't find user wallet" });
  }
  if (balance < amount) {
    return res.status(400).json({ error: "Can't purchase data, low balance" });
  }

  try {
    //create and store new user
    const createDataBuy = await DataModel.create({
      user,
      plan,
      amount,
      phone,
      network,
    }).catch((err) => {
      res.status(400).json({ error: "Unable to buy data" });
    });
    await WalletModel.findOneAndUpdate(
      { user },
      { $set: { balance: balance - amount } },
      { new: true }
    );
    const createDataTrx = await TransactionModel.create({
      user,
      plan,
      amount,
      phone,
      network,
    }).catch((err) => {
      res.status(400).json({ error: "Unable to create transaction for data" });
    });
    if (createDataBuy && createDataTrx) {
      return res
        .status(201)
        .json({ code: 200, message: "Data purchase successful" });
    } else {
      res.status(400).json({ error: "Data purchase failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// buy data
export const addDataPlan = asyncHandler(async (req, res) => {
  const { plan, amount, duration, network } = req.body;
  if (!amount || !duration || !plan || !network)
    return res.status(400).json({ error: "All fields are required" });

  try {
    //create and store new data plan
    const newDataPlan = await DataPlanModel.create({
      plan,
      amount,
      duration,
      network,
    });
    if (newDataPlan) {
      return res.status(201).json({ message: "Data plan added successfully" });
    } else {
      res.status(400).json({ error: "Unable to add data plan" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// add airtime plan
export const addAirtimePlan = asyncHandler(async (req, res) => {
  const { amount, network } = req.body;
  if (!amount || !network)
    return res
      .status(400)
      .json({ error: "Amount and Network are required fields" });

  try {
    //create and store new airtime plan
    const newAirtimePlan = await AirtimePlanModel.create({
      amount,
      network,
    });
    if (newAirtimePlan) {
      return res
        .status(201)
        .json({ message: "Airtime plan added successfully" });
    } else {
      res.status(400).json({ error: "Unable to add airtime plan" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// fetch airtime plan
export const getAirtimePlan = asyncHandler(async (req, res) => {
  try {
    //create and store new airtime plan
    const airtimePlan = await AirtimePlanModel.find();
    if (airtimePlan) {
      return res.status(200).json({ airtimePlan });
    } else {
      res.status(400).json({ error: "Unable to fetch airtime plan" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// fetch data plan
export const getDataPlan = asyncHandler(async (req, res) => {
  try {
    //getting data plan
    const dataPlan = await DataPlanModel.find();
    if (dataPlan) {
      return res.status(200).json({ dataPlan });
    } else {
      res.status(400).json({ error: "Unable to fetch data plan" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

export const editAirtimePlan = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const dataPlan = await AirtimePlanModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (dataPlan) {
      return res
        .status(200)
        .json({ message: "Airtime plan updated successfully", data: dataPlan });
    } else {
      res.status(400).json({ error: "Unable to update data plan" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

export const editDataPlan = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const dataPlan = await DataPlanModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (dataPlan) {
      return res
        .status(200)
        .json({ message: "Data plan updated successfully", data: dataPlan });
    } else {
      res.status(400).json({ error: "Unable to update data plan" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

export const deleteAirtimePlan = asyncHandler(async (req, res) => {
  try {
    //collecting id from params
    const { id } = req.params;
    //deleting data plan
    const dataPlan = await AirtimePlanModel.findByIdAndDelete(id);
    if (dataPlan) {
      return res
        .status(200)
        .json({ message: "Airtime plan successfully deleted" });
    } else {
      res.status(404).json({ error: "Airtime plan not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

export const deleteDataPlan = asyncHandler(async (req, res) => {
  try {
    //collecting id from params
    const { id } = req.params;
    //deleting data plan
    const dataPlan = await DataPlanModel.findByIdAndDelete(id);
    if (dataPlan) {
      return res
        .status(200)
        .json({ message: "Data plan successfully deleted" });
    } else {
      res.status(404).json({ error: "Data plan not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});
