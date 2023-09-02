import React, { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"

const ProgressiveImage = ({ src, alt, height, width, scss, className, textFont, textSize, textColor }) => {
    const [imgSrc, setImgSrc] = useState()

    useEffect(() => {
        let image = new Image()

        image.src = src

        image.onload = () => {
            setImgSrc(image.src)
        }
    }, [src])

    return (
        imgSrc ? (
            <Box
                component="img"
                src={imgSrc}
                alt={alt}
                className={className || ''}
                sx={{
                    height: height || 'auto',
                    width: width || 'auto',
                    ...(scss || {}),
                }}
            />
        ) :
            <Box
                display="flex"
                sx={{
                    height: height || 'auto',
                    width: width || 'auto',
                    margin: 'auto',
                    ...(scss || {}),
                }}
            >
                <Typography
                    margin="auto"
                    fontSize={textSize || '1em'}
                    color={textColor || 'inherit'}
                    sx={textFont ? { fontFamily: textFont } : {}}
                >
                    Loading...
                </Typography>
            </Box>
    )
}

export default ProgressiveImage