import React, { startTransition, useEffect, useMemo, useState } from "react"
import { styled } from '@mui/material/styles'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Dashboard from "../components/admin/dashboard"
import { Box, Skeleton, Stack, Typography } from "@mui/material"
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AllInboxIcon from '@mui/icons-material/AllInbox'
import Products from "../components/admin/products"
import InfoIcon from '@mui/icons-material/Info'
import {
    getOrdersByAdmin,
    getShopsByAdmin,
    getProductsByAdmin,
    getUsersByAdmin,
} from '../store/actions/admin_actions'

const style_for_icons = {
    is_active: {
        color: 'black',
    },
    non_active: {
        color: 'white',
    }
}

const tabs = {
    dashboard: 'Dashboard',
    products: 'Products',
}

const nav_options = [
    {
        label: tabs.dashboard,
        icon: (is_active) => <DashboardIcon sx={is_active ? style_for_icons.is_active : style_for_icons.non_active} />,
    }, {
        label: tabs.products,
        icon: (is_active) => <AllInboxIcon sx={is_active ? style_for_icons.is_active : style_for_icons.non_active} />,
    },
]

const PageTitle = () => (
    <Box
        display='flex'
        alignItems='center'
        columnGap='10px'
        borderBottom='2px black solid'
        paddingLeft='10px'
    >
        <AdminPanelSettingsIcon sx={{ fontSize: '1.8em' }} />
        <Typography
            component='h2'
            margin='0'
            fontSize='1.8em'
        >
            Admin
        </Typography>
    </Box>
)

const Admin = () => {
    const [users, setUsers] = useState(null)
    const [shops, setShops] = useState(null)
    const [orders, setOrders] = useState(null)
    const [products, setpProducts] = useState(null)
    const [error, setError] = useState(null)

    const init_data = async () => {
        try {
            let users = await getUsersByAdmin('createdAt', 'active')
            setUsers(users)

            let orders = await getOrdersByAdmin('createdAt', 'payment_status')
            setOrders(orders)

            let products = await getProductsByAdmin('createdAt', 'stock', 'review.count_reviews', 'target_gender')
            setpProducts(products)

            let shops = await getShopsByAdmin('createdAt')
            setShops(shops)
        } catch (error) {
            setError(error)
        }
    }

    useEffect(() => {
        init_data()
    }, [])

    const [button, setButton] = useState(nav_options[0].label)

    const switchButton = (label_of_button) => {
        if (label_of_button === button) return

        startTransition(() => {
            setButton(label_of_button)
        })
    }

    if (error)
        return (
            <Error>
                {error.message}
            </Error>
        )

    return (
        <AdminPageSection
            id="AdminPageSection"
            className="responsive_up"
        >
            <PageTitle />

            <Box
                display='flex'
                columnGap='30px'
                marginTop='30px'
                boxSizing='border-box'
            >
                <Navigation component="div">
                    <NavigationLabel>
                        {button}
                    </NavigationLabel>

                    {
                        nav_options.map(({ label, icon }) => (
                            <NavBtnWrapper
                                key={label}
                                sx={button === label ? { backgroundColor: 'white', color: 'black' } : { backgroundColor: 'rgb(53,53,59)' }}
                            >
                                <NavButton onClick={() => switchButton(label)}>
                                    <ListItemIcon>
                                        {icon(button === label)}
                                    </ListItemIcon>
                                    <ListItemText primary={label} />
                                </NavButton>
                            </NavBtnWrapper>
                        ))
                    }
                </Navigation>

                {
                    users && orders && products && shops ?
                        button === tabs.dashboard ? (
                            <Dashboard
                                users={users}
                                orders={orders}
                                products={products}
                                shops={shops}
                            />
                        ) : button === tabs.products && (
                            <Products products={products} />
                        ) :
                        <Stack width="100%" boxSizing="border-box">
                            <Loading sx={{ height: '100px' }} />
                            <Loading sx={{ height: '380px', marginTop: '20px' }} />
                        </Stack>
                }
            </Box>
        </AdminPageSection>
    )
}

const ResponsiveAdmin = () => {
    return (
        <ResponsiveAdminWrapper>

            <Admin />

            <AdminPageSection
                id="AdminPageSection"
                className="responsive_down"
            >
                <PageTitle />

                <Stack
                    width="100%"
                    padding="10px"
                    boxSizing="border-box"
                    alignItems="center"
                >
                    <Typography
                        fontSize="1.2em"
                        fontWeight="bold"
                        marginTop="30px"
                        width="fit-content"
                    >
                        <InfoIcon sx={{ float: 'left', paddingRight: '10px' }} />
                        You can't access this page on mobile devices.
                        Let's try to change your device or set the size of browser's screen to be bigger.
                    </Typography>
                </Stack>
            </AdminPageSection>

        </ResponsiveAdminWrapper>
    )
}

export default ResponsiveAdmin

const ResponsiveAdminWrapper = styled('div')(({ theme }) => ({
    '& .responsive_up': {
        display: 'none',
        [theme.breakpoints.up('lg')]: {
            display: 'block',
        }
    },
    '& .responsive_down': {
        display: 'none',
        [theme.breakpoints.down('lg')]: {
            display: 'block',
        }
    }
}))

const Error = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.nunito,
    padding: '20px',
    width: '100%',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
    marginTop: '20px',
}))

const AdminPageSection = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.arial,
    padding: '30px 40px',
}))

const Navigation = styled(List)({
    width: '25%',
    padding: '30px 20px',
    backgroundColor: 'rgb(53,53,59)',
    color: 'white',
    borderRadius: '5px',
})

const NavigationLabel = styled('h2')({
    margin: '0',
    fontSize: '1.5em',
    fontWeight: 'bold',
    borderBottom: '2px lightgrey solid',
    borderRadius: '10px',
    padding: '15px 0 30px',
    textAlign: 'center',
    marginBottom: '20px',
})

const NavBtnWrapper = styled('div')({
    marginTop: '10px',
    borderRadius: '5px',
    border: '1px lightgrey solid',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.1)',
    },
})

const NavButton = styled(ListItemButton)({
    '& .MuiListItemIcon-root': {
        minWidth: '40px',
    },
})

const Loading = styled(Skeleton)({
    transform: 'none',
    width: '100%',
})