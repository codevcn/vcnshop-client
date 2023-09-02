import React, { useEffect, useRef, useState } from "react"
import { styled } from '@mui/material/styles'
import { Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

const TimeLabel = ({ value, label }) => {
    return (
        <Stack
            alignItems="center"
            columnGap="10px"
            fontSize="1em"
        >
            <Typography
                fontSize="1em"
                fontFamily="inherit"
            >
                {value}
            </Typography>
            <Typography
                fontSize="1em"
                fontFamily="inherit"
            >
                {label}
            </Typography>
        </Stack>
    )
}

const time_to_countdown_in_ms = 432000000

const get_time_now = () => new Date().getTime()

const get_time_types = (countdown_in_ms) => {
    return [
        parseInt(countdown_in_ms / (1000 * 60 * 60 * 24)), //days
        parseInt((countdown_in_ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), //hours
        parseInt((countdown_in_ms % (1000 * 60 * 60)) / (1000 * 60)), //minutes
        parseInt((countdown_in_ms % (1000 * 60)) / 1000), //seconds
    ]
}

const Notice = () => {
    const { t } = useTranslation('home_page')

    const now_in_ms = get_time_now()

    const [now, setNow] = useState(now_in_ms)

    const total_time_in_ms = useRef(now_in_ms + time_to_countdown_in_ms)

    const countdown_in_ms = total_time_in_ms.current - now

    const [days, hours, minutes, seconds] = get_time_types(countdown_in_ms)

    const handleSetNow = () => {
        return setTimeout(() => {
            setNow(get_time_now())
        }, 1000)
    }

    useEffect(() => {
        if (countdown_in_ms > 0) {
            let timer = handleSetNow()

            return () => clearTimeout(timer)
        }
    }, [countdown_in_ms])

    return (
        <Stack
            id="NoticeBar"
            component="div"
            flexDirection="row"
            bgcolor="black"
            padding="15px"
            color="white"
            overflow="hidden"
        >

            <TextContainer>

                <Typography
                    fontSize="inherit"
                    fontWeight="bold"
                    fontFamily="inherit"
                >
                    {t('The supper sale is comming in')}
                </Typography>

                <Stack
                    flexDirection="row"
                    alignItems="center"
                    fontSize="1em"
                >
                    <TimeLabel value={days} label={t("Days")} />
                    <Seperate>
                        :
                    </Seperate>
                    <TimeLabel value={hours} label={t("Hours")} />
                    <Seperate>
                        :
                    </Seperate>
                    <TimeLabel value={minutes} label={t("Minutes")} />
                    <Seperate>
                        :
                    </Seperate>
                    <TimeLabel value={seconds} label={t("Seconds")} />
                </Stack>

            </TextContainer>

        </Stack>
    )
}

export default Notice

const TextContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: "center",
    margin: "auto",
    columnGap: "10px",
    fontFamily: theme.fontFamily.nunito,
    fontSize: '0.8em',
    [theme.breakpoints.down('lg')]: {
        fontSize: '0.7em',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '0.6em',
    },
}))

const Seperate = styled('span')(({ theme }) => ({
    margin: '0 10px',
    fontFamily: theme.fontFamily.nunito,
}))