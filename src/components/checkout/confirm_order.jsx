import React from "react"
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from "react-redux"
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { useFloatNumber, useNumerToWords } from "../../hooks/custom_hooks"
import ErrorIcon from '@mui/icons-material/Error'
import { useNavigate, Navigate } from "react-router-dom"
import { saveOrderInfo } from "../../store/actions/cart_actions"
import { Stack, Divider, Box, Tooltip, Typography } from "@mui/material"
import { TAX_CHARGE } from "../../configs/constants"

const Detail = ({ label, value }) => (
    <Stack
        flexDirection='row'
        justifyContent='space-between'
        columnGap='20px'
        padding='2px 10px'
        boxSizing='border-box'
        borderBottom='1.5px black solid'
        borderRadius='10px'
        backgroundColor='white'
    >
        <Typography fontSize="0.9em" fontWeight="bold" fontFamily="inherit">
            {label}
        </Typography>

        <Tooltip title={value}>
            <Typography
                fontFamily="inherit"
                fontSize="1em"
            >
                {value}
            </Typography>
        </Tooltip>
    </Stack>
)

const ProductCard = ({ cardInfo }) => {
    const { image_link, name, price, color, size, quantity } = cardInfo

    return (
        <ProductCardSection>
            <ProductImg src={image_link} />

            <Stack rowGap="3px" width="100%">
                <Detail label={'Name:'} value={name} />
                <Detail label={'Price:'} value={`$${price}`} />
                <Detail label={'Color:'} value={color} />
                <Detail label={'Size:'} value={size} />
                <Detail label={'Quantity:'} value={quantity} />
            </Stack>
        </ProductCardSection>
    )
}

const CartItems = ({ cartItems }) => {
    return (
        <Stack marginTop="30px" width="100%">
            <Title>ITEMS</Title>
            {
                cartItems && cartItems.length > 0 &&
                cartItems.map((item) => (
                    <ProductCard key={item._id} cardInfo={item} />
                ))
            }
        </Stack>
    )
}

const ShippingInfo = ({ shippingInfo }) => {
    return (
        <Box width="100%">
            <Title>Delivery Information</Title>

            {
                shippingInfo &&
                ['Address', 'City', 'State', 'Zip Code', 'Country', 'Phone'].map((label, index) => (
                    <ShippingItem
                        key={label}
                        sx={{ borderTop: index === 0 && '1px #cdcdcd solid' }}
                    >
                        <Typography fontWeight="bold">
                            {label + ':'}
                        </Typography>

                        <span style={{ color: shippingInfo[label === 'Phone' ? 'Phone Number' : label] ? 'black' : '#ababab' }}>
                            {shippingInfo[label === 'Phone' ? 'Phone Number' : label] || 'Not Provided'}
                        </span>
                    </ShippingItem>
                ))
            }

            <Note>
                <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                <span>In case the phone number isn't provided then we use your email to contact to you when dilivery</span>
            </Note>
        </Box>
    )
}

const SummaryItem = ({ label, value, isTotalToPay }) => (
    <Stack
        flexDirection="row"
        justifyContent='space-between'
        columnGap='20px'
        marginBottom='5px'
        sx={isTotalToPay ? { fontSize: '1.2em', fontWeight: 'bold' } : {}}
    >
        <span>
            {label}
        </span>
        <span>
            {'$' + value}
        </span>
    </Stack>
)

const Summary = ({ summaryInfo }) => {
    const { subtotal, tax_fee, shipping_fee, total_to_pay } = summaryInfo
    const number_to_words_convertor = useNumerToWords()

    return (
        <Stack padding="20px" boxSizing="border-box" border="2px black solid">
            <SummaryItem label={'Subtotal'} value={subtotal} />
            <SummaryItem label={'Tax'} value={tax_fee} />
            <SummaryItem label={'Shipping Fee'} value={shipping_fee} />
            <Hr />
            <SummaryItem label={'Total To Pay'} value={total_to_pay} isTotalToPay={true} />
            <Typography fontSize="0.8em" fontFamily="inherit">
                <span>In words: </span>
                <span>{number_to_words_convertor(total_to_pay)}</span>
            </Typography>
        </Stack>
    )
}

