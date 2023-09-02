import React from "react"
import { styled } from '@mui/material/styles'
import empty_cart from '../../assets/images/empty_cart.svg'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
    removeItemFromCart, changeQuantity,
} from "../../store/actions/cart_actions"
import { useDispatch } from "react-redux"
import { NavLink } from 'react-router-dom'
import { Tooltip, Stack, Typography, Box } from "@mui/material"
import ProgressiveImage from "../materials/progressive_image"
import { useTheme } from "@emotion/react"

const titles = [
    { title: 'Product', width: '20%', },
    { title: 'Detail', width: '35%', },
    { title: 'Qty', width: '15%', },
    { title: 'Price', width: '15%', },
    { title: 'Remove', width: '15%', },
]

const ProductCard = ({ itemInfo }) => {
    const { _id, image_link, name, size, color, quantity, stock, price } = itemInfo
    const dispatch = useDispatch()

    const removeItems = () => {
        dispatch(removeItemFromCart(_id))
    }

    const changeProductQuantity = (option) => {
        if (option === 1 && quantity === stock) return
        if (option === -1 && quantity === 1) return
        dispatch(changeQuantity(_id, option))
    }

    const getQtyIocnStyle = (option) => {
        let quantity_icon_style = {
            cursor: 'pointer',
            fontSize: '1.5em',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'scale(1.2)',
            }
        }

        if ((option === 1 && quantity === stock) || (option === -1 && quantity === 1))
            return { ...quantity_icon_style, opacity: '0.5', pointerEvents: 'none' }
        else
            return quantity_icon_style
    }

    const setPrice = (value) => value.toLocaleString('en', { useGrouping: true })

    return (
        <Box
            padding='10px'
        >
            <Stack
                flexDirection="row"
                justifyContent='space-between'
                columnGap='10px'
                boxSizing='border-box'
                width='100%'
            >
                <ProductImage
                    to={`/productDetail/${_id}`}
                >
                    <ProgressiveImage
                        src={image_link}
                        scss={{ maxHeight: '100%', maxWidth: '100%', minWidth: '140px', minHeight: '117px', margin: 'auto' }}
                        alt="Product"
                    />
                </ProductImage>

                <ProductInfo>
                    <Name to={`/productDetail/${_id}`}>
                        {name}
                    </Name>
                    <div>{'Size: ' + size}</div>
                    <div>{'Color: ' + color}</div>
                </ProductInfo>

                <ChangeQty>
                    <Tooltip title="Increase one" placement="top">
                        <AddCircleOutlineIcon
                            sx={getQtyIocnStyle(1)}
                            onClick={() => changeProductQuantity(1)}
                        />
                    </Tooltip>
                    <Typography
                        fontSize='1.2em'
                        fontWeight='bold'
                    >
                        {quantity}
                    </Typography>
                    <Tooltip title="Decrease one">
                        <RemoveCircleOutlineIcon
                            sx={getQtyIocnStyle(-1)}
                            onClick={() => changeProductQuantity(-1)}
                        />
                    </Tooltip>
                </ChangeQty>

                <ProductPrice>
                    {'$' + setPrice(price)}
                </ProductPrice>

                <RemoveProduct
                    sx={{ width: titles[4].width }}
                >
                    <Tooltip title="Remove this product">
                        <StyledDeleteForeverIcon onClick={() => removeItems(_id)} />
                    </Tooltip>
                </RemoveProduct>
            </Stack >

            <ResponsivePrice>
                <span className="label">
                    Price:
                </span>
                <span className="price">
                    {'$' + setPrice(price)}
                </span>
            </ResponsivePrice>
        </Box>
    )
}

const ProductCards = ({ cartItems }) => {
    const theme = useTheme()

    return (
        <CardsSection
            id="ProductCardsSection"
            sx={cartItems.length > 0 ? { height: 'fit-content' } : { height: 'auto' }}
        >
            <Stack
                flexDirection="row"
                justifyContent='space-between'
                columnGap='10px'
                padding='10px'
                boxSizing='border-box'
                width='100%'
                backgroundColor='black'
                marginBottom='10px'
            >
                {
                    titles.map(({ title, width }) => (
                        <Tooltip
                            key={title}
                            title={title}
                        >
                            <Title
                                sx={{ width }}
                                theme={{
                                    titleName: title,
                                    breakpoints: theme.breakpoints
                                }}
                            >
                                {title}
                            </Title>
                        </Tooltip>
                    ))
                }
            </Stack>
            {
                cartItems.length > 0 ?
                    cartItems.map((item) => (
                        <React.Fragment key={item._id}>
                            <ProductCard itemInfo={item} />

                            <Hr />
                        </React.Fragment>
                    ))
                    :
                    <Stack
                        justifyContent='center'
                        alignItems='center'
                        margin='auto'
                        padding='50px 10px'
                    >
                        <img
                            src={empty_cart}
                            style={{ height: '20vh' }}
                            alt="Empty"
                        />
                        <EmptyCartText>
                            THERE IS NO ITEM IN YOUR CART
                        </EmptyCartText>
                        <EmptyCartText className="desc">
                            Let's shop now and make up your cart!!
                        </EmptyCartText>
                        <EmptyCartBtn href="/">
                            Shopping Now
                        </EmptyCartBtn>
                    </Stack>
            }
        </CardsSection>
    )
}

