import React, { useEffect, useMemo, useState } from "react"
import { styled } from '@mui/material/styles'
import { Stack, Box, Typography, Tabs, Tab, Skeleton, Tooltip } from "@mui/material"
import women_banner from '../../assets/images/women_banner.jpg'
import { useDispatch, useSelector } from "react-redux"
import { getWomenSProducts } from "../../store/actions/product_actions"
import ProgressiveImage from "../materials/progressive_image"
import { addProductToCart } from "../../store/actions/cart_actions"
import { NavLink } from "react-router-dom"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useTranslation } from "react-i18next"
import { useSwipe } from "../../hooks/custom_hooks"
import { MAX_NUM_OF_PRODUCTS_MOST_SOLD } from "../../configs/constants"
import { useTheme } from "@emotion/react"

const categories = ['Shirt', 'Pant']

const WomenBanner = () => {
    const { t } = useTranslation('home_page')

    return (
        <WomenBannerSection>
            <Stack
                padding="30px"
                height="100%"
                boxSizing="border-box"
                alignItems="center"
                justifyContent="center"
                bgcolor="rgba(0,0,0,.1)"
            >
                <Typography
                    fontFamily="inherit"
                    color="white"
                    fontSize="3em"
                >
                    {t("Women's")}
                </Typography>
                <Typography
                    fontFamily='inherit'
                    color="white"
                    fontSize="1em"
                    paddingBottom="5px"
                    borderBottom="3px white solid"
                    sx={{ cursor: 'pointer' }}
                >
                    {t('Discover More')}
                </Typography>
            </Stack>
        </WomenBannerSection>
    )
}

const Product = ({ productInfo }) => {
    const { image_link, name, price, _id } = productInfo
    const dispatch = useDispatch()
    const { t } = useTranslation('home_page')

    const handleAddProductToCart = () => {
        dispatch(addProductToCart(_id))
    }

    return (
        <ProductSection>

            <ProductImageContainer>

                <Box
                    to={`/productDetail/${_id}`}
                    component={NavLink}
                    display="flex"
                    width="100%"
                    height="100%"
                    color="black"
                    sx={{ textDecoration: 'none' }}
                >
                    <ProgressiveImage
                        src={image_link}
                        alt="Product"
                        scss={{ maxHeight: '100%', maxWidth: '100%', margin: 'auto' }}
                    />
                </Box>

                <AddProductToCartBtn
                    onClick={handleAddProductToCart}
                    className="AddToCartBtn"
                >
                    {t('Add To Cart')}
                </AddProductToCartBtn>

            </ProductImageContainer>

            <Box
                padding="0 5px"
            >
                <Tooltip title={name}>
                    <Name to={`/productDetail/${_id}`}>
                        {name}
                    </Name>
                </Tooltip>

                <Price>
                    {'$' + price.value}
                </Price>
            </Box>

        </ProductSection>
    )
}

const slide_icon_style = {
    color: 'gray',
    fontSize: '1.5em',
    margin: 'auto',
}

const Slider = ({ products }) => {
    const [slideIndex, setSlideIndex] = useState(0)
    const touchEvents = useSwipe({
        onMoveRight: () => switchSlide('left'),
        onMoveLeft: () => switchSlide('right'),
        speedInMs: 300,
        minSwipingWidth: 100,
    })
    const theme = useTheme()

    const switchSlide = (direction) => {
        let window_width = window.innerWidth
        let count_products = products.length
        let count_slides
        let breakpoints = theme.breakpoints.values

        if (window_width < breakpoints.lg) {
            count_slides = Math.ceil(count_products / 2) - 1 // caculate number of slides
            if (count_products < 3)
                return
        } else if (window_width >= breakpoints.lg) {
            count_slides = Math.ceil(count_products / 3) - 1 // caculate number of slides
            if (count_products < 4)
                return
        }

        if (direction === 'left') {
            setSlideIndex(pre => pre > 0 ? pre - 1 : count_slides)
        } else {
            setSlideIndex(pre => pre < count_slides ? pre + 1 : 0)
        }
    }

    useEffect(() => {
        let interval = setInterval(() => {
            switchSlide('right')
        }, 3000)

        return () => clearInterval(interval)
    }, [products.length])

    const get_translate_x = () => {
        let window_width = window.innerWidth

        if ((window_width < 1200 && products.length < 3) || (window_width < 1200 && products.length < 4))
            return `translateX(0)`

        return `translateX(-${slideIndex * 100}%)`
    }

    return (
        <SliderSection>
            <div
                className="switch_slide_btn left"
                onClick={() => switchSlide('left')}
            >
                <ArrowForwardIosIcon sx={{ transform: 'rotate(180deg)', ...slide_icon_style }} />
            </div>

            <SliderWrapper {...touchEvents}>
                <Stack
                    flexDirection="row"
                    sx={{
                        transform: get_translate_x(),
                        transition: 'transform 0.8s',
                    }}
                >
                    {
                        products.map((product) => (
                            <Product productInfo={product} key={product._id} />
                        ))
                    }
                </Stack>
            </SliderWrapper>

            <div
                onClick={() => switchSlide('right')}
                className="switch_slide_btn right"
            >
                <ArrowForwardIosIcon sx={slide_icon_style} />
            </div>
        </SliderSection>
    )
}

const filter_products_by_category = (category_to_filter, products) => {
    return products
        .filter(({ category }) => category === category_to_filter)
        .slice(0, MAX_NUM_OF_PRODUCTS_MOST_SOLD)
}

const loading_style = {
    transform: 'scale(1)',
    height: '100%',
    width: '100%',
}

