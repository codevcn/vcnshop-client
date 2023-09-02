import React, { useState, useMemo } from "react"
import { styled } from '@mui/material/styles'
import HomeIcon from '@mui/icons-material/Home'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import PlaceIcon from '@mui/icons-material/Place'
import PhoneIcon from '@mui/icons-material/Phone'
import PublicIcon from '@mui/icons-material/Public'
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import axios from 'axios'
import { toast } from "react-toastify"
import WarningIcon from '@mui/icons-material/Warning'
import LocalConvenienceStoreIcon from '@mui/icons-material/LocalConvenienceStore'
import { useNavigate, Navigate } from "react-router-dom"
import Select from '@mui/material/Select'
import { getCodeList } from 'country-list'
import { Divider, FormControlLabel, Radio, Stack, Tooltip, Typography, Paper, RadioGroup, Box } from "@mui/material"
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { useDispatch, useSelector } from "react-redux"
import { saveShippingInfo } from "../../store/actions/cart_actions"
import ErrorIcon from '@mui/icons-material/Error'
import { useTheme } from "@emotion/react"
import { get_user_location_api } from "../../apis/user_apis"

const defaultInputs = [
    {
        label: 'Address',
        icon: <HomeIcon />,
        required: true,
        maxLength: 80,
    }, {
        label: 'City',
        icon: <LocationCityIcon />,
        required: true,
        maxLength: 50,
    }, {
        label: 'State',
        icon: <LocalConvenienceStoreIcon />,
        required: true,
        maxLength: 50,
    }, {
        label: 'Zip Code',
        icon: <PlaceIcon />,
        required: true,
        maxLength: 20,
    }, {
        label: 'Country',
        icon: <PublicIcon />,
        required: true,
    }, {
        label: 'Phone Number',
        icon: <PhoneIcon />,
        required: false,
        maxLength: 20,
    },
]

const ConnectForm = ({ children }) => {
    const useForm_methods = useFormContext()
    return children({ ...useForm_methods })
}

const Country = ({ onSetValueInput, label, required, register }) => {

    const countries = useMemo(() => getCodeList(), [])

    const changePickCountry = (e, label) => {
        onSetValueInput(label, e.target.value)
    }

    return (
        <Stack width="100%">
            <StyledSelect
                native
                onChange={(e) => changePickCountry(e, label)}
                fullWidth
                inputProps={{ ...register(label, { required }) }}
            >
                <option value=""></option>
                {
                    Object.keys(countries).map((key) => (
                        <option
                            key={key}
                            value={countries[key]}
                        >
                            {countries[key]}
                        </option>
                    ))
                }
            </StyledSelect>
        </Stack>
    )
}

const InputWarning = ({ label, error }) => {
    return (
        error &&
        <Stack
            flexDirection="row"
            alignItems='center'
            columnGap='5px'
            padding='3px'
            fontSize='0.9em'
            color='red'
            marginLeft='40px'
            marginTop='3px'
        >
            <WarningIcon sx={{ color: 'red', fontSize: '1.2em' }} />
            <span>
                {
                    label === 'Phone Number' ?
                        'Please type a correct phone number format that starts with calling code. Example: +1...'
                        :
                        'Please don\'t empty this field'
                }
            </span>
        </Stack>
    )
}

const ShippingMethod = ({ method, label, helper_text, cost }) => {
    const theme = useTheme()

    return (
        <Stack
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            padding="10px 20px"
        >
            <div>
                <FormControlLabel
                    value={method}
                    control={<StyledRadio color="default" />}
                    label={label}
                />

                <HelperText>{helper_text}</HelperText>
            </div>

            <Typography fontFamily={theme.fontFamily.kanit}>
                {cost}
            </Typography>
        </Stack>
    )
}

const shipping_methods = [
    {
        method: 'Sea',
        label: 'Sea Transport',
        period: '5 - 7 bussiness days',
        cost: 'Free',
        cost_value: 0,
    }, {
        method: 'Airport',
        label: 'Airport',
        period: '1 - 3 bussiness days',
        cost: '$3',
        cost_value: 3,
    },
]

const ShippingMethods = () => {
    return (
        <ShippingMethodsSection>
            <Note sx={{ marginBottom: '20px' }}>
                <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                <span>Select a shipping method you want for your order</span>
            </Note>

            <ConnectForm>
                {({ control }) => (
                    <Controller
                        control={control}
                        name="Shipping Method"
                        render={({ field: { onChange } }) => (
                            <RadioGroup onChange={onChange}>
                                <Stack rowGap="20px">
                                    {
                                        shipping_methods.map(({ method, label, period, cost }) => (
                                            <Paper elevation={2} key={label}>
                                                <ShippingMethod
                                                    method={method}
                                                    label={label}
                                                    helper_text={period}
                                                    cost={cost}
                                                />
                                            </Paper>
                                        ))
                                    }
                                </Stack>
                            </RadioGroup>
                        )}
                    />
                )}
            </ConnectForm>
        </ShippingMethodsSection>
    )
}

