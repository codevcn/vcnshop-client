import React, { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import Rating from '@mui/material/Rating'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'

const rating_emotion_style = {
    width: '1em',
    height: '1em',
}

const init_rating = {
    good: {
        emotion: 'Good',
        color: 'green'
    },
    not_bad: {
        emotion: 'Not Bad',
        color: '#c3a700'
    },
    bad: {
        emotion: 'Bad',
        color: 'red'
    }
}

const RatingSet = ({ ratingValue, updateRatingsValue }) => {
    const [rating, setRating] = useState(init_rating.bad)

    useEffect(() => {
        if (ratingValue === 0) setRating(init_rating.bad)
    }, [ratingValue])

    const hoverRatingStar = (e, newValue) => {
        if (newValue > 3 || (newValue < 0 && ratingValue > 3))
            return setRating(init_rating.good)
        if (newValue > 2 || (newValue < 0 && ratingValue > 2))
            return setRating(init_rating.not_bad)
        if (newValue > 0 || (newValue < 0 && ratingValue >= 0))
            return setRating(init_rating.bad)
    }

    return (
        <RatingContainer id="RatingContainer">
            <Rating //rating
                value={ratingValue}
                color="default"
                precision={1}
                size="medium"
                sx={{ '& span.MuiRating-icon': { color: rating.color } }}
                onChange={(e, newValue) => updateRatingsValue(newValue)}
                onChangeActive={(e, newValue) => hoverRatingStar(e, newValue)}
            />
            {
                rating.emotion === 'Good' ? (
                    <SentimentVerySatisfiedIcon
                        color="success"
                        titleAccess="Good"
                        sx={rating_emotion_style}
                    />
                ) : rating.emotion === 'Not Bad' ? (
                    <SentimentNeutralIcon
                        titleAccess="Not Bad"
                        sx={{ ...rating_emotion_style, color: init_rating.not_bad.color }}
                    />
                ) : (
                    <SentimentVeryDissatisfiedIcon
                        color="error"
                        titleAccess="Bad"
                        sx={rating_emotion_style}
                    />
                )
            }
        </RatingContainer>
    )
}

export default RatingSet

const RatingContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: '5px',
    margin: '10px 0',
})