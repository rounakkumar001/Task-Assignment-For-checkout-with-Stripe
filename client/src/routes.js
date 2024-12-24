import { createBrowserRouter } from "react-router-dom";
import Home from "./components/home/Home";
import Carts from "./components/cart/Carts";
import Products from "./components/products/Products";
import Checkout from "./components/checkout/Checkout";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentSuccessful from "./components/checkout/PaymentSuccessful";
import PaymentCanceled from "./components/checkout/PaymentCancel";


const stripePromise = loadStripe('pk_test_51QZ7u9JjjtKRr0sEOvdSBi0mmya0cMYCngETUo59JXYtrUk9uU6fsr0nYB7d9Fovo7Xho0MNjK1cCVsQQDULVrHt00EPqZTW93');

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        children: [
            {
                path: 'cart-items',
                element: <Carts />
            },
            {
                path: '',
                element: <Products />
            },

            {
                path: '/cart-items/checkout',
                element: <Elements stripe={stripePromise}>
                    <Checkout />
                </Elements>
            },
            {
                path : '/cart-items/checkout/success',
                element : <PaymentSuccessful/>
            },
            {
                path : '/cart-items/checkout/cancel',
                element : <PaymentCanceled/>
            }

        ]
    }

])

export default router;