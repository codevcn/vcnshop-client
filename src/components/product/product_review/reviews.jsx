import React, { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from "react-redux"
import { Rating, Typography } from "@mui/material"
import Pagination from '@mui/material/Pagination'
import { getReviews } from "../../../store/actions/product_actions"
import { Skeleton, Stack } from "@mui/material"
import CommentIcon from '@mui/icons-material/Comment'
import { LIMIT_GET_COMMENTS } from "../../../configs/constants"
import moment from 'moment'

const convertDate = (time_string) => {
    return moment(time_string).format('DD/MM/YYYY')
}

const Reviews = ({ productId }) => {
    const { reviews, loading, error } = useSelector(({ product }) => product.reviews)
    const [reviewPage, setReviewPage] = useState(1)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getReviews(productId, 1))
    }, [dispatch])

    const switchCommentPage = (e, page) => {
        if (page === reviewPage) return
        setReviewPage(page)
        dispatch(getReviews(productId, page))
    }

    return (
        <>
            {
                loading ? (
                    <>
                        <ReviewLoading />
                        <ReviewLoading />
                        <ReviewLoading />
                    </>
                ) : error ? (
                    <Error>
                        {error.message}
                    </Error>
                ) : reviews && reviews.length > 0 ?
                    reviews.map(({ user_id, name, comment, rating, title, createdAt, avatar, imageURLs }) => (
                        <Review key={user_id}>

                            <WrittenOn>
                                <span>Written On </span>
                                <span>{convertDate(createdAt)}</span>
                            </WrittenOn>

                            <UserInfoContainer>
                                <AvatarWrapper>
                                    <Avatar src={avatar} />
                                </AvatarWrapper>
                                <Name>{name}</Name>
                            </UserInfoContainer>

                            <Rating
                                value={rating * 1}
                                readOnly
                                size="small"
                                precision={0.5}
                            />

                            <CommentTitle>{title}</CommentTitle>

                            <Comment>{comment}</Comment>

                            <ImagesContainer>
                                {
                                    imageURLs && imageURLs.length > 0 &&
                                    imageURLs.map((imageURL) => (
                                        <ReviewImage src={imageURL} key={imageURL} />
                                    ))
                                }
                            </ImagesContainer>

                        </Review>
                    ))
                    :
                    <EmptyReviews>
                        <CommentIcon sx={{ fontSize: '2em' }} />
                        <Typography
                            fontWeight='bold'
                            fontSize='1.2em'
                        >
                            There's no one review...
                        </Typography>
                    </EmptyReviews>
            }

            {
                reviews && reviews.length >= 0 &&
                <Stack
                    flexDirection="row"
                    justifyContent='center'
                >
                    <ReviewPages
                        count={Math.ceil(reviews.length / LIMIT_GET_COMMENTS)}
                        variant="outlined" shape="rounded"
                        onChange={switchCommentPage}
                        page={reviewPage}
                    />
                </Stack >
            }
        </>
    )
}

export default Reviews

const Review = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '5px',
    padding: '10px',
    backgroundColor: '#e0f9ff',
    borderBottom: '2px gray solid',
    position: 'relative',
    marginTop: '10px',
    fontFamily: theme.fontFamily.nunito,
}))

const WrittenOn = styled('div')(({ theme }) => ({
    fontSize: '0.9em',
    position: 'absolute',
    top: '10px',
    right: '10px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8em'
    }
}))

const UserInfoContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    width: 'fit-content',
    cursor: 'pointer',
    paddingRight: '5px',
})

const AvatarWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: '50%',
    height: 'fit-content',
})

const Avatar = styled('img')({
    height: '40px',
    width: '40px',
})

const Name = styled('h2')({
    margin: '0',
    fontSize: '1em',
})

const CommentTitle = styled('h2')({
    margin: '0',
    marginLeft: '5px',
    fontSize: '1.1em',
    marginTop: '5px',
})

const Comment = styled('div')({
    paddingLeft: '5px',
    marginTop: '10px',
    whiteSpace: 'pre-line',
})

const ImagesContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '10px',
    marginTop: '10px',
    overflowX: 'auto',
}))

const ReviewImage = styled('img')({
    height: '80px',
    maxWidth: '120px',
})

const ReviewPages = styled(Pagination)({
    marginTop: '20px',
    '& button.MuiPaginationItem-root': {
        backgroundColor: '#c4f9ff',
        border: '1.5px black solid',
        color: 'black',
        '&:hover': {
            border: '1.5px #c4f9ff solid',
        },
        '&.Mui-selected': {
            border: '2px #c4f9ff solid',
            '&:hover': {
                backgroundColor: '#c4f9ff',
            }
        },
        '&.Mui-disabled': {
            opacity: '0.5',
        },
        '& span.MuiTouchRipple-root': {
            display: 'none',
        }
    }
})

const EmptyReviews = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    rowGap: '5px',
    backgroundColor: '#f0f0f0',
    height: '35vh',
    width: '100%',
    marginTop: '10px',
})

const ReviewLoading = styled(Skeleton)({
    marginTop: '20px',
    width: '100%',
    height: '150px',
    transform: 'unset',
})

const Error = styled('div')({
    textAlign: 'center',
    width: '100%',
    padding: '10px',
    color: 'red',
    fontWeight: 'bold',
})