
import axios from 'axios'
import axiosErrorHandler from '../../utils/axios_error_handler.js'
import {
    get_users_by_admin_api,
} from '../../apis/user_apis.js'
import {
    get_shops_by_admin_api,
} from '../../apis/shop_apis.js'
import {
    get_orders_by_admin_api,
} from '../../apis/order_apis.js'
import {
    get_products_by_admin_api,
} from '../../apis/product_apis.js'

const getUsersByAdmin = async (...fields) => {
    try {
        let query = {}

        for (let field of fields)
            query[field] = 'true'

        let { data } = await axios.get(
            get_users_by_admin_api,
            {
                withCredentials: true,
                params: query,
            }
        )

        return data.list
    } catch (error) {
        let errorObject = axiosErrorHandler(error)

        throw errorObject
    }
}

const getOrdersByAdmin = async (...fields) => {
    try {
        let query = {}

        for (let field of fields)
            query[field] = 'true'

        let { data } = await axios.get(
            get_orders_by_admin_api,
            {
                withCredentials: true,
                params: query,
            }
        )

        return data.list
    } catch (error) {
        let errorObject = axiosErrorHandler(error)

        throw errorObject
    }
}

const getProductsByAdmin = async (...fields) => {
    try {
        let query = {}

        for (let field of fields)
            query[field] = 'true'

        let { data } = await axios.get(
            get_products_by_admin_api,
            {
                withCredentials: true,
                params: query,
            }
        )

        return data.list
    } catch (error) {
        let errorObject = axiosErrorHandler(error)

        throw errorObject
    }
}

const getShopsByAdmin = async (...fields) => {
    try {
        let query = {}

        for (let field of fields)
            query[field] = 'true'

        let { data } = await axios.get(
            get_shops_by_admin_api,
            {
                withCredentials: true,
                params: query,
            }
        )

        return data.list
    } catch (error) {
        let errorObject = axiosErrorHandler(error)

        throw errorObject
    }
}

export {
    getOrdersByAdmin,
    getProductsByAdmin,
    getShopsByAdmin,
    getUsersByAdmin,
}