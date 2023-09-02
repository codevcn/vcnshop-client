import React from "react"
import Badge from '@mui/material/Badge'
import { Stack, styled, Typography, Box, Tooltip } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import foxLogoWhite from '../../../assets/images/logo_app_black.svg'
import MenuBar from "./menu_bar"
import Search from "./search"
import { useSelector } from "react-redux"
import UserNav from "./user_nav"
import { NavLink } from "react-router-dom"
import { useTheme } from "@emotion/react"
import ChangeLanguageBtn from "../../change_language_btn"
import { useTranslation } from "react-i18next"
import NavMenu from "./drawer_menu"
import MediaQuery from "../../../utils/media_query"

const SearchSection = ({ theme }) => {

    return (
        <SearchContainer>

            <MediaQuery minWidth={theme.breakpoints.values.md} isRender={true}>
                <ChangeLanguageBtn />
            </MediaQuery>

            <Search />

        </SearchContainer>
    )
}

const LogoSection = () => {
    const { t } = useTranslation('home_page')

    return (
        <Stack
            alignItems="center"
            rowGap="5px"
            padding="10px 0"
            component="a"
            href="/"
            sx={{ textDecoration: 'none', color: 'black' }}
            margin="auto"
        >

            <Logo src={foxLogoWhite} alt="App Logo" />

            <Stack alignItems="center" marginTop="5px">
                <HeadingTitle>
                    VCN SHOP - FOX COR
                </HeadingTitle>
                <SubHeadingTitle>
                    {t('Shopping Too Easy')}
                </SubHeadingTitle>
            </Stack>

        </Stack>
    )
}

const AuthSection = ({ theme }) => {
    const numberOfCartItems = useSelector(({ cart }) => cart.cartItems.length)
    const { t } = useTranslation('home_page')

    return (
        <AuthContainer>

            <Box>
                <MediaQuery minWidth={theme.breakpoints.values.md} isRender={true}>
                    <UserNav />
                </MediaQuery>

                <MediaQuery minWidth={theme.breakpoints.values.md}>
                    <NavMenu />
                </MediaQuery>
            </Box>

            <CartBtn to="/cart">
                <Tooltip title={t("Cart")}>
                    <StyledBadge
                        badgeContent={numberOfCartItems}
                        color="default"
                        showZero
                    >
                        <ShoppingCartIcon sx={{ fill: 'black' }} />
                    </StyledBadge>
                </Tooltip>
            </CartBtn>

        </AuthContainer>
    )
}

const Navigation = () => {
    const theme = useTheme()

    return (
        <Box
            component="div"
            id="Navigation-Header"
        >

            <Stack
                flexDirection="row"
                padding="10px 30px"
                position="relative"
            >

                <SearchSection theme={theme} />

                <LogoSection />

                <AuthSection theme={theme} />

            </Stack>

            <MediaQuery minWidth={theme.breakpoints.values.md} isRender={true}>
                <MenuBar />
            </MediaQuery>

        </Box>
    )
}

export default Navigation

const SearchContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: "center",
    minHeight: "100%",
    fontFamily: theme.fontFamily.nunito,
    position: "absolute",
    top: "0",
    left: "30px",
    columnGap: "20px",
    [theme.breakpoints.down('md')]: {
        left: "10px",
    },
}))

const Logo = styled('img')(({ theme }) => ({
    height: '5em',
    width: '5em',
    cursor: 'pointer',
    color: 'white',
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}))

const HeadingTitle = styled(Typography)(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    lineHeight: "1em",
    fontSize: "1.3em",
    fontWeight: "bold",
    [theme.breakpoints.down('md')]: {
        fontSize: "1em",
    },
}))

const SubHeadingTitle = styled(Typography)(({ theme }) => ({
    letterSpacing: "1px",
    marginTop: "3px",
    cursor: 'pointer',
    wordSpacing: '3px',
    [theme.breakpoints.down('md')]: {
        fontSize: "0.8em",
    },
}))

const CartBtn = styled(NavLink)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        display: "none",
    },
}))

const StyledBadge = styled(Badge)({
    cursor: 'pointer',
    color: 'black',
    ' span.MuiBadge-anchorOriginTopRight': {
        backgroundColor: '#3FACB1'
    },
    '& svg': {
        transition: 'transform 0.2s',
    },
    '&:hover svg': {
        transform: 'scale(1.2)',
    },
})

const AuthContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: "center",
    columnGap: "20px",
    position: "absolute",
    minHeight: "100%",
    top: "0",
    right: "30px",
    [theme.breakpoints.down('md')]: {
        right: "10px",
    },
}))