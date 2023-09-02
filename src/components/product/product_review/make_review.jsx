import React, { useRef, useState } from "react"
import { styled } from '@mui/material/styles'
import ReviewsIcon from '@mui/icons-material/Reviews'
import { useDispatch } from "react-redux"
import { newReview } from "../../../store/actions/product_actions"
import ScoreCard from "./score_card"
import AddImages from "./add_images"
import { toast } from 'react-toastify'
import RatingSet from "./rating_set"
import { ProtectedSection } from "../../../utils/protected_resource"
import { CircularProgress } from "@mui/material"

const ProductReview = ({ productId }) => {
    const [ratingAndImgs, setReview] = useState({ rating: 0, images: [] })
    const [newReviewProcessing, setNewReviewProcessing] = useState(false)
    const comment_title_ref = useRef()
    const comment_ref = useRef()
    const dispatch = useDispatch()

    const submitReview = async () => {
        let rating = ratingAndImgs.rating
        let images = ratingAndImgs.images
        let comment = comment_ref.current.value
        let cmt_tilte = comment_title_ref.current.value

        if (rating === 0 || cmt_tilte === '' || comment === '')
            return toast.warn('Please complete Rating and Title and Comment!')

        setNewReviewProcessing(true)

        //set ratingAndImgs state to original
        comment_title_ref.current.value = ''
        comment_ref.current.value = ''
        setReview({ rating: 0, images: [] })

        await dispatch(
            newReview({
                productId,
                images,
                rating,
                title: cmt_tilte,
                comment,
            })
        )

        setNewReviewProcessing(false)
    }

    const updateReviewImages = (images) => {
        setReview(pre => ({ ...pre, images }))
    }

    const updateRatingsValue = (rating) => {
        setReview(pre => ({ ...pre, rating }))
    }

    return (
        <div>
            <div style={{ display: 'flex', columnGap: '10px', alignItems: 'center' }}>
                <ReviewsIcon />
                <ProductReviewTitle>Make Review</ProductReviewTitle>
            </div>

            <Hr />

            <ProtectedSection>
                <ReviewContainer>
                    <Title>Overview</Title>

                    <ScoreCard />

                    <Title>Make Review</Title>
                    {
                        newReviewProcessing ?
                            <LoadingContainer>
                                <CircularProgress
                                    sx={{ color: 'black' }}
                                    thickness={5}
                                    size={50}
                                />
                            </LoadingContainer>
                            :
                            <>
                                <AddImages
                                    images={ratingAndImgs.images}
                                    updateReviewImages={updateReviewImages}
                                />

                                <RatingSet
                                    ratingValue={ratingAndImgs.rating}
                                    updateRatingsValue={updateRatingsValue}
                                />

                                <CommentTitle
                                    ref={comment_title_ref}
                                    id="WriteCommentTitle"
                                    maxLength={65}
                                    placeholder="Write your title of comment here..."
                                />

                                <WriteComment //textarea
                                    ref={comment_ref}
                                    id="WriteCommentText"
                                    placeholder="Write your comment here..."
                                    rows={5}
                                    maxLength={200}
                                />

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span></span>
                                    <SubmitCommentBtn onClick={submitReview}>
                                        Submit Review
                                    </SubmitCommentBtn>
                                </div>
                            </>
                    }
                </ReviewContainer>
            </ProtectedSection>
        </div>
    )
}

export default ProductReview

const ProductReviewTitle = styled('h2')({
    margin: '0',
    fontSize: '1.5em',
    transform: 'scaleY(0.9)',
})

const Hr = styled('div')({
    height: '2px',
    backgroundColor: 'black',
})

const ReviewContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '5px',
    marginTop: '5px',
})

const Title = styled('div')({
    margin: '0',
    fontSize: '1.5em',
    transform: 'scaleY(0.9)',
    borderBottom: '2px black solid',
    fontWeight: 'bold',
    width: 'fit-content',
    marginTop: '10px',
})

const LoadingContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    padding: '30px',
    width: '100%',
    boxSizing: 'border-box',
})

const CommentTitle = styled('input')({
    fontSize: '1em',
    padding: '5px 15px',
    border: 'none',
    borderBottom: '1.5px black solid',
    outline: 'unset',
})

const WriteComment = styled('textarea')(({ theme }) => ({
    outline: 'unset',
    padding: '10px 20px',
    fontSize: '1em',
    boxSizing: 'border-box',
    border: '1.5px black solid',
    width: '100%',
    resize: 'vertical',
    fontFamily: theme.fontFamily.nunito,
}))

const SubmitCommentBtn = styled('button')({
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 12px',
    cursor: 'pointer',
    backgroundColor: 'black',
    color: 'white',
    border: '2px white solid',
    '&:hover': {
        outline: '2px black solid',
    }
})