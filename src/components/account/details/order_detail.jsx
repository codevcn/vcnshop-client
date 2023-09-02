import React, { useEffect } from "react"
import { styled } from '@mui/material/styles'
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getOrder } from "../../../store/actions/order_actions"
import { Skeleton, Typography } from "@mui/material"
import Tooltip from '@mui/material/Tooltip'
import OrderStatus from "./order_status"
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PublicIcon from '@mui/icons-material/Public'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import PlaceIcon from '@mui/icons-material/Place'
import HomeIcon from '@mui/icons-material/Home'
import ErrorIcon from '@mui/icons-material/Error'
import moment from "moment"
import { Stack, Box } from '@mui/material'

const format_date = (time_string) => {
    return moment(time_string).format('MMMM Do YYYY, h:mm a')
}

const OrderId = ({ paymentId, createdAt }) => {
    return (
        <IDTitle>
            <span>Order </span>
            <span className="hightlight">{'#' + paymentId}</span>
            <CreatedAt>{format_date(createdAt)}</CreatedAt>
        </IDTitle>
    )
}

const OrderItems = ({ items }) => {
    const navigate = useNavigate()
    const viewProduct = (proudtc_id) => navigate('/productDetail/' + proudtc_id)

    return (
        <OrderItemsSection>
            {
                items.map(({ _id, name, price, quantity, image_link, color, size }) => (
                    <Item key={_id}>
                        <Details>
                            <Tooltip title="Click for visiting the product">
                                <Box minWidth='101px'>
                                    <Image
                                        src={image_link}
                                        onClick={() => viewProduct(_id)}
                                    />
                                </Box>
                            </Tooltip>
                            <div>
                                <OrderInfo style={{ fontWeight: 'bold', color: 'black' }}>
                                    {name}
                                </OrderInfo>
                                <OrderInfo>{'Color: ' + color}</OrderInfo>
                                <OrderInfo>{'Size: ' + size}</OrderInfo>
                                <OrderInfo>{'Qty: ' + quantity}</OrderInfo>
                            </div>
                        </Details>
                        <Price>{'$' + price}</Price>
                    </Item>
                ))
            }
        </OrderItemsSection>
    )
}

const PaymentOfItems = ({ priceOfItems, shippingFee, taxFee, totalToPay }) => {
    return (
        <PaymentItemsSection>
            <span></span>
            <div>
                <PaymentItem>
                    <Type>Subtotal</Type>
                    <div>{'$' + priceOfItems}</div>
                </PaymentItem>
                <PaymentItem>
                    <Type>Shipping</Type>
                    <div>{'$' + shippingFee}</div>
                </PaymentItem>
                <PaymentItem>
                    <Type>Tax</Type>
                    <div>{'$' + taxFee}</div>
                </PaymentItem>
                <PaymentItem sx={{ borderTop: '1px lightgrey solid', paddingTop: '10px' }}>
                    <Type>Total</Type>
                    <div>{'$' + totalToPay}</div>
                </PaymentItem>
            </div>
        </PaymentItemsSection>
    )
}

const ShippingDetails = ({ country, city, zipCode, address }) => {
    return (
        <Box
            bgcolor='white'
            padding='10px 30px 25px'
            width='100%'
            boxSizing="border-box"
        >
            <DetailsTitle>
                <LocalShippingIcon />
                <span>Shipping Details</span>
            </DetailsTitle>
            <div>
                <DetailItem icon={<PublicIcon />} text={country} />
                <DetailItem icon={<LocationCityIcon />} text={city} />
                <DetailItem icon={<PlaceIcon />} text={zipCode} />
                <DetailItem icon={<HomeIcon />} text={address} />
            </div>
        </Box>
    )
}

const DetailItem = ({ icon, text }) => (
    <DetailItemSection>
        {icon}
        {
            text ?
                <span className="main_text">{text}</span>
                :
                <Stack
                    flexDirection="row"
                    columnGap='5px'
                    alignItems='center'
                    color='#A1A1A1'
                >
                    <span>not provided</span>
                    <Tooltip title="You didn't provide this one before">
                        <ErrorIcon sx={{ fontSize: '1em' }} />
                    </Tooltip>
                </Stack>
        }
    </DetailItemSection>
)

const CustomerDetails = ({ name, email, phoneNumber, paymentMethod }) => {
    return (
        <Box
            bgcolor='white'
            padding='10px 30px 25px'
            width='100%'
            boxSizing="border-box"
            marginTop="10px"
        >
            <DetailsTitle>
                <PersonIcon />
                <span>Customer Details</span>
            </DetailsTitle>
            <div>
                {
                    name &&
                    <DetailItem icon={<PersonIcon />} text={name} />
                }
                <DetailItem icon={<EmailIcon />} text={email} />
                <DetailItem icon={<PhoneIcon />} text={phoneNumber ? '+' + phoneNumber : null} />
                <DetailItem icon={<CreditCardIcon />} text={'paid on ' + paymentMethod} />
            </div>
        </Box>
    )
}

