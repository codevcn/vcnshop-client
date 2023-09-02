import React, { useRef, useState } from "react"
import { styled } from '@mui/material/styles'
import { verifyOTPOfForgotPassword } from "../../store/actions/user_actions"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { CircularProgress } from "@mui/material"

const ForgotPasswordVerifyOTP = ({ emailWasTyped, handleOpenProblemSection, loading }) => {
    const [OTPInputValue, setOTPInputValue] = useState('')
    const OTP_input_value_ref = useRef()
    const dispatch = useDispatch()

    const verifyOTPSubmit = () => {
        let OTP_code = OTP_input_value_ref.current.value
        if (OTP_code === '') return toast.warning('Please enter your OTP code!')

        dispatch(verifyOTPOfForgotPassword(OTPInputValue, emailWasTyped))
    }

    const handleInputEntering = (e) => {
        let input_value = e.target.value
        let number_validator = /^\d+$/
        if (input_value !== '' && !number_validator.test(input_value)) return
        setOTPInputValue(input_value)
    }

    const catchEnterKey = (e) => {
        if (e.key === 'Enter') verifyOTPSubmit()
    }

    return (
        <>
            <VerifyOTPSection id="ForgotPasswordVerifyOTPSection">
                <Label htmlFor="VerifyOTP">Enter your OTP code</Label>
                <VerifyOTPInput
                    id="VerifyOTP"
                    ref={OTP_input_value_ref}
                    value={OTPInputValue}
                    onChange={handleInputEntering}
                    onKeyDown={catchEnterKey}
                    placeholder="Enter your OTP code here..."
                    maxLength={20}
                />
            </VerifyOTPSection>
            <SubmitBtnContainer>
                <ProblemBtn onClick={() => handleOpenProblemSection(true)}>
                    Have problem ?
                </ProblemBtn>
                <VerifyOTPBtn onClick={verifyOTPSubmit}>
                    {
                        loading ?
                            <CircularProgress
                                sx={{ color: 'black', margin: 'auto' }}
                                size={18}
                                thickness={6}
                            />
                            : <span>Verify OTP</span>
                    }
                </VerifyOTPBtn>
            </SubmitBtnContainer>
        </>
    )
}

export default ForgotPasswordVerifyOTP

const VerifyOTPSection = styled('div')(({ theme }) => ({
    marginTop: '15px',
}))

const Label = styled('label')({
    width: 'fit-content',
    fontFamily: 'arial',
    fontWeight: 'bold',
    fontSize: '1.1em',
    color: 'white',
    marginLeft: '5px',
})

const VerifyOTPInput = styled('input')({
    marginTop: '5px',
    backgroundColor: 'transparent',
    border: '2px #00ffe6 solid',
    outline: 'unset',
    fontSize: '1em',
    color: 'white',
    padding: '8px 15px',
    paddingRight: '30px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '5px',
    '&:focus': {
        borderRightWidth: '10px',
    },
})

const SubmitBtnContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
})

const ProblemBtn = styled('div')({
    color: 'red',
    fontSize: '1em',
    fontFamily: 'nunito',
    cursor: 'pointer',
    '&:hover': {
        textDecoration: 'underline',
    }
})

const VerifyOTPBtn = styled('button')({
    display: 'flex',
    alignItems: 'center',
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: '#00b0a7',
    padding: '7px 15px',
    borderRadius: '5px',
    border: '1px black solid',
    height: '35px',
})