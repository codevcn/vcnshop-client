import { createSlice } from '@reduxjs/toolkit'

export const storeOrderSlice = createSlice({
    name: 'order_for_store',
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
        getOrderRequestForStore: (state, action) => {
            state.loading = true
            state.error = null
        },
        getOrderSuccessForStore: (state, action) => {
            state.loading = false
            state.order = action.payload.order
        },
        getOrderFailForStore: (state, action) => {
            state.loading = false
            state.error = action.payload.error
        },


        getOrdersRequestForStore: (state, action) => {
            state.loading = true
            state.error = null
        },
        getOrdersSuccessForStore: (state, action) => {
            state.loading = false
            state.orders = action.payload.orders

            let { currentPage, countOrders, currentTab } = action.payload
            state.countOrders = countOrders
            state.currentPage = currentPage
            state.currentTab = currentTab
        },
        getOrdersFailForStore: (state, action) => {
            state.loading = false
            state.error = action.payload.error
        }
    }
})

export const {
    getOrderRequestForStore,
    getOrderSuccessForStore,
    getOrderFailForStore,
    getOrdersRequestForStore,
    getOrdersSuccessForStore,
    getOrdersFailForStore,
} = storeOrderSlice.actions

export const userOrderSlice = createSlice({
    name: 'order_for_user',
    initialState: {
        currentPage: 1,
        currentTab: null,
        order: null,
        orders: null,
        countOrders: 0,
        loading: false,
        error: null,
        paymentCompleted: false
    },
    reducers: {
        completeOrderRequest: (state, action) => {
            state.loading = true
            state.error = null
            state.paymentCompleted = false
        },
        completeOrderSuccess: (state, action) => {
            state.loading = true
            state.paymentCompleted = true
        },
        completeOrderFail: (state, action) => {
            state.loading = false
            state.error = action.payload.error
        },


        getOrderRequest: (state, action) => {
            state.loading = true
            state.error = null
        },
        getOrderSuccess: (state, action) => {
            state.loading = false
            state.order = action.payload.order
        },
        getOrderFail: (state, action) => {
            state.loading = false
            state.error = action.payload.error
        },


        getOrdersRequest: (state, action) => {
            state.loading = true
            state.error = null
        },
        getOrdersSuccess: (state, action) => {
            state.loading = false
            state.orders = action.payload.orders

            let { currentPage, countOrders, currentTab } = action.payload
            state.countOrders = countOrders
            state.currentPage = currentPage
            state.currentTab = currentTab
        },
        getOrdersFail: (state, action) => {
            state.loading = false
            state.error = action.payload.error
        }
    }
})

export const {
    completeOrderRequest, completeOrderSuccess, completeOrderFail,
    getOrderRequest, getOrderSuccess, getOrderFail,
    getOrdersRequest, getOrdersSuccess, getOrdersFail,
} = userOrderSlice.actions

const order_reducer = {
    user: userOrderSlice.reducer,
    store: storeOrderSlice.reducer,
}

export default order_reducer