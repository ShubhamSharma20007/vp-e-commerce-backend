import mongoose from "mongoose";


const purchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    }
})

const PurchaseModel = mongoose.model("purchase", purchaseSchema);

export default PurchaseModel;