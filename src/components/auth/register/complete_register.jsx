import React, { useState } from "react"
import { useForm, useFormContext, FormProvider, Controller } from "react-hook-form"
import { styled } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch, useSelector } from "react-redux"
import { completeRegister } from "../../../store/actions/user_actions"
import ClearIcon from '@mui/icons-material/Clear'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import CancelIcon from '@mui/icons-material/Cancel'
import RadioGroup from '@mui/material/RadioGroup'
import { Box, FormControlLabel, Radio, Stack, Typography } from "@mui/material"
import { MAX_PASSWORD_LENGTH } from "../../../configs/constants"

const inputs = [
    {
        label: 'Full Name',
        required: true,
        max_length: 25,
        helper_text: 'We will use this one to display to other members.',
        warning: 'Full Name field mustn\'t contain special characters. And must be between 2 and 25 characters long.',
    }, {
        label: 'Password',
        required: true,
        max_length: MAX_PASSWORD_LENGTH,
        helper_text: 'Use this one with your email to login',
        warning: `Password must be between 6 and ${MAX_PASSWORD_LENGTH} characters long. And must contain at least one capital letter and one number and one lowercase letter.`,
    }, {
        label: 'Retype Password',
        required: true,
        max_length: 20,
        helper_text: 'Must match the typed password',
        warning: 'Not match the typed password',
    }
]

const input_icon_style = {
    color: 'white',
    cursor: 'pointer',
    transform: 'scale(0.8)',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.1)',
    },
}

const ConnectForm = ({ children }) => {
    const useForm_methods = useFormContext()
    return children({ ...useForm_methods })
}

const Warning = ({ error, text, className }) => {
    return (
        error &&
        <InputWarningContainer className={className || ''}>
            <CancelIcon sx={{ height: '0.7em', color: 'red', }} />
            <InputWarningText>{text}</InputWarningText>
        </InputWarningContainer>
    )
}

const FormGroup = ({ inputInfo, reset, errors, register }) => {
    const { label, helper_text, required, max_length, warning } = inputInfo

    const [showPassword, setShowPassword] = useState(false)

    const handleShowPassword = () => setShowPassword(pre => !pre)

    const clearInput = (input_label) => {
        reset({
            [input_label]: '',
        }, {
            keepErrors: false,
            keepDirty: false,
        })
    }

    return (
        <InputFormGroup key={label}>
            <InputLabelContainer>
                <InputLabel htmlFor={label}>
                    {label}
                </InputLabel>
                {required && <span className="force">*</span>}
            </InputLabelContainer>

            <InputContainer>
                <Box
                    className="ArrowIconWrapper"
                    component="div"
                    display='none'
                    justifyContent='center'
                    alignItems='center'
                    height='100%'
                    position='absolute'
                    left='-25px'
                    top='0'
                >
                    <ArrowRightIcon sx={{ color: 'white', width: '1.2em', height: '1.2em' }} />
                </Box>

                <Input
                    autoComplete="on"
                    id={label}
                    maxLength={max_length}
                    type={label !== 'Password' && label !== 'Retype Password' ? 'text' : showPassword ? 'text' : 'password'}
                    {...register(label, { required: required })}
                />

                <Stack justifyContent="center" alignItems="center" height="100%">
                    {
                        label !== 'Password' && label !== 'Retype Password' ? (
                            <ClearIcon
                                sx={input_icon_style}
                                onClick={() => clearInput(label)}
                            />
                        ) : showPassword ? (
                            <VisibilityIcon
                                sx={input_icon_style}
                                onClick={handleShowPassword}
                            />
                        ) :
                            <VisibilityOffIcon
                                sx={input_icon_style}
                                onClick={handleShowPassword}
                            />
                    }
                </Stack>
            </InputContainer>

            <HelperText>{helper_text}</HelperText>

            <Warning error={errors[label]} text={warning} />
        </InputFormGroup>
    )
}

const radio_style = {
    color: 'white',
    '&.Mui-checked': {
        color: '#00faff',
    },
}

const RenderRadioInput = () => <Radio size="small" color="default" sx={radio_style} />

const EmailWasTyped = ({ emailWasTyped }) => {
    return (
        <InputFormGroup sx={{ opacity: '0.6', marginTop: '10px' }}>
            <InputLabelContainer>
                <InputLabel>Email</InputLabel>
            </InputLabelContainer>
            <InputContainer>
                <Input value={emailWasTyped} readOnly />
            </InputContainer>
            <HelperText>Email you provided</HelperText>
        </InputFormGroup>
    )
}