const OrderDetail = () => {
    const { order, loading, error } = useSelector(({ order_for_user }) => order_for_user)
    const dispatch = useDispatch()
    const { orderId } = useParams()

    useEffect(() => {
        dispatch(getOrder(null, orderId))
    }, [dispatch])

    return (
        <OrderDetailSection id="OrderDetailSection">
            <TitleSection>Order Details</TitleSection>
            <HelperText>Thanks for your order! Check out the details below</HelperText>

            <Box marginTop="30px"></Box>

            {
                loading ? (
                    <Skeleton sx={{ transform: 'unset', height: '400px' }} />
                ) : error ? (
                    <Error>{error.message}</Error>
                ) : order && order._id &&
                <div>

                    <OrderId
                        paymentId={order.payment_info.id}
                        createdAt={order.createdAt}
                    />

                    <ItemsAndStatus>

                        <OrderedItemsContainer>
                            <OrderedItemsTitle>Ordered Items</OrderedItemsTitle>

                            <OrderItems
                                items={order.items_of_order}
                            />

                            <PaymentOfItems
                                priceOfItems={order.price_of_items}
                                shippingFee={order.shipping_fee}
                                taxFee={order.tax_fee}
                                totalToPay={order.total_to_pay}
                            />
                        </OrderedItemsContainer>

                        <OrderStatus status={order.order_status} />

                    </ItemsAndStatus>

                    <ShippingAndCustomer>

                        <ShippingDetails
                            country={order.shipping_info.country}
                            city={order.shipping_info.city}
                            zipCode={order.shipping_info.zip_code}
                            address={order.shipping_info.address}
                        />

                        <CustomerDetails
                            name={order.user.name}
                            email={order.user.email}
                            phoneNumber={order.shipping_info.phone_number}
                            paymentMethod={order.payment_info.method}
                        />

                    </ShippingAndCustomer>

                </div>
            }
        </OrderDetailSection>
    )
}

export default OrderDetail

const OrderDetailSection = styled('div')(({ theme }) => ({
    padding: '20px 30px 40px',
    backgroundColor: '#F5F5F5',
    [theme.breakpoints.down('sm')]: {
        padding: '20px 10px 40px',
    }
}))

const TitleSection = styled(Typography)(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    margin: '10px 0',
    fontSize: '2.2em',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
}))

const HelperText = styled('p')(({ theme }) => ({
    margin: '0',
    fontSize: '0.9em',
    textAlign: 'center',
    fontFamily: theme.fontFamily.kanit,
    '& span.dot_required': {
        display: 'inline-block',
        color: 'red',
        fontSize: '1em',
        transform: 'scale(1.2)',
    },
}))

const IDTitle = styled('h2')(({ theme }) => ({
    margin: '0',
    fontFamily: theme.fontFamily.kanit,
    fontWeight: 'normal',
    fontSize: '1.1em',
    padding: '10px 20px',
    backgroundColor: 'white',
    wordBreak: 'break-word',
    '& .hightlight': {
        color: '#439093',
    },
}))

const CreatedAt = styled('div')({
    fontSize: '0.8em',
    color: 'gray',
})

const ItemsAndStatus = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: "20px",
    marginTop: "25px",
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        columnGap: "0",
    }
}))

const OrderedItemsContainer = styled('div')(({ theme }) => ({
    backgroundColor: 'white',
    width: '100%',
    padding: '30px',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
        padding: '20px 10px',
    }
}))

const OrderedItemsTitle = styled('h2')(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    padding: '0 20px',
    margin: '0',
}))

const OrderItemsSection = styled('div')({
    border: '1px lightgrey solid',
    borderLeft: 'none',
    borderRight: 'none',
    padding: '20px 0 30px',
    marginTop: '15px',
})

const Item = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px',
    boxShadow: '0px 0px 1px gray',
    padding: '20px',
    transition: 'transform 0.2s, border-color 0.2s',
    border: '2px white solid',
    backgroundColor: 'white',
    columnGap: '10px',
    '&:hover': {
        transform: 'scale(1.05)',
        borderColor: 'black',
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    }
}))

const Image = styled('img')(({ theme }) => ({
    maxWidth: '100px',
    height: '100px',
    boxShadow: '0px 0px 3px gray',
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
        maxWidth: '100px',
    }
}))

const Details = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    fontSize: '0.9em',
    display: 'flex',
    columnGap: '15px',
}))

const OrderInfo = styled('p')({
    margin: '0',
    marginTop: '3px',
    color: 'gray',
})

const Price = styled('p')(({ theme }) => ({
    fontSize: '1.5em',
    fontFamily: theme.fontFamily.kanit,
    margin: '0',
    marginTop: '15px',
}))

const PaymentItemsSection = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 20px',
})

const PaymentItem = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '25px',
    justifyContent: 'space-between',
    fontFamily: theme.fontFamily.kanit,
    marginTop: '15px',
}))

const Type = styled('h4')({
    color: 'gray',
    margin: '0',
})

const DetailsTitle = styled('h2')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    fontFamily: theme.fontFamily.kanit,
    fontSize: '1.2em',
    padding: '0 10px 15px',
    borderBottom: '1px lightgrey solid',
}))

const DetailItemSection = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '20px',
    marginTop: '20px',
    fontFamily: theme.fontFamily.kanit,
    paddingLeft: '10px',
    '& span.main_text': {
        wordBreak: 'break-word',
    }
}))

const Error = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    color: 'red',
    padding: '20px',
    textAlign: 'center',
}))

const ShippingAndCustomer = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: "20px",
    justifyContent: "space-between",
    marginTop: "30px",
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    }
}))