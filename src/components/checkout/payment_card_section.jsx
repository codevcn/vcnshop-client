import React, { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import { useStripe, PaymentElement, useElements } from '@stripe/react-stripe-js'
import { toast } from "react-toastify"
import EmailIcon from '@mui/icons-material/Email'
import ErrorIcon from '@mui/icons-material/Error'
import { CircularProgress, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { completePlaceOrder } from '../../store/actions/order_actions'
import axios from "axios"
import axiosErrorHandler from '../../utils/axios_error_handler'
import { deleteCheckoutInfo } from "../../store/actions/cart_actions"
import { get_products_by_ids_api } from '../../apis/product_apis'

const email_is_read_only = true

const payment_method_default = 'card'

class CheckingStatus {
    #error
    #data_if_no_error

    constructor() {
        this.#error = null
        this.#data_if_no_error = null
    }

    getErrorMessage() {
        return this.#error.message
    }
    getError() {
        return this.#error
    }
    getData() {
        return this.#data_if_no_error
    }

    setData(data) {
        this.#data_if_no_error = data
    }
    setError(error) {
        this.#error = {
            ...error,
            message: error.message || 'Something went wrong'
        }
    }

    checkError() {
        return this.getError()
    }
}

const check_products_stock_before_payemnt = async (cart_items) => {
    let status = new CheckingStatus()

    let idList = cart_items.map(({ _id }) => _id)

    let products

    try {
        let { data } = await axios.post(
            get_products_by_ids_api,
            { idList: idList }
        )

        products = data.products
    } catch (error) {
        let errorObject = axiosErrorHandler(error)
        status.setError(errorObject)
        return status
    }

    for (let { quantity, _id: item_id } of cart_items) {

        let product = products.find(({ _id: product_id }) => item_id === product_id)

        let product_stock = product.stock
        if (product_stock === 0) {
            status.setError({ message: 'The product is out of stock' })
            return status
        }
        if (quantity > product_stock) {
            status.setError({ message: 'There is an item with the quantity is greater than in stock' })
            return status
        }
    }

    return status
}

const confirm_the_payment = async (stripe, payment_elements, shipping_info, name_of_user) => {
    let status = new CheckingStatus()

    let response = await stripe.confirmPayment({
        elements: payment_elements,
        confirmParams: {
            return_url: window.location.origin + '/checkout/success',
            shipping: {
                address: {
                    country: shipping_info.City,
                    city: shipping_info.City,
                    state: shipping_info.State,
                },
                phone: shipping_info['Phone Number'],
                name: name_of_user,
            },
        },
        redirect: 'if_required',
    })

    if (response.error) {
        let error = response.error

        if (error.type === 'validation_error' || error.type === 'card_error') {
            status.setError(error)
        } else if (error.type === 'invalid_request_error') {
            status.setError({ message: 'Can\'t complete the payment, fail in authentication.' })
        } else {
            status.setError({ message: 'Something went wrong with the payment section!' })
        }

        return status
    }

    status.setData(response)

    return status
}

const PaymentCardSection = ({ isUnpaidOrder, orderInfo, shippingInfo, orderId, currencyCode }) => {
    const { user } = useSelector(({ user }) => user)
    const { cartItems } = useSelector(({ cart }) => cart)
    const { paymentCompleted } = useSelector(({ order_for_user }) => order_for_user)
    const stripe = useStripe()
    const elements = useElements()
    const [paying, setPaying] = useState(false)
    const dispatch = useDispatch()
    const [almostThere, setAlmostThere] = useState(false)

    useEffect(() => {
        if (paymentCompleted) dispatch(deleteCheckoutInfo())
    }, [paymentCompleted])

    const confirmPayment = (order_id, payment_method, payment_id) => {
        dispatch(completePlaceOrder(
            {
                orderId: order_id,
                paymentMethod: payment_method,
                paymentId: payment_id,
            }
        ))
    }

    const checkPayment = async () => {
        setPaying(true)

        let cart_items = isUnpaidOrder ? orderInfo.items_of_order : cartItems

        let status_of_check_product_stock = await check_products_stock_before_payemnt(cart_items)
        if (status_of_check_product_stock.checkError()) {
            toast.warning(status_of_check_product_stock.getErrorMessage())
            setPaying(false)
            return
        }

        let status_of_confirm_payment = await confirm_the_payment(stripe, elements, shippingInfo, user.name)
        if (status_of_confirm_payment.checkError()) {
            toast.warning(status_of_confirm_payment.getErrorMessage())
            setPaying(false)
            return
        }

        setAlmostThere(true)

        let paymentIntent_info = status_of_confirm_payment.getData().paymentIntent

        confirmPayment(orderId, payment_method_default, paymentIntent_info.id)
    }

    return (
        <>
            <EmailFromGroup>
                <Label htmlFor="email_receipts">Email Receipts</Label>
                <InputContainer>
                    <EmailInput
                        id="email_receipts"
                        readOnly={email_is_read_only}
                        sx={email_is_read_only && { pointerEvents: 'none' }}
                        maxLength={35}
                        defaultValue={user.email || ''}
                        placeholder="Enter your email for receipts..."
                    />
                    <EmailIcon />
                </InputContainer>
                <Note>
                    <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                    <span>
                        In case the email receipts are not provided then we use your email you used
                        for register to send you with receipts after invoices are paid.
                    </span>
                </Note>
            </EmailFromGroup>

            <PaymentElement />

            <PayNowBtn onClick={checkPayment} sx={paying && { pointerEvents: 'none' }}>
                {
                    paying ?
                        <CircularProgress
                            thickness={6}
                            size={22}
                            sx={{ color: 'white', margin: 'auto' }}
                        />
                        :
                        <span>{'Pay ' + orderInfo.total_to_pay + ' ' + currencyCode.toUpperCase()}</span>
                }
            </PayNowBtn>
            <HoverBarAnimation className="hover_animate" />

            {
                almostThere &&
                <Typography color="#1ea865" textAlign="center" marginTop="5px">
                    We're almost there...
                </Typography>
            }
        </>
    )
}

export default PaymentCardSection

const EmailFromGroup = styled('div')({
    width: '100%',
    marginBottom: '10px',
})

const Label = styled('label')({
    fontFamily: '"Gill Sans", sans-serif',
    fontSize: '0.9em',
    fontWeight: 'bold',
})

const InputContainer = styled('div')({
    display: 'flex',
    columnGap: '10px',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 15px',
    marginTop: '5px',
    border: '1px rgba(0,0,0,0.3) solid',
    borderRadius: '5px',
    transition: 'box-shadow 0.2s',
    boxSizing: 'border-box',
    '&.on_focus_with_error': {
        outline: '2px #DF1B41 solid',
        boxShadow: 'unset',
        border: 'unset',
    },
    ':focus': {
        outline: 'unset',
        boxShadow: '0px 0px 5px gray',
        border: 'unset',
    }
})

const EmailInput = styled('input')({
    fontFamily: '"Gill Sans", sans-serif',
    fontSize: '1em',
    width: '100%',
    border: 'none',
    outline: 'unset',
})

const Note = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginTop: '5px',
    padding: '0 10px',
    '& span': {
        fontFamily: '"Nunito", "sans-serif"',
        fontSize: '0.7em',
    }
})

const PayNowBtn = styled('button')({
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 15px',
    width: '100%',
    borderRadius: '5px',
    backgroundColor: 'black',
    border: '2px black solid',
    boxSizing: 'border-box',
    fontFamily: '"Gill Sans", sans-serif',
    fontWeight: 'bold',
    fontSize: '1.2em',
    marginTop: '20px',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover~.hover_animate': {
        width: '100%',
    },
})

const HoverBarAnimation = styled('div')({
    width: '0',
    height: '5px',
    marginTop: '5px',
    transition: 'width 0.5s',
    backgroundColor: 'black',
})