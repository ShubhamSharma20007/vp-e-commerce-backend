import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js";
const auth = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1] || req.cookies.token;
    if (!token) return res.status(401).json({ message: "unauthorized" })
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is not valid" })
        } else {
            const findUser = await UserModel.findById(decoded._id);
            req.user = findUser;
            next();
        }
    })
}

export default auth;