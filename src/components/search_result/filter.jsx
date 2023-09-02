import React, { useState, useCallback } from "react"
import { styled } from '@mui/material/styles'
import { toast } from "react-toastify"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useDispatch, useSelector } from "react-redux"
import { getProducts } from "../../store/actions/product_actions"
import { MAX_PRICE_PORDUCT } from "../../configs/constants"
import {
    Radio, RadioGroup, Collapse, Rating as RatingMUI,
    FormControl, FormControlLabel, Stack, Typography,
    Divider, Box, Tooltip, SwipeableDrawer, IconButton, useMediaQuery,
} from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useCreateQueryString, useGetQueryValue, useGetQueryValueV2 } from "../../hooks/custom_hooks"
import { LIMIT_GET_PRODUCTS_DEFAULT } from '../../configs/constants'
import CloseIcon from '@mui/icons-material/Close'

const categories = {
    category: [
        'Shirt',
        'Pant',
        'Dress',
    ],
    target: [
        'Male',
        'Female',
        'Unisex',
    ],
}

const FilterContainer = ({ children, title }) => {
    const [collapse, setCollapse] = useState(true)

    return (
        <FilterContainerSection>
            <Tooltip title={collapse ? 'Close' : 'Open'}>
                <FilterTitle onClick={() => setCollapse(pre => !pre)}>
                    <span>{title}</span>
                    <ExpandMoreIcon
                        sx={{
                            transition: 'transform 0.2s',
                            transform: collapse ? 'rotate(-90deg)' : 'rotate(0deg)',
                        }}
                    />
                </FilterTitle>
            </Tooltip>
            <StyledCollapse in={collapse}>
                {children}
            </StyledCollapse>
        </FilterContainerSection>
    )
}

const SubCategory = ({ options, label, handleSubmitFilter, defaultValue }) => {

    const Option = ({ category }) => (
        <OptionSection
            control={
                <Radio
                    color="default"
                    sx={{ padding: '5px', color: 'black' }}
                />
            }
            label={category}
            value={category}
        />
    )

    return (
        <Stack marginTop="10px">
            <FormControl>
                <Typography
                    display="flex"
                    component="h2"
                    alignItems="center"
                    justifyContent="space-between"
                    margin="0"
                    fontSize="1em"
                >
                    {label}
                </Typography>
                <RadioGroup
                    name={label}
                    onChange={handleSubmitFilter}
                    defaultValue={defaultValue}
                >
                    {
                        options.map((text) => (
                            <Option
                                category={text}
                                key={text}
                            />
                        ))
                    }
                </RadioGroup>
            </FormControl>
        </Stack>
    )
}

const Category = ({ handleSubmitFilter }) => {
    const get_query_value = useGetQueryValue()

    const pickCategory = (e) => {
        let category = e.target.value
        let label = e.target.name
        let field_to_filter

        if (label === 'Type')
            field_to_filter = 'category'
        else if (label === 'Target')
            field_to_filter = 'target'

        handleSubmitFilter({ [field_to_filter]: category })
    }

    return (
        <FilterContainer title={'Category'}>

            <SubCategory
                label={'Type'}
                options={categories.category}
                handleSubmitFilter={pickCategory}
                defaultValue={get_query_value(undefined, 'category') || ''}
            />

            <SubCategory
                label={'Target'}
                options={categories.target}
                handleSubmitFilter={pickCategory}
                defaultValue={get_query_value(undefined, 'target') || ''}
            />

        </FilterContainer>
    )
}

const Rating = ({ handleSubmitFilter }) => {
    const get_query_value = useGetQueryValue()
    const [rating, setRating] = useState(get_query_value(undefined, 'rating') || 0)

    const switchRatingValue = (e, newRating) => {
        let new_rating = newRating || '0' // equal 0 when two consecutive time of selecting has the same value
        setRating(new_rating)

        handleSubmitFilter({ rating: new_rating })
    }

    return (
        <FilterContainer title={'Rating'}>
            <Box marginTop="10px">
                <RatingMUI
                    value={rating * 1}
                    precision={0.5}
                    onChange={switchRatingValue}
                />
            </Box>

            <Typography component="p" fontSize="0.9em" margin="0" marginLeft="5px">
                {'From ' + rating + (rating > 1 ? ' stars' : ' star')}
            </Typography>
        </FilterContainer>
    )
}

