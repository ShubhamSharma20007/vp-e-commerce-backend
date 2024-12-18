import express from "express";
import { getOrders } from "../controllers/order.controller.js";
import auth from "../middlewares/auth.middleware.js";

const orderRoute = express.Router();
orderRoute.get("/get-orders", auth, getOrders);
export default orderRoute;