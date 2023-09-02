import React from "react"
import { styled } from '@mui/material/styles'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import footer_background_image from '../../../assets/images/footer_background_image.jpg'
import foxLogoWhite from '../../../assets/images/logo_app_white.svg'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import MailIcon from '@mui/icons-material/Mail'
import TelegramIcon from '@mui/icons-material/Telegram'
import cash from '../../../assets/images/payment_methods/cash.jpg'
import visa from '../../../assets/images/payment_methods/visa.jpg'
import mastercard from '../../../assets/images/payment_methods/mastercard.jpg'
import { Box, Divider, Stack, Tooltip, Typography } from "@mui/material"
import { useTheme } from "@emotion/react"
import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import suspenseComponent from "../../../utils/suspense"

const social_icon_style = {
    color: 'white',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.2)',
    }
}

const style_for_title_icons = {
    color: 'white'
}

const menu_navigation = [
    {
        title: 'About us',
        list: [
            { text: 'Terms of use', action: '/termOfUse' },
            { text: 'FAQ', },
            { text: 'Blogs', },
            { text: 'News', },
        ]
    }, {
        title: 'Partner',
        list: [
            { text: 'VCN Travel Look', },
            { text: 'VCN E-Net', },
            { text: 'VCN VLy', },
        ]
    }, {
        title: 'Fast Menu',
        list: [
            { text: 'Men\'s clothing', },
            { text: 'Women\'s clothing', },
            { text: 'Sneaker', },
            { text: 'Suit', },
            { text: 'Unisex', },
        ]
    }, {
        title: 'Contact',
        list: [
            {
                icon: <LocationOnIcon sx={style_for_title_icons} />,
                text: '9th floor of FoxLand Building, 106 Nguyen Van Tien, Bien Hoa - Dong Nai',
            }, {
                icon: <PhoneIcon sx={style_for_title_icons} />,
                text: '(0838) 686 886 986',
            }, {
                icon: <MailIcon sx={style_for_title_icons} />,
                text: 'vcnshop@foxcor.com',
            }, {
                icon: <TelegramIcon sx={style_for_title_icons} />,
                text: '+84 338-988-338',
            }
        ]
    },
]

const payment_methods = [
    { name: 'Visa', img: visa },
    { name: 'Mastercard', img: mastercard },
    { name: 'Cash', img: cash },
]

const SocialNetworks = () => {
    const { t } = useTranslation('home_page')

    return (
        <Stack
            flexDirection="row"
            columnGap="20px"
            justifyContent="space-between"
            alignItems="center"
            padding="15px 30px"
            bgcolor="#3facb1"
        >
            <SocialNetworksText>
                {t('Contact us on social networks!')}
            </SocialNetworksText>

            <SocialNetworksIcons>
                <Tooltip title="Facebook">
                    <FacebookIcon sx={social_icon_style} />
                </Tooltip>
                <Tooltip title="YouTube">
                    <YouTubeIcon sx={social_icon_style} />
                </Tooltip>
                <Tooltip title="Instagram">
                    <InstagramIcon sx={social_icon_style} />
                </Tooltip>
                <Tooltip title="Twitter">
                    <TwitterIcon sx={social_icon_style} />
                </Tooltip>
            </SocialNetworksIcons>
        </Stack>
    )
}

const Logo = () => {
    const { t } = useTranslation('home_page')

    return (
        <LogoSection>

            <LogoImg src={foxLogoWhite} />

            <Box
                marginLeft="10px"
                marginTop="20px"
            >
                <Typography
                    fontFamily="inherit"
                    color="white"
                    fontWeight="bold"
                    textAlign="center"
                >
                    VCN Shop
                </Typography>
                <Typography
                    fontSize="0.9em"
                    fontFamily="inherit"
                    color="white"
                    marginTop="10px"
                >
                    {t('Shopping Too Easy')}
                </Typography>
            </Box>

        </LogoSection>
    )
}

