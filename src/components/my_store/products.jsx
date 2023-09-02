import React, { useCallback, useEffect, useMemo, useState } from "react"
import { styled } from '@mui/material/styles'
import ErrorIcon from '@mui/icons-material/Error'
import AddProduct from './add_product'
import { useDispatch, useSelector } from "react-redux"
import { Skeleton } from "@mui/material"
import { getProductsForShop } from "../../store/actions/product_actions"
import { useNavigate } from 'react-router-dom'
import TableMUI from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import LaunchIcon from '@mui/icons-material/Launch'
import moment from "moment"
import TableSortLabel from '@mui/material/TableSortLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import SearchIcon from '@mui/icons-material/Search'
import { useDebounce } from "../../hooks/custom_hooks"
import { Pagination as PaginationMUI, Tooltip, Avatar, IconButton, Stack, Box, Typography } from "@mui/material"
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import ViewCompactIcon from '@mui/icons-material/ViewCompact'
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral'
import { MAX_NUM_OF_PRODUCTS_SHOP } from "../../configs/constants"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 16,
        [theme.breakpoints.down('sm')]: {
            fontSize: 13,
        }
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '& .MuiButtonBase-root.MuiTableSortLabel-root:hover': {
        color: 'rgba(255,255,255,0.7)',
    },
    '& .MuiButtonBase-root.MuiTableSortLabel-root.Mui-active': {
        color: 'rgba(255,255,255,0.7)',
        ' .MuiTableSortLabel-icon': {
            color: 'rgba(255,255,255,0.7)',
        }
    },
}))

// -1: pre less than next && 1: pre greater than next && 0: pre is equal to next
const doingSortByString = (pre_product, next_product, sort_by) => {
    if (pre_product[sort_by] > next_product[sort_by])
        return 1
    else if (pre_product[sort_by] < next_product[sort_by])
        return -1
    return 0
}

const doingSortByTime = (pre_time, next_time) => {
    if (moment(pre_time).isAfter(next_time))
        return 1
    else if (moment(pre_time).isBefore(next_time))
        return -1
    return 0
}

const doingSortByFloatNumber = (pre_number, next_number) => {
    return parseFloat(pre_number) - parseFloat(next_number)
}

const sortHandler = (products, order_by, order_type) => {
    if (order_by === 'Product Name') order_by = 'name'
    else if (order_by === 'Date Of Adding') order_by = 'createdAt'
    else if (order_by === 'Price (USD)') order_by = 'price'
    else if (order_by === 'Stock') order_by = 'stock'
    else if (order_by === 'Sold') order_by = 'sold'

    let sort_products = [...products]

    if (order_by === 'createdAt')
        sort_products.sort((pre, next) => {
            if (order_type === 'asc')
                return doingSortByTime(pre.createdAt, next.createdAt)
            else
                return -doingSortByTime(pre.createdAt, next.createdAt)
        })
    else if (order_by === 'price')
        sort_products.sort((pre, next) => {
            if (order_type === 'asc')
                return doingSortByFloatNumber(pre.price.value, next.price.value)
            else
                return -doingSortByFloatNumber(pre.price.value, next.price.value)
        })
    else if (order_by === 'sold')
        sort_products.sort((pre, next) => {
            if (order_type === 'asc')
                return doingSortByString(pre.sold, next.sold, 'count')
            else
                return -doingSortByString(pre.sold, next.sold, 'count')
        })
    else
        sort_products.sort((pre, next) => {
            if (order_type === 'asc')
                return doingSortByString(pre, next, order_by)
            else
                return -doingSortByString(pre, next, order_by)
        })

    return sort_products
}

const converDate = (time_string) => {
    return moment(time_string).format('DD/MM/YYYY, HH:mm')
}

const searchHandler = (products, keyword) => {
    return products.filter((product) => {
        return product.name.toLowerCase().includes(keyword.toLowerCase())
    })
}

const get_number_of_pages = (count_products, maximum_number_of_products) => {
    return Math.ceil(count_products / maximum_number_of_products)
}