const Gender = ({ control, errors }) => {
    return (
        <InputFormGroup>

            <InputLabelContainer sx={{ fontSize: '1.1em', marginBottom: '5px' }}>
                <InputLabel>Gender</InputLabel>
            </InputLabelContainer>

            <Controller
                control={control}
                name="Gender"
                rules={{ required: true }}
                render={({ field: { onChange } }) => (
                    <RadioGroup
                        row
                        onChange={onChange}
                    >
                        <FormControlLabel sx={{ color: 'white' }} value="Female" control={RenderRadioInput()} label="Female" />
                        <FormControlLabel sx={{ color: 'white' }} value="Male" control={RenderRadioInput()} label="Male" />
                        <FormControlLabel sx={{ color: 'white' }} value="Other" control={RenderRadioInput()} label="Other" />
                    </RadioGroup>
                )}
            />

            <Warning error={errors.Gender} text={'Plase pick a gender!'} />

        </InputFormGroup>
    )
}

const Inputs = React.memo(() => {

    return (
        <ConnectForm>
            {({ register, formState: { errors }, reset, control }) => (
                <Stack id="InformationsSection" margin="20px 0 0">

                    {
                        inputs.map((input) => (
                            <FormGroup
                                inputInfo={input}
                                errors={errors}
                                reset={reset}
                                register={register}
                                key={input.label}
                            />
                        ))
                    }

                    <Gender control={control} errors={errors} />

                </Stack>
            )}
        </ConnectForm>
    )
})

const TermOfUse = () => {

    return (
        <ConnectForm>
            {({ formState: { errors }, control }) => (
                <Stack rowGap="5px" marginTop="10px">

                    <Controller
                        control={control}
                        name="TermOfUse"
                        rules={{ required: true }}
                        render={({ field: { onChange } }) => (
                            <CheckboxContainer>
                                <Checkbox
                                    color="default"
                                    size="small"
                                    sx={{ color: 'red', width: '1em', height: '1em' }}
                                    id="TermOfUse"
                                    onChange={onChange}
                                />

                                <Typography
                                    htmlFor="TermOfUse"
                                    component="label"
                                    marginLeft='5px'
                                    marginTop='1px'
                                    fontSize='0.9em'
                                    color='white'
                                    sx={{ cursor: 'pointer' }}
                                >
                                    Accept our terms of use.
                                </Typography>

                                <span className="star_character">*</span>
                            </CheckboxContainer>
                        )}
                    />

                    <Warning
                        error={errors.TermOfUse}
                        text={'You must acccept our terms of use. Please!'}
                        className={errors.TermOfUse ? 'term_of_use_warning' : ''}
                    />

                </Stack>
            )}
        </ConnectForm>
    )
}

