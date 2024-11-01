import express from "express";
import {
  capturePaymentAndFinalizeOrder,
  createOrder,
} from "../controllers/student-controller/orderController.js";

const orderRouter = express.Router();

//  POST | create  payment
orderRouter.post("/create", createOrder);

//  POST | capture payment and finalize order
orderRouter.post("/capture", capturePaymentAndFinalizeOrder);

export default orderRouter;
