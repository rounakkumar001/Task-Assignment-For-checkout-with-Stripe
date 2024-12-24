// import mongoose from 'mongoose';

// // const orderSchema = new mongoose.Schema({
// //     customer_email: { type: String, required: true },
// //     items: { type: Array, required: true }, 
// //     payment_status: { type: String, required: true }, 
// //     transaction_id: { type: String }, 
// //     total_amount : {type : Number},
// //     created_at: { type: Date, default: Date.now },
// // });

// // const Order = mongoose.model('Order', orderSchema);





// const OrderSchema = new mongoose.Schema({
//     customer_email: {
//         type: String,
//         required: true
//     },
//     products: [{
//         type: Object,
//         required: true
//     }],
//     total_amount: {
//         type: Number,
//         required: true
//     },
//     payment_status: {
//         type: String,
//         enum: ['pending', 'succeeded', 'failed'],
//         default: 'pending'
//     },
//     session_id: {
//         type: String,
//         unique: true
//     },
//     transaction_id: {
//         type: String
//     },
//     payment_method: {
//         type: String
//     },
//     created_at: {
//         type: Date,
//         default: Date.now
//     },
//     completed_at: {
//         type: Date
//     }
// },{time});

// const Order = mongoose.model('Order', OrderSchema);

// export default Order;


import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    customer_email: {
        type: String,
        required: true
    },
    products: [{
        type: Object,
        required: true
    }],
    total_amount: {
        type: Number,   
    },
    payment_status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'canceled'],
        default: 'succeeded'
    },
    session_id: {
        type: String,
        unique: true
    },
    transaction_id: {
        type: String
    },
    payment_method: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    completed_at: {
        type: Date
    }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
export default Order;

