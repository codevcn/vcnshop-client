import React, { useEffect } from "react"
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from "react-redux"
import { getShop } from "../store/actions/shop_actions"
import RegisterShop from "../components/my_store/register_store"
import { Skeleton, Stack, Box } from "@mui/material"
import Avatar from '@mui/material/Avatar'
import PhoneIcon from '@mui/icons-material/Phone'
import StoreIcon from '@mui/icons-material/Store'
import Products from "../components/my_store/products"
import ScrollToTopBtn from "../components/scroll_to_top_btn"
import { useNavigate, Route, Routes } from "react-router-dom"
import { useCurrentRoute } from "../hooks/custom_hooks"
import ErrorIcon from '@mui/icons-material/Error'
import Orders from '../components/my_store/orders'
import ProductDetail from '../components/my_store/product_detail'
import OrderDetail from '../components/my_store/order_detail'

const GreetingSection = ({ greeting }) => {
    return (
        <Greeting>
            {greeting}
        </Greeting>
    )
}

const StoreInfo = ({ store }) => {
    return (
        <Stack
            bgcolor="rgba(0,0,0,0.05)"
            width="100%"
            justifyContent="center"
            alignItems="center"
            padding="30px"
            marginTop="30px"
            boxSizing="border-box"
            borderRadius="10px"
        >
            <Stack>
                {
                    store.avatar ?
                        <StyledAvatar src={store.avatar} alt="Shop Avatar" />
                        :
                        <StyledAvatar>{store.name[0]}</StyledAvatar>
                }
                <div style={{ margin: '15px auto', fontSize: '1.2em' }}>
                    {store.name}
                </div>
            </Stack>

            <Stack columnGap="5px" alignItems="center" fontSize="0.8em" color="gray" flexDirection="row">
                <PhoneIcon sx={{ fontSize: '1.2em' }} />
                <span>{store.contact_info.phone}</span>
            </Stack>
        </Stack>
    )
}

const Navigation = () => {
    const navigate = useNavigate()
    const current_route = useCurrentRoute()

    const switchNav = (href) => {
        navigate('/myStore/' + href)
    }

    const NavButton = ({ navText, href }) => (
        <NavBtn
            onClick={() => switchNav(href)}
            sx={current_route.includes(href) ? { backgroundColor: 'black', color: 'white' } : {}}
        >
            {navText}
        </NavBtn>
    )

    return (
        <NavigationSection>
            <NavButton navText={'Products'} href={'Products'} />
            <NavButton navText={'Greeting'} href={'Greeting'} />
            <NavButton navText={'Orders'} href={'Orders'} />
        </NavigationSection>
    )
}

const MyStore = () => {
    const { shop, loading, error, checkShopIsExist } = useSelector(({ shop }) => shop)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!checkShopIsExist)
            dispatch(getShop())
    }, [dispatch])

    return (
        <div>
            {
                loading ? (
                    <Box padding='30px'>
                        <Loading sx={{ height: '50px' }} />
                        <Loading sx={{ height: '300px' }} />
                        <Loading sx={{ height: '50px' }} />
                    </Box>
                ) : error && error.statusCode !== 404 ? (
                    <Error>
                        {error.message}
                    </Error>
                ) : !checkShopIsExist ? (
                    <RegisterShop />
                ) : shop && (
                    <MyStoreSection
                        id="MyStoreSection"
                    >

                        <PageTitle>
                            <StoreIcon sx={{ width: '1.4em', height: '1.4em' }} />
                            <span>Store</span>
                        </PageTitle>

                        <StoreInfo store={shop} />

                        <Navigation />

                        <Note>
                            <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                            <span>Now select one tab above to view</span>
                        </Note>

                        <Main>
                            <Routes>
                                <Route path="/Products" element={<Products />} />
                                <Route path="/Product/:productId" element={<ProductDetail />} />
                                <Route path="/Greeting" element={<GreetingSection greeting={shop.greeting} />} />
                                <Route path="/Orders" element={<Orders />} />
                                <Route path="/Order/:orderId" element={<OrderDetail />} />
                            </Routes>
                        </Main>

                    </MyStoreSection>
                )
            }

            <ScrollToTopBtn />
        </div>
    )
}

export default MyStore

const MyStoreSection = styled('div')(({ theme }) => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "50px 30px",
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('sm')]: {
        padding: '50px 15px',
    }
}))

const Loading = styled(Skeleton)({
    marginTop: '20px',
    transform: 'none',
})

const PageTitle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    boxSizing: 'border-box',
    width: '100%',
    borderBottom: '2px black solid',
    margin: '0',
    fontSize: '1.8em',
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.5em',
    }
}))

const StyledAvatar = styled(Avatar)({
    width: '150px',
    height: '150px',
    backgroundColor: 'black',
    color: 'white',
    border: '2px white solid',
})

const NavigationSection = styled('div')(({ theme }) => ({
    display: 'flex',
    marginTop: "20px",
    width: "100%",
    [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap',
        rowGap: '5px',
    }
}))

const NavBtn = styled('button')(({ theme }) => ({
    fontWeight: 'bold',
    border: '2px black solid',
    backgroundColor: 'black',
    color: 'white',
    padding: '10px 30px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'transform 0.2s ease',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
        transform: 'scale(1.1)',
    },
    [theme.breakpoints.down('sm')]: {
        marginRight: '5px',
    }
}))

const Note = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginTop: '10px',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '0.8em',
})

const Main = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.nunito,
    padding: '30px 30px 0',
    width: '100%',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        padding: '30px 5px 0',
    },
}))

const Greeting = styled('div')({
    padding: '10px 30px',
    borderLeft: '1px lightgrey solid',
    borderRight: '1px lightgrey solid',
    whiteSpace: 'pre-line',
    width: '100%',
    boxSizing: 'border-box',
})

const Error = styled('div')(({ theme }) => ({
    color: 'red',
    fontWeight: 'bold',
    fontSize: '1.3em',
    width: '100%',
    textAlign: 'center',
    marginTop: '30px',
    fontFamily: theme.fontFamily.nunito,
}))