import axios from 'axios'
import {
    completeOrderRequest, completeOrderSuccess, completeOrderFail,
    getOrderRequest, getOrderSuccess, getOrderFail,
    getOrdersRequest, getOrdersSuccess, getOrdersFail,
    getOrderRequestForStore,
    getOrderSuccessForStore,
    getOrderFailForStore,
    getOrdersRequestForStore,
    getOrdersSuccessForStore,
    getOrdersFailForStore,
} from '../reducers/order_reducer.js'
import { toast } from 'react-toastify'
import axiosErrorHandler from '../../utils/axios_error_handler.js'
import {
    LIMIT_GET_ORDERS,
} from '../../configs/constants.js'
import { redirectAfterSeconds } from '../../utils/redirect_handler.js'
import {
    complete_place_order_api,
    get_order_api,
    get_orders_api,
    get_orders_for_shop_api,
    get_one_order_for_shop_api,
} from '../../apis/order_apis.js'

const completePlaceOrder = ({ orderId, paymentMethod, paymentId }) => async (dispatch) => {
    try {
        dispatch(completeOrderRequest())

        await axios.put(
            complete_place_order_api,
            {
                orderId,
                paymentMethod,
            },
            { withCredentials: true },
        )

        dispatch(completeOrderSuccess())

        toast.success('Order Successfully Placed!')

        redirectAfterSeconds(1000, { href: '/checkout/success?payment_intent=' + paymentId })
    } catch (error) {
        let errorObject = axiosErrorHandler(error, 'Error Warning: fail to complete the order.')

        dispatch(completeOrderFail({ error: errorObject }))

        toast.error(errorObject.message)
    }
}

const getOrder = (paymentId, orderId) => async (dispatch) => {
    try {
        dispatch(getOrderRequest())

        let query = {}

        if (paymentId)
            query.paymentId = paymentId
        else if (orderId)
            query.orderId = orderId

        let { data } = await axios.get(
            get_order_api,
            {
                withCredentials: true,
                params: query,
            }
        )

        dispatch(getOrderSuccess({ order: data.order }))
    } catch (error) {
        let errorObject = axiosErrorHandler(error, 'Error Warning: fail to get order.')

        dispatch(getOrderFail({ error: errorObject }))

        toast.error(errorObject.message)
    }
}

const getOrders = (page = 1, limit = LIMIT_GET_ORDERS, payment_status = null) => async (dispatch) => {
    try {
        dispatch(getOrdersRequest())

        let query = {
            page,
            limit,
        }

        if (payment_status)
            query.paymentStatus = payment_status

        let { data } = await axios.get(
            get_orders_api,
            {
                withCredentials: true,
                params: query,
            }
        )

        dispatch(getOrdersSuccess({
            orders: data.orders,
            countOrders: data.countOrders,
            currentPage: page || 1,
            currentTab: payment_status,
        }))
    } catch (error) {
        let errorObject = axiosErrorHandler(error)

        dispatch(getOrdersFail({ error: errorObject }))

        toast.error(errorObject.message)
    }
}

const getOrdersForShop = (limit = LIMIT_GET_ORDERS, page = 1, order_status) => async (dispatch) => {
    try {
        dispatch(getOrdersRequestForStore())

        let query = {
            page,
            limit,
        }

        if (order_status)
            query.orderStatus = order_status

        let { data } = await axios.get(
            get_orders_for_shop_api,
            {
                withCredentials: true,
                params: query,
            }
        )

        dispatch(getOrdersSuccessForStore({
            orders: data.orders,
            countOrders: data.orders.length,
            currentPage: page,
            currentTab: null,
        }))
    } catch (error) {
        let errorObject = axiosErrorHandler(error, 'Error Warning: fail to get orders.')

        dispatch(getOrdersFailForStore({ error: errorObject }))

        toast.error(errorObject.message)
    }
}

const getOrderDetailForShop = (orderId) => async (dispatch) => {
    try {
        dispatch(getOrderRequestForStore())

        let { data } = await axios.get(
            get_one_order_for_shop_api,
            {
                withCredentials: true,
                params: {
                    orderId
                },
            }
        )

        dispatch(getOrderSuccessForStore({ order: data.order }))
    } catch (error) {
        let errorObject = axiosErrorHandler(error, 'Error Warning: fail to get order.')

        dispatch(getOrderFailForStore({ error: errorObject }))

        toast.error(errorObject.message)
    }
}

export {
    completePlaceOrder, getOrder, getOrders,
    getOrdersForShop, getOrderDetailForShop,
}