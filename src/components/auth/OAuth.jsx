import React, { useEffect, useState } from "react"
import GoogleIcon from '@mui/icons-material/Google'
import { styled, CircularProgress, Stack, Box, Typography, Backdrop, Tooltip } from "@mui/material"
import axios from 'axios'
import axiosErrorHandler from '../../utils/axios_error_handler'
import { toast } from "react-toastify"
import {
    google_sign_in_api,
} from '../../apis/auth_apis'
import oAuthFeature from "../../utils/OAuth"
import baseCustomEvent from "../../utils/custom_event"
import eventNames from "../../configs/event_names"
import { redirectAfterSeconds } from '../../utils/redirect_handler'

const OauthBtn = ({ label, backgroundColor, icon, onClick }) => {
    return (
        <Stack
            key={label}
            flex='1'
            flexDirection="row"
            columnGap="10px"
            display='flex'
            justifyContent='center'
            alignItems='center'
            padding='10px'
            bgcolor={backgroundColor}
            sx={{ cursor: 'pointer' }}
            component="div"
            onClick={onClick}
        >

            {icon}

            <Typography
                color='white'
                sx={{ fontFamily: theme => theme.fontFamily.nunito }}
            >
                {label}
            </Typography>

        </Stack>
    )
}

const signInWithGoogle = async (access_token) => {
    return await axios.post(
        google_sign_in_api,
        { access_token },
        { withCredentials: true }
    )
}

const GoogleOauth = () => {
    const [loading, setLoading] = useState(false)

    const handleSignInWithGoogle = async (access_token) => {
        setLoading(true)

        try {
            await signInWithGoogle(access_token)
        } catch (error) {
            let errorObject = axiosErrorHandler(error)

            toast.error(errorObject.message)

            setLoading(false)
            return
        }

        setLoading(false)
        toast.success('Author successfully!')

        redirectAfterSeconds(1000, { isReload: false, href: '/account' })
    }

    // set and clear custom event
    useEffect(() => {
        baseCustomEvent.subscribe(eventNames.ACCESS_TOKEN_GOOGLE, (e) => {
            handleSignInWithGoogle(e.detail.access_token)
        })

        baseCustomEvent.unsubscribe(eventNames.ACCESS_TOKEN_GOOGLE, () => { })

        return () => {
            baseCustomEvent.unsubscribe(eventNames.ACCESS_TOKEN_GOOGLE, () => { })
        }
    }, [])

    const authByGoogle = async () => {
        setLoading(true)

        try {
            await oAuthFeature.openGoogleOAuth()
        } catch (error) {
            let errorObject = axiosErrorHandler(error)

            toast.error(errorObject.message)

            setLoading(false)
            return
        }

        setLoading(false)
    }

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <OauthBtn
                label="Google"
                icon={<GoogleIcon sx={{ color: 'white' }} />}
                backgroundColor="#1877F2"
                onClick={authByGoogle}
            />
        </>
    )
}

const OAuth = () => {
    return (
        <OAuthSection
            id="Oauth"
        >
            <Typography
                color='white'
                margin='0'
                fontSize='1em'
                textAlign="center"
            >
                OR USING YOUR SOCIAL ACCOUNTS
            </Typography>


            <Stack
                flexDirection="row"
                width='100%'
                marginTop='5px'
            >

                <Tooltip title="Sign in with Google">
                    <Box width="100%">
                        <GoogleOauth />
                    </Box>
                </Tooltip>

            </Stack>
        </OAuthSection >
    )
}

export default OAuth

const OAuthSection = styled('div')(({ theme }) => ({
    marginTop: "15px",
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8em',
    }
}))