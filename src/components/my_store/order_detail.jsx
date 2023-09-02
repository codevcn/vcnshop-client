import React, { useEffect } from "react"
import { styled } from '@mui/material/styles'
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getOrderDetailForShop } from "../../store/actions/order_actions"
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PaidIcon from '@mui/icons-material/Paid'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ErrorIcon from '@mui/icons-material/Error'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import { Avatar, Typography, Tooltip, Skeleton, StepConnector, stepConnectorClasses, Box, useMediaQuery } from "@mui/material"
import PublicIcon from '@mui/icons-material/Public'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import PlaceIcon from '@mui/icons-material/Place'
import HomeIcon from '@mui/icons-material/Home'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import InfoIcon from '@mui/icons-material/Info'

const icon_style = { fontSize: '1.8em', color: 'white' }

const steps = [
    {
        label: 'Order Placed',
        description: '',
        icon: <PaidIcon sx={icon_style} />,
    }, {
        label: 'Packed',
        description: '',
        icon: <InventoryIcon sx={icon_style} />
    }, {
        label: 'Delivering',
        description: '',
        icon: <LocalShippingIcon sx={icon_style} />
    }, {
        label: 'Deliveried',
        description: '',
        icon: <CheckCircleIcon sx={icon_style} />
    }
]

const RenderStepIcon = ({ active, completed, error, }, icon_component) => {
    return (
        <StepIconWrapper theme={{ active, completed, error }}>
            {icon_component}
        </StepIconWrapper>
    )
}

const getActiveStep = (order_status) => {
    if (order_status === 'processing')
        return 1
    if (order_status === 'delivering')
        return 2
    if (order_status === 'delivered')
        return 4
}

const OrderStatus = ({ orderStatus }) => {
    const matches_from_sm = useMediaQuery(theme => theme.breakpoints.up('sm'))

    return (
        <Box
            width="100%"
            marginTop="20px"
        >
            <Title>Order Status</Title>

            <Box
                padding='25px 20px'
                width='100%'
                boxSizing='border-box'
                backgroundColor='#F5F5F5'
            >
                <Stepper
                    activeStep={getActiveStep(orderStatus)}
                    alternativeLabel={matches_from_sm ? true : false}
                    orientation={matches_from_sm ? "horizontal" : "vertical"}
                    connector={<ColorlibConnector />}
                >
                    {
                        steps.map(({ label, icon }) => (
                            <Step key={label}>
                                <StyledStepLabel StepIconComponent={(state) => RenderStepIcon(state, icon)}>
                                    <CheckCircleIcon
                                        className="completed_icon"
                                        sx={{ marginRight: '5px', fontSize: '1.2em' }}
                                    />
                                    <span>{label}</span>
                                </StyledStepLabel>
                            </Step>
                        ))
                    }
                </Stepper>
            </Box>
        </Box>
    )
}

const get_total_price = (items) => {
    return items.reduce((accumulator, { price, quantity }) => {
        return (accumulator + (price * quantity)).toFixed(2) * 1
    }, 0)
}

const TotalPrice = ({ totalPrice }) => {
    return (
        <Box
            display='flex'
            columnGap='25px'
            justifyContent='space-between'
            marginTop='20px'
            borderTop='1px lightgrey solid'
            paddingTop='10px'
            fontSize='1.3em'
        >
            <span></span>

            <Box
                display='flex'
                columnGap='20px'
                alignItems="center"
            >
                <Typography
                    color="gray"
                    fontSize="1em"
                >
                    Total:
                </Typography>

                <Typography
                    fontSize="1em"
                >
                    {'$' + totalPrice}
                </Typography>
            </Box>
        </Box>
    )
}