const UserLocation = ({ onSetInputValue, onGetInputValues, onClearsError }) => {
    const [loading, setLoading] = useState(false)

    const getUserLocation = async () => {
        let user_location_detail

        setLoading(true)

        try {
            let { data } = await axios.get(get_user_location_api)

            user_location_detail = {
                'Country': data.country_name,
                'State': data.region_name,
                'City': data.city_name,
                'Zip Code': data.zip_code,
            }
        } catch (error) {
            user_location_detail = error
        }

        setLoading(false)

        if (user_location_detail instanceof Error)
            return toast.error(user_location_detail.response ? user_location_detail.response.data.message : 'Something went wrong, please try again some minutes later!')

        for (let { label } of defaultInputs) {
            onSetInputValue(label, user_location_detail[label] || '')
            if (onGetInputValues(label)) onClearsError(label)
        }

        toast.success('Apply your location successfully!')
    }

    return (
        <Tooltip
            title="Click to use your location"
        >
            <StyledMyLocationIcon
                sx={loading && { animationDuration: '2s', pointerEvents: 'none', cursor: 'not-allowed' }}
                onClick={getUserLocation}
            />
        </Tooltip>
    )
}

const DefaultAddress = ({ onSetInputValue, onGetInputValues, onClearsError }) => {

    const usingDefaultAddress = () => {
        let default_address = localStorage.getItem('shippingInfo')
        if (!default_address)
            return toast.warning('You don\'t set a default address yet')

        default_address = JSON.parse(default_address)

        for (let { label } of defaultInputs) {
            onSetInputValue(label, default_address[label] || '')
            if (onGetInputValues(label)) onClearsError(label)
        }
    }

    return (
        <Tooltip
            title="Click to use your default address"
        >
            <StyledBookmarkIcon onClick={usingDefaultAddress} />
        </Tooltip>
    )
}

const Inputs = () => {
    return (
        <ConnectForm>
            {({ register, setValue, formState: { errors } }) => (
                <Box
                    paddingLeft='10px'
                    width='100%'
                    boxSizing='border-box'
                >
                    {
                        defaultInputs.map(({ label, icon, required, maxLength }) => (
                            <FormGroup key={label}>
                                <InputLabel>{label}</InputLabel>

                                <Stack
                                    flexDirection="row"
                                    alignItems='center'
                                    columnGap='10px'
                                    width='100%'
                                >
                                    {icon}
                                    {
                                        label === 'Country' ?
                                            <Country
                                                onSetValueInput={setValue}
                                                required={required}
                                                label={label}
                                                register={register}
                                            />
                                            :
                                            <Input
                                                placeholder={'Enter ' + label + ' here...'}
                                                {...register(label, { required })}
                                                maxLength={maxLength}
                                            />
                                    }
                                </Stack>

                                <InputWarning label={label} error={errors[label]} />
                            </FormGroup>
                        ))
                    }
                </Box>
            )}
        </ConnectForm>
    )
}

const ShippingInfo = () => {
    const number_of_items_in_cart = useSelector(({ cart }) => cart.cartItems.length)
    const useForm_methods = useForm()
    const { handleSubmit } = useForm_methods
    const dispatch = useDispatch()
    const navigate = useNavigate()

    if (number_of_items_in_cart === 0) {
        return (<Navigate to={-1} />)
    }

    const shippingSubmit = (data, e) => {
        e.preventDefault()

        let { setError } = useForm_methods
        let {
            Address,
            City,
            State,
            'Zip Code': Zip_Code,
            Country,
            'Phone Number': Phone_Number,
            'Shipping Method': Shipping_Method,
        } = data

        if (Phone_Number) {
            let phone_number = Phone_Number.trim()
            if (phone_number[0] !== '+' || /[a-zA-Z]/.test(phone_number) || phone_number.length < 6)
                return setError('Phone Number')
        }
        if (!Shipping_Method)
            return toast.warning('Please select a shipping method')

        let shipping_method_selected = shipping_methods.find(({ method }) => method === Shipping_Method)

        let shipping_info = {
            'Address': Address,
            'City': City,
            'State': State,
            'Zip Code': Zip_Code,
            'Country': Country,
            'Phone Number': Phone_Number,
            'Method': {
                'name': Shipping_Method,
                'cost': shipping_method_selected.cost_value,
            }
        }

        dispatch(saveShippingInfo(shipping_info))

        navigate('/checkout/confirm_order')
    }

    return (
        <ShippingInfoSection id="ShippingInfoSection">

            <SectionTitle>Delivery Information</SectionTitle>

            <ShippingMethodsAndInputs>

                <FormProvider {...useForm_methods}>
                    <ShippingMethods />
                </FormProvider>

                <Divider orientation="vertical" variant="middle" flexItem />

                <InputsSection>
                    <FormProvider {...useForm_methods}>
                        <Inputs />
                    </FormProvider>

                    <Stack marginTop="30px" alignItems="center">
                        <Note>
                            <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                            <span>The shipping info above will be set to your default address ater you continue</span>
                        </Note>

                        <SubmitBtn onClick={handleSubmit(shippingSubmit)}>
                            <span>Continue</span>
                            <DoubleArrowIcon />
                        </SubmitBtn>
                    </Stack>
                </InputsSection>

                <LocationSection>
                    <UserLocation
                        onSetInputValue={useForm_methods.setValue}
                        onClearsError={useForm_methods.clearErrors}
                        onGetInputValues={useForm_methods.getValues}
                    />

                    <Box marginTop="50px" />

                    <DefaultAddress
                        onSetInputValue={useForm_methods.setValue}
                        onClearsError={useForm_methods.clearErrors}
                        onGetInputValues={useForm_methods.getValues}
                    />
                </LocationSection>

            </ShippingMethodsAndInputs>

        </ShippingInfoSection >
    )
}

