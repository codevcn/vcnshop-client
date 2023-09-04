import { createSlice, current } from '@reduxjs/toolkit'

export const productForUserSlice = createSlice({
    name: 'product',
    initialState: {
        countProducts: 0,
        currentPage: 1,
        loading: false,
        error: null,
        products: null,

        reviews: {
            loading: false,
            error: null,
            reviews: null,
        },
        productDetail: {
            product: null,
            loading: false,
            error: null,
        },
        womenS: {
            loading: false,
            error: null,
            products: null,
        },
        menS: {
            loading: false,
            error: null,
            products: null,
        },
        overview: {
            loading: false,
            error: null,
            products: null,
        },
    },
    reducers: {
        getProductsRequest: (state, action) => {
            state.error = null
            state.loading = true
        },
        getProductsSuccess: (state, action) => {
            state.products = action.payload.products
            state.countProducts = action.payload.countProducts
            state.currentPage = action.payload.currentPage
            state.loading = false
        },
        getProductsFail: (state, action) => {
            state.error = action.payload.error
            state.loading = false
        },


        getWomenSProductsRequest: (state, action) => {
            state.womenS.error = null
            state.womenS.loading = true
        },
        getWomenSProductsSuccess: (state, action) => {
            state.womenS.products = action.payload.products
            state.womenS.loading = false
        },
        getWomenSProductsFail: (state, action) => {
            state.womenS.error = action.payload.error
            state.womenS.loading = false
        },


        getMenSProductsRequest: (state, action) => {
            state.menS.error = null
            state.menS.loading = true
        },
        getMenSProductsSuccess: (state, action) => {
            state.menS.products = action.payload.products
            state.menS.loading = false
        },
        getMenSProductsFail: (state, action) => {
            state.menS.error = action.payload.error
            state.menS.loading = false
        },


        getOverviewRequest: (state, action) => {
            state.overview.loading = true
            state.overview.error = null
        },
        getOverviewSuccess: (state, action) => {
            state.overview.loading = false
            state.overview.products = action.payload.products
        },
        getOverviewFail: (state, action) => {
            state.overview.loading = false
            state.overview.error = action.payload.error
        },


        getProductRequest: (state, action) => {
            state.productDetail.error = null
            state.productDetail.loading = true
        },
        getProductSuccess: (state, action) => {
            state.productDetail.product = action.payload.product
            state.productDetail.loading = false
        },
        getProductFail: (state, action) => {
            state.productDetail.error = action.payload.error
            state.productDetail.loading = false
        },


        getReviewsRequest: (state, action) => {
            state.reviews.error = null
            state.reviews.loading = true
        },
        getReviewsSuccess: (state, action) => {
            state.reviews.reviews = action.payload.reviews
            state.reviews.loading = false
        },
        getReviewsFail: (state, action) => {
            state.reviews.error = action.payload.error
            state.reviews.loading = false
        },


        newReviewRequest: (state, action) => {
            state.reviews.error = null
        },
        newReviewSuccess: (state, action) => {
            let { newReview, newAverageRating, newCountReview } = action.payload
            let update_reviews = current(state).reviews.reviews.filter(({ user_id }) => user_id !== newReview.user_id)

            state.reviews.reviews = [newReview, ...update_reviews]

            let current_review = current(state).productDetail.product.review
            state.productDetail.product.review = {
                ...current_review,
                average_rating: newAverageRating,
                count_reviews: newCountReview,
            }
        },
        newReviewFail: (state, action) => {
            state.reviews.error = action.payload.error
        },
    }
})

export const {
    getProductsRequest, getProductsSuccess, getProductsFail,
    getWomenSProductsRequest, getWomenSProductsSuccess, getWomenSProductsFail,
    getMenSProductsRequest, getMenSProductsSuccess, getMenSProductsFail,
    getProductRequest, getProductSuccess, getProductFail,
    newReviewRequest, newReviewSuccess, newReviewFail,
    getReviewsRequest, getReviewsSuccess, getReviewsFail,
    getOverviewRequest, getOverviewSuccess, getOverviewFail,
} = productForUserSlice.actions

export default productForUserSlice.reducer