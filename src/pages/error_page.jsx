import React from "react"
import { styled } from "@mui/material"
import { Box, Typography } from '@mui/material'
import { Avatar } from '@mui/material'
import Logo from '../assets/images/logo_app_black_min.jpg'

const send_email = 'https://mail.google.com/mail/u/0/#inbox?compose=DmwnWrRspXTWbQjlVKzbrxFMVDTdPjwpsfdczBTtwmlKFCxtKbMfNlmXFHwVzSDRSBXLWxRFTbPQ'

const ErrorPage = () => {

    return (
        <Box
            id="ErrorPageSection"
            component="div"
            padding="50px"
            width="100%"
            boxSizing="border-box"
        >

            <Avatar
                src={Logo}
                sx={{
                    width: '80px',
                    height: '80px',
                }}
            />

            <TextContainer>

                <Typography
                    fontSize="1.8em"
                    marginTop="30px"
                >

                    Something went wrong!!!
                    <br />

                    Trying reload the page or contact to admin via email:
                    <br />

                    <Typography
                        component="a"
                        href={send_email}
                        target="_blank"
                        color="red"
                        fontFamily="inherit"
                        fontSize="1em"
                        fontWeight="bold"
                        sx={{
                            textDecoration: 'none',
                            wordBreak: 'break-word',
                        }}
                    >
                        codevoicainay@gmail.com
                    </Typography>

                </Typography>

            </TextContainer>
            
        </Box>
    )
}

export default ErrorPage

const TextContainer = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('md')]: {
        fontSize: '0.8em',
    }
}))