export default ShippingInfo

const ShippingInfoSection = styled('div')(({ theme }) => ({
    width: '100%',
    fontFamily: theme.fontFamily.nunito,
    margin: '20px 0',
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
    color: 'white',
    boxSizing: 'border-box',
    margin: '20px 0',
    textAlign: 'center',
    padding: '15px',
    width: '100%',
    fontSize: '1.5em',
    backgroundColor: 'black',
    letterSpacing: '3px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.2em',
    }
}))

const ShippingMethodsAndInputs = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: "20px",
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    }
}))

const ShippingMethodsSection = styled('div')(({ theme }) => ({
    width: "50%",
    paddingLeft: "20px",
    boxSizing: "border-box",
    [theme.breakpoints.down('sm')]: {
        width: "100%",
        paddingLeft: "0",
    }
}))

const InputsSection = styled('div')(({ theme }) => ({
    width: '50%',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        paddingRight: '15px',
        boxSizing: 'border-box',
    }
}))

const icon_style = {
    margin: 'auto',
    fontSize: '2em',
    padding: '7px',
    borderRadius: '50%',
    cursor: 'pointer',
    animation: 'get_user_location 0s infinite linear',
    '&:hover': {
        outline: '2px black solid',
    },
}

const StyledMyLocationIcon = styled(MyLocationIcon)({
    ...icon_style,
    '@keyframes get_user_location': {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
    },
})

const StyledBookmarkIcon = styled(BookmarkIcon)({
    ...icon_style,
})

const FormGroup = styled('div')({
    marginTop: '20px',
    width: '100%',
})

const StyledSelect = styled(Select)({
    borderRadius: 'unset',
    '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'unset',
        }
    },
    '&.MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderRightWidth: '8px',
        borderColor: 'unset',
    },
    '& fieldset': {
        border: '1px black solid',
    },
    '& select': {
        display: 'block',
        padding: '10px 15px',
        '& option': {
            color: 'black',
        }
    },
    '& svg': {
        color: 'black',
        fontSize: '2em',
    }
})

const InputLabel = styled('label')({
    display: 'block',
    fontSize: '1em',
    fontWeight: 'bold',
    marginBottom: '5px',
    marginLeft: '40px',
})

const Input = styled('input')({
    border: '1px black solid',
    width: '100%',
    padding: '10px 15px',
    fontSize: '1em',
    outline: 'unset',
    '&:focus': {
        borderRightWidth: '8px',
        outline: '1.5px black solid',
    },
})

const Note = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginTop: '10px',
    paddingLeft: '10px',
    '& span': {
        fontFamily: '"Nunito", "sans-serif"',
        fontSize: '0.8em',
    }
})

const SubmitBtn = styled('button')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    backgroundColor: 'black',
    color: 'white',
    padding: '8px 30px',
    fontSize: '1em',
    marginTop: '20px',
    border: '2px black solid',
    cursor: 'pointer',
    boxSizing: 'border-box',
    borderRadius: '20px',
    width: 'fit-content',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
    },
    '&:active': {
        backgroundColor: 'black',
        color: 'white',
    },
})

const HelperText = styled('div')({
    color: 'gray',
    fontFamily: '"Gill Sans", sans-serif',
    fontSize: '0.8em',
    marginBottom: '5px',
})

const StyledRadio = styled(Radio)({
    pointerEvents: 'none',
    color: 'black',
    '& .MuiSvgIcon-root': {
        fontSize: '1em',
    },
})

const LocationSection = styled('div')(({ theme }) => ({
    height: "fit-content",
    padding: "20px 10px",
    paddingRight: "20px",
    position: "sticky",
    top: "0",
    justifyContent: "",
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    }
}))