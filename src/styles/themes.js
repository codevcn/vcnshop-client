import { createTheme } from '@mui/material/styles'

const global_theme = createTheme({
    fontFamily: {
        kanit: '"Kanit", "sans-serif"',
        nunito: '"Nunito", "sans-serif"',
        arial: '"Arial", "Helvetica", "sans-serif"',
        gillSans: '"Gill Sans", sans-serif',
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            970: 970,
            lg: 1200,
            xl: 1536,
        },
    },
})

export default global_theme