import React from "react"
import { styled } from '@mui/material/styles'
import CategoryIcon from '@mui/icons-material/Category'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import LiveHelpIcon from '@mui/icons-material/LiveHelp'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import HomeIcon from '@mui/icons-material/Home'
import { NavLink } from "react-router-dom"
import { Stack, Typography, Box } from "@mui/material"
import category_background_image from '../../../assets/images/dropdown_menu.jpg'
import { useTranslation } from "react-i18next"

const clothing_subtitles = [
    'Jacket',
    'Sweater',
    'Hoodie',
]
const shoes_subtitles = [
    'Nike',
    'Adidas',
    'Sneakers',
]
const accessories_subtitles = [
    'Glass',
    'Necklace',
]

const CategoryList = ({ title, subTitles, translator }) => {
    return (
        <Stack height="100%" marginLeft="10px" padding="10px">
            <Typography
                display="block"
                color="white"
                fontSize="1.1em"
                textAlign="center"
                padding="0 5px 5px 5px"
                margin="0"
                component="h2"
                borderBottom="2px white solid"
            >
                {title}
            </Typography>

            <Stack padding="10px" rowGap="5px" alignItems="center">
                {
                    subTitles.map((title) => (
                        <Category key={title}>
                            {translator(title)}
                        </Category>
                    ))
                }
            </Stack>
        </Stack>
    )
}

const DropdownMenu = () => {
    const { t } = useTranslation('home_page')

    return (
        <Box
            className="dropdown_menu"
            display="none"
            position="absolute"
            zIndex="10"
            left="8%"
            top="100%"
            width="80vw"
            height="300px"
            bgcolor="black"
            padding="10px"
            columnGap="10px"
            border="1px white solid"
            sx={{ cursor: 'initial' }}
        >

            <DropdownMenuImage src={category_background_image} />

            <Stack width="100%" flexDirection="row" justifyContent="space-evenly">
                <CategoryList title={t('CLOTHING')} subTitles={clothing_subtitles} translator={t} />
                <CategoryList title={t('SHOES')} subTitles={shoes_subtitles} translator={t} />
                <CategoryList title={t('ACCESSORIES')} subTitles={accessories_subtitles} translator={t} />
            </Stack>

        </Box>
    )
}

const style_for_icons_nav = {
    color: 'white',
}

const navs = [
    {
        icon: <HomeIcon sx={style_for_icons_nav} />,
        label: 'Home',
        action: '/#'
    }, {
        icon: <CategoryIcon sx={style_for_icons_nav} />,
        label: 'Category',
        action: '/',
        with_dropdown_menu: true,
        dropdown_menu: <DropdownMenu />
    }, {
        icon: <ConfirmationNumberIcon sx={style_for_icons_nav} />,
        label: 'Coupon',
        action: '/'
    }, {
        icon: <FavoriteBorderIcon sx={style_for_icons_nav} />,
        label: 'My Wishlist',
        action: '/'
    }, {
        icon: <ShoppingCartIcon sx={style_for_icons_nav} />,
        label: 'Cart',
        action: '/cart'
    }, {
        icon: <LiveHelpIcon sx={style_for_icons_nav} />,
        label: 'FAQ',
        action: '/faq'
    },
]

const Nav = ({ navInfo, navLabel }) => {
    const { icon, action, with_dropdown_menu, dropdown_menu } = navInfo

    return (
        <NavContainer>
            <NavItem
                to={action}
                className="animation-container"
            >
                <div className="animation-wrapper">
                    <Stack
                        flexDirection="row"
                        alignItems="center"
                        columnGap="5px"
                    >
                        <IconOption>{icon}</IconOption>

                        <span>{navLabel}</span>

                        {
                            with_dropdown_menu &&
                            <Stack>
                                <ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2em', margin: 'auto' }} />
                            </Stack>
                        }
                    </Stack>
                </div>
            </NavItem>

            {dropdown_menu}
        </NavContainer>
    )
}

const MenuBar = () => {
    const { t } = useTranslation('home_page')

    return (
        <Stack
            id="MenuBarSection"
            component="div"
            flexDirection="row"
            justifyContent="space-around"
            position="relative"
            width="100%"
            bgcolor="black"
        >
            {
                navs.map((navInfo) => (
                    <Nav
                        navInfo={navInfo}
                        navLabel={t(navInfo.label)}
                        key={navInfo.label}
                    />
                ))
            }
        </Stack>
    )
}

export default MenuBar

const NavContainer = styled('div')(({ theme }) => ({
    height: 'fit-content',
    fontFamily: theme.fontFamily.nunito,
    '&:hover .dropdown_menu': {
        display: 'flex',
    },
    "&:hover .animation-container::after , &:hover .animation-container::before": {
        height: "100%",
        width: "100%",
    },
    '&:hover .animation-wrapper , &:hover svg': {
        color: 'black',
    }
}))

const NavItem = styled(NavLink)({
    display: 'block',
    color: 'white',
    textDecoration: 'none',
    padding: "2px 3px",
    border: "none",
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
    "& .animation-wrapper": {
        position: "relative",
        width: "fit-content",
        boxSizing: "border-box",
        zIndex: 3,
        padding: "10px 20px",
        fontSize: "0.9em",
        transition: 'color 0.3s ease',
    },
    "&::after": {
        position: "absolute",
        content: '""',
        right: "0",
        bottom: "0",
        width: "0",
        height: "0",
        backgroundColor: "white",
        transition: "all 0.3s ease",
        zIndex: 2
    },
    "&::before": {
        position: "absolute",
        content: '""',
        left: "0",
        top: "0",
        backgroundColor: "white",
        transition: "all 0.3s ease",
        width: "0",
        height: "0",
        zIndex: 2
    },
})

const IconOption = styled('div')({
    display: 'flex',
    alignContent: 'center',
    color: 'white',
    marginRight: '5px',
    '& svg': {
        fontSize: '1.3rem',
        transition: 'color 0.3s ease',
    }
})

const DropdownMenuImage = styled('img')({
    width: '256px',
    maxWidth: '260px',
    height: '100%',
})

const Category = styled('div')({
    padding: '5px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    color: 'white',
    fontSize: '0.9em',
    position: 'relative',
    zIndex: '1',
    transition: 'color 0.3s',
    width: '100%',
    textAlign: 'center',
    '&::after': {
        content: '""',
        position: 'absolute',
        backgroundColor: 'white',
        height: '100%',
        width: '0',
        top: '0',
        left: '0',
        margin: 'auto',
        transition: 'width 0.3s',
        zIndex: '-1',
        borderRadius: '3px',
    },
    '&:hover': {
        color: 'black',

        '&::after': {
            width: '100%',
        }
    }
})