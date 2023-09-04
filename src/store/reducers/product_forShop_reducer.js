import { createSlice, current } from '@reduxjs/toolkit'

export const productForShopSlice = createSlice({
    name: 'product',
    initialState: {
        countProducts: 0,
        currentPage: 1,
        loading: false,
        error: null,
        products: null,
        productDetail: null,
    },
    reducers: {
        getProductsForShopRequest: (state, action) => {
            state.error = null
            state.loading = true
        },
        getProductsForShopSuccess: (state, action) => {
            state.products = action.payload.products
            state.countProducts = action.payload.countProducts
            state.currentPage = action.payload.currentPage
            state.loading = false
        },
        getProductsForShopFail: (state, action) => {
            state.error = action.payload.error
            state.loading = false
        },


        getProductForShopRequest: (state, action) => {
            state.error = null
            state.loading = true
        },
        getProductForShopSuccess: (state, action) => {
            state.productDetail = action.payload.product
            state.loading = false
        },
        getProductForShopFail: (state, action) => {
            state.error = action.payload.error
            state.loading = false
        },


        createNewProductRequest: (state, action) => {
            state.error = null
        },
        createNewProductSuccess: (state, action) => {
            let current_products = current(state).products

            state.products = [
                ...current_products,
                action.payload.product,
            ]
        },
        createNewProductFail: (state, action) => {
            state.error = action.payload.error
        },


        updateProductRequest: (state, action) => {
            state.error = null
        },
        updateProductSuccess: (state, action) => {
            state.productDetail = action.payload.product
        },
        updateProductFail: (state, action) => {
            state.error = action.payload.error
        },


        deleteProductRequest: (state, action) => {
        },
        deleteProductSuccess: (state, action) => {
        },
        deleteProductFail: (state, action) => {
        },
    }
})

export const {
    getProductsForShopFail, getProductsForShopRequest, getProductsForShopSuccess,
    getProductForShopFail, getProductForShopRequest, getProductForShopSuccess,
    createNewProductRequest, createNewProductSuccess, createNewProductFail,
    updateProductRequest, updateProductSuccess, updateProductFail,
    deleteProductRequest, deleteProductSuccess, deleteProductFail,
} = productForShopSlice.actions

export default productForShopSlice.reducer