// media query component
// is used when do not want to rerender the whole component
import React from "react"
import useMediaQuery from '@mui/material/useMediaQuery'

// function for check media query, if size of screen is greater than minWidth then return children
const MediaQuery = ({ children, minWidth, isRender }) => { // `isRender` param is to know it renders children when matches or renders when doesn't match
    const matches = useMediaQuery(`(min-width:${minWidth}px)`)

    if (isRender && matches)
        return children

    if (!isRender && !matches)
        return children

    return <></>
}

export default MediaQuery
