import React from "react"
import { useCurrentRoute } from "../hooks/custom_hooks"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import Vietnam_flag from '../assets/images/VietNam_flag.jpg'
import English_flag from '../assets/images/English_flag.jpg'
import { Box, Tooltip, Avatar, styled, CircularProgress } from "@mui/material"
import suspenseComponent from "../utils/suspense"

const ChangeLanguageBtn = () => {
    const { t, i18n } = useTranslation('common')
    const current_route = useCurrentRoute()

    const is_at_homepage = current_route === '/'
    const current_lang = i18n.resolvedLanguage

    const change_language = async (language_to_change) => i18n.changeLanguage(language_to_change) // async for avoid blocking UI

    const changeLanguage = () => {
        let language_to_change

        if (current_lang === 'vi') {
            if (!is_at_homepage) {
                return toast.warning('Xin lỗi! Hiện tại chức năng này chỉ khả dụng ở trang chủ')
            }

            language_to_change = 'en'
        } else {
            if (!is_at_homepage) {
                return toast.warning('Sorry! Currently, this feature is useable only at homepage')
            }

            language_to_change = 'vi'
        }

        change_language(language_to_change)
    }

    const ChangeLanguageBtn = ({ title, src }) => (
        <Tooltip title={t(title)}>
            <Box
                onClick={changeLanguage}
                component="div"
                sx={{
                    cursor: 'pointer',
                    opacity: is_at_homepage ? '1' : '0.3'
                }}
            >
                <Flag
                    src={src}
                />
            </Box>
        </Tooltip>
    )

    return (
        !current_lang || current_lang === 'en' ?
            <ChangeLanguageBtn
                title="Switch to Vietnamese"
                src={English_flag}
            />
            :
            <ChangeLanguageBtn
                src={Vietnam_flag}
                title="Switch to English"
            />
    )
}

const SuspenseFallback = () => (
    <CircularProgress
        thickness={5}
        size={20}
        sx={{ color: 'white' }}
    />
)

export default suspenseComponent(ChangeLanguageBtn)(<SuspenseFallback />)

const Flag = styled(Avatar)(({ theme }) => ({
    height: '30px',
    width: '30px',
    [theme.breakpoints.down('md')]: {
        height: '20px',
        width: '20px',
    },
}))