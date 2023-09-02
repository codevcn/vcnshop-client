import React from "react"
import { styled } from '@mui/material/styles'
import SecBanner_1 from '../../assets/images/sec_banner_1.webp'
import SecBanner_2 from '../../assets/images/sec_banner_2.webp'
import SecBanner_3 from '../../assets/images/sec_banner_3.webp'
import { useTheme } from "@emotion/react"
import { Typography, Box } from "@mui/material"
import { useTranslation } from "react-i18next"

const SecBanner = ({ banner, title, subtitle }) => {
    const theme = useTheme()
    const { t } = useTranslation('home_page')

    return (
        <SecBannerSection
            sx={{ backgroundImage: `url(${banner})` }}
        >
            <SecBannerContainer>

                <Box
                    fontFamily={theme.fontFamily.kanit}
                    color="black"
                    className="title_container"
                >
                    <Typography
                        fontFamily="inherit"
                        fontWeight="bold"
                        fontSize="2em"
                        color="inherit"
                    >
                        {title}
                    </Typography>
                    <Typography
                        fontFamily="inherit"
                        marginTop="5px"
                        color="inherit"
                    >
                        {subtitle}
                    </Typography>
                </Box>

                <AnimationTextContainer
                    className="animation_text_container"
                >
                    <AnimationText
                        className="animation_text"
                    >
                        {t('Shop Now')}
                    </AnimationText>
                </AnimationTextContainer>

            </SecBannerContainer>
        </SecBannerSection>
    )
}

const SecBanners = () => {
    const { t } = useTranslation('home_page')

    return (
        <SecBannersSection>
            <SecBanner banner={SecBanner_1} title={t('Woman')} subtitle={t('Spring 2021')} />
            <SecBanner banner={SecBanner_2} title={t('Man')} subtitle={t('Spring 2022')} />
            <SecBanner banner={SecBanner_3} title={t('Unisex')} subtitle={t('New Trend')} />
        </SecBannersSection>
    )
}

export default SecBanners

const SecBannersSection = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: "30px",
    width: "100%",
    marginTop: "50px",
    padding: "0 50px",
    boxSizing: "border-box",
    [theme.breakpoints.down('md')]: {
        flexDirection: "column",
        rowGap: '20px',
    },
    [theme.breakpoints.down('sm')]: {
        padding: "0 10px",
    },
}))

const SecBannerSection = styled('div')(({ theme }) => ({
    width: "100%",
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right bottom',
}))

const SecBannerContainer = styled('div')(({ theme }) => ({
    width: '100%',
    height: '250px',
    border: '1px rgba(0,0,0,.1) solid',
    padding: '30px',
    boxSizing: 'border-box',
    position: 'relative',
    transition: 'background-color 0.5s',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgb(63,172,177,0.78)',

        '& .title_container': {
            color: 'white',
        },
        '& .animation_text_container': {
            transform: 'scaleX(1)',

            '& .animation_text': {
                top: '0',
            }
        },
    },
    [theme.breakpoints.down('md')]: {
        height: '250px',
    },
}))

const AnimationTextContainer = styled('div')({
    height: '1.5em',
    transform: 'scaleX(0)',
    transition: 'transform 0.5s',
    position: 'absolute',
    left: '30px',
    bottom: '30px',
    borderBottom: '3px white solid',
    paddingBottom: '2px',
    color: 'white',
    overflow: 'hidden',
})

const AnimationText = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    position: 'relative',
    top: '100%',
    left: '0',
    width: 'max-content',
    fontSize: '1em',
    transition: 'top 0.4s',
    transitionDelay: '0.3s',
}))