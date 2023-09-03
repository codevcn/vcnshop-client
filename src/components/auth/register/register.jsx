import React, { useRef, useState } from "react"
import { styled } from '@mui/material/styles'
import VerifyOTP from "./verify_OTP"
import OAuth from "../OAuth"
import CircularProgress from '@mui/material/CircularProgress'
import ResendOTP from "./resend_OTP"
import { NavLink } from "react-router-dom"
import { toast } from 'react-toastify'
import EmailIcon from '@mui/icons-material/Email'
import { useDispatch, useSelector } from 'react-redux'
import { sendRegisterOTP } from "../../../store/actions/user_actions"
import CompleteRegister from "./complete_register"
import validator from 'validator'
import { Typography } from "@mui/material"

const Register = () => {
    const { auth: { registerStep }, loading } = useSelector(({ user }) => user)
    const [sendOTPNote, setSendOTPNote] = useState(false)
    const email_input_ref = useRef()
    const email_was_typed_ref = useRef()
    const dispatch = useDispatch()

    const timeToResendOTP = 120

    const sendOTPSubmit = () => {
        let email = email_input_ref.current.value
        if (email.length === 0) return toast.warning('Please enter your email!')
        if (!validator.isEmail(email))
            return toast.warning('Please enter format of email correctly!')

        email_was_typed_ref.current = email
        dispatch(sendRegisterOTP(email))
        setSendOTPNote(true)
    }

    const catchEnterKey = (e) => {
        if (e.key === 'Enter') sendOTPSubmit()
    }

    return (
        registerStep === 3 ? (
            <CompleteRegister emailWasTyped={email_was_typed_ref.current} />
        ) :
            <RegisterSection id="RegisterSection">

                <div>
                    <Title>Register</Title>

                    {
                        registerStep === 1 &&
                        <>
                            <FormGroup>
                                <Label htmlFor="StyledPhoneInput">
                                    Enter your email here
                                </Label>
                                <div style={{ display: 'flex', columnGap: '10px' }}>
                                    <EmailIcon sx={{ color: 'white' }} />
                                    <EmailInput
                                        maxLength={35}
                                        ref={email_input_ref}
                                        type="email"
                                        placeholder="Enter your email here..."
                                        onKeyDown={catchEnterKey}
                                    />
                                </div>
                            </FormGroup>
                            <HelperText>
                                <span>An OTP code will be sent to your email to verify.</span>
                                {
                                    sendOTPNote &&
                                    <span className="send_OTP_note">
                                        Please wait! The time for sending OTP could take up to 4 or 6 seconds
                                    </span>
                                }
                            </HelperText>
                        </>
                    }

                    {
                        registerStep === 2 &&
                        <VerifyOTP emailWasTyped={email_was_typed_ref.current} />
                    }
                    
                    <SendOTPContainer>
                        <Typography
                            color='red'
                            fontSize='0.9em'
                            sx={{ cursor: 'pointer' }}
                        >
                            Have problem ?
                        </Typography>
                        {
                            loading &&
                            <SendOTPBtn>
                                <CircularProgress
                                    sx={{ color: 'black', }}
                                    size={18}
                                    thickness={6}
                                />
                            </SendOTPBtn>
                        }
                        {
                            !loading && registerStep === 1 &&
                            <SendOTPBtn onClick={sendOTPSubmit}>
                                Send OTP
                            </SendOTPBtn>
                        }
                        {
                            !loading && registerStep === 2 &&
                            <ResendOTP
                                secondsStarter={timeToResendOTP}
                                emailWasTyped={email_was_typed_ref.current && email_was_typed_ref.current}
                            />
                        }
                    </SendOTPContainer>
                </div>

                <SignIn>
                    <span>Already have an account ? </span>
                    <NavLink to="/auth/login" className="NavLink">
                        Sign In.
                    </NavLink>
                </SignIn>

                <OAuth />

            </RegisterSection >
    )
}

export default Register

const RegisterSection = styled('div')(({ theme }) => ({
    ...theme.auth_background,
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('md')]: {
        minWidth: '100%',
        padding: '20px',
    }
}))

const Title = styled('h2')({
    fontWeight: 'bold',
    fontSize: '2em',
    color: 'white',
    margin: '10px 0 15px',
})

const FormGroup = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    rowGap: '10px',
    borderBottom: '1px #00b0a7 solid',
    paddingBottom: '3px',
})

const Label = styled('label')({
    color: 'white',
    fontWeight: '500',
    padding: '2px',
})

const EmailInput = styled('input')({
    padding: '0',
    border: 'unset',
    fontSize: '1.1em',
    outline: 'unset',
    backgroundColor: '#242424',
    color: 'white',
    width: '100%',
})

const HelperText = styled('p')({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '5px',
    margin: '5px 0 10px',
    fontStyle: 'italic',
    fontFamily: 'sans-serif',
    color: 'white',
    fontSize: '0.8em',
    marginTop: '10px',
    '& span.send_OTP_note': {
        fontSize: '0.95em',
        color: '#ffe859',
    }
})

const SendOTPContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        rowGap: '10px',
    }
}))

const SendOTPBtn = styled('button')({
    display: 'flex',
    alignItems: 'center',
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: '#00b0a7',
    padding: '8px 15px',
    borderRadius: '5px',
    border: '2px #00b0a7 solid',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
    }
})

const SignIn = styled('div')(({ theme }) => ({
    color: 'white',
    marginTop: '30px',
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