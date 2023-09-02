import React, { useState } from "react"
import { styled } from '@mui/material/styles'
import { useForm } from "react-hook-form"
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import { changePassword } from "../../../store/actions/user_actions"
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress } from "@mui/material"
import { MAX_PASSWORD_LENGTH } from "../../../configs/constants"
import { Typography, Stack, Box, Tooltip } from "@mui/material"

const inputs = [
    {
        label: 'The Old Password',
        required: true,
        maxLength: 25,
        warning: 'Please enter the old password.',
        placeholder: 'Enter the old password',
    }, {
        label: 'New Password',
        required: true,
        maxLength: MAX_PASSWORD_LENGTH,
        warning: `Password must be between 6 and ${MAX_PASSWORD_LENGTH} characters long. And must contain at least one capital letter and one number and one lowercase letter.`,
        placeholder: 'Enter a new password',
    }, {
        label: 'Retype The New Password',
        required: true,
        maxLength: MAX_PASSWORD_LENGTH,
        warning: 'Doen\'t Match',
        placeholder: 'Enter the new password',
    },
]

const password_style = {
    marginRight: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.2)',
    }
}

const ChangePassword = () => {
    const { register, formState: { errors }, handleSubmit, setError } = useForm()
    const [showPassword, setShowPassword] = useState([false, false, false])
    const dispatch = useDispatch()
    const { loading } = useSelector(({ user }) => user)

    const handleHideShowPassword = (index) => {
        if (index !== 0) setShowPassword(pre => [pre[0], !pre[1], !pre[2]])
        else setShowPassword(pre => [!pre[0], pre[1], pre[2]])
    }

    const changePasswordSubmit = (data, e) => {
        e.preventDefault()

        let password_regex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*\\s).{6,${MAX_PASSWORD_LENGTH}}$`)

        let old_password = data['The Old Password']
        let new_password = data['New Password']
        let retype_password = data['Retype The New Password']

        if (!password_regex.test(new_password)) {
            return setError('New Password')
        }
        if (new_password !== retype_password) {
            return setError('Retype The New Password')
        }

        dispatch(changePassword(old_password, new_password))
    }

    return (
        <ChangePasswordSection id="ChangePasswordSection">
            <Typography
                component="h2"
                margin="10px 0"
                width="100%"
                textAlign="center"
                fontSize="2.2em"
                fontWeight="bold"
            >
                CHANGE YOUR PASSWORD
            </Typography>
            <Typography
                fontSize="0.9em"
                textAlign="center"
            >
                We suggest you update your password one time per six months. Note that the fields with * is required.
            </Typography>

            <Stack width="100%" margin="20px 0 30px">
                <Box height="5px" width="40px" margin="auto" bgcolor="black" />
            </Stack>

            <Stack
                onSubmit={handleSubmit(changePasswordSubmit)}
                component="form"
                rowGap="10px"
                width="100%"
            >
                {
                    inputs.map(({ label, required, maxLength, warning, placeholder }, index) => (
                        <FormGroup key={label}>
                            <Label htmlFor={label}>
                                <span>{label}</span>
                                {required && <span className="required">*</span>}
                            </Label>
                            <Stack
                                justifyContent="space-between"
                                flexDirection="row"
                                alignItems="center"
                                width="100%"
                                border="2px black solid"
                                boxSizing="border-box"
                                bgcolor="white"
                                columnGap="5px"
                            >
                                <Input
                                    id={label}
                                    {...register(label, { required })}
                                    type={showPassword[index] ? 'text' : 'password'}
                                    maxLength={maxLength}
                                    autoComplete="on"
                                    placeholder={placeholder}
                                />
                                {
                                    showPassword[index] ?
                                        <VisibilityIcon
                                            sx={password_style}
                                            onClick={() => handleHideShowPassword(index)}
                                        />
                                        :
                                        <VisibilityOffIcon
                                            sx={password_style}
                                            onClick={() => handleHideShowPassword(index)}
                                        />
                                }
                            </Stack>
                            {
                                errors[label] &&
                                <InputWarning>
                                    <CancelIcon sx={{ color: 'red', fontSize: '1em' }} />
                                    <span>{warning}</span>
                                </InputWarning>
                            }
                        </FormGroup>
                    ))
                }

                <Tooltip title="Click to change to new password">
                    <SaveChangeBtn type="submit">
                        {
                            loading ?
                                <CircularProgress
                                    size={24}
                                    thickness={7}
                                    className="loading"
                                    sx={{ color: 'white' }}
                                />
                                :
                                <>
                                    <SaveAltIcon />
                                    <span>Save Change</span>
                                </>
                        }
                    </SaveChangeBtn>
                </Tooltip>
            </Stack>
        </ChangePasswordSection>
    )
}

export default ChangePassword

const ChangePasswordSection = styled('div')(({ theme }) => ({
    backgroundColor: '#F5F5F5',
    padding: '20px 30px 40px',
    boxSizing: 'border-box',
    width: '100%',
    fontFamily: theme.fontFamily.kanit,
}))

const FormGroup = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    columnGap: '5px',
    padding: '5px',
    width: '50%',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}))

const Label = styled('label')({
    display: 'flex',
    columnGap: '5px',
    fontSize: '1.4em',
    fontWeight: 'bold',
    marginLeft: '5px',
    width: '100%',
    '& span.required': {
        color: 'red',
    },
})

const Input = styled('input')(({ theme }) => ({
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 'unset',
    border: 'none',
    padding: '8px 15px',
    fontSize: '1em',
    outline: 'unset',
    boxSizing: 'border-box',
    fontFamily: theme.fontFamily.nunito,
}))

const InputWarning = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '5px',
    alignItems: 'center',
    color: 'red',
    marginTop: '3px',
    marginLeft: '3px',
    fontFamily: theme.fontFamily.nunito,
}))

const SaveChangeBtn = styled('button')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: '10px',
    border: '2px #2D2D2D solid',
    backgroundColor: '#2D2D2D',
    margin: '0 auto',
    boxSizing: 'border-box',
    width: 'fit-content',
    padding: '10px 35px',
    color: 'white',
    borderRadius: '30px',
    marginTop: '20px',
    fontSize: '1em',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
        '& span.loading': {
            color: 'black',
        }
    },
    '&:active': {
        backgroundColor: '#2D2D2D',
        color: 'white',
    }
})