import React, { useState, useRef, useEffect } from "react"
import { styled } from '@mui/material/styles'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { useDispatch, useSelector } from "react-redux"
import { updateUserAvatar } from "../../store/actions/user_actions"
import { Modal, Stack, Tooltip, CircularProgress, Avatar as AvatarMUI, Box, Typography } from '@mui/material'
import { useTheme } from "@emotion/react"

const UpdateAvatar = ({ userAvatar }) => {
    const [openChangeAvatarSection, setOpenChangeAvatarSection] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(null)
    const theme = useTheme()
    const [updating, setUpdating] = useState(false)
    const dispatch = useDispatch()
    const image_to_upload_ref = useRef(null)

    useEffect(() => {
        setUpdating(false)
        setOpenChangeAvatarSection(false)
    }, [userAvatar])

    useEffect(() => {
        setUpdating(false)
    }, [])

    const avatarAction = (is_changing) => {
        if (is_changing) {
            setUpdating(true)
            let avatar_to_update = image_to_upload_ref.current.files[0]
            dispatch(updateUserAvatar(avatar_to_update))
        } else {
            setOpenChangeAvatarSection(false)
            setUpdating(false)
            image_to_upload_ref.current.value = null
            URL.revokeObjectURL(avatarUrl)
        }
    }

    const handleChangeAvatar = () => {
        let image = image_to_upload_ref.current.files[0]
        setAvatarUrl(URL.createObjectURL(image))
        setOpenChangeAvatarSection(true)
    }

    return (
        <>
            <input
                ref={image_to_upload_ref}
                style={{ display: 'none' }}
                type="file"
                id="fake_avatar_input"
                onChange={handleChangeAvatar}
            />

            <Modal
                open={openChangeAvatarSection}
                onClose={() => avatarAction(false)}
                sx={{ '& .wrapper_box': { outline: 'none' } }}
            >
                <Box
                    className="wrapper_box"
                    display="flex"
                    height="100%"
                >
                    <Stack
                        padding="20px 20px 15px"
                        borderRadius="5px"
                        border="1px black solid"
                        bgcolor="white"
                        boxSizing="border-box"
                        fontFamily={theme.fontFamily.kanit}
                        margin="auto"
                    >
                        <Box display="flex">
                            <AvatarMUI src={avatarUrl} sx={{ height: '110px', width: '110px', margin: 'auto' }} />
                        </Box>
                        <Typography
                            marginTop="20px"
                            borderBottom="1px gray solid"
                            paddingBottom="5px"
                            paddingLeft="5px"
                            width="100%"
                        >
                            Set this image to your avatar ?
                        </Typography>
                        <Stack flexDirection="row" justifyContent="space-between" marginTop="5px" padding="5px">
                            <span></span>
                            <Stack flexDirection="row" columnGap="20px">
                                <ActionBtn onClick={() => avatarAction(false)}>
                                    Cancel
                                </ActionBtn>
                                <ActionBtn onClick={() => avatarAction(true)}>
                                    {
                                        updating ?
                                            <CircularProgress
                                                sx={{ color: 'black', margin: 'auto' }}
                                                size={15}
                                                thickness={6}
                                            />
                                            :
                                            'Agree'
                                    }
                                </ActionBtn>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Modal>
        </>
    )
}

const DisplayAvatar = ({ nameOfUser, userAvatar }) => {

    return (
        <Tooltip title="Click to change avatar">
            <AvatarWarraper>
                {
                    userAvatar ?
                        <AvatarMUI src={userAvatar} sx={{ height: '100%', width: '100%' }} />
                        :
                        <AvatarMUI>
                            {nameOfUser[0]}
                        </AvatarMUI>
                }

                <Box
                    className="change_avatar_btn"
                    htmlFor="fake_avatar_input"
                    component="label"
                    display="none"
                    position="absolute"
                    width="100%"
                    height="100%"
                    borderRadius="50%"
                    sx={{ cursor: 'pointer' }}
                >
                    <AddAPhotoIcon sx={{ margin: 'auto', width: '40%', height: '40%', color: 'black' }} />
                </Box>
            </AvatarWarraper>
        </Tooltip>
    )
}

const set_name_of_user = (name_of_user) => {
    let name_of_user_trimed = name_of_user.trim()
    if (name_of_user_trimed.length > 5)
        name_of_user_trimed = name_of_user_trimed.slice(0, 8) + '...'

    return name_of_user_trimed
}

const NameOfUser = ({ nameOfUser }) => (
    <NameOfUserContainer>
        <div>Hello,</div>
        <Tooltip title={nameOfUser} placement="right">
            <Typography
                fontWeight="bold"
                fontSize="1.2em"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                sx={{ overflowX: 'hidden' }}
            >
                {set_name_of_user(nameOfUser)}
            </Typography>
        </Tooltip>
    </NameOfUserContainer>
)

const Avatar = () => {
    const { user } = useSelector(({ user }) => user)

    return (
        user &&
        <AvatarSection id="AvatarSection">

            <UpdateAvatar userAvatar={user.avatar} />

            <DisplayAvatar nameOfUser={user.name} userAvatar={user.avatar} />

            <NameOfUser nameOfUser={user.name} />

        </AvatarSection>
    )
}

export default Avatar

const AvatarSection = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: theme.fontFamily.kanit,
    [theme.breakpoints.down('md')]: {
        fontSize: '0.8em',
        flexDirection: "column",
    },
}))

const NameOfUserContainer = styled('div')(({ theme }) => ({
    marginLeft: "15px",
    [theme.breakpoints.down('md')]: {
        marginLeft: "0",
        marginTop: '10px',
    },
}))

const ActionBtn = styled('span')({
    display: 'flex',
    padding: '5px 15px',
    backgroundColor: '#d6d6d6',
    borderRadius: '5px',
    cursor: 'pointer',
    ':hover': {
        outline: '2px black solid',
    }
})

const AvatarWarraper = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '110px',
    height: '110px',
    position: 'relative',
    borderRadius: '50%',
    backgroundColor: 'rgb(45,45,45)',
    color: 'white',
    fontSize: '3em',
    fontWeight: 'bold',
    '&:hover label.change_avatar_btn': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff70',
    },
})