import React from "react"
import { styled } from '@mui/material/styles'
import { useSelector } from "react-redux"
import PersonIcon from '@mui/icons-material/Person'
import { useNavToRedirectLogin } from "../../../hooks/custom_hooks"
import { CircularProgress, Typography } from "@mui/material"
import Tooltip from '@mui/material/Tooltip'
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { AUTH_STATUS_AUTHENTICATED, AUTH_STATUS_NOT_AUTHENTICATED } from "../../../configs/constants"

const UserNav = () => {
    const { auth: { authStatus }, error } = useSelector(({ user }) => user)
    const navigate_to_login = useNavToRedirectLogin()
    const navigate = useNavigate()
    const { t } = useTranslation('home_page')

    const handleAuthNavigate = (option) => {
        if (option === 'login')
            navigate_to_login()
        else if (option === 'register')
            navigate('/auth/register')
        else
            navigate('/account')
    }

    return (
        authStatus === AUTH_STATUS_AUTHENTICATED ? (
            <Tooltip title={t("Account")}>
                <PersonIconWrapper onClick={() => handleAuthNavigate('account')}>
                    <PersonIcon sx={{ fontSize: '1.8em' }} />
                </PersonIconWrapper>
            </Tooltip>
        ) : authStatus === AUTH_STATUS_NOT_AUTHENTICATED ? (
            <BtnContainer>
                <AuthBtn onClick={() => handleAuthNavigate('login')}>
                    {t('Sign In')}
                </AuthBtn>
                <AuthBtn onClick={() => handleAuthNavigate('register')} className="SignUp">
                    {t('Sign Up')}
                </AuthBtn>
            </BtnContainer>
        ) :
            <CircularProgress
                size={15}
                thickness={5}
                sx={{ color: 'black' }}
            />
    )
}

export default UserNav

const BtnContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: 'black',
    [theme.breakpoints.down('md')]: {
        color: 'white',
        '& .SignUp': {
            display: "none",
        }
    },
}))

const AuthBtn = styled(Typography)(({ theme }) => ({
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'unset',
    padding: '5px 15px',
    borderRadius: '10px',
    color: 'inherit',
    '&:hover': {
        backgroundColor: 'black',
        color: 'white',
    },
    [theme.breakpoints.down('md')]: {
        backgroundColor: 'white',
        color: 'black'
    },
}))

const PersonIconWrapper = styled('span')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '5px',
    borderRadius: '50%',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'black',
        '& svg': {
            color: 'white',
        }
    },
    '& svg': {
        color: 'black',
        [theme.breakpoints.down('md')]: {
            color: 'white',
        },
    }
}))