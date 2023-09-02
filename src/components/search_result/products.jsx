import React, { useEffect } from "react"
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import Skeleton from '@mui/material/Skeleton'
import { getProducts } from "../../store/actions/product_actions"
import { Grid } from "@mui/material"
import { LIMIT_GET_PRODUCTS_DEFAULT, MAX_PRICE_PORDUCT } from "../../configs/constants"
import { useParams } from "react-router-dom"
import { Rating, Stack, Typography, Box } from "@mui/material"
import { NavLink } from "react-router-dom"
import { useTheme } from "@emotion/react"
import ProgressiveImage from "../materials/progressive_image"
import { useGetQueryValueV2 } from "../../hooks/custom_hooks"

const Loading = () => (
    <Grid
        container
        columns={{ xs: 4, sm: 9, md: 16 }}
        columnSpacing={{ xs: 1.5 }}
        rowSpacing={{ xs: 2 }}
    >
        {
            [1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
                <Grid
                    item
                    key={value}
                    xs={2}
                    sm={3}
                    md={4}
                >
                    <Skeleton
                        animation="wave"
                        sx={{
                            width: '100%',
                            height: '300px',
                            transform: 'scale(1)',
                        }}
                    />
                </Grid>
            ))
        }
    </Grid>
)

const Empty = () => (
    <Stack
        justifyContent="center"
        alignItems="center"
        rowGap="15px"
        width="100%"
        bgcolor="#f5f5f5"
        padding="20px"
        boxSizing="border-box"
        border="5px #dddddd solid"
        margin="16px 15px"
    >
        <HeartBrokenIcon sx={{ fontSize: '3.8em' }} />
        <Typography margin="0" component="p" fontSize="1.2em" fontWeight="bold">
            Oops!! No Result For Your Search...
        </Typography>
    </Stack>
)

const Product = ({ productInfo }) => {
    const { _id, image_link, name, review, sold, price } = productInfo
    const theme = useTheme()

    return (
        <ProductSection id="Product-Search">

            <Box
                to={`/productDetail/${_id}`}
                component={NavLink}
                display="flex"
                width="100%"
                height="200px"
                border='1px #dedede solid'
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
            >
                <ProgressiveImage
                    src={image_link}
                    alt="Product"
                    scss={{ maxHeight: '100%', maxWidth: '100%', margin: 'auto' }}
                    textColor="black"
                />
            </Box>

            <Stack
                rowGap="5px"
                padding="0 5px"
            >

                <Name to={`/productDetail/${_id}`}>
                    {name}
                </Name>

                <div>
                    <Rating
                        precision={0.5}
                        readOnly
                        value={review.average_rating}
                        size="small"
                        sx={{ color: '#ff2222' }}
                    />
                </div>

                <Typography color="gray" fontWeight="bold" fontSize="0.9em">
                    {'Sold: ' + sold.count}
                </Typography>

                <Typography
                    fontFamily={theme.fontFamily.kanit}
                    fontSize="0.9em"
                    marginTop="5px"
                    paddingLeft="5px"
                    bgcolor="white"
                    borderRadius="5px"
                >
                    {'$' + price.value}
                </Typography>

            </Stack>

        </ProductSection>
    )
}

const Products = ({ products }) => {

    return (
        <Grid
            container
            columns={{ xs: 4, sm: 9, md: 16 }}
            columnSpacing={{ xs: 1.5 }}
            rowSpacing={{ xs: 2 }}
        >
            {
                products.map((product) => (
                    <Grid
                        key={product._id}
                        item
                        xs={2}
                        sm={3}
                        md={4}
                    >
                        <Product productInfo={product} />
                    </Grid>
                ))
            }
        </Grid>
    )
}

const Result = () => {
    const { products, loading, error } = useSelector(({ product }) => product)
    const dispatch = useDispatch()
    const { keyword } = useParams()
    const get_query_values = useGetQueryValueV2()

    const getProductsFirstTime = () => {
        let query_data = get_query_values('price', 'rating', 'category', 'target')
        let price_data = query_data.price,
            rating_data = query_data.rating,
            category_data = query_data.category,
            target_data = query_data.target

        dispatch(getProducts(
            LIMIT_GET_PRODUCTS_DEFAULT,
            category_data || undefined,
            keyword,
            rating_data || undefined,
            price_data ? [price_data * 1, MAX_PRICE_PORDUCT] : undefined,
            1,
            target_data || undefined
        ))
    }

    useEffect(() => {
        if (keyword)
            getProductsFirstTime()
    }, [dispatch])

    return (
        <Box width="100%" marginTop="10px">
            {
                loading ? (
                    <Loading />
                ) : error ? (
                    <Typography
                        fontSize="1.2em"
                        color="red"
                        width="100%"
                        textAlign="center"
                    >
                        {error.message}
                    </Typography>
                ) : products && products.length > 0 ?
                    <Products products={products} />
                    :
                    <Empty />
            }
        </Box>
    )
}

export default Result

const ProductSection = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.nunito,
    boxSizing: 'border-box',
    padding: '3px',
    paddingBottom: '6px',
    width: '100%',
    boxShadow: '0px 0px 1px gray',
    borderBottom: '2px black solid',
    '&:hover': {
        boxShadow: '0px 0px 8px gray',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.9em',
    }
}))

const Name = styled(NavLink)({
    display: 'block',
    textDecoration: 'unset',
    color: 'black',
    width: 'fit-content',
    maxWidth: '100%',
    fontSize: '1em',
    fontWeight: 'bold',
    marginTop: '10px',
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '&:hover': {
        textDecoration: 'underline',
    }
})