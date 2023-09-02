import React from "react"
import { styled } from '@mui/material/styles'
import ErrorIcon from '@mui/icons-material/Error'
import { createShop } from "../../store/actions/shop_actions"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from "react-redux"
import { CircularProgress } from "@mui/material"
import CancelIcon from '@mui/icons-material/Cancel'

const max_fields_length = {
    StoreName: 50,
    Greeting: 500,
    Phone: 15,
}

const min_field_length = 3

const RegisterStore = () => {
    const { createShopProccessing } = useSelector(({ shop }) => shop)
    const { register, formState: { errors }, handleSubmit, setError } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const checkAndSubmit = (data, e) => {
        e.preventDefault()

        if (data['Phone Number'] && data['Phone Number'][0] !== '+')
            return setError('Phone Number', 'pattern')

        dispatch(createShop(
            data['Store Name'],
            data['Greeting'],
            data['Phone Number'],
        ))
    }

    const Field = ({ label, is_multiline, error, min_length, max_length, helper_text }) => {
        let error_text

        if (error) {
            if (error.type === 'required')
                error_text = 'Please don\'t empty this field'
            else if (error.type === 'maxLength' || error.type === 'minLength')
                error_text = `The store name must be between ${min_length} and ${max_length} characters`
            else if (error.type === 'pattern')
                error_text = 'Please check format of the content you typed'
        }

        error = !!error

        return (
            <TextField
                sx={{ marginTop: '20px' }}
                inputProps={{
                    ...register(label, {
                        maxLength: max_length,
                        minLength: min_length,
                        required: true,
                    }),
                    maxLength: max_length,
                }}
                rows={5}
                label={label}
                fullWidth
                helperText={error ? error_text : helper_text}
                error={error}
                multiline={is_multiline}
                color="success"
            />
        )
    }

    return (
        <RegisterStoreSection
            id="Register-Store"
        >

            <Note>
                <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                <span>
                    The store page is available only for users had a store account before.
                    And since you don't have any store account yet, let's create one.
                </span>
            </Note>

            <RegisterTitle>Register</RegisterTitle>

            <FieldContainer>

                <Field
                    label={'Store Name'}
                    is_multiline={false}
                    error={errors['Store Name']}
                    min_length={min_field_length}
                    max_length={max_fields_length.StoreName}
                    helper_text={"Please enter your store name"}
                />

                <Field
                    label={'Greeting'}
                    is_multiline={true}
                    error={errors['Greeting']}
                    min_length={min_field_length}
                    max_length={max_fields_length.Greeting}
                    helper_text={"Please enter your greeting, greet your customer when they visit your store"}
                />

                <Field
                    label={'Phone Number'}
                    is_multiline={false}
                    error={errors['Phone Number']}
                    min_length={min_field_length}
                    max_length={max_fields_length.Phone}
                    helper_text={"Add the phone number of you store, the customers'll use this one to contact to the vender. Example: +84123456789"}
                />

            </FieldContainer>

            <BtnContainer>
                {
                    createShopProccessing ?
                        <NavBtn type="button" sx={{ pointerEvents: 'none' }}>
                            <CircularProgress
                                sx={{ color: 'white' }}
                                size={18}
                                thickness={6}
                            />
                        </NavBtn>
                        :
                        <>
                            <NavBtn
                                type="button"
                                onClick={() => navigate(-1)}
                                className="cancel"
                            >
                                <CancelIcon />
                                <span>Cancel</span>
                            </NavBtn>

                            <NavBtn onClick={handleSubmit(checkAndSubmit)}>
                                <CheckCircleOutlineIcon />
                                <span>Submit</span>
                            </NavBtn>
                        </>
                }
            </BtnContainer>

        </RegisterStoreSection>
    )
}

export default RegisterStore

const RegisterStoreSection = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.nunito,
    padding: '20px',
}))

const Note = styled('p')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    fontSize: '0.8em',
    width: '100%',
    boxSizing: 'border-box',
    padding: '0 30px',
    margin: '0',
    fontFamily: "inherit",
    [theme.breakpoints.down('sm')]: {
        padding: '0 10px',
    }
}))

const RegisterTitle = styled('h2')({
    color: 'white',
    width: '100%',
    padding: '10px',
    textAlign: 'center',
    boxSizing: 'border-box',
    backgroundColor: 'black',
    borderRadius: '5px',
    margin: '20px 0',
    fontFamily: "inherit",
})

const FieldContainer = styled('div')(({ theme }) => ({
    padding: '0 30px',
    [theme.breakpoints.down('sm')]: {
        padding: '0',
    }
}))

const BtnContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    columnGap: '30px',
    width: '100%',
    marginTop: '30px',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        width: 'fit-content',
        rowGap: '10px',
        margin: '0 auto',
        marginTop: '30px',
    }
}))

const NavBtn = styled('button')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    fontSize: '1.2em',
    borderRadius: '5px',
    padding: '10px 30px',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: '2px black solid',
    '&.cancel': {
        backgroundColor: 'indianred',
        border: '2px indianred solid',
    },
    '&:hover': {
        color: 'black',
        backgroundColor: 'white',
    },
    '&:active': {
        color: 'white',
        backgroundColor: 'black',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.9em',
    },
}))