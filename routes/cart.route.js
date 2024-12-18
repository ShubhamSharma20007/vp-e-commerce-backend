import express from "express";
import { createCartProduct, getProductCart, cartLength, updateProductCart, deleteProductCart } from "../controllers/cart.controller.js";
import auth from "../middlewares/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart", auth, createCartProduct);
cartRouter.get("/get-cart-item", auth, getProductCart);
cartRouter.get('/cart-item-length', auth, cartLength)
cartRouter.put("/update-cart-item", auth, updateProductCart);
cartRouter.delete("/delete-cart-item/:id/:qty", auth, deleteProductCart); // :id 

export default cartRouter;