export default ProductCards

const CardsSection = styled('div')(({ theme }) => ({
    alignItems: 'center',
    width: '65%',
    backgroundColor: '#f0f0f0',
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('lg')]: {
        width: '100%',
    },
}))

const Hr = styled('hr')({
    border: '0.5px grey solid',
    width: '100%',
    backgroundColor: 'grey',
    margin: '10px auto',
    boxSizing: 'border-box',
    '&:last-of-type': {
        display: 'none',
    }
})

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '1.1em',
    textAlign: 'center',
    color: 'black',
    borderRadius: '5px',
    backgroundColor: 'white',
    padding: '2px 0',
    boxSizing: 'border-box',
    ...(theme.titleName === 'Product' ? { minWidth: '140px' } : {}),
    [theme.breakpoints.down('lg')]: {
        fontSize: '0.85em',
        ...(theme.titleName === 'Remove' ? { display: 'none' } : {}),
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.85em',
        ...(theme.titleName === 'Price' ? { display: 'none' } : {}),
    },
}))

const ProductImage = styled(NavLink)({
    display: 'flex',
    width: titles[0].width,
    height: "145px",
    color: "black",
    textDecoration: 'none',
    minWidth: '140px',
})

const ProductInfo = styled('div')(({ theme }) => ({
    fontSize: '1em',
    marginLeft: '10px',
    rowGap: '10px',
    width: titles[1].width,
    boxSizing: 'border-box',
    [theme.breakpoints.down('lg')]: {
        fontSize: '0.8em',
    },
}))

const ChangeQty = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: '5px',
    width: titles[2].width,
    boxSizing: 'border-box',
    [theme.breakpoints.down('lg')]: {
        fontSize: '0.9em',
    },
}))

const ProductPrice = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '1.2em',
    width: titles[3].width,
    boxSizing: 'border-box',
    [theme.breakpoints.down('lg')]: {
        fontSize: '1em',
    },
    [theme.breakpoints.down('sm')]: {
        display: 'none'
    },
}))

const ResponsivePrice = styled('div')(({ theme }) => ({
    display: 'flex',
    fontSize: '1em',
    marginTop: '5px',
    columnGap: '5px',
    fontFamily: theme.fontFamily.kanit,
    paddingLeft: '10px',
    '& span.label': {
        fontWeight: 'bold',
    },
    [theme.breakpoints.up('sm')]: {
        display: 'none',
    }
}))

const Name = styled(NavLink)({
    fontSize: '1.1em',
    fontWeight: 'bold',
    width: 'fit-content',
    cursor: 'pointer',
    color: 'black',
    textDecoration: 'unset',
    '&:hover': {
        textDecoration: 'underline',
    }
})

const StyledDeleteForeverIcon = styled(DeleteForeverIcon)({
    height: '1.5em',
    width: '1.5em',
    margin: 'auto',
    cursor: 'pointer',
    color: 'red',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.2)',
    }
})

const EmptyCartText = styled('p')(({ theme }) => ({
    display: 'block',
    fontFamily: theme.fontFamily.kanit,
    fontWeight: 'bold',
    fontSize: '1.5em',
    color: '#323232',
    margin: '0',
    marginTop: '10px',
    '&.desc': {
        display: 'block',
        fontWeight: 'bold',
        fontSize: '0.9em',
        marginTop: '0px',
    }
}))

const EmptyCartBtn = styled('a')({
    padding: '10px 20px',
    borderRadius: '10px',
    fontFamily: 'nunito',
    fontWeight: 'bold',
    fontSize: '1em',
    color: 'white',
    backgroundColor: 'black',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'transform 0.2s',
    textDecoration: 'unset',
    '&:hover': {
        transform: 'scale(1.05)',
    },
})

const RemoveProduct = styled('div')(({ theme }) => ({
    display: 'flex',
    boxSizing: 'border-box',
    [theme.breakpoints.down('lg')]: {
        display: 'none',
    },
}))