const Items = ({ items }) => (
    <ItemsSection>
        <Title>Items</Title>

        <Box
            padding='25px 20px'
            width='100%'
            boxSizing='border-box'
            backgroundColor='#F5F5F5'
        >
            <div>
                {
                    items.map(({ _id, name, price, quantity, image_link, color, size }) => (
                        <Item key={_id}>
                            <Details>
                                <Box minWidth='101px'>
                                    <Image src={image_link} />
                                </Box>
                                <div>
                                    <ItemDetail sx={{ fontWeight: 'bold', color: 'black' }}>
                                        {name}
                                    </ItemDetail>
                                    <ItemDetail>{'Color: ' + color}</ItemDetail>
                                    <ItemDetail>{'Size: ' + size}</ItemDetail>
                                    <ItemDetail>{'Qty: ' + quantity}</ItemDetail>
                                </div>
                            </Details>
                            <Price>{'$' + price}</Price>
                        </Item>
                    ))
                }
            </div>

            <TotalPrice totalPrice={get_total_price(items)} />
        </Box>
    </ItemsSection>
)

const Detail = ({ icon, text }) => (
    <Box
        display='flex'
        alignItems='center'
        columnGap='20px'
        fontFamily="inherit"
        paddingLeft='10px'
    >
        {icon}
        {
            text ?
                <span>{text}</span>
                :
                <Typography
                    display='flex'
                    columnGap='5px'
                    alignItems='center'
                    color='#A1A1A1'
                >
                    <span>not provided</span>
                    <Tooltip
                        title="The customer didn't provide this one before"
                        placement="right"
                    >
                        <ErrorIcon sx={{ fontSize: '1em' }} />
                    </Tooltip>
                </Typography>
        }
    </Box>
)

const CustomerInfo = ({ userInfo, shippingInfo, paymentInfo }) => (
    <Box
        width="100%"
    >
        <Title>Customer Info</Title>

        <Box
            padding='25px 20px'
            width='100%'
            boxSizing='border-box'
            backgroundColor='#F5F5F5'
        >
            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                rowGap='20px'
            >
                <Tooltip title="Avatar Of Customer" placement="right">
                    <CustomerAvatar src={userInfo.avatar} />
                </Tooltip>
                {
                    userInfo.name &&
                    <Detail icon={<PersonIcon />} text={userInfo.name} />
                }
                {<Detail icon={<EmailIcon />} text={userInfo.email} />}
                {<Detail icon={<PhoneIcon />} text={shippingInfo.phone_number ? '+' + shippingInfo.phone_number : null} />}
                {<Detail icon={<CreditCardIcon />} text={paymentInfo.method !== 'none' ? 'Paid On ' + paymentInfo.method : 'Unpaid'} />}
            </Box>
        </Box>
    </Box>
)

const ShippingInfo = ({ shippingInfo }) => (
    <Box
        width="100%"
        marginTop="5px"
    >
        <Title>Shipping Info</Title>

        <Box
            padding='25px 20px'
            width='100%'
            boxSizing='border-box'
            backgroundColor='#F5F5F5'
        >
            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                rowGap='20px'
            >
                <Detail icon={<PublicIcon />} text={shippingInfo.country} />
                <Detail icon={<LocationCityIcon />} text={shippingInfo.city} />
                <Detail icon={<PlaceIcon />} text={shippingInfo.zip_code} />
                <Detail icon={<HomeIcon />} text={shippingInfo.address} />
            </Box>
        </Box>
    </Box>
)

const OrderDetail = () => {
    const { order, loading, error } = useSelector(({ order_for_store }) => order_for_store)
    const { orderId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getOrderDetailForShop(orderId))
    }, [dispatch])

    return (
        <Box
            id="OrderDetailSection"
            marginTop="20px"
        >
            <SectionTitle>

                <Tooltip title="Back">
                    <GoBackBtn
                        onClick={() => navigate(-1)}
                    >
                        <NavigateBeforeIcon />
                        <span>Back</span>
                    </GoBackBtn>
                </Tooltip>

                <Typography
                    display="flex"
                    alignItems="center"
                    columnGap="5px"
                    fontSize="1.2em"
                    fontWeight="bold"
                >
                    <InfoIcon sx={{ fontSize: '1.3m' }} />
                    <span>Order Detail</span>
                </Typography>

            </SectionTitle>

            {
                loading ? (
                    <Skeleton sx={{ height: '500px', transform: 'scale(1)', marginTop: '20px' }} />
                ) : error ? (
                    <Error>{'error.message'}</Error>
                ) : order && order.user &&
                <div>
                    <OrderStatus orderStatus={order.order_status} />

                    <Container>
                        <Items items={order.items} />

                        <CustomerAndShipping>
                            <CustomerInfo
                                userInfo={order.user}
                                paymentInfo={order.payment_info}
                                shippingInfo={order.shipping_info}
                            />

                            <ShippingInfo
                                shippingInfo={order.shipping_info}
                            />
                        </CustomerAndShipping>
                    </Container>
                </div>
            }
        </Box>
    )
}

