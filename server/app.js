import express from "express";
import cors from "cors";
import morgan from "morgan";
import Stripe from "stripe";
import dotenv from "dotenv";
import productRouter from "./routes/product.router.js";
import Order from "./models/orders.model.js";


dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware setup
app.use(morgan('combined'));
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use("/api/v1/products", productRouter);

// Order details retrieval route
app.get('/api/v1/order-details', async (req, res) => {
    try {
        const { session_id } = req.query;
        const order = await Order.findOne({ session_id });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.post("/api/v1/create-checkout-session", async (req, res) => {

    try {
        console.log(req.body);
        const { products, email, totalAmount } = req.body;
        console.log(`${products} ${email} ${totalAmount}`);

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.title.longTitle
                },
                unit_amount: product.price.cost * 100
            },
            quantity: 1
        }));

        // console.log(stripe);
        console.log(process.env.STRIPE_SECRET_KEY);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/cart-items/checkout/success",
            cancel_url: "http://localhost:3000/cart-items/checkout/cancel",
            metadata: {
                email,
                total_amount: totalAmount,
                order_date: new Date().toISOString()
            }
        })




    
        const preliminaryOrder = new Order({
            customer_email: email,
            products: products.map(product => ({
                product_id: product._id,
                title: product.title.longTitle,
                quantity: product.quantity || 1,
                price: product.price.cost
            })),
            total_amount: totalAmount,
            total_amount : totalAmount,
            session_id: session.id,
            payment_method: 'stripe', 
            created_at: new Date()
        });

        await preliminaryOrder.save();


        res.json({
            id: session.id,
            sessionUrl: session.url,

        });
    }
    catch (error) {
        console.error("Checkout Session Error:", error);
        res.status(500).json({ error: error.message });
    }



})





// --------------------------------------------


app.use(express.json({ 

    verify: (req, res, buf) => {
        req.rawBody = buf; 
    }
}));


app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log("Webhook Endpoint Triggered");

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify webhook signature using the raw body
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

        console.log(`Received Webhook Event: ${event.type}`);

        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                await handleSuccessfulPayment(session);
                break;

            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                await handlePaymentIntentSuccess(paymentIntent);
                break;

            case 'checkout.session.async_payment_failed':
            case 'payment_intent.payment_failed':
                const failedSession = event.data.object;
                await handleFailedPayment(failedSession);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook Verification Error:', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});



async function handleSuccessfulPayment(session) {
    try {
        console.log("Processing Successful Checkout Session");

        const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent
        );

        const order = await Order.findOneAndUpdate(
            { session_id: session.id },
            {
                payment_status: 'succeeded',
                transaction_id: paymentIntent.id,
                payment_method: paymentIntent.payment_method_types[0],
                completed_at: new Date(),
                payment_details: {
                    amount_received: paymentIntent.amount_received / 100,
                    currency: paymentIntent.currency,
                    payment_method: paymentIntent.payment_method_types[0]
                }
            },
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!order) {
            console.warn(`No order found for session: ${session.id}`);
        }

        console.log("Checkout Session Updated Successfully");
    } catch (error) {
        console.error('Successful Payment Webhook Error:', error);
    }
}

// Helper function for payment intent success
async function handlePaymentIntentSuccess(paymentIntent) {
    try {
        console.log("Processing Payment Intent Success");

        const order = await Order.findOneAndUpdate(
            { transaction_id: paymentIntent.id },
            {
                payment_status: 'succeeded',
                payment_details: {
                    amount_received: paymentIntent.amount_received / 100,
                    currency: paymentIntent.currency,
                    payment_method: paymentIntent.payment_method_types[0]
                },
                completed_at: new Date()
            },
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!order) {
            console.warn(`No order found for payment intent: ${paymentIntent.id}`);
        }

        console.log("Payment Intent Updated Successfully");
    } catch (error) {
        console.error('Payment Intent Success Webhook Error:', error);
    }
}

// Helper function for failed payment
async function handleFailedPayment(session) {
    try {
        console.log("Processing Failed Payment");

        const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent || session.id
        );

        const order = await Order.findOneAndUpdate(
            { 
                $or: [
                    { session_id: session.id },
                    { transaction_id: paymentIntent.id }
                ]
            },
            {
                payment_status: 'failed',
                transaction_id: paymentIntent.id,
                completed_at: new Date(),
                payment_details: {
                    failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed',
                    error_code: paymentIntent.last_payment_error?.code,
                    failure_type: paymentIntent.last_payment_error?.type
                }
            },
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!order) {
            console.warn(`No order found for failed payment: ${session.id}`);
        }

        console.log("Failed Payment Updated Successfully");
    } catch (error) {
        console.error('Failed Payment Webhook Error:', error);
    }
}


// --------------------------------------------

// app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {

//     console.log("I'm inside the webhook endpoint");

//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(
//             req.body, 
//             sig, 
//             process.env.STRIPE_WEBHOOK_SECRET
//         );
//     } catch (err) {
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle different event types
//     switch (event.type) {
//         case 'checkout.session.completed':
//             const session = event.data.object;
//             await handleSuccessfulPayment(session);
//             break;

//         case 'checkout.session.async_payment_failed':
//         case 'payment_intent.payment_failed':
//             const failedSession = event.data.object;
//             await handleFailedPayment(failedSession);
//             break;
//     }

//     res.json({ received: true });
// });


// async function handleSuccessfulPayment(session) {
//     try {
//         const paymentIntent = await stripe.paymentIntents.retrieve(
//             session.payment_intent
//         );

//         console.log("Payement Intent : ", paymentIntent);

//         await Order.findOneAndUpdate(
//             { session_id: session.id },
//             {
//                 payment_status: 'succeeded',
//                 transaction_id: paymentIntent.id,
//                 payment_method: paymentIntent.payment_method_types[0],
//                 completed_at: new Date(),
//                 payment_details: {
//                     amount_received: paymentIntent.amount_received / 100,
//                     currency: paymentIntent.currency
//                 }
//             },
//             { new: true }
//         );
//     } catch (error) {
//         console.error('Successful Payment Webhook Error:', error);
//     }
// }

// async function handleFailedPayment(session) {
//     try {
//         const paymentIntent = await stripe.paymentIntents.retrieve(
//             session.payment_intent
//         );
//         console.log("Payement Intent : ", paymentIntent);
//         await Order.findOneAndUpdate(
//             { session_id: session.id },
//             {
//                 payment_status: 'failed',
//                 transaction_id: paymentIntent.id,
//                 completed_at: new Date(),
//                 payment_details: {
//                     failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed',
//                     error_code: paymentIntent.last_payment_error?.code
//                 }
//             },
//             { new: true }
//         );
//     } catch (error) {
//         console.error('Failed Payment Webhook Error:', error);
//     }
// }














export { app };
