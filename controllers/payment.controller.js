import CartModel from "../models/cart.model.js";
import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";

import mail from "../lib/mail-service.js";

const createPaymentIntent = async (req, res) => {
    const user = req.user;
    const getCartItems = await CartModel.findOne({ userId: user._id }).populate('products.productId');

    if (!getCartItems) return res.status(404).send("Cart not found");

    if (getCartItems.products.length === 0) return res.status(404).send("Cart is empty");

    const orderItems = await Promise.all(getCartItems.products.map(async (item) => {
        const product = await ProductModel.findById(item.productId)
        return {
            productId: product._id,
            quantity: item.quantity,
            price: product.price,
        }
    }));

    //  total
    const total = getCartItems.products.reduce((acc, item) => {
        const product = item.productId;
        return acc + product.price * item.quantity;
    }, 0);


    //  check order is already exists
    let existingOrder = await OrderModel.findOne({ userId: user._id });
    if (existingOrder) {
        existingOrder.items.push(...orderItems)
        existingOrder.total += total;
        await existingOrder.save();
    } else {
        existingOrder = await OrderModel.create({
            userId: user._id,
            items: orderItems,
            total
        });
        if (!existingOrder) {
            return res.status(500).send("Error creating order");
        }
    }

    // update the quantity from Product modal
    const bulkOperations = orderItems.map((item) => ({
        updateOne: {
            filter: { _id: item.productId },
            update: { $inc: { stockes: -item.quantity } },

        },
    }));

    await ProductModel.bulkWrite(bulkOperations);

    await CartModel.findOneAndUpdate({ userId: user._id }, {
        $set: {
            products: []
        }
    })


    const mailProducts = await Promise.all(orderItems.map(async (item) => {
        const product = await ProductModel.findById(item.productId);
        return {
            name: product.name,
            price: product.price,
            quantity: item.quantity
        }
    }))



    //  mail functionality'
    const emailText = {
        recepient: req.user.email,
        subject: "Order Placed Successfully",
        products: mailProducts

    };


    //  sending mail function
    mail(emailText, user)

    return res.status(200).json({
        success: true,
        message: "Order created successfully",
        // order: existingOrder,
    });
}

export {
    createPaymentIntent,

}