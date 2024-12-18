import UserModel from "../models/user.model.js";
import { validationResult } from "express-validator"

const regiserUser = async (req, res) => {
    const {
        fullName,
        email,
        password,
        role
    } = req.body;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() })
    // }
    try {
        //  check user already exist or not
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exist", success: false });
        }
        const user = await UserModel.create({
            fullName: {
                firstName: fullName.firstName,
                lastName: fullName.lastName
            },
            email,
            password,
            role
        });
        return res.status(200).json({ user, message: "User created successfully", success: true });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: err.message, success: false });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        //  genrate the token
        const token = await user.genrateAuthToken();

        //  set the token in the cookie
        res.cookie('token', token)
        return res.status(200).json({ token, success: true, message: "User login successfully", user });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: err.message, success: false });
    }
}


const logout = async (req, res) => {
    try {
        req.headers.authorization = null
        res.clearCookie('token');
        return res.status(200).json({ message: "User logout successfully", success: true });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: err.message, success: false });
    }
}


const getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        // console.log(req.cookies.token) // access the token 
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false })
        }
        return res.status(200).json({ message: "User profile", user, success: true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error, success: false });

    }
}

const userRequiredAddress = async (req, res) => {
    const { area, city, state, pincode } = req.body;

    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false })
        }
        // find the user
        const updateUser = await UserModel.findById(user._id);
        updateUser.address = { area, city, state, pincode };
        await updateUser.save();
        return res.status(200).json({ message: "User address updated", updateUser, success: true });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error, success: false });

    }

}

export {
    regiserUser,
    loginUser,
    userRequiredAddress,
    logout,
    getUserProfile,

}