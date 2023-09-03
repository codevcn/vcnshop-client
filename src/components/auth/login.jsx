import React, { useState, useCallback } from "react"
import { styled } from '@mui/material/styles'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import OAuth from "./OAuth"
import { NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "../../store/actions/user_actions"
import validator from 'validator'
import { toast } from "react-toastify"
import CircularProgress from '@mui/material/CircularProgress'
import { useForm } from "react-hook-form"
import UndoIcon from '@mui/icons-material/Undo'
import { Tooltip, Typography, IconButton, Stack, Box } from '@mui/material'
import { useGetQueryValue } from "../../hooks/custom_hooks"

// for testing
import testing from '../../test/auth.json'

const form_group_icon_style = { color: 'white', marginLeft: '10px' }

const auto_account = testing.Account

const AutoAccountButton = ({ handleSetAutoAccount }) => {
    const [getAccountBtn, setGetAccountBtn] = useState(false)

    const style_for_btn = {
        padding: '10px 25px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '5px',
    }

    const cancelAutoAccount = () => {
        setGetAccountBtn(false)
        handleSetAutoAccount(-1)
    }

    return (
        <Stack
            columnGap="10px"
            rowGap="5px"
            flexDirection="row"
            marginTop="20px"
            alignItems="center"
            flexWrap="wrap"
        >
            {
                getAccountBtn ?
                    <>
                        <button
                            style={style_for_btn}
                            onClick={() => handleSetAutoAccount('user_1')}
                            type="button"
                        >
                            For User
                        </button>

                        <button
                            style={style_for_btn}
                            onClick={() => handleSetAutoAccount('admin')}
                            type="button"
                        >
                            For Admin
                        </button>

                        <Tooltip arrow title="Back">
                            <IconButton onClick={cancelAutoAccount} sx={{ border: '1px gray solid' }}>
                                <UndoIcon sx={{ color: 'white', fontSize: '0.75em' }} />
                            </IconButton>
                        </Tooltip>
                    </>
                    :
                    <button style={style_for_btn} onClick={() => setGetAccountBtn(true)}>
                        Get An Accnount
                    </button>
            }
        </Stack>
    )
}

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { register, handleSubmit, setValue } = useForm()
    const { loading } = useSelector(({ user }) => user)
    const dispatch = useDispatch()
    const query_value_getter = useGetQueryValue()

    const get_redirect_route = () => {
        let redirect = query_value_getter(undefined, 'redirect')

        if (redirect)
            redirect = '/' + redirect
        else
            redirect = '/account'

        return redirect
    }

    const handleShowPassword = () => setShowPassword(pre => !pre)

    const loginSubmit = (data, e) => {
        e.preventDefault()
        if (!data.Email || !data.Password) return toast.warning('Please don\'t empty the email and password input!')

        let email = data.Email.trim()
        if (!validator.isEmail(email)) return toast.warning('Please type format of the email correctly!')

        let password = data.Password
        if (password === '') return toast.warning('Please type the password!')

        dispatch(loginUser(email, password, get_redirect_route()))
    }

    const catchEnterKey = (e) => {
        if (e.key === 'Enter') loginSubmit()
    }

    const handleSetAutoAccount = useCallback((role) => {
        if (role === 'user_1') {
            setValue('Email', auto_account[1].email)
            setValue('Password', auto_account[1].password)
        } else if (role === 'admin') {
            setValue('Email', auto_account[0].email)
            setValue('Password', auto_account[0].password)
        } else {
            setValue('Email', '')
            setValue('Password', '')
        }
    }, [])

    return (
        <LoginSection id="LoginSectionArea">

            <form onSubmit={handleSubmit(loginSubmit)} action="#">

                <Typography
                    fontWeight='bold'
                    fontSize='2em'
                    color='white'
                    margin='10px 0 15px'
                    component="h2"
                >
                    Sign In
                </Typography>

                <FormGroup>
                    <EmailIcon sx={form_group_icon_style} />
                    <Input
                        {...register('Email')}
                        type="email"
                        id="email"
                        placeholder=" "
                        onKeyDown={catchEnterKey}
                        autoComplete="on"
                    />
                    <Label htmlFor="email">Enter your e-mail</Label>
                </FormGroup>

                <FormGroup sx={{ marginTop: '30px' }}>
                    <LockIcon sx={form_group_icon_style} />
                    <Input
                        {...register('Password')}
                        id="password"
                        placeholder=" "
                        type={showPassword ? "text" : "password"}
                        onKeyDown={catchEnterKey}
                        autoComplete="on"
                    />
                    <Label htmlFor="password">Enter your password</Label>
                    <Box
                        onClick={() => handleShowPassword()}
                        component="div"
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        marginRight='5px'
                        sx={{ cursor: 'pointer' }}
                    >
                        {
                            showPassword ?
                                <VisibilityIcon sx={{ color: 'white' }} />
                                :
                                <VisibilityOffIcon sx={{ color: 'white' }} />
                        }
                    </Box>
                </FormGroup>

                <Stack marginTop="20px" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <ForgotPassword to="/auth/forgotPassword">
                        Forgot Password ?
                    </ForgotPassword>

                    <LoginBtn type="submit">
                        {
                            loading ?
                                <CircularProgress
                                    sx={{ color: 'black', margin: 'auto' }}
                                    size={19}
                                    thickness={6}
                                />
                                : <span>Login</span>
                        }
                    </LoginBtn>
                </Stack>

                <AutoAccountButton handleSetAutoAccount={handleSetAutoAccount} />

            </form>

            <SignUp>
                <span>Don't have an account ? </span>
                <NavLink
                    className="NavLink"
                    to="/auth/register"
                >
                    Sign Up.
                </NavLink>
            </SignUp>

            <OAuth />

        </LoginSection>
    )
}

export default Login

const LoginSection = styled('div')(({ theme }) => ({
    ...theme.auth_background,
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('md')]: {
        minWidth: '100%',
        padding: '20px',
    }
}))

const FormGroup = styled('div')({
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    border: '1.5px #33b8b6 solid',
    columnGap: '10px',
    padding: '6px 0',
    paddingRight: '6px',
})

const Label = styled('label')({
    color: 'grey',
    fontSize: '0.9em',
    fontWeight: '500',
    padding: '2px 12px',
    position: 'absolute',
    top: '24%',
    left: '10%',
    transition: 'top 0.3s , left 0.3s , background-color 0.3s ease-in , color 0.3s ease-in',
    borderRadius: '3px',
    cursor: 'text',
})

const Input = styled('input')({
    width: '100%',
    fontSize: '1.1em',
    padding: '5px 8px',
    boxSizing: 'border-box',
    border: 'none',
    outline: 'unset',
    backgroundColor: 'transparent',
    color: 'white',
    '&:focus ~ label , :not(:placeholder-shown) ~ label': {
        top: '-40%',
        left: '12%',
        backgroundColor: '#00B0A7',
        color: 'black',
    }
})

const ForgotPassword = styled(NavLink)({
    color: 'red',
    fontSize: '0.9em',
    cursor: 'pointer',
    textDecoration: 'unset',
    '&:hover': {
        textDecoration: 'underline',
    }
})

const LoginBtn = styled('button')({
    display: "flex",
    fontSize: '1em',
    fontWeight: 'bold',
    backgroundColor: '#00b0a7',
    padding: '10px 20px',
    borderRadius: '5px',
    border: '2px #00b0a7 solid',
    height: '40px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
    }
})

const SignUp = styled('div')(({ theme }) => ({
    color: 'white',
    marginTop: '30px',
    '& .NavLink': {
        color: 'yellow',
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'inherit',
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.9em',
    }
}))