import React, { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import { Skeleton } from "@mui/material"
import { useSelector } from "react-redux"
import PaymentCardSection from "./payment_card_section"
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from "@stripe/stripe-js"
import axios from "axios"
import { toast } from "react-toastify"
import axiosErrorHandler from "../../utils/axios_error_handler"
import { useGetQueryValue } from '../../hooks/custom_hooks'
import { useNavigate } from "react-router-dom"
import { Stack, Avatar, Paper } from '@mui/material'
import BlackLogo from '../../assets/images/logo_app_black.svg'
import ErrorIcon from '@mui/icons-material/Error'
import {
    init_place_order_api,
    get_order_api,
    get_stripe_key_api,
} from '../../apis/order_apis'

const payment_appearance = {
    theme: 'flat',
    variables: {
        fontFamily: '"Gill Sans", sans-serif',
        borderRadius: '5px',
        colorBackground: 'white',
        colorText: 'black',
    },
    rules: {
        '.Block': {
            backgroundColor: 'var(--colorBackground)',
            boxShadow: 'none',
            padding: '12px',
        },
        '.Input': {
            padding: '12px',
            border: '1px rgba(0,0,0,0.3) solid',
        },
        '.Input:focus': {
            boxShadow: '0px 0px 5px gray',
        },
        '.Input:disabled, .Input--invalid:disabled': {
            color: 'lightgray',
        },
        '.Input--invalid': {
            border: 'none',
        },
        '.Label': {
            fontWeight: 'bold',
            fontSize: '0.9em',
        },
    }
}

const currency_code = 'usd'

const get_order_initor = async (shippingInfo, order_info, cartItems) => {
    return axios.post(
        init_place_order_api,
        {
            currency: currency_code,
            shipping_info: {
                city: shippingInfo.City,
                country: shippingInfo.Country,
                state: shippingInfo.State,
                address: shippingInfo.Address,
                zip_code: shippingInfo['Zip Code'],
                phone_number: shippingInfo['Phone Number'],
                method: shippingInfo.Method.name,
            },
            items_of_order: cartItems,
            price_of_items: order_info.subtotal,
            tax_fee: order_info.tax_fee,
            shipping_fee: shippingInfo.Method.cost,
            total_to_pay: order_info.total_to_pay,
        },
        { withCredentials: true }
    )
}

const get_unpaid_order = async (order_id) => {
    return axios.get(
        get_order_api,
        {
            withCredentials: true,
            params: {
                orderId: order_id,
            }
        }
    )
}

const get_stripe_key = async () => {
    return axios.get(get_stripe_key_api, { withCredentials: true })
}

const Logo = () => {
    return (
        <LogoContainer>
            <Avatar src={BlackLogo} sx={{ height: '100px', width: '100px' }} />
            <div>
                <LogoText>VCN Shop</LogoText>
                <LogoText sx={{ marginTop: '5px', fontSize: '1em' }}>Fox COR</LogoText>
            </div>
        </LogoContainer>
    )
}

const Payment = () => {
    const { cartItems, shippingInfo, orderInfo: stored_orderInfo } = useSelector(({ cart }) => cart)
    const [orderInitor, setOrderInitor] = useState()
    const [orderInfo, setOrderInfo] = useState()
    const get_value_of_query_string = useGetQueryValue()
    const navigate = useNavigate()

    const init_order = (order_info, client_secret, stripe_key, order_id, is_unpaid_order) => {
        setOrderInfo(order_info)

        setOrderInitor({
            client_secret: client_secret,
            stripe_key: stripe_key,
            order_id: order_id,
            is_unpaid_order: is_unpaid_order,
        })
    }

    const initPlaceOrder = async (order_info) => {
        let order_data

        try {
            let response = await get_order_initor(shippingInfo, order_info, cartItems)

            order_data = response.data
        } catch (error) {
            let errorObject = axiosErrorHandler(error)
            toast.error(errorObject.message)
            return
        }

        init_order(
            stored_orderInfo,
            order_data.client_secret,
            order_data.stripe_key,
            order_data.orderId
        )
    }

    const initUnpaidOrder = async (order_id) => {
        let order_data
        let stripe_key

        try {
            let response_of_getOrder = await get_unpaid_order(order_id)
            let response_of_getStripeKey = await get_stripe_key()

            order_data = response_of_getOrder.data.order
            stripe_key = response_of_getStripeKey.data.stripe_key
        } catch (error) {
            let errorObject = axiosErrorHandler(error)
            toast.error(errorObject.message)
            return
        }

        init_order(
            order_data,
            order_data.payment_info.client_secret,
            stripe_key,
            order_data._id,
            true
        )
    }

    useEffect(() => {
        let order_id = get_value_of_query_string(undefined, 'orderId')
        if (order_id) {
            initUnpaidOrder(order_id)
        } else {
            if (!stored_orderInfo) {
                navigate(-1)
            } else {
                initPlaceOrder(stored_orderInfo)
            }
        }
    }, [])

    if (!orderInitor || !orderInfo)
        return (
            <Loading>
                <Skeleton className="loading" animation="wave" />
                <Skeleton className="loading" animation="wave" />
            </Loading>
        )

    return (
        <Stack id="PaymentSection" marginBottom="50px">
            <Title>
                Payment
            </Title>

            <Stack justifyContent="center" alignItems="center" marginTop="30px">
                <Logo />

                <Note>
                    <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                    <span>Now please fill full in all fields below</span>
                </Note>

                <Stack component={Paper} elevation={3} padding="50px 30px" borderRadius="5px" marginTop="10px">
                    <Elements
                        stripe={loadStripe(orderInitor.stripe_key)}
                        options={{
                            appearance: payment_appearance,
                            clientSecret: orderInitor.client_secret,
                        }}
                    >
                        <PaymentCardSection
                            currencyCode={currency_code}
                            orderId={orderInitor.order_id}
                            shippingInfo={shippingInfo}
                            isUnpaidOrder={orderInitor.is_unpaid_order}
                            orderInfo={orderInfo}
                        />
                    </Elements>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default Payment

const Loading = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    rowGap: "30px",
    alignItems: "center",
    margin: "20px 0",
    width: '100%',
    '& .loading': {
        width: '100%',
        transform: 'scale(1)',
        '&:nth-of-type(1)': {
            height: '100px',
        },
        '&:nth-of-type(2)': {
            height: '500px',
        },
    },
})

const Title = styled('h2')(({ theme }) => ({
    color: 'white',
    boxSizing: 'border-box',
    margin: '20px 0',
    fontFamily: theme.fontFamily.gillSans,
    textAlign: 'center',
    padding: '15px',
    width: '100%',
    fontSize: '1.5em',
    backgroundColor: 'black',
    letterSpacing: '3px',
}))

const LogoContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    fontFamily: theme.fontFamily.arial,
}))

const LogoText = styled('div')({
    fontWeight: 'bold',
    fontSize: '2em',
    transform: 'scaleY(1.2)',
})

const Note = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginTop: '50px',
    paddingLeft: '10px',
    '& span': {
        fontFamily: '"Nunito", "sans-serif"',
        fontSize: '0.8em',
    }
})