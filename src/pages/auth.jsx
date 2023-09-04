import React, { useEffect, useRef, useState } from "react"
import { createTheme, styled } from '@mui/material/styles'
import Mascot from '../assets/images/VCNShop_Mascot.png'
import { NavLink, useNavigate } from "react-router-dom"
import Login from '../components/auth/login'
import Register from '../components/auth/register/register'
import ForgotPassword from '../components/auth/forgot_password'
import { Route, Routes } from "react-router-dom"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { ThemeProvider } from "@mui/material/styles"
import { Box, Stack, LinearProgress, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { setUpAuth } from "../store/actions/user_actions"
import { AUTH_STATUS_AUTHENTICATED, AUTH_STATUS_NOT_AUTHENTICATED } from "../configs/constants"

const Auth = () => {
    const { authStatus } = useSelector(({ user }) => user.auth)
    const [authSetUp, setAuthSetUp] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const checkAuthFlag = useRef(1)

    const handleCheckAuth = async () => {
        if (checkAuthFlag.current !== 1) return

        await dispatch(setUpAuth())

        if (authStatus === AUTH_STATUS_AUTHENTICATED) {
            navigate('/account')

        } else if (authStatus === AUTH_STATUS_NOT_AUTHENTICATED) {
            setAuthSetUp(true)

            checkAuthFlag.current = 2
        }
    }

    useEffect(() => {
        handleCheckAuth()
    }, [authStatus])

    if (!authSetUp)
        return (
            <Checking>
                <Box
                    color="black"
                    width="100%"
                >
                    <LinearProgress color="inherit" />
                </Box>

                <Typography
                    marginTop="20px"
                >
                    Checking...
                </Typography>
            </Checking>
        )

    return (
        <AuthPage id="AuthPage">

            <Layout>
                <Stack
                    alignItems='center'
                    flexDirection='column'
                    marginBottom='10px'
                >
                    <Header>WELCOME TO VCN SHOP</Header>

                    <Box
                        display='flex'
                        columnGap='40px'
                    >
                        <Nav to="/">Home</Nav>
                        <Nav to="/termOfuse">
                            Term Of Use
                        </Nav>
                        <Nav to="/faq">
                            FAQ
                        </Nav>
                    </Box>

                    <Text>
                        <span>Create lifestyle in your way.</span>
                        <CheckCircleOutlineIcon fontSize='1.2em' />
                    </Text>

                    <Text>
                        <span>Shopping and enjoy the moment.</span>
                        <CheckCircleOutlineIcon fontSize='1.2em' />
                    </Text>

                    <Text>
                        <span>Simply and smoothly.</span>
                        <CheckCircleOutlineIcon fontSize='1.2em' />
                    </Text>
                </Stack>

                <Box
                    display='flex'
                    justifyContent='space-between'
                    marginTop="30px"
                >
                    <MascotImage src={Mascot} alt="VCN Shop Mascot" className="flip" />
                    <MascotImage src={Mascot} alt="VCN Shop Mascot" />
                </Box>
            </Layout>

            <ThemeProvider theme={AuthBackgroundTheme}>
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/forgotPassword' element={<ForgotPassword />} />
                </Routes>
            </ThemeProvider>

        </AuthPage>
    )
}

export default Auth

const AuthBackgroundTheme = createTheme({
    auth_background: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '40%',
        padding: '20px 40px 30px',
        boxSizing: 'border-box',
        backgroundColor: '#242424',
    },
})

const Checking = styled('div')(({ theme }) => ({
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
    padding: "30px 100px",
    [theme.breakpoints.down('sm')]: {
        padding: '30px',
    }
}))

const AuthPage = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    columnGap: '10px',
    width: '100%',
    [theme.breakpoints.down('lg')]: {
        justifyContent: 'center',
        backgroundColor: '#242424',
    },
}))

const Layout = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
    padding: '40px',
    paddingTop: '30px',
    boxSizing: 'border-box',
    [theme.breakpoints.down('lg')]: {
        display: 'none',
    },
}))

const Header = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    fontWeight: 'bold',
    fontSize: '3em',
}))

const Nav = styled(NavLink)(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    fontSize: '0.9em',
    color: 'black',
    textDecoration: 'unset',
    cursor: 'pointer',
    '&:hover': {
        textDecoration: 'underline',
    }
}))

const Text = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '10px',
    alignItems: 'center',
    marginTop: '10px',
    fontFamily: theme.fontFamily.nunito,
    fontSize: '1.2em',
    fontWeight: 'bold',
}))

const MascotImage = styled('img')({
    color: 'black',
    height: '15em',
    '&.flip': {
        transform: 'rotateY(180deg)',
    }
})