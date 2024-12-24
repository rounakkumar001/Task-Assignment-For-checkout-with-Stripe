import { createSlice } from "@reduxjs/toolkit";

import api from '../axios/axios.js';

const productSlice = createSlice({
    name : 'products',
    initialState : {
        products : [],
        loading : false,
        error : null,
    },
    reducers : {
        setProducts (state, action){
            state.products = action.payload;
            console.log(action.payload);
        },
        setLoading(state, action){
            state.loading = action.payload;

        },
        setError(state, action) {
            state.error = action.payload;
        },
    }
})
export const {setError, setLoading, setProducts} = productSlice.actions;
export default productSlice.reducer;

export const featchProducts = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await api.get(`/api/v1/products/fetchProducts`);
        console.log(response.data);
        dispatch(setProducts(response.data)); // Dispatch action to set tasks in the store
    } catch (error) {
        dispatch(setError(error.response?.data.error_message || 'An error occurred while fetching tasks.'));
    } finally {
        dispatch(setLoading(false));
    }
}