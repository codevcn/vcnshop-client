import React, { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import deliveryIcon from '../../assets/images/delivery.svg'
import ListAltIcon from '@mui/icons-material/ListAlt'
import PaymentIcon from '@mui/icons-material/Payment'
import PlaceIcon from '@mui/icons-material/Place'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmailIcon from '@mui/icons-material/Email'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { getOrder } from "../../store/actions/order_actions"
import { useDispatch, useSelector } from "react-redux"
import { PDFDownloadLink } from '@react-pdf/renderer'
import PDFReceipt from './PDF_receipt'
import axios from "axios"
import { toast } from "react-toastify"
import axiosErrorHandler from "../../utils/axios_error_handler"
import { useNavigate } from "react-router-dom"
import { useGetQueryValue } from "../../hooks/custom_hooks"
import { Stack, Typography, CircularProgress, Skeleton, Box } from '@mui/material'
import { send_receipt_via_email_api } from "../../apis/order_apis"
import { useTheme } from "@emotion/react"

const project_info = {
    email: 'vcnshop@gmail.com',
    website: 'https://www.vcnshop.new',
}

const SEA_TRANSPORT = 'Sea'

const Summary = ({ order }) => {
    const theme = useTheme()

    const SummaryType = ({ icon, small_title, value_of_type }) => (
        <Stack
            flexDirection="row"
            alignItems='center'
            columnGap='15px'
            width='100%'
            marginTop='20px'
            padding='5px 30px'
            boxSizing='border-box'
            bgcolor='rgb(128 128 128 / 11%)'
            fontFamily={theme.fontFamily.kanit}
        >
            {icon}

            <div>
                <Typography
                    fontSize='0.9em'
                    fontFamily="inherit"
                    color='gray'
                >
                    {small_title}
                </Typography>

                <Typography
                    fontFamily="inherit"
                    fontSize='1.1em'
                >
                    {value_of_type}
                </Typography>
            </div>
        </Stack>
    )

    return (
        <Stack
            width="30%"
            minWidth="300px"
            boxSizing="border-box"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                padding="30px 0"
                border='1px black solid'
                borderBottom='5px black solid'
                borderRight='5px black solid'
                boxSizing='border-box'
                borderRadius='5px'
            >
                <Typography
                    fontSize='1.3em'
                    padding='15px 30px'
                    color='white'
                    margin='0'
                    fontFamily={theme.fontFamily.kanit}
                    letterSpacing='2px'
                    marginBottom='20px'
                    bgcolor='black'
                >
                    ORDER SUMMARY
                </Typography>
                <SummaryType
                    icon={<ListAltIcon />}
                    small_title={order.items_of_order.length + ' items'}
                    value_of_type={order.total_to_pay + ' USD'}
                />
                <SummaryType
                    icon={<PaymentIcon />}
                    small_title={'Payment'}
                    value_of_type={'Paid on ' + order.payment_info.method}
                />
                <SummaryType
                    icon={<AccessTimeIcon />}
                    small_title={'Delivery Date & Time'}
                    value_of_type={order.shipping_info.method === SEA_TRANSPORT ? 'Within 5 - 7 days' : ''}
                />
                <SummaryType
                    icon={<PlaceIcon />}
                    small_title={'Delivery Address'}
                    value_of_type={order.shipping_info.country + ', ' + order.shipping_info.city + ', ' + order.shipping_info.address}
                />
            </Stack>
        </Stack >
    )
}

const Thanking = () => {
    const theme = useTheme()

    return (
        <Stack
            alignItems='center'
            justifyContent='center'
            width='30%'
            minWidth="300px"
            padding='10px'
            boxSizing='border-box'
            fontFamily={theme.fontFamily.kanit}
        >
            <TruckAnimation src={deliveryIcon} />
            <Typography
                fontFamily="inherit"
                fontSize='2em'
                fontWeight='bold'
                margin='25px 0'
            >
                THANK YOU!
            </Typography>
            <ThankText>
                We are getting started on your order right away, and you will receive an email for an invoice of
                your order.
            </ThankText>
            <ThankText sx={{ marginTop: '10px' }}>
                We suggest you should check your email regularly to receive your order in time. Thank
                for shopping in our site, have a nice day!
            </ThankText>
            <Stack
                flexDirection="row"
                columnGap='15px'
                marginTop='30px'
                flexWrap="wrap"
                rowGap="10px"
                justifyContent="center"
            >
                <ContinueShopping href="/">
                    Continue Shopping
                </ContinueShopping>
                <ViewOrder href="/account/myOrders">
                    View Order
                </ViewOrder>
            </Stack>
        </Stack>
    )
}

const Receipt = ({ order }) => {
    const [sendReceiptLoading, setSendReceiptLoading] = useState(false)
    const user_email = useSelector(({ user }) => user.user.email)
    const theme = useTheme()

    const sendReceiptViaEmail = async () => {
        setSendReceiptLoading(true)

        try {
            await axios.post(
                send_receipt_via_email_api + order.payment_info.id,
                {},
                { withCredentials: true }
            )
            toast.success('The receipt was sent to ' + user_email + ' successfully!')
        } catch (error) {
            let errorObject = axiosErrorHandler(error)
            toast.error(errorObject.message)
        }

        setSendReceiptLoading(false)
    }

    return (
        <Stack
            justifyContent='center'
            alignItems='center'
            width='30%'
            minWidth="300px"
        >
            <Stack
                flexDirection="row"
                padding='5px'
                bgcolor='black'
                borderRadius='50%'
                width='60px'
                height='60px'
            >
                <ReceiptIcon sx={{ fontSize: '3em', color: 'white', margin: 'auto' }} />
            </Stack>
            <Typography
                textAlign='center'
                columnGap='5px'
                marginTop='10px'
                paddingLeft='10px'
                fontFamily={theme.fontFamily.nunito}
                fontSize='0.8em'
                width='80%'
            >
                Get A Receipt For Your Order.
            </Typography>
            <Option onClick={sendReceiptViaEmail}>
                {
                    sendReceiptLoading ?
                        <CircularProgress
                            sx={{ color: 'black', padding: '3px' }}
                            thickness={6}
                            size={19}
                        />
                        :
                        <>
                            <EmailIcon />
                            <span>Send A Receipt Via Email</span>
                        </>
                }
            </Option>
            <DownloadOption
                fileName="VCNShop-Receipt.pdf"
                document={
                    <PDFReceipt
                        items={order.items_of_order}
                        systemEmail={project_info.email}
                        website={project_info.website}
                        receiverInfo={order.user}
                        deliveryInfo={order.shipping_info}
                        totalToPay={order.total_to_pay}
                        taxFee={order.tax_fee}
                        shippingFee={order.shipping_fee}
                        paymentInfo={order.payment_info}
                        dateOfPayment={order.createdAt}
                    />
                }
            >
                <FileDownloadIcon />
                <span>Download A Receipt</span>
            </DownloadOption>
        </Stack>
    )
}

const Success = () => {
    const { order } = useSelector(({ order_for_user }) => order_for_user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const query_value_getter = useGetQueryValue()
    const theme = useTheme()

    useEffect(() => {
        let paymentId = query_value_getter(undefined, 'payment_intent')

        if (!paymentId) {
            navigate(-1)
        } else {
            dispatch(getOrder(paymentId))
        }
    }, [dispatch])

    return (
        <Box
            component="div"
            id="SuccessfulPayment"
            margin="20px 0"
        >
            <Stack
                alignItems='center'
                rowGap='10px'
                bgcolor='black'
                padding='15px'
            >
                <CheckCircleIcon sx={{ fontSize: '3em', color: 'white' }} />
                <Typography
                    fontFamily={theme.fontFamily.kanit}
                    margin='0'
                    color='white'
                >
                    Yay! Order Successfully Placed
                </Typography>
            </Stack>

            {
                order ?
                    <Details>
                        <Summary order={order} />

                        <Thanking />

                        <Receipt order={order} />
                    </Details>
                    :
                    <Stack flexDirection="row" columnGap="20px" width="100%" padding="15px 0" marginTop="10px">
                        <Loading animation="wave" />
                        <Loading animation="wave" />
                        <Loading animation="wave" />
                    </Stack>
            }
        </Box >
    )
}

export default Success

const style_of_option = {
    display: 'flex',
    columnGap: '5px',
    alignItems: 'center',
    padding: '5px 10px',
    backgroundColor: 'white',
    boxShadow: '3px 3px 0px gray',
    borderRadius: '5px',
    cursor: 'pointer',
    border: '1px gray solid',
    position: 'relative',
    marginTop: '15px',
    color: 'black',
    fontFamily: '"Gill Sans", sans-serif',
    textDecoration: 'unset',
    fontSize: '0.8em',
    '&:hover': {
        backgroundColor: 'rgb(0 0 0)',
        color: 'white',
        '& svg': {
            color: 'white',
        }
    },
    '&:active': {
        top: '3px',
        left: '3px',
        boxShadow: 'none',
    },
}

const Details = styled('div')(({ theme }) => ({
    display: 'flex',
    marginTop: '30px',
    rowGap: '30px',
    justifyContent: 'center',
    columnGap: '30px',
    flexWrap:'wrap'
}))

const Option = styled('button')({
    ...style_of_option,
})

const DownloadOption = styled(PDFDownloadLink)({
    ...style_of_option,
})

const TruckAnimation = styled('img')(({ theme }) => ({
    position: 'relative',
    zIndex: '3',
    height: '80px',
    animation: 'car_jump 3s infinite linear',
    '@keyframes car_jump': {
        '0%': { top: '3px', },
        '10%': { top: '0', },
        '20%': { top: '3px', },
        '30%': { top: '0', },
        '40%': { top: '3px', },
        '50%': { top: '0', },
        '60%': { top: '3px', },
        '70%': { top: '0', },
        '80%': { top: '3px', },
        '90%': { top: '0', },
        '100%': { top: '3px', },
    },
}))

const ThankText = styled('p')(({ theme }) => ({
    margin: '0',
    fontFamily: 'inherit',
    width: '80%',
    textAlign: 'center',
}))

const Button = styled('a')(({ theme }) => ({
    textDecoration: 'unset',
    color: 'black',
    fontFamily: '"Gill Sans", sans-serif',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    '&:hover': {
        outline: '2px black solid',
    },
    '&:active': {
        outline: 'none',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '0.8em',
    }
}))

const ContinueShopping = styled(Button)({
    color: 'white',
    backgroundColor: 'black',
})

const ViewOrder = styled(Button)({
    boxShadow: '0px 0px 3px gray',
    backgroundColor: 'white',
})

const Loading = styled(Skeleton)({
    width: '100%',
    height: '400px',
    transform: 'scale(1)',
})