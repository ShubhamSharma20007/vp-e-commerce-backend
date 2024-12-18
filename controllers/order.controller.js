import OrderModel from "../models/order.model.js"
const getOrders = async (req, res) => {
    const user = req.user;
    try {
        const orders = await OrderModel.findOne({ userId: user._id }).populate('items.productId');
        const modified = orders.items.map(item => {
            const product = {
                ...item.productId.toJSON(),
                quantity: item.quantity,
                itemCreatedAt: item.createdAt
            }
            return { productId: product }
        })

        const mergedata = {
            ...orders.toJSON(),
            items: modified
        }

        return res.status(200).json(mergedata);

    } catch (error) {
        return res.status(500).json(error);

    }
}
export {
    getOrders
}