const ConfirmOrder = () => {
    const { cartItems, shippingInfo } = useSelector(({ cart }) => cart)
    const get_float_number = useFloatNumber()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    if (!shippingInfo || cartItems.length === 0) {
        return (<Navigate to={-1} />)
    }

    const subtotal = get_float_number(
        cartItems.reduce((accumulator, { price, quantity }) => get_float_number(accumulator + price * quantity), 0)
    )

    const tax_fee = get_float_number(subtotal * TAX_CHARGE)

    const shipping_fee = shippingInfo.Method.cost

    const total_to_pay = get_float_number(subtotal + shipping_fee + tax_fee)

    const confirmOrder = () => {
        let order_info = {
            total_to_pay: total_to_pay,
            shipping_fee: shipping_fee,
            tax_fee: tax_fee,
            subtotal: subtotal,
        }

        dispatch(saveOrderInfo(order_info))

        navigate('/checkout/payment')
    }

    return (
        <ConfirmOrderSection id="ConfirmOrderSection">

            <SectionTitle>CONFIRM ORDER</SectionTitle>

            <Details>

                <ShippingInfoAndCartItems>
                    <ShippingInfo shippingInfo={shippingInfo} />

                    <CartItems cartItems={cartItems} />
                </ShippingInfoAndCartItems>

                <SummarySection>

                    <Title sx={{ textAlign: 'center' }}>SUMMARY</Title>

                    <Summary summaryInfo={{ subtotal, tax_fee, shipping_fee, total_to_pay }} />

                    <ConfirmOrderSubmit onClick={confirmOrder}>
                        <span>Proceed To Payment</span>
                        <DoubleArrowIcon />
                    </ConfirmOrderSubmit>

                    <Divider sx={{ margin: '30px auto', width: '50%' }} flexItem />

                    <Box>
                        <Note>
                            <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                            <span>If you have any questions about Tax or more, please go to FAQ</span>
                        </Note>
                    </Box>
                </SummarySection>

            </Details>

        </ConfirmOrderSection>
    )
}

export default ConfirmOrder

const ConfirmOrderSection = styled('div')(({ theme }) => ({
    marginTop: '30px',
    marginBottom: '20px',
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8em',
    }
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
    color: 'white',
    boxSizing: 'border-box',
    margin: '20px 0',
    fontFamily: theme.fontFamily.GillSans,
    textAlign: 'center',
    padding: '15px',
    width: '100%',
    fontSize: '1.5em',
    backgroundColor: 'black',
    letterSpacing: '3px',
}))

const Details = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '35px',
    padding: '0 30px',
    boxSizing: 'border-box',
    columnGap: '20px',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        padding: '0 10px',
    }
}))

const ShippingInfoAndCartItems = styled('div')(({ theme }) => ({
    width: "55%",
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    }
}))

const Title = styled('div')({
    fontWeight: 'bold',
    fontSize: '1.2em',
    padding: '10px 30px',
    boxSizing: 'border-box',
    borderRadius: '5px',
    backgroundColor: 'black',
    width: '100%',
    color: 'white',
    marginBottom: '5px',
})

const ShippingItem = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    columnGap: '20px',
    padding: '10px 20px',
    boxSizing: 'border-box',
    border: '1px #cdcdcd solid',
    borderTop: 'none',
    borderRadius: '3px',
})

const Note = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginTop: '5px',
    paddingLeft: '10px',
    '& span': {
        fontSize: '0.8em',
    }
})

const ProductCardSection = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '15px',
    width: '100%',
    marginBottom: '10px',
    backgroundColor: '#ececec',
    padding: '15px 10px',
    boxSizing: 'border-box',
    border: '2px #e1e1e1 solid',
    borderRadius: '3px',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        rowGap: '20px',
    }
}))

const ProductImg = styled('img')(({ theme }) => ({
    width: '110px',
    maxHeight: '110px',
    [theme.breakpoints.down('sm')]: {
        width: '130px',
        maxHeight: '130px',
    }
}))

const SummarySection = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: "45%",
    rowGap: "10px",
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginTop: '20px',
    }
}))

const Hr = styled('div')({
    margin: '20px 0',
    height: '3px',
    width: '100%',
    backgroundColor: 'black',
})

const ConfirmOrderSubmit = styled('button')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    fontWeight: 'bold',
    fontSize: '1em',
    padding: '10px 20px',
    backgroundColor: 'black',
    border: '2px black solid',
    cursor: 'pointer',
    color: 'white',
    marginTop: '10px',
    '&:hover': {
        color: 'black',
        backgroundColor: 'white',
        '& svg': {
            color: 'black',
        }
    },
    '&:active': {
        color: 'white',
        backgroundColor: 'black',
    },
})