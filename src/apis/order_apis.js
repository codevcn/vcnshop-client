
const EXPRESS_SERVER = import.meta.env.VITE_EXPRESS_SERVER

export const complete_place_order_api = EXPRESS_SERVER + '/api/order/completePlaceOrder/'
export const get_order_api = EXPRESS_SERVER + '/api/order/getOrder/'
export const get_orders_api = EXPRESS_SERVER + '/api/order/getOrders/'
export const get_orders_for_shop_api = EXPRESS_SERVER + '/api/order/getOrdersForShop/'
export const get_one_order_for_shop_api = EXPRESS_SERVER + '/api/order/getOneOrderForShop/'
export const get_orders_by_admin_api = EXPRESS_SERVER + '/api/order/getOrdersByAdmin/'
export const init_place_order_api = EXPRESS_SERVER + '/api/order/initPlaceOrder/'
export const get_stripe_key_api = EXPRESS_SERVER + '/api/order/getStripeKey/'
export const send_receipt_via_email_api = EXPRESS_SERVER + '/api/order/sendReceiptViaEmail/'
export const find_orders_with_productId_api = EXPRESS_SERVER + '/api/order/findOrdersWithProductId/'