import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URL}`);
        if (connection) {
            console.log("Database connected 🎉")
        }
    } catch (error) {
        console.log(error)

    }

}

export default connectDB