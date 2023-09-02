import React, { useRef, useState } from "react"
import { styled } from '@mui/material/styles'
import OAuth from "./OAuth"
import Divider from '@mui/material/Divider'
import ClearIcon from '@mui/icons-material/Clear'
import "react-toastify/dist/ReactToastify.css"
import CircularProgress from '@mui/material/CircularProgress'
import { NavLink } from "react-router-dom"
import { toast } from 'react-toastify'
import validator from "validator"
import { useDispatch, useSelector } from "react-redux"
import ResetPasswordSection from "./reset_password"
import { forgotPassword } from "../../store/actions/user_actions"
import ForgotPasswordVerifyOTP from './forgot_password_verify_OTP'
import { Box } from "@mui/material"

const ForgotPasswordSection = () => {
    const email_input_ref = useRef()
    const email_was_typed_ref = useRef()
    const [sendOTPNote, setSendOTPNote] = useState(false)
    const { auth: { forgotPasswordStep }, loading } = useSelector(({ user }) => user)
    const dispatch = useDispatch()

    const clearInput = () => email_input_ref.current.value = ''

    const forgotPasswordSubmit = () => {
        let email = email_input_ref.current.value
        if (!validator.isEmail(email))
            return toast.warning('Please enter format of the email correctly!')

        email_was_typed_ref.current = email
        dispatch(forgotPassword(email))
        setSendOTPNote(true)
    }

    const catchEnterKey = (e) => {
        if (e.key === 'Enter') forgotPasswordSubmit()
    }

    return (
        forgotPasswordStep === 3 ? (
            <ResetPasswordSection emailWasTyped={email_was_typed_ref.current} />
        ) :
            <ForgotPasswordArea id="ForgotPasswordArea">

                <div>
                    <Title>Forgot Password</Title>
                    <Desc>
                        Use your email to recover your password.
                        We will send an four-digit code to your email and then please
                        typing the code to recover. Thanks!
                    </Desc>

                    <Divider sx={{ backgroundColor: '#999999' }} />

                    <Box
                        sx={forgotPasswordStep !== 1 && { opacity: '0.5', pointerEvents: 'none' }}
                        marginTop="15px"
                    >
                        <Label htmlFor="RecoverPasswordInput">
                            Enter your email
                        </Label>

                        <Box
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                            columnGap='10px'
                            marginTop='5px'
                            padding='5px'
                            border='2px #00ffe6 solid'
                            borderRadius='5px'
                        >
                            <EmailInput
                                ref={email_input_ref}
                                id="RecoverPasswordInput"
                                type="text"
                                placeholder="Enter your email here..."
                                onKeyDown={catchEnterKey}
                            />

                            <Box
                                display='flex'
                                alignItems='center'
                                height='100%'
                            >
                                <StyledClearIcon onClick={clearInput} />
                            </Box>
                        </Box>
                    </Box>
                    {
                        sendOTPNote &&
                        <HelperText>
                            <span className="send_OTP_note">
                                Please wait! The time for sending OTP could take up to 4 or 6 seconds
                            </span>
                        </HelperText>
                    }
                    {
                        forgotPasswordStep === 1 &&
                        <SubmitBtnContainer>
                            <span></span>
                            <SendRecoverCodeBtn onClick={forgotPasswordSubmit}>
                                {
                                    loading ?
                                        <CircularProgress
                                            sx={{ color: 'black', margin: 'auto' }}
                                            size={18}
                                            thickness={6}
                                        />
                                        : <span>Send recover code</span>
                                }
                            </SendRecoverCodeBtn>
                        </SubmitBtnContainer>
                    }
                    {
                        forgotPasswordStep === 2 &&
                        <ForgotPasswordVerifyOTP
                            emailWasTyped={email_was_typed_ref.current}
                            loading={loading}
                        />
                    }
                </div>

                <SignInContainer>
                    <span>Already have an account ? </span>
                    <NavLink to="/auth/login" className="NavLink">
                        Sign In.
                    </NavLink>
                </SignInContainer>

                <OAuth />

            </ForgotPasswordArea>
    )
}

export default ForgotPasswordSection

const ForgotPasswordArea = styled('div')(({ theme }) => ({
    ...theme.auth_background,
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('md')]: {
        minWidth: '100%',
        padding: '20px',
    }
}))

const Title = styled('h2')({
    margin: '0',
    marginTop: '10px',
    fontFamily: 'arial',
    fontWeight: 'bold',
    color: 'white',
    position: 'relative',
    width: 'fit-content',
    paddingBottom: '8px',
    '&::after': {
        content: '""',
        height: '5px',
        width: '100%',
        backgroundColor: '#893bff',
        position: 'absolute',
        bottom: '0',
        left: '15px',
    }
})

const Desc = styled('p')({
    margin: '10px 0',
    textAlign: 'center',
    fontFamily: 'nunito',
    color: 'white',
})

const Label = styled('label')({
    width: 'fit-content',
    fontFamily: 'arial',
    fontWeight: 'bold',
    fontSize: '1.1em',
    color: 'white',
    marginLeft: '5px',
})

const EmailInput = styled('input')({
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'unset',
    fontSize: '1em',
    color: 'white',
    padding: '5px 10px',
    paddingRight: '30px',
    width: '90%',
    boxSizing: 'border-box',
    '&:focus': {
        borderRightWidth: '10px',
    },
})

const StyledClearIcon = styled(ClearIcon)({
    color: 'white',
    cursor: 'pointer',
    transform: 'scale(0.8)',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.1)',
    }
})

const HelperText = styled('div')({
    fontFamily: 'sans-serif',
    fontSize: '0.8em',
    color: '#ffe859',
    marginTop: '5px',
    paddingLeft: '5px',
})

const SubmitBtnContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
})

const SendRecoverCodeBtn = styled('button')({
    display: 'flex',
    alignItems: 'center',
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: '#00b0a7',
    padding: '7px 15px',
    borderRadius: '5px',
    border: '2px #00b0a7 solid',
    height: '35px',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
    }
})

const SignInContainer = styled('div')(({ theme }) => ({
    marginTop: '15px',
    color: 'white',
    fontFamily: 'nunito',
    '& .NavLink': {
        color: 'yellow',
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'unset',
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.9em',
    }
}))