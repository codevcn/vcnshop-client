import React, { useMemo } from "react"
import { styled } from '@mui/material/styles'
import Rating from '@mui/material/Rating'
import { useSelector } from "react-redux"
import { Box, Stack } from "@mui/material"

const getWidthOfRatingBar = (number_of_all_reviews, reviews_count) => {
    return `${(reviews_count / number_of_all_reviews) * 100}%`
}

const ScoreCard = () => {
    const { average_rating, count_reviews } = useSelector(({ product }) => product.productDetail.product.review)
    const { reviews } = useSelector(({ product }) => product.reviews)

    const countStar = useMemo(() => {
        let count_star = [
            { star: 1, count: 0 },
            { star: 2, count: 0 },
            { star: 3, count: 0 },
            { star: 4, count: 0 },
            { star: 5, count: 0 },
        ]

        if (reviews && reviews.length > 0)
            for (let review of reviews)
                count_star[review.rating - 1].count++

        return count_star.reverse()
    }, [reviews])

    return (
        <ScoreCardSection>

            <div>
                <Stack
                    flexDirection="row"
                    alignItems='center'
                >
                    <AverageRatingNumber>{average_rating}</AverageRatingNumber>

                    <Rating
                        value={average_rating * 1}
                        precision={0.5}
                        readOnly
                        size="large"
                        sx={{ color: '#ff8888' }}
                    />
                </Stack>

                <BaseOn>
                    <span>{'Based On ' + count_reviews}</span>
                    <span>{count_reviews > 1 ? ' Reviews' : ' Review'}</span>
                </BaseOn>
            </div>

            <Stack
                flexDirection="row"
                columnGap='8px'
                width='100%'
                alignItems='center'
            >
                <Stars>
                    {
                        [5, 4, 3, 2, 1].map((number) => (
                            <Rating
                                value={number}
                                readOnly
                                key={number}
                                sx={{ color: '#ff8888' }}
                            />
                        ))
                    }
                </Stars>

                <CountingBars>
                    {
                        countStar.map(({ star, count }) => (
                            <RatingBar key={star}>
                                <Box
                                    display="flex"
                                    alignItems='center'
                                    height='17px'
                                    width={getWidthOfRatingBar(count_reviews, count)}
                                    bgcolor="#ff8888"
                                />

                                <div>{count}</div>
                            </RatingBar>
                        ))
                    }
                </CountingBars>
            </Stack>

        </ScoreCardSection>
    )
}

export default ScoreCard

const ScoreCardSection = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '20px',
    padding: '0 25px',
    boxSizing: 'border-box',
    boxShadow: '0px 0px 3px grey',
    borderRadius: '5px',
    marginTop: '5px',
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        padding: '20px',
        rowGap: '15px',
    }
}))

const AverageRatingNumber = styled('h2')({
    margin: '0',
    marginRight: '5px',
})

const BaseOn = styled('p')({
    margin: '0',
    fontSize: '0.9em',
})

const Stars = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '5px',
    padding: '5px 0',
})

const CountingBars = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '5px',
    borderLeft: '2px #ff8888 solid',
    padding: '10px 0 8px',
    width: '100%',
})

const RatingBar = styled('div')({
    display: 'flex',
    columnGap: '8px',
    alignItems: 'center',
})