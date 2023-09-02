
const EXPRESS_SERVER = import.meta.env.VITE_EXPRESS_SERVER

export const create_product_api = EXPRESS_SERVER + '/api/product/createProduct/'
export const update_product_api = EXPRESS_SERVER + '/api/product/updateProduct/'
export const delete_product_api = EXPRESS_SERVER + '/api/product/deleteProduct/'
export const get_products_api = EXPRESS_SERVER + '/api/product/getProducts/'
export const get_product_api = EXPRESS_SERVER + '/api/product/getProduct/'
export const new_review_api = EXPRESS_SERVER + '/api/product/newReview/'
export const get_reviews_api = EXPRESS_SERVER + '/api/product/getReviews/'
export const get_products_by_admin_api = EXPRESS_SERVER + '/api/product/getProductsByAdmin/'
export const get_products_by_ids_api = EXPRESS_SERVER + '/api/product/getProductsByIds/'
export const get_products_name_api = EXPRESS_SERVER + '/api/product/getProductsName/'
export const check_products_api = EXPRESS_SERVER + '/api/product/checkProducts/'
export const get_products_for_shop_api = EXPRESS_SERVER + '/api/product/getProductsForShop/'
