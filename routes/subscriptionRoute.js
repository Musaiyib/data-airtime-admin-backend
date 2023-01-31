import { Router } from "express";
import {
  addAirtimePlan,
  addDataPlan,
  buyAirtime,
  buyData,
  getDataPlan,
  getAirtimePlan,
  editAirtimePlan,
  deleteAirtimePlan,
  editDataPlan,
  deleteDataPlan,
} from "../controllers/subscriptionController.js";
const subscriptionRoute = Router();

//Elcom candidate routes
// registering candidate
subscriptionRoute.route("/data").post(buyData);
subscriptionRoute.route("/airtime").post(buyAirtime);
subscriptionRoute.route("/data/addplan").get(getDataPlan).post(addDataPlan);
subscriptionRoute
  .route("/airtime/addplan")
  .get(getAirtimePlan)
  .post(addAirtimePlan);
subscriptionRoute
  .route("/airtime/:id")
  .put(editAirtimePlan)
  .delete(deleteAirtimePlan);
subscriptionRoute.route("/data/:id").put(editDataPlan).delete(deleteDataPlan);
export default subscriptionRoute;
