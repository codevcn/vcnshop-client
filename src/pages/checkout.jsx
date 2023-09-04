import React, { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import Header from '../components/checkout/header'
import ShippingInfo from "../components/checkout/shipping_info"
import NotFound404 from './not_found_404'
import ConfirmOrder from "../components/checkout/confirm_order"
import Payment from '../components/checkout/payment'
import Success from '../components/checkout/success'
import { useCurrentRoute } from "../hooks/custom_hooks"
import { Routes, Route, useNavigate } from "react-router-dom"
import { Box, LinearProgress, Typography } from "@mui/material"
import { check_products_api } from "../apis/product_apis"
import { useSelector } from "react-redux"
import axiosErrorHandler from "../utils/axios_error_handler"
import { toast } from 'react-toastify'
import axios from "axios"

const steps = ['shipping_info', 'confirm_order', 'payment', 'success']

const get_step_from_route = (current_route) => {
    let split_route = current_route.toLowerCase().split('checkout/')
    let step_in_route = split_route[1]
    if (!step_in_route) return null
    return steps.find((step) => step_in_route === step)
}

const get_step_index = (step) => steps.indexOf(step)

const checkProducts = async (products) => {
    if (products && products.length > 0) {
        await axios.post(
            check_products_api,
            { products },
            { withCredentials: true }
        )
    }
}

const Checkout = () => {
    const current_route = useCurrentRoute()
    const [checkingStatus, setcheckingStatus] = useState(null)
    const { cartItems } = useSelector(({ cart }) => cart)
    const navigate = useNavigate()

    const checkProductsBeforePayment = async () => {
        if (checkingStatus === null) {
            try {
                await checkProducts(cartItems)

                setcheckingStatus('valid')
            } catch (error) {
                let errorObject = axiosErrorHandler(error)

                toast.warning(errorObject.message)

                navigate('/cart')
            }
        }
    }

    useEffect(() => {
        checkProductsBeforePayment()
    }, [checkingStatus])

    const step = get_step_from_route(current_route)

    if (!step)
        return (<NotFound404 />)

    if (checkingStatus !== 'valid')
        return (
            <CheckingProducts>
                <Box
                    color="black"
                    width="100%"
                >
                    <LinearProgress color="inherit" />
                </Box>

                <Typography
                    marginTop="20px"
                >
                    Checking Products...
                </Typography>
            </CheckingProducts>
        )

    return (
        <CheckoutPage id="CheckoutPage">
            <Header activeStep={get_step_index(step)} />

            <Routes>
                <Route path="/shipping_info" element={<ShippingInfo />} />
                <Route path="/confirm_order" element={<ConfirmOrder />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/success" element={<Success />} />
            </Routes>
        </CheckoutPage>
    )
}

export default Checkout

const CheckoutPage = styled('div')({
    padding: '10px',
})

const CheckingProducts = styled('div')(({ theme }) => ({
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
    padding: "30px 100px",
    [theme.breakpoints.down('sm')]: {
        padding: '30px',
    }
}))