const table_head_sort_labels = ['Product Name', 'Date Of Adding', 'Sold', 'Price (USD)', 'Stock']

const Table = ({ products, onViewProduct, onCreateSort, order }) => {
    return (
        <TableContainer component={Paper}>
            <TableMUI sx={{ minWidth: 700 }} aria-label="ProductsOfShop">
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>
                            <Tooltip title="Ordinal Number">
                                <span>O.N</span>
                            </Tooltip>
                        </StyledTableCell>
                        {
                            table_head_sort_labels.map((label) => (
                                <StyledTableCell
                                    key={label}
                                    align={label === 'Price (USD)' || label === 'Stock' ? 'center' : 'left'}
                                    sortDirection={order.by === label ? order.type : false}
                                >
                                    <TableSortLabel
                                        active={order.by === label}
                                        direction={order.by === label ? order.type : 'desc'}
                                        onClick={() => onCreateSort(label)}
                                    >
                                        {label}
                                    </TableSortLabel>
                                </StyledTableCell>
                            ))
                        }
                        <StyledTableCell>
                            View
                        </StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {products.map(({ _id, name, createdAt, price, stock, sold }, index) => (
                        <StyledTableRow key={_id}>
                            <StyledTableCell component="th" scope="row">
                                {index + 1}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                {name}
                            </StyledTableCell>
                            <StyledTableCell>{converDate(createdAt)}</StyledTableCell>
                            <StyledTableCell align="center">{sold.count}</StyledTableCell>
                            <StyledTableCell align="center">{price.value}</StyledTableCell>
                            <StyledTableCell align="center">{stock}</StyledTableCell>
                            <StyledTableCell>
                                <Tooltip title="View Product">
                                    <IconButton onClick={() => onViewProduct(_id)}>
                                        <LaunchIcon />
                                    </IconButton>
                                </Tooltip>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </TableMUI>
        </TableContainer>
    )
}

const EmptyHeadingComponent = ({ option }) => (
    <Typography
        fontSize='1.2em'
        width='100%'
        textAlign='center'
        marginTop='30px'
        component="h2"
    >
        <SentimentNeutralIcon sx={{ fontSize: '1.8em' }} />
        <div>
            {
                option === 'All Products' ? (
                    "Oops! You don't have any product!"
                ) : option === 'Stockout' && (
                    "You have no product is out of stock"
                )
            }
        </div>
    </Typography >
)

const Products = ({ option }) => {
    const { products, loading, error } = useSelector(({ product_for_shop }) => product_for_shop)
    const [keyword, setKeyword] = useState('')
    const [order, setOrder] = useState({ by: '', type: 'asc' })
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getProductsForShop(
            MAX_NUM_OF_PRODUCTS_SHOP,
            1,
            undefined,
        ))
    }, [dispatch])

    const decounce = useDebounce()

    const doingSearch = (e) => {
        let keyword = e.target.value
        setKeyword(keyword)
    }

    const handleViewProduct = useCallback((product_id) => {
        navigate('/myStore/product/' + product_id)
    }, [])

    const handleCreateSort = useCallback((label) => {
        setOrder(pre => ({ by: label, type: pre.type === 'asc' ? 'desc' : 'asc' }))
    }, [])

    const update_products = useMemo(() => {
        if (products && products.length > 0) {
            let new_products = products

            if (keyword)
                new_products = searchHandler(products, keyword)

            new_products = sortHandler(new_products, order.by, order.type)

            return new_products
        }

        return null
    }, [products, keyword, order])

    return (
        <>
            <FormControl fullWidth>
                <InputLabel htmlFor="search_by_name" color="success">
                    Search By Name
                </InputLabel>
                <OutlinedInput
                    id="search_by_name"
                    color="success"
                    startAdornment={<SearchIcon sx={{ paddingRight: '10px' }} />}
                    label="Search By Name"
                    onChange={decounce(doingSearch, 300)}
                    defaultValue={keyword}
                    placeholder="Enter the product name here..."
                />
            </FormControl>

            <Note>
                <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                <span>Swipe to left to see more</span>
            </Note>

            {

                loading ? (
                    <Skeleton sx={{ transform: 'none', height: '300px', marginTop: '30px' }} />
                ) : error ? (
                    <Stack
                        flexDirection="row"
                        alignItems='center'
                        justifyContent='center'
                        columnGap='5px'
                        fontSize='1.1em'
                        fontWeight='bold'
                        color='red'
                        width='100%'
                        marginTop='30px'
                    >
                        <ErrorIcon sx={{ fontSize: '1.2em' }} />
                        <span>{error.message}</span>
                    </Stack>
                ) : update_products && update_products.length > 0 ? (
                    <Box marginTop="20px">
                        <Table
                            order={order}
                            products={update_products}
                            onViewProduct={handleViewProduct}
                            onCreateSort={handleCreateSort}
                        />
                    </Box>
                ) : (
                    <EmptyHeadingComponent option={option} />
                )
            }
        </>
    )
}

