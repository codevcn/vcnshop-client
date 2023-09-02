import React from "react"
import { styled } from '@mui/material/styles'
import not_found_404 from '../assets/images/not_found_404.jpg'
import { useNavigate } from "react-router-dom"
import { Box, Stack, Typography } from "@mui/material"

const NotFound404 = () => {
    const navigate = useNavigate()

    const navigatePage = (option) => {
        navigate(option)
    }

    return (
        <NotFound404Section
            id="NotFound404Page"
        >

            <ImageWrapper>
                <Box
                    src={not_found_404}
                    component="img"
                    height="100%"
                />
            </ImageWrapper>

            <div>

                <Typography
                    letterSpacing="2px"
                    margin="0"
                    component="h1"
                >
                    Oops!
                </Typography>

                <Text>
                    Either you aren't cool enough to visit this page or it doesn't exist...
                </Text>

                <Text>
                    I mean <span>"404 not found"</span>
                </Text>

                <Stack
                    flexDirection="row"
                    columnGap="10px"
                >

                    <Button onClick={() => navigatePage('/')}>
                        Back to Home page
                    </Button>

                    <Button onClick={() => navigatePage(-1)}>
                        Back to previous page
                    </Button>

                </Stack>

            </div>

        </NotFound404Section>
    )
}

export default NotFound404

const NotFound404Section = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: '10px',
    width: '99vw',
    height: '99vh',
    padding: '30px',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        rowGap: '20px',
    }
}))

const ImageWrapper = styled('div')(({ theme }) => ({
    height: "45vh",
    [theme.breakpoints.down('sm')]: {
        height: "35vh",
    }
}))

const Text = styled('p')(({ theme }) => ({
    fontFamily: theme.fontFamily.arial,
    fontWeight: 'bold',
    margin: '10px',
    '& span': {
        fontSize: '1.2em',
    }
}))

const Button = styled('button')(({ theme }) => ({
    fontFamily: theme.fontFamily.arial,
    fontSize: '1.1em',
    color: 'white',
    border: 'none',
    backgroundColor: 'black',
    padding: '10px 25px',
    marginTop: '10px',
    transform: 'skew(-5deg)',
    transition: 'background-color 0.2s ease, transform 0.2s ease, color 0.2s ease',
    cursor: 'pointer',
    position: 'relative',
    zIndex: '1',
    '&:hover': {
        backgroundColor: '#1e7870',
        transform: 'scale(1.15)',
        zIndex: '2',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.9em',
    }
}))