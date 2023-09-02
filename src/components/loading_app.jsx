import React from "react"
import { styled } from '@mui/material/styles'
import foxLogoBlack from '../assets/images/logo_app_black.svg'
import { Box, Modal } from "@mui/material"

const LoadingApp = () => {
    return (
        <Box
            id="LoadingApp"
            open={true}
            onClose={() => { }}
            component={Modal}
            sx={{ '& .loading_container': { outline: 'none' } }}
        >
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                className="loading_container"
                height="100%"
                width="100%"
                bgcolor='white'
            >
                <Box
                    padding='30px'
                    border='5px transparent solid'
                    position='relative'
                    borderRadius='50%'
                    width='85px'
                    height='85px'
                >

                    <CircularAnimation />

                    <Image src={foxLogoBlack} />

                </Box>
            </Box>
        </Box>
    )
}

export default LoadingApp

const CircularAnimation = styled('div')({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    borderTop: '5px black solid',
    boxSizing: 'border-box',
    borderRadius: '50%',
    animation: 'circular-animation 2s infinite',
    '@keyframes circular-animation': {
        '0%': {
            transform: 'rotate(0deg)',
        },
        '25%': {
            transform: 'rotate(90deg)',
        },
        '50%': {
            transform: 'rotate(180deg)',
        },
        '75%': {
            transform: 'rotate(270deg)',
        },
        '100%': {
            transform: 'rotate(360deg)',
        },
    }
})

const Image = styled('img')({
    width: '100%',
    height: '100%',
    color: 'black',
})