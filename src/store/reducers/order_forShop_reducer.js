import { createSlice } from '@reduxjs/toolkit'

export const orderForShopSlice = createSlice({
    name: 'order_for_shop',
    initialState: {
        currentPage: 1,
        currentTab: null,
        order: null,
        orders: null,
        countOrders: 0,
        loading: false,
        error: null,
    },
    reducers: {
        getOrderRequestForShop: (state, action) => {
            state.loading = true
            state.error = null
        },
        getOrderSuccessForShop: (state, action) => {
            state.loading = false
            state.order = action.payload.order
        },
        getOrderFailForShop: (state, action) => {
            state.loading = false
            state.error = action.payload.error
        },


        getOrdersRequestForShop: (state, action) => {
            state.loading = true
            state.error = null
        },
        getOrdersSuccessForShop: (state, action) => {
            state.loading = false
            state.orders = action.payload.orders

            let { currentPage, countOrders, currentTab } = action.payload
            state.countOrders = countOrders
            state.currentPage = currentPage
            state.currentTab = currentTab
        },
        getOrdersFailForShop: (state, action) => {
            state.loading = false
            state.error = action.payload.error
        }
    }
})

export const {
    getOrderRequestForShop,
    getOrderSuccessForShop,
    getOrderFailForShop,
    getOrdersRequestForShop,
    getOrdersSuccessForShop,
    getOrdersFailForShop,
} = orderForShopSlice.actions

export default orderForShopSlice.reducer