const Nav = ({ title, list }) => {
    const theme = useTheme()
    const { t } = useTranslation('home_page')

    return (
        <NavSection>
            <Typography
                component="h2"
                margin="0"
                paddingBottom="7px"
                color="white"
                fontFamily={theme.fontFamily.kanit}
                borderBottom="3px #3FACB1 solid"
                width="fit-content"
                fontWeight="bold"
                fontSize="1.3em"
            >
                {t(title)}
            </Typography>

            {
                list.map(({ icon, text, action }) => (
                    <Stack
                        key={text}
                        flexDirection="row"
                        alignItems="center"
                        marginTop="20px"
                    >

                        {
                            icon &&
                            <Box
                                marginRight="10px"
                                sx={{ cursor: 'pointer' }}
                            >
                                {icon}
                            </Box>
                        }

                        <Box
                            fontFamily={theme.fontFamily.nunito}
                            color="white"
                        >
                            {
                                action ?
                                    <Typography
                                        component={NavLink}
                                        to={action}
                                        sx={{
                                            cursor: 'pointer',
                                            fontFamily: "inherit",
                                            color: "inherit",
                                            textDecoration: 'none',
                                            '&:hover': { color: '#9ffaff' }
                                        }}
                                    >
                                        {t(text)}
                                    </Typography>
                                    :
                                    <Typography
                                        fontFamily="inherit"
                                    >
                                        {t(text)}
                                    </Typography>
                            }
                        </Box>

                    </Stack>
                ))
            }
        </NavSection>
    )
}

const MenuNav = () => {

    return (
        <Stack
            bgcolor="black"
            padding="0 20px"
            position="relative"
            sx={{
                backgroundImage: `url(${footer_background_image})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >

            <Box
                className="Footer-Modal-Base"
                position="absolute"
                zIndex="1"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bgcolor="#00000087"
            />

            <Stack
                position="relative"
                zIndex="2"
            >

                <NavContainer>
                    <Logo />

                    <Nav title={menu_navigation[0].title} list={menu_navigation[0].list} />
                    <Nav title={menu_navigation[1].title} list={menu_navigation[1].list} />
                    <Nav title={menu_navigation[2].title} list={menu_navigation[2].list} />
                    <Nav title={menu_navigation[3].title} list={menu_navigation[3].list} />
                </NavContainer>

                <Divider flexItem variant="middle" sx={{ backgroundColor: 'rgba(255,255,255,.3)' }} />

                <PaymentMethods />

            </Stack>
        </Stack>
    )
}

const PaymentMethods = () => {
    const theme = useTheme()

    return (
        <PaymentMethodsSection>
            <Typography
                fontFamily={theme.fontFamily.nunito}
                fontSize="0.8em"
                color="white"
            >
                &copy; 2023 VCN Shop - FOX E-commerce Corporation
            </Typography>
            <Stack
                flexDirection="row"
                columnGap="20px"
                paddingRight="30px"
            >
                {
                    payment_methods.map(({ name, img }) => (
                        <Tooltip
                            key={name}
                            title={name}
                            placement="top"
                        >
                            <Method src={img} />
                        </Tooltip>
                    ))
                }
            </Stack>
        </PaymentMethodsSection>
    )
}

const Footer = () => {
    return (
        <Box
            component="div"
            id="FooterSection"
            marginTop="30px"
        >

            <SocialNetworks />

            <MenuNav />

        </Box>
    )
}

export default suspenseComponent(Footer)()

const LogoImg = styled('img')(({ theme }) => ({
    height: '100px',
    [theme.breakpoints.down('md')]: {
        height: '80px',
    },
}))

const NavSection = styled('div')(({ theme }) => ({
    width: '12vw',
    marginLeft: '10px',
    '&:last-child': {
        width: '22vw',
        '& h2': {
            marginLeft: '32px',
            [theme.breakpoints.down('md')]: {
                marginLeft: '0',
            },
        },
        [theme.breakpoints.down('md')]: {
            width: 'auto',
        },
    },
    [theme.breakpoints.down('md')]: {
        width: 'auto',
        marginTop: '50px',
    },
}))

const Method = styled('img')({
    height: '25px',
    width: '40px',
})

const NavContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: "space-between",
    padding: "40px 20px",
    [theme.breakpoints.down('md')]: {
        flexDirection: "column",
        padding: '40px 0',
    },
}))

const LogoSection = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    width: "20%",
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('md')]: {
        width: "max-content",
    },
}))

const SocialNetworksText = styled(Typography)(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    color: "white",
    fontSize: "1.3em",
    fontWeight: "bold",
    [theme.breakpoints.down('md')]: {
        fontSize: "1em",
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.9em',
    }
}))

const SocialNetworksIcons = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: "center",
    columnGap: "30px",
    [theme.breakpoints.down('md')]: {
        columnGap: "10px",
    },
}))

const PaymentMethodsSection = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: "space-between",
    alignItems: "center",
    bgcolor: "transparent",
    padding: "20px",
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        rowGap: '20px',
    },
}))