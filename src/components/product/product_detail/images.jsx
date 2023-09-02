import React, { useState } from "react"
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import zoom_in_image from '../../../assets/images/zoom_in_mouse_hover.svg'
import CancelIcon from '@mui/icons-material/Cancel'
import { Box, Stack, Modal, Tooltip } from "@mui/material"
import ProgressiveImage from "../../materials/progressive_image"

const SmallImages = ({ imagePicked, images, handlePickImg }) => {
    return (
        <SmallImagesSection>
            {
                images.map((img) => (
                    <SmallImage
                        key={img}
                        className={img === imagePicked ? 'active' : ""}
                        src={img}
                        onClick={() => handlePickImg(img)}
                    />
                ))
            }
        </SmallImagesSection>
    )
}

const MainImage = ({ imagePicked }) => {
    const [openLightBox, setOpenLightBox] = useState(false)

    const viewProductImg = (open) => {
        setOpenLightBox(open)
    }

    const LightBox = () => {
        return (
            <Modal
                open={openLightBox}
                sx={{ '& .wrapper_box': { outline: 'unset' } }}
            >
                <Box
                    display="flex"
                    className="wrapper_box"
                    boxSizing="border-box"
                    padding="50px"
                    width="100vw"
                    height="100vh"
                    position="relative"
                >
                    <Box
                        display="flex"
                        maxHeight="100%"
                        justifyContent="center"
                        margin="auto"
                    >
                        <LightBoxImg src={imagePicked} />
                    </Box>

                    <Tooltip title="Close">
                        <CloseLightBoxBtn
                            onClick={() => viewProductImg(false)}
                        />
                    </Tooltip>
                </Box>
            </Modal>
        )
    }

    return (
        <>
            <MainImageWrapper
                elevation={5}
                onClick={() => viewProductImg(true)}
            >
                <ProgressiveImage
                    scss={{ margin: 'auto', maxWidth: '100%', maxHeight: '100%' }}
                    src={imagePicked}
                />
            </MainImageWrapper>

            <LightBox open={openLightBox} imagePicked={imagePicked} />
        </>
    )
}

const Images = ({ images }) => {
    const [imagePicked, setImagePicked] = useState(images[0])

    const pickImg = (img) => {
        setImagePicked(img)
    }

    return (
        <ImagesSection
            id="ProductImgs"
        >
            <SmallImages
                imagePicked={imagePicked}
                images={images}
                handlePickImg={pickImg}
            />

            <MainImage
                imagePicked={imagePicked}
            />
        </ImagesSection>
    )
}

export default Images

const ImagesSection = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: "space-between",
    columnGap: "5px",
    width: "100%",
    boxSizing: "border-box",
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        rowGap: '10px',
    }
}))

const MainImageWrapper = styled(Paper)(({ theme }) => ({
    display: "flex",
    width: "100%",
    height: "90vh",
    overflow: "hidden",
    cursor: `url(${zoom_in_image}), auto`,
    [theme.breakpoints.down('sm')]: {
        height: "fit-content",
    }
}))

const SmallImagesSection = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: "12px",
    height: "100%",
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'row',
        columnGap: '5px',
        flexWrap: 'wrap',
    }
}))

const SmallImage = styled('img')(({ theme }) => ({
    display: 'block',
    width: '80px',
    maxHeight: '93px',
    cursor: 'pointer',
    border: '2px white solid',
    borderRadius: '3px',
    boxShadow: '0px 0px 5px gray',
    '&.active': {
        outline: '2px black solid',
    },
    '&:hover': {
        outline: '2px black solid',
    },
    [theme.breakpoints.down('sm')]: {
        width: '42px',
    }
}))

const LightBoxImg = styled('img')({
    maxHeight: '100%',
    maxWidth: '100%',
    borderRadius: '5px',
})

const CloseLightBoxBtn = styled(CancelIcon)({
    color: 'white',
    width: '1.8em',
    height: '1.8em',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    position: 'absolute',
    right: '30px',
    top: '30px',
    '&:hover': {
        transform: 'scale(1.2)',
    }
})