const Products = () => {
    const { products, loading, error } = useSelector(({ product }) => product.womenS)
    const [tab, setTab] = useState(categories[0])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getWomenSProducts(
            categories.length * MAX_NUM_OF_PRODUCTS_MOST_SOLD,
            1,
            { name: 'sold.count', type: -1 }
        ))
    }, [dispatch])

    const main_products = useMemo(() => {
        if (products && products.length > 0) {
            return filter_products_by_category(tab, products)
        }

        return null
    }, [products, tab])

    const selectTab = (e, new_tab) => {
        if (new_tab === tab) return

        setTab(new_tab)
    }

    return (
        <ProductsSection>

            <Box
                color="black"
                width="fit-content"
            >
                <StyledTabs
                    value={tab}
                    onChange={selectTab}
                    textColor="inherit"
                >
                    {
                        categories.map((category) => (
                            <StyledTab
                                key={category}
                                value={category}
                                label={category}
                            />
                        ))
                    }
                </StyledTabs>
            </Box>

            {
                loading ? (
                    <Stack
                        flexDirection="row"
                        columnGap="15px"
                        width="100%"
                        marginTop="40px"
                        justifyContent="space-between"
                        height="320px"
                    >
                        <Skeleton sx={loading_style} />
                        <Skeleton sx={loading_style} />
                        <Skeleton sx={loading_style} />
                    </Stack>
                ) : error ? (
                    <Typography
                        color="red"
                        marginTop="30px"
                    >
                        {error.message}
                    </Typography>
                ) :
                    main_products && main_products.length > 0 &&
                    <Slider products={main_products} />
            }

        </ProductsSection>
    )
}

const WomenSProducts = () => {

    return (
        <WomenSProductsSection
            id="Woman's-Banner"
        >

            <WomenBanner />

            <Products />

        </WomenSProductsSection>
    )
}

export default WomenSProducts

const WomenSProductsSection = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: "center",
    padding: "20px 60px",
    paddingRight: '80px',
    justifyContent: "space-between",
    marginTop: "10px",
    columnGap: "100px",
    overflowX: 'hidden',

    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        padding: "10px",
    },
}))

const WomenBannerSection = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    height: "500px",
    minWidth: "250px",
    backgroundImage: `url(${women_banner})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.down('md')]: {
        minWidth: "100%",
        marginBottom: '20px',
    },
}))

const ProductsSection = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: "68%",
    alignItems: "center",
    [theme.breakpoints.down('md')]: {
        width: "100%",
    },
}))

const StyledTabs = styled(Tabs)({
    '& .MuiTabs-indicator': {
        backgroundColor: 'black',
    }
})

const StyledTab = styled(Tab)({
    padding: '0',
    fontSize: '1.1em',
    textTransform: 'none',
})

const SliderWrapper = styled('div')(({ theme }) => ({
    marginTop: "40px",
    width: "99.99%",
    overflow: "hidden",
    [theme.breakpoints.down('md')]: {
        marginTop: "20px",
    },
}))

const ProductSection = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.nunito,
    boxSizing: 'border-box',
    minWidth: '33.33%',
    maxWidth: '33.33%',
    padding: '10px 0',
    '&:hover .AddToCartBtn': {
        bottom: '10px',
    },
    [theme.breakpoints.down('970')]: {
        minWidth: '100%',
        maxWidth: '100%',
    },
    [theme.breakpoints.down('lg')]: {
        minWidth: '50%',
        maxWidth: '50%',
    },
}))

const ProductImageContainer = styled('div')(({ theme }) => ({
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    cursor: "pointer",
    overflow: "hidden",
    height: "250px",
    width: "100%",
    border: "1px rgba(0,0,0,.05) solid",
    boxSizing: "border-box",
    [theme.breakpoints.down('sm')]: {
        height: '200px',
    }
}))

const AddProductToCartBtn = styled('button')(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    borderRadius: '15px',
    fontSize: '0.9em',
    justifyContent: "space-between",
    flexDirection: "row",
    width: "max-content",
    boxSizing: "border-box",
    padding: "5px 20px",
    backgroundColor: "white",
    position: "absolute",
    bottom: "-30%",
    left: "50%",
    transform: 'translateX(-50%)',
    transition: 'bottom 0.3s',
    border: '1.5px black solid',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'black',
        color: 'white',
    }
}))

const Name = styled(NavLink)(({ theme }) => ({
    display: 'inline-block',
    textDecoration: 'unset',
    color: 'black',
    width: '100%',
    margin: '0 auto',
    fontSize: 'clamp(0.8em, 1vw, 1em)',
    fontWeight: 'bold',
    marginTop: '15px',
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    '&:hover': {
        textDecoration: 'underline',
    },
}))

const Price = styled(Typography)(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    fontSize: "0.9em",
    marginTop: "5px",
    paddingLeft: "5px",
    bgcolor: "white",
    borderRadius: "5px",
    textAlign: "center",
    [theme.breakpoints.down('md')]: {
        fontSize: "0.8em",
    },
}))

const SliderSection = styled('div')(({ theme }) => ({
    position: "relative",
    width: "100%",
    alignItems: "center",
    zIndex: '1',
    '& .switch_slide_btn': {
        display: 'flex',
        position: "absolute",
        top: "50%",
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '50%',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,.05)',
        },
        '&.left': {
            right: 'calc(100% + 10px)',
            zIndex: '2',
            [theme.breakpoints.down('md')]: {
                left: '0',
                right: 'auto',
            },
        },
        '&.right': {
            left: 'calc(100% + 10px)',
            zIndex: '2',
            [theme.breakpoints.down('md')]: {
                right: '0',
                left: 'auto',
            },
        },
    }
}))