import axios from 'axios'
import {
    addProductToCartRequest, addProductToCartSuccess, addProductToCartFail,
    changeQuantityRequest, changeQuantityFail,
    removeItem, saveShipping, saveOrder,
    deleteCheckout,
} from '../../store/reducers/cart_reducer'
import { toast } from 'react-toastify'
import axiosErrorHandler from '../../utils/axios_error_handler'
import {
    get_product_api,
} from '../../apis/product_apis'

const addProductToCart = (product_id, options) => async (dispatch, getState) => {
    try {
        dispatch(addProductToCartRequest())

        let { data } = await axios.get(get_product_api + product_id)

        let productData = data.product

        if (productData.stock === 0) {
            dispatch(addProductToCartFail({}))
            return toast.warning('The product now is out of stock')
        }

        let product_in_cart = getState().cart.cartItems.find(({ _id }) => product_id === _id)

        if (product_in_cart) {
            let current_qty = product_in_cart.quantity
            if (current_qty + 1 > productData.stock || current_qty === productData.stock) {
                dispatch(addProductToCartFail({}))
                return toast.warning('The quantity of product in your cart now is greater than in stock')
            }
        }

        let product_to_add = {
            _id: product_id,
            image_link: productData.image_link,
            name: productData.name,
            size: options ? options.size : productData.options.sizes[0],
            color: options ? options.color : productData.options.colors[0],
            shop_id: productData.shop.id,
            price: productData.price.value,
            quantity: product_in_cart ? product_in_cart.quantity : 1,
            stock: productData.stock,
        }

        dispatch(addProductToCartSuccess({ product_to_add: product_to_add }))

        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

        toast.success('Add the product to cart successfully')
    } catch (error) {
        let errorObject = axiosErrorHandler(error)

        if (errorObject.statusCode !== 404) {
            dispatch(addProductToCartFail({ error: errorObject }))

            toast.error(errorObject.message)
        } else {
            dispatch(addProductToCartFail({}))

            toast.error('The product now is not available')
        }
    }
}

const changeQuantity = (product_id, option) => async (dispatch, getState) => {
    try {
        dispatch(changeQuantityRequest({ productId: product_id, option }))

        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    } catch (error) {
        let errorObject = axiosErrorHandler(error)

        dispatch(changeQuantityFail({ error: errorObject }))
    }
}

const removeItemFromCart = (product_id) => (dispatch, getState) => {
    dispatch(removeItem({ productId: product_id }))

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

const saveShippingInfo = (shipping_info) => (dispatch, getState) => {
    dispatch(saveShipping(shipping_info))

    localStorage.setItem('shippingInfo', JSON.stringify(getState().cart.shippingInfo))
}

const saveOrderInfo = ({
    total_to_pay,
    shipping_fee,
    tax_fee,
    tax_charge,
    shipping_fee_charge,
    subtotal,
}) => (dispatch, getState) => {
    dispatch(saveOrder({
        total_to_pay,
        shipping_fee,
        tax_fee,
        tax_charge,
        shipping_fee_charge,
        subtotal,
    }))

    sessionStorage.setItem('orderInfo', JSON.stringify(getState().cart.orderInfo))
}

const deleteCheckoutInfo = () => (dispatch) => {
    dispatch(deleteCheckout())

    sessionStorage.removeItem('orderInfo')
    localStorage.removeItem('cartItems')
}

export {
    addProductToCart, removeItemFromCart, changeQuantity,
    saveShippingInfo, saveOrderInfo, deleteCheckoutInfo,
}