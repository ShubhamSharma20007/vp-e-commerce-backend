import express from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";
import auth from "../middlewares/auth.middleware.js";

const paymentRouter = express.Router();
paymentRouter.get("/create-payment-intent", auth, createPaymentIntent);
export default paymentRouter;