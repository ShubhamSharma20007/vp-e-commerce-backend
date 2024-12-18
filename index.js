import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/connection.js';
import userRouter from './routes/user.route.js';
import productRouter from './routes/product.route.js';
import paymentRouter from './routes/payment.route.js';
import cartRouter from './routes/cart.route.js';
import { fileURLToPath } from 'url';
import path from 'path';
import auth from './middlewares/auth.middleware.js';
import orderRoute from './routes/order.route.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const dirname = fileURLToPath(
    import.meta.url)



connectDB()
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// static public path

process.env.NODE_ENV == "producation" ?
    app.use('/uploads', express.static(path.join(dirname, '/uploads'))) :
    app.use(express.static(path.join(dirname, "../public")));
//  cors configuration 
app.use(cors({ credentials: true, origin: process.env.CLIENT_ORIGIN }));



//  routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/payment', paymentRouter)
app.use('/api/v1/order', orderRoute)

//  payment intrigration  and gateway

app.post('/api/v1/payment-gateway', auth, async (req, res) => {
    const { products, area, city, pincode, state } = req.body;
    const user = req.user;

    if (!products || products.length === 0) {
        return res.status(400).json({ success: false, message: "No products provided." });
    }

    try {
        // Create a customer in Stripe
        const customer = await stripe.customers.create({
            name: `${user.fullName.firstName} ${user.fullName.lastName}`,
            email: user.email,
            address: {
                line1: area,
                postal_code: pincode,
                city: city,
                state: state,
                country: 'IN',
            },
        });

        if (!customer) {
            throw new Error("Failed to create customer.");
        }


        const stripeProducts = await Promise.all(
            products.map(async (p) => {
                const stripeProduct = await stripe.products.create({
                    name: p.productId.name,

                });

                const stripePrice = await stripe.prices.create({
                    product: stripeProduct.id,
                    unit_amount: p.productId.price * p.quantity,
                    currency: 'INR',
                });

                return {
                    price: stripePrice.id,
                    quantity: p.quantity,
                };
            })
        );



        const session = await stripe.checkout.sessions.create({
            line_items: stripeProducts.map((item) => ({
                price: item.price,
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.CLIENT_ORIGIN}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_ORIGIN}/cart`,
            customer_email: user.email,

        });



        if (!session || !session.url) {
            throw new Error("Failed to create checkout session.");
        }



        return res.status(200).json({ url: session.url, success: true });

    } catch (error) {
        console.error("Payment error:", error.message);
        return res.status(500).json({ url: null, success: false, error: error.message });
    }
});



//  Server listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running on port ${port} ✔`)
})