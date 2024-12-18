import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,

        },
        lastName: {
            type: String,
            required: true,
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    address: {
        area: {
            type: String,

        },
        city: {
            type: String,

        },
        state: {
            type: String,

        },
        pincode: {
            type: Number,

        }
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
})
userSchema.methods.genrateAuthToken = function () {
    return jwt.sign({
        _id: this._id
    }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const UserModel = mongoose.model("user", userSchema);
export default UserModel;