import React, { useEffect } from "react"
import { styled } from '@mui/material/styles'
import ProductDetail from "../components/product/product_detail/product_detail"
import ScrollToTopBtn from '../components/scroll_to_top_btn'
import MakeReview from "../components/product/product_review/make_review"
import InfoIcon from '@mui/icons-material/Info'
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getProductDetail } from '../store/actions/product_actions'
import Skeleton from '@mui/material/Skeleton'
import CommentIcon from '@mui/icons-material/Comment'
import Reviews from "../components/product/product_review/reviews"
import StorefrontIcon from '@mui/icons-material/Storefront'
import { Box, Typography, Stack } from "@mui/material"

const loading_widths = ['82%', '75%', '60%', '45%', '50%']

const Loading = () => (
    <Stack
        flexDirection="row"
        justifyContent='space-between'
        columnGap='20px'
        width='100%'
        height='99vh'
        marginTop='10px'
    >
        <ProductSkeleton />
        <Detail>
            {
                loading_widths.map((width) => (
                    <Skeleton
                        key={width}
                        style={{ width }}
                        animation="pulse"
                        variant="rectangular"
                        sx={{ height: '30px' }}
                    />
                ))
            }
        </Detail>
    </Stack>
)

const Product = () => {
    const { product, loading, error } = useSelector(({ product }) => product.productDetail)
    const dispatch = useDispatch()
    const { productId } = useParams()

    useEffect(() => {
        dispatch(getProductDetail(productId))
    }, [dispatch])

    return (
        <ProductDetailPage id="ProductDetailPage">
            <PageTitle>
                <InfoIcon sx={{ fontSize: '1.8em' }} />
                <Typography
                    component="h2"
                    fontSize="1.8em"
                    margin="0"
                >
                    Product Detail
                </Typography>
            </PageTitle>

            <Hr />

            {
                loading ? (
                    <Loading />
                ) : error ? (
                    <Error>
                        {error.message}
                    </Error>
                ) : product &&
                <>
                    <ProductDetail product={product} />

                    <ReviewsAndIntroduction>

                        <Box width='100%'>
                            <MakeReview productId={product._id} productReview={product.review} />

                            <ReviewsSection id="Reviews">
                                <Stack
                                    flexDirection='row'
                                    alignItems='center'
                                >
                                    <CommentIcon />
                                    <ReviewsTitle>Reviews</ReviewsTitle>
                                </Stack>

                                <Hr />

                                <Reviews
                                    productId={productId}
                                />
                            </ReviewsSection>
                        </Box>

                        <DescriptionAndStore>

                            <Title>Description</Title>

                            <Description>
                                {product.description}
                            </Description>

                            <VistShopButton>
                                <StorefrontIcon />
                                <span>Vist Shop</span>
                            </VistShopButton>

                        </DescriptionAndStore>

                    </ReviewsAndIntroduction>
                </>
            }

            <ScrollToTopBtn />
        </ProductDetailPage >
    )
}

export default Product

const ProductDetailPage = styled('div')(({ theme }) => ({
    padding: '0 30px',
    marginTop: '20px',
    fontFamily: theme.fontFamily.kanit,
    [theme.breakpoints.down('md')]: {
        padding: '0 20px',
    }
}))

const PageTitle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginLeft: '20px',
    transform: 'scaleY(0.9)',
    [theme.breakpoints.down('md')]: {
        fontSize: '0.8em',
    },
}))

const Hr = styled('div')({
    height: '2px',
    backgroundColor: 'black',
})

const ProductSkeleton = styled(Skeleton)({
    width: '60%',
    height: '100%',
    transform: 'unset',
})

const Detail = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '30px',
    width: '37%',
})

const Error = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2em',
    color: 'red',
    margin: 'auto',
    width: '100%',
    height: '25vh',
})

const ReviewsAndIntroduction = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    columnGap: '30px',
    marginTop: '50px',
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    }
}))

const ReviewsSection = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
})

const ReviewsTitle = styled('h2')({
    margin: '0',
    fontSize: '1.5em',
    transform: 'scaleY(0.9)',
    marginLeft: '5px',
})

const Title = styled('div')({
    margin: '0',
    fontSize: '1.2em',
    transform: 'scaleY(0.9)',
    borderBottom: '2px black solid',
    fontWeight: 'bold',
    width: 'fit-content',
})

const Description = styled('p')({
    margin: '0',
    fontSize: '0.9em',
})

const DescriptionAndStore = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px',
    marginTop: '10px',
    width: '70%',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginTop: '30px',
    }
}))

const VistShopButton = styled('button')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    padding: '10px 30px',
    backgroundColor: 'black',
    color: 'white',
    border: '2px black solid',
    borderRadius: '5px',
    marginTop: '30px',
    width: 'fit-content',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
    }
})