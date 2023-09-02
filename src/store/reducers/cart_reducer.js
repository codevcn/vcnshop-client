import { createSlice, current } from '@reduxjs/toolkit'

const get_cartItems = () => {
    let cart_items = localStorage.getItem('cartItems')
    return cart_items ? JSON.parse(cart_items) : []
}

const get_shippingInfo = () => {
    let shipping_info = localStorage.getItem('shippingInfo')
    return shipping_info ? JSON.parse(shipping_info) : null
}

const get_orderInfo = () => {
    let order_info = sessionStorage.getItem('orderInfo')
    return order_info ? JSON.parse(order_info) : null
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: get_cartItems(),
        shippingInfo: get_shippingInfo(),
        orderInfo: get_orderInfo(),
        loading: false,
        error: null,
    },
    reducers: {
        addProductToCartRequest: (state) => {
            state.loading = true
            state.error = null
        },
        addProductToCartSuccess: (state, action) => {
            let { product_to_add } = action.payload
            let current_cartItems = current(state).cartItems

            let existing_product = current_cartItems.find(({ _id }) => product_to_add._id === _id)
            if (existing_product) {
                product_to_add.quantity++

                current_cartItems = current_cartItems.filter(({ _id }) => _id !== product_to_add._id)
            }

            state.cartItems = [product_to_add, ...current_cartItems]
            state.loading = false
        },
        addProductToCartFail: (state, action) => {
            state.error = action.payload.error || null
            state.loading = false
        },


        changeQuantityRequest: (state, action) => {
            let { productId, option } = action.payload

            state.cartItems = current(state).cartItems.map((item) => {
                if (item._id === productId) return ({ ...item, quantity: item.quantity + option })
                else return item
            })
        },
        changeQuantityFail: (state, action) => {
            state.error = action.payload.error
            state.loading = false
        },


        removeItem: (state, action) => {
            let { productId } = action.payload

            state.cartItems = current(state).cartItems.filter(({ _id }) => _id !== productId)
        },


        saveShipping: (state, action) => {
            state.shippingInfo = action.payload
        },


        saveOrder: (state, action) => {
            let {
                total_to_pay,
                shipping_fee,
                tax_fee,
                tax_charge,
                shipping_fee_charge,
                subtotal,
            } = action.payload

            state.orderInfo = {
                total_to_pay,
                shipping_fee,
                tax_fee,
                tax_charge,
                shipping_fee_charge,
                subtotal,
            }
        },


        deleteCheckout: (state, action) => {
            state.orderInfo = null
        },
    },
})

export const {
    addProductToCartRequest, addProductToCartSuccess, addProductToCartFail,
    changeQuantityRequest, changeQuantityFail,
    removeItem, saveShipping, saveOrder,
    deleteCheckout,
    initPaymentRequest, initPaymentSuccess, initPaymentFail,
} = cartSlice.actions

export default cartSlice.reducer