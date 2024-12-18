import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }

    }],
    total: {
        type: Number,
        required: true
    },
    // status: {
    //     type: String,
    //     enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    //     default: 'pending'
    // },

}, {
    timestamps: true
})

const OrderModel = mongoose.model('order', orderSchema)

export default OrderModel;