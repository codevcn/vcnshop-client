import React from "react"
import { styled } from '@mui/material/styles'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import { useNavigate } from 'react-router-dom'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import PaymentIcon from '@mui/icons-material/Payment'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { Box, StepConnector, Tooltip, Typography } from "@mui/material"
import { stepConnectorClasses } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTheme } from "@emotion/react"

const icon_style = { fontSize: '2em', color: 'white' }

const steps = [
    {
        label: 'Shipping Info',
        icon: <LocalShippingIcon sx={icon_style} />,
    }, {
        label: 'Confirm Order',
        icon: <LibraryAddCheckIcon sx={icon_style} />,
    }, {
        label: 'Payment',
        icon: <PaymentIcon sx={icon_style} />,
    }
]

const RenderStepIcon = ({ active, completed, error, icon, className }, icon_component, breakpoints) => {
    return (
        <StepIconWrapper theme={{ active, completed, error, breakpoints }}>
            {icon_component}
        </StepIconWrapper>
    )
}

const Navigation = () => {
    const navigate = useNavigate()
    const theme = useTheme()

    return (
        <NavigationSection>
            <GoBackContainer>
                <GoBackWrapper onClick={() => navigate(-1)}>
                    <GoBackIcon />
                    <Typography
                        fontSize="1.5em"
                        sx={{ transform: 'scaleX(0.9)' }}
                        fontFamily={theme.fontFamily.kanit}
                    >
                        BACK
                    </Typography>
                </GoBackWrapper>
            </GoBackContainer>

            <Typography
                fontFamily={theme.fontFamily.kanit}
                fontSize="2.5em"
                fontWeight="bold"
                letterSpacing="3px"
            >
                CHECKOUT
            </Typography>
        </NavigationSection>
    )
}

const CheckoutStep = ({ activeStep }) => {
    const theme = useTheme()

    return (
        <Box
            margin="30px 0"
        >
            <Stepper
                activeStep={activeStep}
                alternativeLabel
                connector={<ColorlibConnector />}
            >
                {
                    steps.map(({ label, icon }) => (
                        <Step key={label}>
                            <Tooltip title={label}>
                                <StyledStepLabel StepIconComponent={(state) => RenderStepIcon(state, icon, theme.breakpoints)}>
                                    <CompletedIcon
                                        className="completed_icon"
                                    />
                                    <span>
                                        {label}
                                    </span>
                                </StyledStepLabel>
                            </Tooltip>
                        </Step>
                    ))
                }
            </Stepper>
        </Box>
    )
}

const Hr = () => (
    <Box
        height="1px"
        width="100%"
        bgcolor="#dddddd"
        margin="0 auto"
    />
)

const Header = ({ activeStep }) => {

    return (
        <div id="HeaderSection">
            {
                activeStep < 3 &&
                <>
                    <Navigation />

                    <Hr />
                </>
            }

            <CheckoutStep activeStep={activeStep} />

            <Hr />
        </div>
    )
}

export default Header

const NavigationSection = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
    position: "relative",
    [theme.breakpoints.down('sm')]: {
        flexDirection: "column",
    }
}))

const GoBackContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: "center",
    height: "100%",
    position: "absolute",
    top: "0",
    left: "0",
    paddingLeft: "15px",
    [theme.breakpoints.down('sm')]: {
        position: "relative",
        paddingLeft: "0",
        width: '100%',
    }
}))

const GoBackWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    position: 'relative',
    cursor: 'pointer',
    '&::after': {
        content: '""',
        height: '3px',
        width: '0',
        backgroundColor: 'black',
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
})

const CompletedIcon = styled(CheckCircleIcon)({
    display: 'none',
    marginRight: '5px',
    fontSize: '1.2em',
})

const state_color = {
    non_active: '#bbbbbb',
    active: 'black',
    completed: '#00805e',
    error: 'red',
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: '25px',
        [theme.breakpoints.down('sm')]: {
            top: '20px',
        }
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor: state_color.active,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor: state_color.completed,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: '5px',
        width: '100%',
        border: 'unset',
        backgroundColor: state_color.non_active,
        zIndex: '1',
        position: 'relative',
    },
}))

const StepIconWrapper = styled('div')(({ theme }) => ({
    padding: '12px 12px 7px',
    borderRadius: '50%',
    zIndex: '2',
    position: 'relative',
    backgroundColor: (theme.completed && state_color.completed) || (theme.active && state_color.active) || state_color.non_active,
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.7em',
    }
}))

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
    '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
        marginTop: '10px',
        color: state_color.non_active,
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.8em',
        },

        '&.Mui-completed': {
            color: state_color.completed,
            '& .completed_icon': {
                display: 'initial',
            }
        },
        '&.Mui-active': {
            color: state_color.active,
        },
    },
}))