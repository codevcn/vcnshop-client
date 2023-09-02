import React from "react"
import { styled } from "@mui/material"
import NewsLetter from "../components/home/new_letter"
import ScrollToTopBtn from "../components/scroll_to_top_btn"
import Background from "../components/home/background"
import SecBanners from "../components/home/sec_banners"
import WomenSProducts from "../components/home/women's_products"
import MenSProducts from "../components/home/men's_products"
import { Box, Typography } from "@mui/material"
import Overview from "../components/home/overview"
import { useTranslation } from 'react-i18next'
import suspenseComponent from "../utils/suspense"

const Home = () => {
    const { t } = useTranslation('home_page')

    return (
        <Box
            id="Home"
            component="div"
            width="100%"
        >
            <Background />

            <SecBanners />

            <Title>
                {t('Most Sold')}
            </Title>

            <WomenSProducts />

            <MenSProducts />

            <Title>
                {t('Overview')}
            </Title>

            <Overview />

            <NewsLetter />

            <ScrollToTopBtn />
        </Box>
    )
}

export default suspenseComponent(Home)()

const Title = styled(Typography)(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    fontWeight: "bold",
    fontSize: "3em",
    paddingLeft: "60px",
    marginTop: "80px",
    [theme.breakpoints.down('md')]: {
        textAlign: 'center',
        fontSize: '2em',
        paddingLeft: "0",
        marginTop: "50px",
    },
}))