const CompleteRegister = ({ emailWasTyped }) => {
    const useForm_methods = useForm()
    const { handleSubmit, setError } = useForm_methods
    const { loading } = useSelector(({ user }) => user)
    const dispatch = useDispatch()

    const submitProvideInfo = (data, e) => {
        e.preventDefault()

        let full_name_regex = /^([a-zA-Z0-9_\- ]){2,25}$/
        let password_regex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*\\s).{6,${MAX_PASSWORD_LENGTH}}$`)

        let Full_Name = data['Full Name']
        let Password = data.Password
        let Retype_Password = data['Retype Password']
        let Gender = data.Gender

        if (!full_name_regex.test(Full_Name)) {
            setError('Full Name')
            return
        }
        if (!password_regex.test(Password)) {
            setError('Password')
            return
        }
        if (Retype_Password !== Password) {
            setError('Retype Password')
            return
        }

        dispatch(completeRegister(Full_Name, emailWasTyped, Password, Gender))
    }

    return (
        <ProvideInfoForm
            id="CompleteRegister"
            onSubmit={handleSubmit(submitProvideInfo)}
        >
            <Title>We need more information...</Title>
            <Typography
                margin='0'
                marginTop='10px'
                fontSize='0.9em'
                fontStyle='italic'
                color='white'
                textAlign='center'
            >
                The information below may serve to improve user experience
                in the future, we assure you that the information you
                provide is completely confidential and will be protected
                in accordance with our privacy policy. Thank you!
            </Typography>

            <Divider sx={{ backgroundColor: '#999999', marginTop: '20px' }} />

            <EmailWasTyped emailWasTyped={emailWasTyped} />

            <FormProvider {...useForm_methods}>
                <Inputs />

                <Divider sx={{ backgroundColor: '#999999', marginTop: '10px', }} />

                <TermOfUse />
            </FormProvider>

            <SubmitBtn>
                {
                    loading ?
                        <CircularProgress
                            sx={{ color: 'black' }}
                            size={19}
                            thickness={6}
                        />
                        : <span>Start Shopping</span>
                }
            </SubmitBtn>
        </ProvideInfoForm >
    )
}

export default CompleteRegister

const ProvideInfoForm = styled('form')(({ theme }) => ({
    ...theme.auth_background,
    fontFamily: theme.fontFamily.nunito,
    overflowY: 'auto',
    [theme.breakpoints.down('lg')]: {
        minWidth: '100%',
        padding: '30px',
    }
}))

const InputFormGroup = styled('div')({
    '&:not(:first-of-type)': {
        marginTop: '20px',
    }
})

const InputLabelContainer = styled('div')({
    display: 'flex',
    '& span.force': {
        color: 'red',
        fontWeight: 'bold',
        fontSize: '1.2em',
    }
})

const InputLabel = styled('label')({
    display: 'block',
    width: 'fit-content',
    color: 'white',
    margin: '0px 5px 3px',
    fontWeight: 'bold',
    fontFamily: 'arial',
})

const InputContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    border: '1.5px #00faff solid',
    boxSizing: 'border-box',
    padding: '5px',
    paddingRight: '8px',
})

const Input = styled('input')({
    color: 'white',
    margin: '0',
    outline: 'unset',
    fontSize: '0.9em',
    border: 'none',
    paddingLeft: '5px',
    width: '90%',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    letterSpacing: '1px',
    '&:hover , :focus': {
        borderRightWidth: '6px',
    },
    '&:focus ~ .ArrowIconWrapper': {
        display: 'flex',
    }
})

const HelperText = styled('div')({
    color: 'white',
    fontSize: '0.8em',
    fontStyle: 'italic',
    marginTop: '4px',
    marginLeft: '3px',
})

const InputWarningContainer = styled('span')({
    display: 'flex',
    alignItems: 'center',
    marginTop: '3px',
    '&.term_of_use_warning': {
        animation: 'Term_of_use_warning 0.5s 1',
    },
    '@keyframes Term_of_use_warning': {
        '0%': { 'transform': 'translate(1px, 1px) rotate(0deg)' },
        '10%': { 'transform': 'translate(-1px, -2px) rotate(1deg)' },
        '20%': { 'transform': 'translate(-3px, 0px) rotate(-1deg)' },
        '30%': { 'transform': 'translate(3px, 2px) rotate(0deg)' },
        '40%': { 'transform': 'translate(1px, -1px) rotate(-1deg)' },
        '50%': { 'transform': 'translate(-1px, 2px) rotate(1deg)' },
        '60%': { 'transform': 'translate(-3px, 1px) rotate(0deg) ' },
        '70%': { 'transform': 'translate(3px, 1px) rotate(1deg)' },
        '80%': { 'transform': 'translate(-1px, -1px) rotate(-1deg)' },
        '90%': { 'transform': 'translate(1px, 2px) rotate(0deg)' },
        '100%': { 'transform': 'translate(1px, -2px) rotate(1deg)' },
    }
})

const InputWarningText = styled('p')({
    color: 'red',
    fontSize: '0.8em',
    margin: '0',
    height: 'min-content',
})

const Title = styled('h2')({
    color: 'white',
    margin: '0',
    fontSize: '1.5em',
    fontWeight: 'bold',
    paddingBottom: '8px',
    width: 'fit-content',
    position: 'relative',
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

const CheckboxContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    '& span.star_character': {
        display: 'inline-block',
        color: 'red',
        fontSize: '1.5em',
        height: '22px',
        marginLeft: '5px',
    }
})

const SubmitBtn = styled('button')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    padding: '10px',
    height: '36px',
    boxSizing: 'border-box',
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: 'white',
    border: 'unset',
    borderRadius: '3px',
    position: 'relative',
    '& span': {
        transition: 'letter-spacing 0.2s',
    },
    '&:hover span': {
        letterSpacing: '1px',
    }
})