export default OrderDetail

const state_color = {
    active: 'black',
    completed: '#4bba7b',
    non_active: '#a1a1a1',
}

const ItemsSection = styled('div')(({ theme }) => ({
    width: "60%",
    marginTop: "0",
    [theme.breakpoints.down('md')]: {
        width: '100%',
    }
}))

const CustomerAndShipping = styled('div')(({ theme }) => ({
    width: '40%',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    }
}))

const SectionTitle = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    columnGap: '10px',
    boxSizing: 'border-box',
    width: '100%',
    margin: '0',
    fontSize: '1.3em',
    marginTop: '30px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
    }
}))

const GoBackBtn = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    backgroundColor: 'white',
    fontSize: '1em',
    position: 'absolute',
    left: '0',
    top: '0',
    cursor: 'pointer',
    '&:hover': {
        textDecoration: 'underline',
    },
    [theme.breakpoints.down('sm')]: {
        position: 'relative',
        width: '100%',
    }
}))

const Error = styled('div')(({ theme }) => ({
    color: 'red',
    width: '100%',
    textAlign: 'center',
    padding: '20px 0',
    fontSize: '1.2em',
    fontWeight: 'bold',
    fontFamily: theme.fontFamily.nunito,
}))

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    marginTop: '5px',
    columnGap: '5px',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        rowGap: '10px',
        alignItems: 'center',
    }
}))

const Item = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px',
    boxShadow: '0px 0px 1px gray',
    padding: '20px',
    transition: 'transform 0.2s, border-color 0.2s',
    border: '2px white solid',
    backgroundColor: 'white',
    flexWrap: 'wrap',
    '&:hover': {
        transform: 'scale(1.05)',
        borderColor: 'black',
    }
})

const Image = styled('img')({
    height: '100px',
    boxShadow: '0px 0px 3px gray',
})

const Details = styled('div')(({ theme }) => ({
    display: 'flex',
    fontFamily: theme.fontFamily.kanit,
    fontSize: '0.9em',
    columnGap: '15px',
    flexWrap: 'wrap',
}))

const ItemDetail = styled('p')({
    margin: '0',
    marginTop: '3px',
    color: 'gray',
})

const Price = styled('p')(({ theme }) => ({
    fontSize: '1.5em',
    fontFamily: theme.fontFamily.kanit,
}))

const Title = styled('h2')({
    margin: '0',
    backgroundColor: '#F5F5F5',
    padding: '8px',
    paddingLeft: '20px',
    fontSize: '0.9em',
    marginBottom: '5px',
    textAlign: 'center',
})

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    display: 'flex',
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: '25px',
        [theme.breakpoints.down('sm')]: {
            top: 'auto',
        }
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor: state_color.active,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor: state_color.completed,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: '5px',
        width: '100%',
        border: 'unset',
        backgroundColor: state_color.non_active,
        position: 'relative',
        zIndex: '1',
        [theme.breakpoints.down('sm')]: {
            height: 'auto',
            width: '5px',
            marginLeft: '12px',
        }
    },
}))

const StepIconWrapper = styled('div')(({ theme }) => ({
    padding: '12px 12px 7px',
    borderRadius: '50%',
    backgroundColor: (theme.completed && state_color.completed) || (theme.active && state_color.active) || state_color.non_active,
    position: 'relative',
    zIndex: '2',
}))

const StyledStepLabel = styled(StepLabel)({
    '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
        marginTop: '10px',
        color: state_color.non_active,
        '& .completed_icon': {
            display: 'none',
        },
        '&.Mui-completed': {
            color: state_color.completed,
            '& .completed_icon': {
                display: 'initial',
            }
        },
        '&.Mui-active': {
            color: state_color.active,
        },
    },
})

const CustomerAvatar = styled(Avatar)({
    width: '100px',
    height: '100px',
    boxShadow: '0px 0px 3px gray',
})