import React, { createContext, useCallback, useContext, useRef, useState } from "react"
import { styled } from '@mui/material/styles'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { addProductToCart } from "../../../store/actions/cart_actions"
import Images from "./images"
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-toastify'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import RatingMUI from '@mui/material/Rating'
import { CircularProgress, Stack, Tooltip, Typography, Box } from "@mui/material"
import StraightenIcon from '@mui/icons-material/Straighten'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { useTheme } from "@emotion/react"

const OptionsContext = createContext()

const Rating = ({ averageRating, countReviews }) => {
    return (
        <Stack columnGap={'10px'} flexDirection={'row'} alignItems={'center'}>
            <RatingMUI
                readOnly
                defaultValue={0}
                precision={0.5}
                value={averageRating * 1}
            />
            <div>
                <span>({countReviews}</span>
                <span>{countReviews > 1 ? ' reviews' : ' review'})</span>
            </div>
        </Stack>
    )
}

const StockStatus = ({ productStock }) => {
    return (
        <Tooltip
            title={productStock > 0 ? `${productStock} products left` : 'Out of stock'}
            placement="right"
        >
            <Box
                bgcolor={productStock > 0 ? '#6ce26c' : '#ff6161'}
                fontSize='0.9em'
                fontWeight='bold'
                borderRadius='10px'
                padding='5px 15px'
                width='fit-content'
            >
                {productStock > 0 ? 'In Stock: ' + productStock : 'Out of stock'}
            </Box>
        </Tooltip>
    )
}

const Colors = ({ onPickColor }) => {
    const [colorPicked, setColorPicked] = useState()
    const colors_data = useContext(OptionsContext).colors

    const pickColor = (color) => {
        setColorPicked(color)
        onPickColor('color', color)
    }

    const selectColor = (e) => {
        let color = e.target.value
        if (color === 'none') {
            e.target.value = ''
            onPickColor('color', null)
        } else {
            e.target.value = color
            onPickColor('color', color)
        }
    }

    const ColorBox = ({ color }) => {
        return (
            <Box
                sx={colorPicked === color ? { outline: '2px gray solid' } : {}}
                borderRadius="50%"
            >
                <Tooltip
                    key={color}
                    title={color}
                >
                    <Box
                        borderRadius='50%'
                        padding='4px'
                    >
                        <Box
                            width='20px'
                            height='20px'
                            borderRadius='50%'
                            boxShadow='0px 0px 4px gray'
                            cursor='pointer'
                            bgcolor={color}
                            component="div"
                            onClick={() => pickColor(color)}
                            sx={{ cursor: 'pointer' }}
                        />
                    </Box>
                </Tooltip>
            </Box>

        )
    }

    return (
        <div>
            <Typography
                component="h2"
                fontSize='1.1em'
                margin='0'
                fontWeight='bold'
            >
                Color:
            </Typography>

            <Stack
                flexDirection="row"
                columnGap='15px'
                marginTop='8px'
            >
                {
                    colors_data.length > 5 ?
                        <Box
                            onClick={selectColor}
                            component="select"
                            padding='5px'
                            fontSize='1em'
                            border='2px gray solid'
                            width='100%'
                        >
                            <option value="none">
                                Please select one!
                            </option>
                            {
                                colors_data.map((color) => (
                                    <option
                                        value={color}
                                        key={color}
                                    >
                                        {color}
                                    </option>
                                ))
                            }
                        </Box>
                        :
                        colors_data.map((color) => (
                            <ColorBox color={color} key={color} />
                        ))
                }
            </Stack>
        </div >
    )
}

const Sizes = ({ onPickSize }) => {
    const sizes_data = useContext(OptionsContext).sizes

    const handlePickSize = (e) => {
        let size_name = e.target.value
        if (size_name === 'none') {
            e.target.value = ''
            onPickSize('size', null)
        } else {
            e.target.value = size_name
            onPickSize('size', size_name)
        }
    }

    return (
        <Box
            marginTop="15px"
        >
            <Stack
                flexDirection="row"
                justifyContent="space-between"
            >
                <Typography
                    component="h2"
                    fontSize='1.1em'
                    margin='0'
                    fontWeight='bold'
                >
                    Size:
                </Typography>

                <Stack
                    flexDirection="row"
                    alignItems='center'
                    columnGap='5px'
                    width='fit-content'
                >
                    <StraightenIcon />
                    <FindYourSize>
                        Find your size exactly.
                    </FindYourSize>
                </Stack>
            </Stack>
            <Box
                marginTop='5px'
                padding='5px'
                fontSize='1em'
                border='2px gray solid'
                width='100%'
                component="select"
                onClick={handlePickSize}
            >
                <option value="none">
                    Please choose one!
                </option>
                {
                    sizes_data.map((size) => (
                        <option
                            value={size}
                            key={size}
                        >
                            {size}
                        </option>
                    ))
                }
            </Box>
        </Box>
    )
}

