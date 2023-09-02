import React, { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { Box } from "@mui/material"

const ScrollToTopBtn = () => {
    const [open, setOpen] = useState(false)

    const showScrollToTopBtn = () => {
        if (window.scrollY > 100) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', showScrollToTopBtn)
    }, [])

    const scrollToTop = () => {
        window.scroll({ top: 0, behavior: 'smooth' })
    }

    const scrollToTopDoubleClick = () => {
        window.scroll({ top: 0, behavior: 'auto' })
    }

    return (
        <ScrollToTopSection
            id="ScrollToTopBtn"
            sx={{ bottom: open ? '30px' : '-55px' }}
            onClick={scrollToTop}
            onDoubleClick={scrollToTopDoubleClick}
        >
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                fontSize='0.9em'
                fontWeight='bold'
                textAlign='center'
                overflow='hidden'
                borderRadius='50%'
                width='100%'
                height='100%'
            >
                <StyledDoubleArrowIcon />
            </Box>
        </ScrollToTopSection>
    )
}

export default ScrollToTopBtn

const ScrollToTopSection = styled('div')(({ theme }) => ({
    width: '50px',
    height: '50px',
    position: 'fixed',
    right: '30px',
    borderRadius: '50%',
    padding: '2px',
    backgroundColor: '#bbb9b9',
    transition: 'bottom 0.5s',
    boxSizing: 'border-box',
    cursor: 'pointer',
    border: '2px black solid',
    zIndex: '99',
    opacity: '0.3',
    '&:hover': {
        opacity: '1',
        '& svg': {
            animationPlayState: 'running',
            animationDuration: '0.8s',
        }
    },
    [theme.breakpoints.down('md')]: {
        width: '40px',
        height: '40px',
    },
}))

const StyledDoubleArrowIcon = styled(DoubleArrowIcon)({
    color: 'black',
    transform: 'rotate(-90deg)',
    width: '1.2em',
    height: '1.2em',
    animation: 'SlideArrow 0s paused infinite linear',
    '@keyframes SlideArrow': {
        'from': {
            transform: 'translateY(100%) rotate(-90deg)',
        },
        'to': {
            transform: 'translateY(-100%) rotate(-90deg)',
        }
    },
})