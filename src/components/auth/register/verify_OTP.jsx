import React, { useEffect, useMemo, useRef, useState } from "react"
import { styled } from '@mui/material/styles'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch } from "react-redux"
import { verifyRegisterOTP } from "../../../store/actions/user_actions"
import { IconButton, Tooltip, Typography } from "@mui/material"

const input_value_validator = /^\d+$/

const VerifyOTP = ({ emailWasTyped }) => {
    const [OTPInputValue, setOTPInputValue] = useState('')
    const OTPInputContainerRef = useRef()
    const dispatch = useDispatch()

    useEffect(() => {
        if (/^\d{4}$/.test(OTPInputValue))
            dispatch(verifyRegisterOTP(OTPInputValue, emailWasTyped))
    }, [OTPInputValue])

    const input_values = useMemo(() => {
        let temp_values = OTPInputValue.split('')
        let main_values = []
        for (let i = 0; i < 4; i++) {
            if (input_value_validator.test(temp_values[i]))
                main_values.push(temp_values[i])
            else
                main_values.push('')
        }
        return main_values
    }, [OTPInputValue])

    useEffect(() => {
        OTPInputContainerRef.current.firstElementChild.focus()
    }, [OTPInputContainerRef])

    const pressKeyHandler = (e) => {
        let target = e.target
        let key_of_event = e.key
        let previousInput = target.previousElementSibling
        let nextInput = target.nextElementSibling
        if (key_of_event === 'Backspace' && target.value === '') {
            if (previousInput)
                previousInput.focus()
        } else if (key_of_event === 'ArrowRight' || key_of_event === 'ArrowDown') {
            e.preventDefault()
            if (nextInput) nextInput.focus()
        } else if (key_of_event === 'ArrowLeft' || key_of_event === 'ArrowUp') {
            e.preventDefault()
            if (previousInput) previousInput.focus()
        }
    }

    const enterOTPHandler = (e, index) => {
        let target = e.target
        let input_value = target.value.trim()
        let next_input = target.nextElementSibling
        if (input_value === '' && next_input && next_input.value !== '')
            input_value = '#'
        let new_value = OTPInputValue.slice(0, index) + input_value + OTPInputValue.slice(index + 1)
        if (new_value.length > 4) new_value = new_value.slice(0, 4)
        setOTPInputValue(new_value)
        if (input_value === '#') return
        if (next_input) next_input.focus()
    }

    const onFocusHandler = (e) => {
        let target = e.target
        let target_value = target.value
        target.setSelectionRange(0, target_value.length)
        let previousInput = target.previousElementSibling
        if (previousInput && previousInput.value === '' && target_value === '')
            previousInput.focus()
    }

    const clearInput = () => {
        setOTPInputValue('')
        OTPInputContainerRef.current.firstElementChild.focus()
    }

    return (
        <VerifyOTPFormGroup id="VerifyOTPFormGroup">
            <Title>Enter the OTP code here...</Title>

            <OTPInputContainer ref={OTPInputContainerRef}>

                {
                    input_values.map((items, index) => (
                        <OTPInputs
                            key={index}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="\d{1}"
                            maxLength={4}
                            className="otp_input"
                            value={items}
                            onChange={(e) => enterOTPHandler(e, index)}
                            onKeyDown={pressKeyHandler}
                            onFocus={onFocusHandler}
                        />
                    ))
                }

                <ClearInputsBtn>

                    <IconButton
                        onClick={() => clearInput()}
                    >
                        <Tooltip title="Clear">
                            <ClearIcon sx={{ color: 'white', }} />
                        </Tooltip>
                    </IconButton>

                </ClearInputsBtn>
            </OTPInputContainer>

            <Announce>
                A four-digit OTP code was sent to your email.
                Please check the email and enter or paste the code to above.
            </Announce>
        </VerifyOTPFormGroup>
    )
}

export default VerifyOTP

const VerifyOTPFormGroup = styled('div')({
    marginTop: '20px',
})

const Title = styled(Typography)({
    display: 'block',
    width: 'fit-content',
    fontWeight: 'bold',
    padding: '3px 10px',
    backgroundColor: '#33b8b6',
    borderRadius: '5px',
})

const OTPInputContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px',
    margin: '0 auto',
    marginTop: '8px',
    width: '60%',
    position: 'relative',
    borderBottom: '1.5px #33b8b6 solid',
})

const OTPInputs = styled('input')({
    width: '42px',
    height: '42px',
    padding: '0 3px',
    boxSizing: 'border-box',
    border: '1.5px black solid',
    borderRadius: '3px',
    textAlign: 'center',
    outline: 'unset',
    margin: '0',
    fontSize: '1.2em',
    fontWeight: 'bold',
    '&::selection': {
        background: '#33b8b6',
    },
    '&:hover': {
        outline: '3px white solid',
    },
    '&:focus': {
        outline: '3px #33b8b6 solid',
    },
})

const ClearInputsBtn = styled('div')({
    display: "flex",
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: "100%",
    top: "0",
})

const Announce = styled(Typography)({
    margin: '0',
    marginTop: '5px',
    fontStyle: 'italic',
    color: 'white',
    fontSize: '0.8em',
})