const Options = ({ onSetOptions }) => {

    const handleSetOptions = (option_name, option_value) => {
        onSetOptions(option_name, option_value)
    }

    return (
        <Stack
            rowGap='12px'
        >
            <Colors onPickColor={handleSetOptions} />
            <Sizes onPickSize={handleSetOptions} />
        </Stack>
    )
}

const set_price = (price) => price.toLocaleString('en', { useGrouping: true })

const Price = ({ price }) => {
    const theme = useTheme()

    return (
        <Tooltip title={`Price: ${price} USD`} placement="right">
            <Typography
                display='flex'
                columnGap='3px'
                fontSize='1.8em'
                fontWeight='bold'
                margin='10px 0'
                width='fit-content'
                fontFamily={theme.fontFamily.kanit}
            >
                <span>$</span>
                <span>
                    {set_price(price)}
                </span>
            </Typography>
        </Tooltip>
    )
}

const AddToCart = ({ options, productId }) => {
    const { loading } = useSelector(({ cart }) => cart)
    const dispatch = useDispatch()

    const addToCart = () => {
        let { color, size } = options.current

        if (!color || !size)
            return toast.warn('Please select one color and one size')

        dispatch(addProductToCart(productId, { color, size }))
    }

    return (
        <Tooltip title="Add this product to your cart">
            <AddToCartBtn onClick={addToCart}>
                {
                    loading ?
                        <CircularProgress
                            thickness={6}
                            size={20}
                            sx={{ color: 'white' }}
                        />
                        :
                        <>
                            <AddShoppingCartIcon sx={{ color: 'white', fontSize: '1.2em' }} />
                            <span>Add to cart</span>
                        </>
                }
            </AddToCartBtn>
        </Tooltip>
    )
}

const action_icon_style = {
    color: 'white',
}

const actions = [
    {
        name: 'Add to wish list',
        icon: <FavoriteBorderIcon sx={action_icon_style} />,
    }, {
        name: 'Coupons',
        icon: <ConfirmationNumberIcon sx={action_icon_style} />,
    },
]

const MoreActions = () => {
    return (
        <MoreActionsSection
            ariaLabel="SpeedDial-MoreActions"
            icon={<SpeedDialIcon sx={{ color: 'white' }} />}
            direction="right"
            hidden={false}
        >
            {
                actions.map(({ name, icon }) => (
                    <SpeedDialAction
                        key={name}
                        icon={icon}
                        tooltipTitle={name}
                        tooltipPlacement="bottom"
                    />
                ))
            }
        </MoreActionsSection>
    )
}

const ProductDetail = ({ product }) => {
    const options = useRef({ color: null, size: null })
    const theme = useTheme()

    const handleSetOptions = useCallback((option_name, option_value) => {
        options.current = {
            ...options.current,
            [option_name]: option_value,
        }
    }, [])

    return (
        <ProductDetailSection
            id="ProductDetail"
        >

            <Images
                images={product.images}
                image_link={product.image_link}
            />

            <Details>

                <Typography
                    fontFamily={theme.fontFamily.nunito}
                    fontWeight='bold'
                    fontSize='1.5em'
                >
                    {product.name}
                </Typography>

                <Rating
                    averageRating={product.review.average_rating}
                    countReviews={product.review.count_reviews}
                />

                <StockStatus
                    productStock={product.stock}
                />

                <OptionsContext.Provider
                    value={{
                        colors: product.options.colors,
                        sizes: product.options.sizes,
                    }}
                >
                    <Options onSetOptions={handleSetOptions} />
                </OptionsContext.Provider>

                <Price price={product.price.value} />

                <AddToCart
                    options={options}
                    productId={product._id}
                />

                <MoreActions />

            </Details>

        </ProductDetailSection>
    )
}

export default ProductDetail

const ProductDetailSection = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '30px',
    justifyContent: 'space-between',
    marginTop: '15px',
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('md')]: {
        fontSize: '0.8em',
        flexDirection: 'column',
    },

}))

const Details = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '20px',
    width: '70%',
    boxSizing: 'border-box',
    padding: '20px 0',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    }
}))

const MoreActionsSection = styled(SpeedDial)(({ theme }) => ({
    '& .MuiButtonBase-root': {
        backgroundColor: 'black',
        '&:hover': {
            backgroundColor: 'black',
        }
    },
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    }
}))

const AddToCartBtn = styled('button')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: '10px',
    cursor: 'pointer',
    padding: '10px 20px',
    transition: 'background-color 0.2s',
    borderRadius: '20px',
    fontSize: '1em',
    backgroundColor: '#26A69A',
    fontWeight: 'bold',
    border: 'none',
    color: 'white',
    '&:hover': {
        backgroundColor: 'black',
    }
})

const FindYourSize = styled('div')({
    fontSize: '0.9em',
    color: 'red',
    cursor: 'pointer',
    '&:hover': {
        textDecoration: 'underline',
    }
})