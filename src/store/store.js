import { configureStore } from '@reduxjs/toolkit'
import product_for_user_reducer from './reducers/product_forUser_reducer.js'
import product_for_shop_reducer from './reducers/product_forShop_reducer.js'
import cart_reducer from './reducers/cart_reducer.js'
import shop_reducer from './reducers/shop_reducer.js'
import user_reducer from './reducers/user_reducer.js'
import order_for_user_reducer from './reducers/order_forUser_reducer.js'
import order_for_shop_reducer from './reducers/order_forShop_reducer.js'

const store = configureStore({
    reducer: {
        product: product_for_user_reducer,
        product_for_shop: product_for_shop_reducer,
        cart: cart_reducer,
        shop: shop_reducer,
        user: user_reducer,
        order_for_user: order_for_user_reducer,
        order_for_shop: order_for_shop_reducer,
    },
})

export default store
