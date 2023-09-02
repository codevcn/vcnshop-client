import React, { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from "react-redux"
import { getReviews } from "../../store/actions/product_actions"
import { Rating } from "@mui/material"
import { Skeleton } from "@mui/material"
import CommentIcon from '@mui/icons-material/Comment'
import { LIMIT_GET_COMMENTS } from "../../configs/constants"
import { Pagination } from "@mui/material"
import Collapse from '@mui/material/Collapse'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import { IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import { Tooltip, Stack, Typography } from "@mui/material"

const ReviewsSection = ({ productId }) => {
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

    const convertDate = (date_in_string) => {
        let date_splitting = date_in_string.split('/')
        let temp = date_splitting[0]
        date_splitting[0] = date_splitting[1]
        date_splitting[1] = temp
        return date_splitting.join('/')
    }

    return (
        <>
            {
                loading ? (
                    <Skeleton sx={{ height: '300px', marginTop: '20px', transform: 'scale(1)' }} />
                ) : error ? (
                    <Error>{error.message}</Error>
                ) : reviews && reviews.length > 0 ?
                    reviews.map(({ user_id, name, comment, rating, title, createdAt, avatar, imageURLs }) => (
                        <ReviewContainer key={user_id}>
                            <Date>
                                <span>Written On </span>
                                <span>{convertDate(new window.Date(createdAt).toLocaleDateString())}</span>
                            </Date>
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
                                sx={{ marginTop: '5px' }}
                            />
                            <CommentTitle>{title}</CommentTitle>
                            <Comment>{comment}</Comment>
                            <ReviewImagesContainer>
                                {
                                    imageURLs && imageURLs.length > 0 && imageURLs.map((imageURL) => (
                                        <div key={imageURL} style={{ maxWidth: '15%' }}>
                                            <ReviewImage src={imageURL} />
                                        </div>
                                    ))
                                }
                            </ReviewImagesContainer>
                        </ReviewContainer>
                    ))
                    :
                    <EmptyReviews>
                        <CommentIcon sx={{ height: '2em', width: '2em' }} />
                        <Typography
                            fontWeight='bold'
                            fontSize='1.2em'
                        >
                            There's no one review...
                        </Typography>
                    </EmptyReviews>
            }

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ReviewPages
                    count={Math.ceil(reviews.length / LIMIT_GET_COMMENTS)}
                    variant="outlined"
                    shape="rounded"
                    onChange={switchCommentPage}
                    page={reviewPage}
                />
            </div>
        </>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} unmountOnExit />
})

const Description = ({ description }) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <ViewBtn onClick={() => setOpen(pre => !pre)}>
                <span>View Description</span>
                <KeyboardArrowDownIcon />
            </ViewBtn>

            <Collapse
                in={open}
                unmountOnExit
                timeout="auto"
                sx={{ marginTop: '10px' }}
            >
                <span>{description}</span>
            </Collapse>
        </>
    )
}

const Reviews = ({ productId }) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <ViewBtn onClick={() => setOpen(pre => !pre)}>
                <span>View Reviews</span>
                <KeyboardArrowDownIcon />
            </ViewBtn>

            <Dialog
                fullScreen
                open={open}
                TransitionComponent={Transition}
            >
                <div>
                    <CloseContainer>
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            width="100%"
                        >
                            <Tooltip title="Close">
                                <IconButton onClick={() => setOpen(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                            <span>Cancel</span>
                        </Stack>

                        <h2 className="close_title">Reviews</h2>
                    </CloseContainer>

                    <ReviewsSection productId={productId} />
                </div>
            </Dialog>
        </>
    )
}

const ReviewsAndDescription = ({ productId, description }) => {
    return (
        <>
            <Description description={description} />

            <Reviews productId={productId} />
        </>
    )
}

export default ReviewsAndDescription

const ViewBtn = styled('div')({
    display: 'flex',
    columnGap: '10px',
    alignItems: 'center',
    fontSize: '1.1em',
    width: '100%',
    border: 'none',
    padding: '10px',
    marginTop: '30px',
    borderBottom: '1px lightgrey solid',
    cursor: 'pointer',
    boxSizing: 'border-box',
    '&:hover': {
        textDecoration: 'underline',
    }
})

const CloseContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '5px',
    alignItems: 'center',
    fontWeight: 'bold',
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px',
    paddingLeft: '20px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    fontFamily: theme.fontFamily.nunito,
    position: 'relative',
    '& .close_title': {
        margin: '0',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        [theme.breakpoints.down('sm')]: {
            position: 'relative',
            top: '0',
            left: '0',
            transform: 'none',
        }
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        paddingLeft: '10px',

    }
}))

const Error = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: '5px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    color: 'red',
    width: '100%',
    marginTop: '30px',
})

const ReviewContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '5px',
    padding: '20px 30px',
    backgroundColor: '#e0f9ff',
    position: 'relative',
    marginTop: '10px',
})

const Date = styled('div')(({ theme }) => ({
    fontSize: '0.9em',
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8em',
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
    fontFamily: '"Work Sans", sans-serif',
    margin: '0',
    fontSize: '1em',
})

const CommentTitle = styled('h2')({
    fontFamily: '"Work Sans", sans-serif',
    margin: '0',
    marginLeft: '5px',
    fontSize: '1.1em',
    marginTop: '5px',
})

const Comment = styled('div')({
    fontFamily: '"Nunito", "sans-serif"',
    paddingLeft: '5px',
    marginTop: '5px',
})

const ReviewImagesContainer = styled('div')({
    display: 'flex',
    columnGap: '10px',
    marginTop: '10px',
    overflowX: 'auto',
})

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