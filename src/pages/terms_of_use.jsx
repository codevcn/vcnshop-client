import React from "react"
import { styled } from "@mui/material"
import { Box, Stack, Typography, Divider } from '@mui/material'
import { useNavigate } from "react-router-dom"
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'

const embed_link_terms_of_use_html = "https://codevcnn.github.io/Storage/terms_of_use_vcn_shop_ecommerce.html"

const TermsOfUse = () => {
    const navigate = useNavigate()

    return (
        <div id="TermOfUse">

            <Stack
                height="100vh"
                bgcolor="#2C2C2C"
            >
                <Box
                    position="relative"
                >
                    <GoBackContainer>
                        <GoBackWrapper onClick={() => navigate(-1)}>
                            <GoBackIcon />

                            <Typography
                                fontSize="1.5em"
                                sx={{ transform: 'scaleX(0.9)' }}
                                color="white"
                            >
                                BACK
                            </Typography>
                        </GoBackWrapper>
                    </GoBackContainer>

                    <Title>
                        VCN Shop - FOX COR
                    </Title>
                </Box>

                <Divider flexItem sx={{ bgcolor: 'rgba(255,255,255,.3)' }} />

                <Box
                    height="100%"
                    overflow="hidden"
                >
                    <Box
                        component="object"
                        height="100%"
                        width="100%"
                        data={embed_link_terms_of_use_html}
                        type="text/html"
                    />
                </Box>
            </Stack>

        </div>
    )
}

export default TermsOfUse

const GoBackContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: "center",
    height: "100%",
    position: "absolute",
    left: "0",
    top: "0",
    paddingLeft: "15px",
    [theme.breakpoints.down('sm')]: {
        position: "relative",
        height: "auto",
        marginTop: '20px',
        fontSize: '0.8em',
    }
}))

const GoBackWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    cursor: 'pointer',
    position: 'relative',
    '&::after': {
        content: '""',
        height: '3px',
        width: '0',
        backgroundColor: 'white',
        position: 'absolute',
        top: '100%',
        right: '0',
        transition: 'width 0.2s',
    },
    '&:hover::after': {
        width: '100%',
    },
})

const GoBackIcon = styled(ExpandCircleDownIcon)({
    height: '100%',
    transform: 'rotate(90deg)',
    transition: 'transform 0.2s',
    margin: 'auto',
    color: 'white',
})

const Title = styled(Typography)(({ theme }) => ({
    color: "white",
    fontWeight: "bold",
    fontSize: "2em",
    padding: "10px",
    textAlign: "center",
    [theme.breakpoints.down('sm')]: {
        fontSize: "1.5em",
    }
}))