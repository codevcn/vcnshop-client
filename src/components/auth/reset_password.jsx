import React, { useCallback, useState } from "react"
import { styled } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import { useForm, useFormContext, FormProvider } from "react-hook-form"
import CancelIcon from '@mui/icons-material/Cancel'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch, useSelector } from "react-redux"
import { resetPassword } from "../../store/actions/user_actions"
import { Box, Stack } from "@mui/material"
import { MAX_PASSWORD_LENGTH } from "../../configs/constants"

const show_password_icon_style = {
    color: 'white',
    cursor: 'pointer',
    transform: 'scale(0.8)',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.1)',
    }
}

const ConnectForm = ({ children }) => {
    const useForm_methods = useFormContext()
    return children({ ...useForm_methods })
}

const Warning = ({ order }) => {
    let warning_text
    if (order === 'NewPassword')
        warning_text = `Password must be between 6 and ${MAX_PASSWORD_LENGTH} characters long. And must contain at least one capital letter and one number and one lowercase letter.`
    if (order === 'ConfirmPassword')
        warning_text = 'Password doesn\'t match.'
    return (
        <Stack flexDirection="row" marginTop="5px" alignItems="center">
            <CancelIcon sx={{ height: '0.7em', color: 'red' }} />
            <InputWarningText>{warning_text}</InputWarningText>
        </Stack>
    )
}

const FormGroup = ({ label, displayLabel, showPassword, onShowPassword }) => {

    return (
        <ConnectForm>
            {({ register, formState: { errors } }) => (
                <Stack justifyContent="center" marginTop="15px">

                    <Stack position="relative" width="100%">
                        <NewPasswordInput
                            label={displayLabel}
                            variant="standard"
                            {...register(label)}
                            fullWidth
                            type={showPassword ? "text" : "password"}
                        />
                        <ShowPasswordIconInputWrapper>
                            {
                                showPassword ?
                                    <VisibilityIcon
                                        onClick={onShowPassword}
                                        sx={show_password_icon_style}
                                    />
                                    :
                                    <VisibilityOffIcon
                                        onClick={onShowPassword}
                                        sx={show_password_icon_style}
                                    />
                            }
                        </ShowPasswordIconInputWrapper>
                    </Stack>

                    {errors[label] && <Warning order={label} />}

                </Stack>
            )}
        </ConnectForm>
    )
}

const Inputs = () => {
    const [showPassword, setshowPassword] = useState(false)

    const handleShowPassword = useCallback(() => {
        setshowPassword(pre => !pre)
    }, [setshowPassword])

    return (
        <>
            <FormGroup
                label={'NewPassword'}
                displayLabel={'Enter a new password'}
                showPassword={showPassword}
                onShowPassword={handleShowPassword}
            />

            <FormGroup
                label={'ConfirmPassword'}
                displayLabel={'Re-enter the new password'}
                showPassword={showPassword}
                onShowPassword={handleShowPassword}
            />
        </>
    )
}

const ResetPasswordSection = ({ emailWasTyped }) => {
    const { loading } = useSelector(({ user }) => user)
    const useForm_methods = useForm()
    const { handleSubmit, setError } = useForm_methods
    const dispatch = useDispatch()

    const resetPasswordSubmit = (data, e) => {
        e.preventDefault()

        let password_regex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*\\s).{6,${MAX_PASSWORD_LENGTH}}$`)

        let new_password = data.NewPassword
        let confirm_password = data.ConfirmPassword

        if (!password_regex.test(new_password))
            return setError('NewPassword')
        if (confirm_password !== new_password)
            return setError('ConfirmPassword')

        dispatch(resetPassword(emailWasTyped, new_password))
    }

    const cancelResetPassword = () => {
        window.open('/auth/login', '_self')
    }

    return (
        <NewPasswordForm
            onSubmit={handleSubmit(resetPasswordSubmit)}
            id="NewPasswordForm"
        >
            <Title>New Password</Title>
            <HelperText>
                You need to update your password every time you get a recover password code.
                All this because of safety of your account. Thanks!
            </HelperText>

            <Divider sx={{ borderColor: '#858585', marginTop: '10px' }} />

            <FormProvider {...useForm_methods}>
                <Inputs />
            </FormProvider>

            <Box
                display='flex'
                columnGap='3px'
                marginTop='20px'
            >
                <Button
                    onClick={cancelResetPassword}
                    type="button"
                >
                    Cancle Update
                </Button>
                <Button type="submit">
                    {
                        loading ?
                            <CircularProgress
                                sx={{ color: 'black', margin: 'auto' }}
                                size={18}
                                thickness={6}
                            />
                            : <span>Update Password</span>
                    }
                </Button>
            </Box>
        </NewPasswordForm>
    )
}

export default ResetPasswordSection

const NewPasswordForm = styled('form')(({ theme }) => ({
    ...theme.auth_background,
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('md')]: {
        minWidth: '100%',
        padding: '20px',
    }
}))

const Title = styled('h2')(({ theme }) => ({
    color: 'white',
    margin: '0',
    fontFamily: theme.fontFamily.nunito,
    fontSize: '1.5em',
    fontWeight: 'bold',
    width: 'fit-content',
    position: 'relative',
    textShadow: '2px 2px #2dad9d ',
    marginTop: '10px',
}))

const HelperText = styled('p')(({ theme }) => ({
    margin: '20px 0 10px',
    fontFamily: theme.fontFamily.nunito,
    fontSize: '0.9em',
    fontStyle: 'italic',
    color: 'white',
    textAlign: 'center',
}))

const NewPasswordInput = styled(TextField)({
    '&.MuiTextField-root': {
        '& label.css-aqpgxn-MuiFormLabel-root-MuiInputLabel-root': {
            color: 'grey',
        },
        '& label.MuiInputLabel-shrink': {
            color: '#2dad9d',
        },
        '& label.MuiInputLabel-standard.Mui-focused': {
            color: '#2dad9d',
        },
    },
    '& .MuiInputBase-root': {
        '&:hover:not(.Mui-disabled)::before': {
            borderBottom: '1.5px white solid',
        },
        '&::before': {
            borderBottom: '1.5px white solid',
        },
        '&::after': {
            borderBottom: '2px #2dad9d solid',
        },
        '& input': {
            color: 'white',
            padding: '5px 10px',
        },
    }
})

const ShowPasswordIconInputWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '0',
    right: '9px',
    height: '100%',
})

const InputWarningText = styled('p')(({ theme }) => ({
    color: 'red',
    fontFamily: theme.fontFamily.nunito,
    fontSize: '0.8em',
    margin: '0',
    height: 'min-content',
}))

const Button = styled('button')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    flex: '1',
    borderRadius: '20px',
    padding: '5px',
    fontSize: '1.1em',
    fontFamily: theme.fontFamily.nunito,
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0px 5px grey',
    boxSizing: 'border-box',
    border: '2px black solid',
    position: 'relative',
    '&:hover': {
        top: '-3px',
        boxShadow: '0px 8px grey',
    },
    '&:active': {
        top: '5px',
        boxShadow: 'unset',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.9em',
    }
}))