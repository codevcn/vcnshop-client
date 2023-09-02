import React, { useState } from "react"
import { styled } from '@mui/material/styles'
import { Box, IconButton, Stack, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import { NavLink } from "react-router-dom"
import UserNav from "./user_nav"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ChangeLanguageBtn from "../../change_language_btn"

const navs = [
    {
        label: 'Home',
        action: '/#'
    }, {
        label: 'Coupon',
        action: '/'
    }, {
        label: 'My Wishlist',
        action: '/'
    }, {
        label: 'Cart',
        action: '/cart'
    }, {
        label: 'FAQ',
        action: '/faq'
    },
]

const NavMenu = () => {
    const [open, setOpen] = useState()

    const toggleDrawer = (open) => {
        setOpen(open)
    }

    const Navs = () => (
        <Stack
            alignItems="center"
            rowGap="15px"
        >

            {
                navs.map(({ label, action }) => (
                    <NavBtn
                        to={action}
                        key={label}
                        onClick={() => toggleDrawer(false)}
                    >
                        <Typography
                            fontSize="1em"
                        >
                            {label}
                        </Typography>
                    </NavBtn>
                ))
            }

            <UserNav />

            <ChangeLanguageBtn />

            <IconButton onClick={() => toggleDrawer(false)}>
                <ArrowForwardIcon sx={{ color: 'white' }} />
            </IconButton>
        </Stack>
    )

    return (
        <Box>
            <IconButton onClick={() => toggleDrawer(true)}>
                <MenuIcon />
            </IconButton>
            <StyledDrawer
                anchor="right"
                open={open}
                onClose={() => toggleDrawer(false)}
            >
                <Box
                    padding="20px"
                    width="50vw"
                    boxSizing="border-box"
                >
                    <Navs />
                </Box>
            </StyledDrawer>
        </Box>
    )
}

export default NavMenu

const NavBtn = styled(NavLink)({
    textDecoration: 'none',
    color: 'white',
    padding: '0 10px',
    boxSizing: 'border-box',
    '&:active': {
        color: 'yellow',
    }
})

const StyledDrawer = styled(Drawer)({
    '& .MuiPaper-root': {
        backgroundColor: 'black',
    }
})