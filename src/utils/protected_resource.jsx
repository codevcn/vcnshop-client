import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material'
import { useSelector } from 'react-redux'
import LoadingApp from '../components/loading_app'
import { toast } from 'react-toastify'
import { useCheckIsAdminRole, useNavToRedirectLogin } from '../hooks/custom_hooks'
import CircularProgress from '@mui/material/CircularProgress'
import { Box } from '@mui/material'
import { useTheme } from '@emotion/react'
import { AUTH_STATUS_AUTHENTICATED, AUTH_STATUS_NOT_AUTHENTICATED } from '../configs/constants'

const ProtectedRoute = ({ children, isAdminRoute }) => {
    const [isVerified, setIsVerified] = useState(false)
    const { auth: { authStatus }, user } = useSelector(({ user }) => user)
    const navigate_to_login = useNavToRedirectLogin()
    const check_is_admin_role = useCheckIsAdminRole()

    const authHandler = () => {
        if (authStatus === AUTH_STATUS_AUTHENTICATED && user) {
            if (isAdminRoute && !check_is_admin_role(user.role)) {
                toast.warning('You don\'t have permission to access this resource')
                navigate_to_login()
            }

            setIsVerified(true)
        } else if (authStatus === AUTH_STATUS_NOT_AUTHENTICATED) {
            toast.warning('Session expires or not an authenticated user!')
            navigate_to_login()
        }
    }

    useEffect(() => {
        authHandler()
    }, [authStatus, user])

    if (isVerified)
        return children

    return (
        <LoadingApp />
    )
}

const ProtectedSection = ({ children }) => {
    const [status, setStatus] = useState(null)
    const { auth: { authStatus }, error } = useSelector(({ user }) => user)
    const navigate_to_login = useNavToRedirectLogin()
    const theme = useTheme()

    const authHandler = () => {
        if (authStatus === AUTH_STATUS_AUTHENTICATED) {
            setStatus('success')
        } else if (authStatus === AUTH_STATUS_NOT_AUTHENTICATED) {
            setStatus('fail')
        }
    }

    useEffect(() => {
        authHandler()
    }, [authStatus, error])

    if (status === null)
        return (
            <Box
                width="100%"
                boxSizing="border-box"
                padding="50px 30px"
                textAlign="center"
            >
                <CircularProgress
                    thickness={5}
                    size={50}
                    sx={{ color: 'black' }}
                />
            </Box>
        )
    else if (status === 'fail')
        return (
            <Box
                display="flex"
                alignItems="center"
                fontFamily={theme.fontFamily.nunito}
                padding="30px 20px"
                width="100%"
                boxSizing="border-box"
                color="red"
            >
                <span>Please login to access this resource</span>
                <LoginButton onClick={() => navigate_to_login()}>
                    Login
                </LoginButton>
            </Box>
        )

    return children
}

export {
    ProtectedRoute,
    ProtectedSection,
}

const LoginButton = styled('div')({
    color: 'white',
    backgroundColor: 'black',
    padding: '10px 20px',
    marginLeft: '10px',
    textDecoration: 'unset',
    borderRadius: '3px',
    border: '2px black solid',
    cursor: 'pointer',
    width: 'fit-content',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
    }
})