const Pagination = ({ option }) => {
    const { countProducts, currentPage } = useSelector(({ product_for_shop }) => product_for_shop)
    const dispatch = useDispatch()

    const switchPage = (e, new_page) => {
        if (new_page === currentPage) return

        dispatch(getProductsForShop(
            MAX_NUM_OF_PRODUCTS_SHOP,
            new_page,
            undefined,
        ))
    }

    return (
        option === 'All Products' &&
        <Stack
            flexDirection="row"
            justifyContent="center"
        >
            <Pages
                count={get_number_of_pages(countProducts, MAX_NUM_OF_PRODUCTS_SHOP)}
                variant="outlined"
                shape="rounded"
                onChange={switchPage}
                page={currentPage}
            />
        </Stack>
    )
}

const options = [
    {
        title: 'All Products',
        icon: <ViewCompactIcon sx={{ color: 'white' }} />,
        tooltip: 'All Products',
    }, {
        title: 'Stockout',
        icon: <CheckBoxOutlineBlankIcon sx={{ color: 'white' }} />,
        tooltip: 'View The Stockout Products',
    },
]

const ProductsSection = ({ shopId }) => {
    const [option, setOption] = useState('All Products')
    const dispatch = useDispatch()

    const switchOption = (title) => {
        if (title === option) return

        if (title === 'All Products')
            dispatch(getProductsForShop(
                MAX_NUM_OF_PRODUCTS_SHOP,
                1,
                undefined,
            ))
        else if (title === 'Stockout')
            dispatch(getProductsForShop(
                100,
                1,
                [0, 0]
            ))

        setOption(title)
    }

    return (
        <div id="ProductsOfStore">

            <AddProductBtnAndOptions>
                <AddProduct />

                <Stack
                    flexDirection="row"
                    columnGap="20px"
                >
                    {
                        options.map(({ title, icon, tooltip }) => (
                            <Tooltip
                                title={tooltip}
                                key={title}
                                arrow
                            >
                                <IconButton onClick={() => switchOption(title)}>
                                    <Avatar sx={{ backgroundColor: 'black' }}>
                                        {icon}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        ))
                    }
                </Stack>
            </AddProductBtnAndOptions>

            <Box
                marginTop="30px"
            >
                <Products
                    option={option}
                    shopId={shopId}
                />

                <Pagination
                    option={option}
                    shopId={shopId}
                />
            </Box>
        </div>
    )
}

export default ProductsSection

const Pages = styled(PaginationMUI)({
    marginTop: '30px',
})

const AddProductBtnAndOptions = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: "space-between",
    alignItems: 'center',
    marginTop: "20px",
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        rowGap: '10px',
        alignItems: "flex-start",
    }
}))

const Note = styled('div')(({ theme }) => ({
    display: 'none',
    alignItems: 'center',
    columnGap: '5px',
    marginTop: '10px',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '0.8em',
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
        display: 'flex',
    }
}))