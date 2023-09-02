import React from "react"
import { Pagination as PagninationUI } from "@mui/material"
import {
    useDispatch,
    useSelector,
} from "react-redux"
import { getProducts } from '../../store/actions/product_actions'
import { LIMIT_GET_PRODUCTS_DEFAULT, MAX_PRICE_PORDUCT } from "../../configs/constants"
import { Stack } from '@mui/material'
import { useNavigate, useParams } from "react-router-dom"
import { useCreateQueryString, useGetQueryValueV2 } from "../../hooks/custom_hooks"

const get_number_of_pages = (count_products) => {
    return Math.ceil(count_products / LIMIT_GET_PRODUCTS_DEFAULT)
}

const Pagination = () => {
    const { countProducts, currentPage } = useSelector(({ product }) => product)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const get_query_values = useGetQueryValueV2()
    const { keyword } = useParams()
    const queryStringCreator = useCreateQueryString()

    const navigation = (query_string) => {
        if (query_string)
            navigate(`/search/${keyword}?${query_string}`)
        else
            navigate(`/search/${keyword}`)
    }

    const switchProductsPage = (e, page) => {
        if (page === currentPage) return

        let query_data = get_query_values('price', 'rating', 'category', 'target', 'pagination')
        let price_data = query_data.price,
            rating_data = query_data.rating,
            category_data = query_data.category,
            target_data = query_data.target

        let query_string_options = {}
        if (price_data)
            query_string_options.price = price_data
        if (rating_data)
            query_string_options.rating = rating_data
        if (category_data)
            query_string_options.category = category_data
        if (target_data)
            query_string_options.target = target_data

        navigation(queryStringCreator(query_string_options))

        dispatch(getProducts(
            LIMIT_GET_PRODUCTS_DEFAULT,
            category_data || undefined,
            keyword,
            rating_data || undefined,
            price_data ? [price_data * 1, MAX_PRICE_PORDUCT] : undefined,
            page,
            target_data || undefined,
        ))
    }

    return (
        <Stack
            flexDirection="row"
            justifyContent="space-between"
            id="Product-Search-Pagination"
            marginTop="20px"
        >
            <span></span>
            <PagninationUI
                count={get_number_of_pages(countProducts)}
                variant="outlined"
                shape="rounded"
                onChange={switchProductsPage}
                page={currentPage}
            />
        </Stack>
    )
}

export default Pagination