import React, { useState } from "react"
import { styled } from '@mui/material/styles'
import SendIcon from '@mui/icons-material/Send'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify'
import { Typography, CircularProgress, Box } from "@mui/material"
import validator from 'validator'
import { useTranslation } from "react-i18next"

const NewsLetter = () => {
    const { register, handleSubmit } = useForm()
    const [submitting, setSubmitting] = useState()
    const { t } = useTranslation('home_page')

    const submit = async (data, e) => {
        let email = data['Email']

        if (!email)
            return toast.warning('Please don\'t empty the email input!')
        if (!validator.isEmail(email))
            return toast.warning('Please enter email format correctly!')

        setSubmitting(true)

        await new Promise((resolve) => {
            setTimeout(() => { resolve() }, 2000)
        })

        setSubmitting(false)

        toast.success('Subscribe successfully!')
    }

    return (
        <NewsLetterSection
            id="News-Letter-Section"
        >

            <Typography
                component="h2"
                margin="0"
                fontFamily="inherit"
                textAlign="center"
                fontSize="2em"
                fontWeight="bold"
            >
                {t('Newsletter From Us')}
            </Typography>

            <Typography
                textAlign="center"
                marginTop="15px"
                fontFamily="inherit"
                width="50%"
                fontSize="1em"
            >
                {t('Newsletter Intro')}
            </Typography>

            <EmailContainer>

                <Box
                    bgcolor="rgba(0,0,0,.05)"
                    padding="10px 20px"
                    width="100%"
                >
                    <EmailInput
                        placeholder={t('Enter your email address...')}
                        {...register('Email')}
                    />
                </Box>

                <SubmitBtn onClick={handleSubmit(submit)}>
                    {
                        submitting ?
                            <CircularProgress
                                thickness={5}
                                size={20}
                                sx={{ color: 'white' }}
                            />
                            :
                            <StyledSendIcon />
                    }
                </SubmitBtn>

            </EmailContainer>

        </NewsLetterSection>
    )
}

export default NewsLetter

const NewsLetterSection = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    margin: "100px 0 50px",
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('md')]: {
        margin: "50px 0",
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8em',
    },
}))

const EmailContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    marginTop: "15px",
    width: '400px',
    [theme.breakpoints.down('sm')]: {
        width: '250px',
    },
}))

const EmailInput = styled('input')({
    border: 'none',
    outline: 'none',
    fontSize: '1em',
    width: '100%',
    backgroundColor: 'transparent',
})

const SubmitBtn = styled('button')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80px',
    cursor: 'pointer',
    backgroundColor: '#3FACB1',
    padding: '10px 0',
    overflow: 'hidden',
    position: 'relative',
    border: 'none',
    color: 'white',
    boxSizing: 'border-box',
    [theme.breakpoints.up('sm')]: {
        '&:hover svg': {
            animationPlayState: 'running',
            animationDuration: '0.8s',
        }
    }
}))

const StyledSendIcon = styled(SendIcon)({
    color: 'white',
    fontSize: '1.5em',
    animation: 'submitting_animate 0s paused infinite linear',
    '@keyframes submitting_animate': {
        'from': {
            transform: 'translateX(-40px)',
        },
        'to': {
            transform: 'translateX(40px)',
        }
    }
})