const Price = ({ handleSubmitFilter }) => {
    const [warning, setWarning] = useState('')
    const get_query_value = useGetQueryValue()
    const [price, setPrice] = useState(get_query_value(undefined, 'price') || '')

    const submitPrice = () => {
        if (price * 1 > MAX_PRICE_PORDUCT || !price)
            return setWarning(`Please enter a number smaller than or equal ${MAX_PRICE_PORDUCT}. Ex: 11.25`)

        handleSubmitFilter({ price: price })
    }

    const catchEnterKeyboard = e => e.key === 'Enter' && submitPrice()

    const inputFormatter = (e) => {
        let value = e.target.value
        let price_regex = /^[0-9]{0,}(\.){0,1}(\.[0-9]{1,2})?$/

        if (value === '')
            setPrice('')
        else if (price_regex.test(value))
            setPrice(value)
    }

    return (
        <FilterContainer title={'Price'}>
            <Box marginTop="10px">
                <Typography fontFamily="inherit" component="label" htmlFor="filter-price-search">
                    You're searching products with price from:
                </Typography>
            </Box>

            <Stack flexDirection="row" alignItems="center" marginTop="10px" columnGap="10px">
                <PriceFilterInput
                    id="filter-price-search"
                    value={price}
                    onChange={inputFormatter}
                    onKeyDown={catchEnterKeyboard}
                />
                <span>USD</span>
            </Stack>

            {
                warning &&
                <Typography
                    component="span"
                    display="block"
                    color="red"
                    marginTop="5px"
                    fontSize="0.8em"
                    fontFamily="inherit"
                >
                    {warning}
                </Typography>
            }

            <PriceApplyButton onClick={submitPrice}>
                Apply
            </PriceApplyButton>
        </FilterContainer>
    )
}

const Filter = () => {
    const { loading } = useSelector(({ product }) => product)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const get_query_values = useGetQueryValueV2()
    const { keyword } = useParams()
    const queryStringCreator = useCreateQueryString()

    const navigation = (query_string) => {
        navigate(`/search/${keyword}?${query_string}`)
    }

    const handleSubmitFilter = useCallback(({ price, rating, category, target }) => {
        if (price && price * 1 > MAX_PRICE_PORDUCT) {
            return toast.warning('Can\'t apply, please check again')
        }

        let query_data = get_query_values('price', 'rating', 'category', 'target')
        let price_data = query_data.price,
            rating_data = query_data.rating,
            category_data = query_data.category,
            target_data = query_data.target

        let query_string_options = {}
        if (price || price_data)
            query_string_options.price = price || price_data
        if (rating || rating_data)
            query_string_options.rating = rating || rating_data
        if (category || category_data)
            query_string_options.category = category || category_data
        if (target || target_data)
            query_string_options.target = target || target_data

        navigation(queryStringCreator(query_string_options))

        dispatch(getProducts(
            LIMIT_GET_PRODUCTS_DEFAULT,
            category || category_data || undefined,
            keyword,
            rating || rating_data || undefined,
            price ? [price * 1, MAX_PRICE_PORDUCT] : (price_data ? [price_data * 1, MAX_PRICE_PORDUCT] : undefined),
            1,
            target || target_data || undefined,
        ))
    }, [])

    return (
        <FilterSection
            id="ProductsSearchFilter"
            sx={loading ? { pointerEvents: 'none' } : {}}
            className="Static_Filter"
        >

            <Title>
                <FilterAltIcon />
                <span>Filter</span>
            </Title>

            <Category handleSubmitFilter={handleSubmitFilter} />

            <Divider flexItem />

            <Rating handleSubmitFilter={handleSubmitFilter} />

            <Divider flexItem />

            <Price handleSubmitFilter={handleSubmitFilter} />

        </FilterSection>
    )
}

