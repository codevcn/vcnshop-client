import React, { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from "react-redux"
import { getProductDetailForShop } from "../../store/actions/product_actions"
import { Skeleton, Typography, Tooltip, Stack } from "@mui/material"
import InfoIcon from '@mui/icons-material/Info'
import ReviewsAndDescription from "./reviews_and_description"
import { Divider } from "@mui/material"
import EditProduct from "./edit_product"
import { useNavigate, useParams } from "react-router-dom"
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import DeleteProduct from "./delete_product"
import ProgressiveImage from "../materials/progressive_image"

const Images = React.memo(({ images, image_link }) => {
    const [mainImage, setMainImage] = useState('')

    const pickImage = (url) => { setMainImage(url) }

    return (
        <ImagesSection>
            <SmallImages>
                {
                    images.map((url) => (
                        <SmallImage
                            src={url}
                            onClick={() => pickImage(url)}
                            sx={{ outline: mainImage === url ? '2px gray solid' : 'unset' }}
                            key={url}
                        />
                    ))
                }
            </SmallImages>

            <MainImageWrapper>
                <ProgressiveImage
                    src={mainImage || image_link}
                    scss={{
                        margin: 'auto',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        borderRadius: '3px',
                        boxShadow: '0px 0px 3px gray',
                    }}
                />
            </MainImageWrapper>
        </ImagesSection>
    )
})

const Detail = ({ product }) => {
    const { _id, name, stock, target_gender, category, options, price } = product

    return (
        <DetailSection>

            <Tooltip
                title={name}
            >
                <ProductName>
                    {name}
                </ProductName>
            </Tooltip>

            <div>
                <Stack
                    flexDirection="row"
                    marginTop='15px'
                    columnGap='10px'
                    alignItems='center'
                    justifyContent='space-between'
                    width='fit-content'
                >
                    <InfoIcon sx={{ fontSize: '1em' }} />
                    <Field>
                        <span className="bold">Stock: </span>
                        <span>{stock}</span>
                    </Field>
                    <Divider orientation="vertical" flexItem={true} />
                    <Field>
                        <span className="bold">Target Gender: </span>
                        <span>{target_gender}</span>
                    </Field>
                    <Divider orientation="vertical" flexItem={true} />
                    <Field>
                        <span className="bold">Category: </span>
                        <span>{category}</span>
                    </Field>
                </Stack>

                <Title>Colors</Title>

                <Colors>
                    {
                        product.options.colors.map((color) => (
                            <Tooltip key={color} title={color}>
                                <Color theme={{ color }}></Color>
                            </Tooltip>
                        ))
                    }
                </Colors>

                <Title>Sizes</Title>

                <Sizes>
                    {
                        options.sizes.map((size) => (
                            <Tooltip key={size} title={'Size ' + size}>
                                <Size>
                                    {size}
                                </Size>
                            </Tooltip>
                        ))
                    }
                </Sizes>

                <Tooltip title={`Price: ${price.value} USD`} placement="right">
                    <Price>
                        {'$' + price.value}
                    </Price>
                </Tooltip>
            </div>

            <EditProduct productId={_id} />

        </DetailSection>
    )
}

const ProductDetail = () => {
    const { productDetail: product, loading, error } = useSelector(({ product_for_shop }) => product_for_shop)
    const dispatch = useDispatch()
    const { productId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getProductDetailForShop(productId))
    }, [dispatch])

    return (
        <ProductSection id="ProductSection">
            <SectionTitle>

                <Tooltip title="Back">
                    <GoBackBtn
                        onClick={() => navigate(-1)}
                    >
                        <NavigateBeforeIcon />
                        <span>Back</span>
                    </GoBackBtn>
                </Tooltip>

                <Typography
                    display="flex"
                    alignItems="center"
                    columnGap="5px"
                    fontSize="1.2em"
                    fontWeight="bold"
                >
                    <InfoIcon sx={{ fontSize: '1.3m' }} />
                    <span>Product Detail</span>
                </Typography>

            </SectionTitle>

            {
                loading ? (
                    <Skeleton sx={{ height: '400px', transform: 'scale(1)', marginTop: '20px' }} />
                ) : error ? (
                    <Error>{error.message}</Error>
                ) : product && (
                    <>
                        <Product>
                            <Images images={product.images} image_link={product.image_link} />

                            <Detail product={product} />
                        </Product>

                        <DeleteProduct productId={productId} />

                        <ReviewsAndDescription
                            productId={productId}
                            description={product.description}
                        />
                    </>
                )
            }
        </ProductSection>
    )
}

export default ProductDetail

const ProductSection = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.nunito,
}))

const SectionTitle = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    columnGap: '10px',
    boxSizing: 'border-box',
    width: '100%',
    margin: '0',
    fontSize: '1.3em',
    marginTop: '30px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
    }
}))

const GoBackBtn = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    backgroundColor: 'white',
    fontSize: '1em',
    position: 'absolute',
    left: '0',
    top: '0',
    cursor: 'pointer',
    '&:hover': {
        textDecoration: 'underline',
    },
    [theme.breakpoints.down('sm')]: {
        position: 'relative',
        width: '100%',
    }
}))

const Error = styled('div')(({ theme }) => ({
    color: 'red',
    width: '100%',
    textAlign: 'center',
    padding: '20px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    boxSizing: 'border-box',
    fontFamily: theme.fontFamily.nunito,
}))

const Product = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '30px',
    marginTop: '5px',
    paddingTop: '35px',
    borderTop: '2px black solid',
    [theme.breakpoints.down('lg')]: {
        flexDirection: 'column',
    }
}))

const ImagesSection = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '15px',
    width: '60%',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        rowGap: '10px',
    }
}))

const SmallImages = styled('div')(({ theme }) => ({
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
    borderRadius: '3px',
    border: '2px white solid',
    cursor: 'pointer',
    boxShadow: '0px 0px 2px gray',
    '&:hover': {
        outline: '2px gray solid',
    },
    [theme.breakpoints.down('sm')]: {
        width: '42px',
    }
}))

const MainImageWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    width: '100%',
    height: "90vh",
    overflow: "hidden",
    [theme.breakpoints.down('sm')]: {
        height: "fit-content",
    }
}))

const DetailSection = styled('div')(({ theme }) => ({
    width: '40%',
    paddingLeft: '20px',
    [theme.breakpoints.down('lg')]: {
        marginTop: '30px',
        width: '100%',
        paddingLeft: '0px',
    }
}))

const ProductName = styled(Typography)(({ theme }) => ({
    margin: "0",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "1.5em",
    width: "100%",
    overflow: "hidden",
    [theme.breakpoints.down('sm')]: {
        whiteSpace: "wrap",
    }
}))

const Field = styled('div')({
    fontSize: '1em',
    padding: '5px',
    '& .bold': {
        fontWeight: 'bold',
    }
})

const Colors = styled('div')({
    display: 'flex',
    columnGap: '20px',
    flexWrap: 'wrap',
})

const Title = styled('h2')({
    margin: '25px 0 10px',
    fontSize: '1.1em',
})

const Color = styled('div')(({ theme }) => ({
    backgroundColor: theme.color,
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    boxShadow: '0px 0px 3px black',
}))

const Sizes = styled('div')({
    display: 'flex',
    columnGap: '10px',
    flexWrap: 'wrap',
})

const Size = styled('div')({
    padding: '5px 20px',
    border: '2px black solid',
})

const Price = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.kanit,
    fontSize: '2.8em',
    marginTop: '30px',
    width: 'fit-content',
    [theme.breakpoints.down('md')]: {
        fontSize: '2em',
    }
}))