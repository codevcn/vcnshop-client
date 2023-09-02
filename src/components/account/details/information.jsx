import React, { useEffect } from "react"
import { styled } from '@mui/material/styles'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import RadioGroup from '@mui/material/RadioGroup'
import { FormControlLabel } from "@mui/material"
import { Radio } from "@mui/material"
import CancelIcon from '@mui/icons-material/Cancel'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { useDispatch, useSelector } from "react-redux"
import { updateProfile } from "../../../store/actions/user_actions"
import { CircularProgress } from "@mui/material"
import ErrorIcon from '@mui/icons-material/Error'
import { Stack, Tooltip, Box, Typography } from '@mui/material'
import { toast } from "react-toastify"

const radio_style = {
    '&.Mui-checked': {
        color: 'black',
    },
}

const SubmitBtn = () => {
    const { loading } = useSelector(({ user }) => user)

    return (
        <Tooltip title="Submit the change">
            <SaveChangeBtn type="submit">
                {
                    loading ?
                        <CircularProgress
                            sx={{ color: 'white' }}
                            size={24}
                            thickness={7}
                        />
                        :
                        <>
                            <SaveAltIcon />
                            <span>Save Change</span>
                        </>
                }
            </SaveChangeBtn>
        </Tooltip>
    )
}

const ShippingInfo = () => {

    const shipping_info = localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : null

    return (
        <FormGroup sx={{ marginTop: '10px' }}>
            <Label>Your Default Address</Label>
            {
                shipping_info ?
                    <div style={{ color: 'gray', fontFamily: '"Kanit", "sans-serif"' }}>
                        {shipping_info.Country && `${shipping_info.Country}, `}
                        {shipping_info.State && `${shipping_info.State}, `}
                        {shipping_info.City && `${shipping_info.City}, `}
                        {shipping_info.Address && `${shipping_info.Address}. `}
                        {shipping_info['Zip Code'] && `Zip Code: ${shipping_info['Zip Code']}`}
                    </div>
                    :
                    <Note>
                        <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                        <span>You didn't provide any addresses</span>
                    </Note>
            }
        </FormGroup>
    )
}

const ConnectForm = ({ children }) => {
    const useForm_methods = useFormContext()
    return children({ ...useForm_methods })
}

const set_inputs = (nameOfUser, email) => [
    {
        label: 'Full Name',
        defaultValue: nameOfUser,
        required: false,
        maxLength: 25,
        warning: 'Full Name field mustn\'t contain special characters. And must be between 2 and 25 characters long.',
    }, {
        label: 'Email',
        defaultValue: email,
        required: true,
        maxLength: 35,
        warning: 'Please enter format of the email correctly!',
    },
]

const UserInformation = () => {
    const { user, error } = useSelector(({ user }) => user)

    useEffect(() => {
        if (error) {
            toast.error(error.message)
        }
    }, [error])

    const EmailField = ({ defaultValue, label }) => (
        <FormGroup>
            <Box sx={{ opacity: '0.5' }}>
                <Label>
                    <span>{label}</span>
                </Label>
                <Input
                    defaultValue={defaultValue}
                    readOnly
                />
            </Box>
            <Note>
                <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                <span>Currently we don't allow you to edit your email. Sorry for this!</span>
            </Note>
        </FormGroup>
    )

    return (
        <ConnectForm>
            {({ register, formState: { errors } }) => (
                <>
                    {
                        set_inputs(user.name, user.email).map(({ label, required, warning, maxLength, defaultValue }) => (
                            label === 'Email' ?
                                <EmailField label={label} defaultValue={defaultValue} key={label} />
                                :
                                <FormGroup key={label}>
                                    <Label htmlFor={label}>
                                        <span>{label}</span>
                                        {required && <span className="required">*</span>}
                                    </Label>
                                    <Input
                                        id={label}
                                        {...register(label, { required })}
                                        maxLength={maxLength}
                                        autoComplete="on"
                                        defaultValue={defaultValue}
                                    />
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

                    <FormGroup>
                        <Label>Gender</Label>
                        <RadioGroup
                            row
                            defaultValue={user.gender}
                        >
                            <FormControlLabel sx={{ color: 'black' }} value="Female" control={<Radio {...register('Gender')} size="small" color="default" sx={radio_style} />} label="Female" />
                            <FormControlLabel sx={{ color: 'black' }} value="Male" control={<Radio {...register('Gender')} size="small" color="default" sx={radio_style} />} label="Male" />
                            <FormControlLabel sx={{ color: 'black' }} value="Other" control={<Radio {...register('Gender')} size="small" color="default" sx={radio_style} />} label="Other" />
                        </RadioGroup>
                    </FormGroup>
                </>
            )}
        </ConnectForm>
    )
}

const Information = () => {
    const useForm_methods = useForm()
    const { handleSubmit, setError } = useForm_methods
    const dispatch = useDispatch()

    const saveChangeSubmit = (data, e) => {
        e.preventDefault()

        let full_name_regex = /^([a-zA-Z0-9_\- ]){2,}$/

        let Full_Name = data['Full Name']
        let Gender = data.Gender

        if (!full_name_regex.test(Full_Name)) {
            return setError('Full Name')
        }

        dispatch(updateProfile(Full_Name, Gender))
    }

    return (
        <InformationSection id="Information-Profile">

            <Typography
                margin="10px 0"
                width="100%"
                textAlign="center"
                fontSize="2.2em"
                fontWeight="bold"
            >
                PERSONAL INFORMATION
            </Typography>
            <Typography
                fontSize="0.9em"
                textAlign="center"
            >
                Feel free to edit any your detail below if you want to update your information. Note that the fields with * is required.
            </Typography>

            <Stack width="100%" margin="20px 0 30px">
                <Box height="5px" width="40px" margin="auto" bgcolor="black" />
            </Stack>

            <Stack
                onSubmit={handleSubmit(saveChangeSubmit)}
                component="form"
                rowGap="10px"
                width="100%"
            >

                <FormProvider {...useForm_methods}>

                    <UserInformation />

                    <ShippingInfo />

                    <SubmitBtn />

                </FormProvider>

            </Stack>

        </InformationSection>
    )
}

export default Information

const InformationSection = styled('div')(({ theme }) => ({
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
    width: '100%',
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
    width: '55%',
    '& span.required': {
        color: 'red',
    },
})

const Input = styled('input')(({ theme }) => ({
    width: '55%',
    backgroundColor: 'white',
    borderRadius: 'unset',
    border: '2px black solid',
    padding: '8px 15px',
    fontSize: '1em',
    outline: 'unset',
    boxSizing: 'border-box',
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}))

const InputWarning = styled('div')({
    display: 'flex',
    columnGap: '3px',
    alignItems: 'center',
    marginTop: '5px',
    marginLeft: '5px',
    color: 'red',
    fontSize: '0.9em',
})

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
        '& svg': {
            color: 'black',
        }
    },
    '&:active': {
        backgroundColor: '#2D2D2D',
        color: 'white',
        '& svg': {
            color: 'white',
        }
    }
})

const Note = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginTop: '5px',
    paddingLeft: '10px',
    '& span': {
        fontFamily: theme.fontFamily.nunito,
        fontSize: '0.8em',
    }
}))