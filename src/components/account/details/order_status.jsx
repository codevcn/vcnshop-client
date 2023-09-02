import React from "react"
import { styled } from '@mui/material/styles'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Typography from '@mui/material/Typography'
import PaidIcon from '@mui/icons-material/Paid'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { StepConnector, stepConnectorClasses, Box } from "@mui/material"

const icon_style = { fontSize: '1.8em' }

const steps = [
    {
        label: 'Order Placed',
        description: '',
        icon: <PaidIcon sx={icon_style} />,
    }, {
        label: 'Packed',
        description: '',
        icon: <InventoryIcon sx={icon_style} />
    }, {
        label: 'Delivering',
        description: '',
        icon: <LocalShippingIcon sx={icon_style} />
    }, {
        label: 'Deliveried',
        description: '',
        icon: <CheckCircleIcon sx={icon_style} />
    }
]

const RenderStepIcon = ({ active, completed, error, }, icon_component) => {
    return (
        <StepIconWrapper theme={{ active, completed, error }}>
            {icon_component}
        </StepIconWrapper>
    )
}

const OrderStatus = ({ status }) => {

    const getActiveStep = (order_status) => {
        if (order_status === 'processing')
            return 1
        if (order_status === 'delivering')
            return 2
        if (order_status === 'delivered')
            return 4
    }

    return (
        <OrderStatusSection id="OrderStatus">
            <Typography
                fontSize="1.2em"
                fontWeight="bold"
                width="max-content"
                borderBottom="1px lightgrey solid"
                paddingBottom="10px"
            >
                Order Status
            </Typography>

            <Box marginTop='20px'>
                <Stepper
                    activeStep={getActiveStep(status)}
                    orientation="vertical"
                    connector={<ColorlibConnector />}
                >
                    {
                        steps.map(({ label, description, icon }) => (
                            <Step key={label}>
                                <StyledStepLabel StepIconComponent={(state) => RenderStepIcon(state, icon)}>
                                    {label}
                                </StyledStepLabel>
                                <StepContent>
                                    <Typography width="max-content">
                                        {description}
                                    </Typography>
                                </StepContent>
                            </Step>
                        ))
                    }
                </Stepper>
            </Box>
        </OrderStatusSection>
    )
}

export default OrderStatus

const OrderStatusSection = styled('div')(({ theme }) => ({
    backgroundColor: 'white',
    padding: '35px 30px',
    height: 'fit-content',
    [theme.breakpoints.down('sm')]: {
        marginTop: '10px',
    }
}))

const state_color = {
    active: 'black',
    completed: '#4bba7b',
    non_active: '#a1a1a1',
}

const StepIconWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    borderRadius: '50%',
    padding: '10px',
    border: `2px ${(theme.completed && state_color.completed) || (theme.active && state_color.active) || state_color.non_active} solid`,
    color: (theme.completed && state_color.completed) || (theme.active && state_color.active) || state_color.non_active,
}))

const ColorlibConnector = styled(StepConnector)({
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
        width: '2px',
        marginLeft: '14px',
        border: 'unset',
        backgroundColor: state_color.non_active,
    },
})

const StyledStepLabel = styled(StepLabel)({
    '& .MuiStepLabel-label': {
        color: state_color.non_active,
        width: 'max-content',
        '&.Mui-completed': {
            color: state_color.completed,
        },
        '&.Mui-active': {
            color: state_color.active,
        },
    },
})