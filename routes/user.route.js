import express from "express";
import { regiserUser, loginUser, logout, getUserProfile, userRequiredAddress } from "../controllers/user.controller.js";
import { body } from "express-validator";
import auth from "../middlewares/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/register", regiserUser);
userRouter.post("/login", loginUser);
userRouter.get('/logout', auth, logout)
userRouter.get('/profile', auth, getUserProfile)
userRouter.post('/user-address', auth, userRequiredAddress)




export default userRouter;