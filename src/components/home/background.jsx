import React from "react"
import { styled } from '@mui/material/styles'
import banner_item_1 from '../../assets/images/home_banner_item_1.jpg'
import banner_item_2 from '../../assets/images/home_banner_item_2.jpg'
import banner_background from '../../assets/images/home_banner_background.jpg'
import { Typography } from "@mui/material"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useTheme } from "@emotion/react"
import { useTranslation } from "react-i18next"

const Background = () => {
    const theme = useTheme()
    const { t } = useTranslation('home_page')

    const shopNowAction = () => {
        let destination

        if (window.innerWidth <= 900) destination = 600
        else destination = 860

        window.scrollTo({
            top: destination,
            behavior: 'smooth',
        })
    }

    return (
        <BackgroundSection
            id="Home-Background"
        >

            <TextContainer>
                <Typography
                    fontFamily="inherit"
                    color="red"
                >
                    <AnimationText theme={{ BackgroundTextIndex: 40 }}>
                        {t('Winter Collection')}
                    </AnimationText>
                </Typography>
                <Typography
                    fontFamily="inherit"
                    fontSize="3em"
                    fontWeight="bold"
                    color="black"
                >
                    <AnimationText theme={{ BackgroundTextIndex: 41 }}>
                        {t('New Trending')}
                    </AnimationText>
                    <br />
                    <AnimationText theme={{ BackgroundTextIndex: 42 }}>
                        {t('Collection 2023')}
                    </AnimationText>
                </Typography>
                <Typography
                    fontFamily={theme.fontFamily.nunito}
                    fontStyle="italic"
                    fontSize="1em"
                >
                    <AnimationText theme={{ BackgroundTextIndex: 43 }}>
                        {t('Make up your lifestyle')}
                    </AnimationText>
                </Typography>

                <ShopNowButton
                    onClick={shopNowAction}
                >
                    <span>{t('Shop Now')}</span>
                    <ArrowForwardIcon sx={{ fontSize: '1.1em' }} />
                </ShopNowButton>
            </TextContainer>

            <BannerContainer>
                <img src={banner_item_1} alt="banner-1" />
                <img src={banner_item_2} alt="banner-2" />
            </BannerContainer>

        </BackgroundSection>
    )
}

export default Background

const BackgroundSection = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: "space-between",
    width: "100%",
    padding: "30px 70px",
    boxSizing: "border-box",
    backgroundImage: `url(${banner_background})`,
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
        padding: '30px',
    },
}))

const TextContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily: theme.fontFamily.kanit,
    fontSize: '1em',
    position: 'relative',
    zIndex: '5',
    width: '100%',
    [theme.breakpoints.down('md')]: {
        fontSize: '0.6em',
    },
}))

const AnimationText = styled('span')(({ theme }) => ({
    display: 'inline-block',
    animation: 'background_text_animate 5s forwards infinite',
    animationDelay: `${theme.BackgroundTextIndex * 0.05}s`,
    '@keyframes background_text_animate': {
        '0%': {
            transform: 'translate(-100px) scale(.3)',
            opacity: '0',
            color: 'black',
        },
        '4%': {
            transform: 'translate(50px) scale(.7)',
            opacity: '1',
        },
        '6%': {
            color: 'yellow',
        },
        '8%': {
            transform: 'translate(0) scale(2)',
            opacity: '0',
            color: 'inherit',
        },
        '10%': {
            transform: 'translate(0) scale(1)',
            opacity: '1',
        },
        '100%': {
            transform: 'translate(0) scale(1)',
            opacity: '1',
        },
    }
}))

const BannerContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    zIndex: '1',
    height: '500px',
    width: '100%',
    overflow: 'visible',
    marginRight: '50px',
    [theme.breakpoints.down('md')]: {
        height: '350px',
    },
    '& img': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    '& img:nth-of-type(1)': {
        zIndex: '2',
        height: '400px',
        transform: 'translate(-70%, -50%)',
        animation: 'auto_change_image_1 5s infinite ease-in-out alternate',
        '@keyframes auto_change_image_1': {
            '0%': {
                opacity: '1',
            },
            '40%': {
                opacity: '1',
            },
            '60%': {
                opacity: '0',
            },
            '100%': {
                opacity: '0',
            }
        },
        [theme.breakpoints.down('md')]: {
            height: '300px',
        },
    },
    '& img:nth-of-type(2)': {
        zIndex: '3',
        height: '400px',
        animation: 'auto_change_image_2 5s infinite linear alternate',
        '@keyframes auto_change_image_2': {
            '0%': {
                opacity: '0',
            },
            '40%': {
                opacity: '0',
            },
            '60%': {
                opacity: '1',
            },
            '100%': {
                opacity: '1',
            }
        },
        [theme.breakpoints.down('md')]: {
            height: '300px',
        },
    },
}))

const ShopNowButton = styled('button')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    padding: '10px 25px',
    fontFamily: theme.fontFamily.nunito,
    fontSize: '0.8rem',
    width: 'fit-content',
    marginTop: '15px',
    border: '2px black solid',
    borderRadius: '0',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
        backgroundColor: 'black',
        color: 'white',
    },
    [theme.breakpoints.down('md')]: {
        padding: '10px',
        fontSize: '0.7rem',
    },
}))