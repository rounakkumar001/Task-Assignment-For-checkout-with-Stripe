import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/productSlice.js";
import cartReducer from "../features/cartSlice.js";

const store = configureStore({
    reducer : {
        products : productReducer,
        cart : cartReducer
    }
})

export default store;