const DrawerFilter = () => {
    const [open, setOpen] = useState(false)

    const toggleDrawer = (open) => {
        setOpen(open)
    }

    return (
        <Box className="Drawer_Filter">

            <OpenDrawerBtn
                onClick={() => toggleDrawer(true)}
            >
                <FilterAltIcon sx={{ fontSize: '1.3em' }} />
                <span>Filter</span>
            </OpenDrawerBtn>

            <SwipeableDrawer
                anchor="left"
                open={open}
                swipeAreaWidth={0}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <div>
                    <Stack
                        flexDirection="row"
                        justifyContent="space-between"
                        padding="5px"
                    >
                        <span></span>
                        <IconButton onClick={() => toggleDrawer(false)}>
                            <CloseIcon sx={{ fontSize: '1.2em' }} />
                        </IconButton>
                    </Stack>

                    <Filter />
                </div>
            </SwipeableDrawer>

        </Box >
    )
}

const ResponsiveFilter = () => {
    const matches_from_md = useMediaQuery(theme => theme.breakpoints.up('md'))

    return (
        matches_from_md ? (
            <Filter />
        ) :
            <DrawerFilter />
    )
}

export default React.memo(ResponsiveFilter)

const OpenDrawerBtn = styled('button')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    padding: "10px 20px",
    cursor: 'pointer',
    borderColor: "black",
    transition: 'background-color 0.2s',
    border: '1px lightgrey solid',
    backgroundColor: 'white',
    '&:active , &:hover': {
        backgroundColor: 'black',
        color: 'white',
    }
})

const FilterSection = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px',
    width: '25%',
    height: 'fit-content',
    padding: '20px 10px',
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('lg')]: {
        flexDirection: 'row',
        width: '100%',
        boxSizing: 'border-box',
        columnGap: '20px',
        justifyContent: 'space-around',
        backgroundColor: '#f7f7f7',
        padding: '30px 15px',
    },
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        backgroundColor: 'white',
    }
}))

const Title = styled(Typography)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
    borderBottom: "1px #939393 solid",
    margin: "0",
    paddingBottom: "10px",
    fontSize: "1.3em",
    [theme.breakpoints.down('lg')]: {
        backgroundColor: '#e1e1e1',
        borderBottom: "none",
        color: '#8e8e8e',
        paddingBottom: "0",
        padding: '10px 15px',
        fontSize: '1em',
    },
}))

const FilterContainerSection = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
        maxWidth: '100%',
    }
}))

const FilterTitle = styled('h2')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0',
    fontSize: '1.2em',
    padding: '10px',
    paddingLeft: '15px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,.05)',
    },
    [theme.breakpoints.down('lg')]: {
        fontSize: '1em',
        justifyContent: 'left',
        columnGap: '10px',
    }
}))

const PriceFilterInput = styled('input')({
    outline: 'unset',
    width: '100%',
    minWidth: '82px',
    padding: '5px 10px',
    boxSizing: 'border-box',
    border: '1px gray solid',
    '&:focus': {
        outline: '1px black solid',
    }
})

const PriceApplyButton = styled('button')({
    width: '100%',
    padding: '5px 10px',
    backgroundColor: 'black',
    color: 'white',
    marginTop: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: '2px black solid',
    borderRadius: '3px',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
    },
    '&:active': {
        backgroundColor: 'black',
        color: 'white',
    }
})

const StyledCollapse = styled(Collapse)({
    padding: '0 15px',
    paddingLeft: '25px',
})

const OptionSection = styled(FormControlLabel)({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    paddingLeft: '5px',
    marginTop: '3px',
    cursor: 'pointer',
    '& .MuiFormControlLabel-label': {
        fontFamily: 'inherit',
    }
})