import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,

    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    category: {
        type: String,
        required: true
    },
    stockes: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
})

const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;