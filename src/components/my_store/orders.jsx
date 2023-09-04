import React, { useEffect, useCallback, useState, useMemo } from "react"
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { getOrdersForShop } from '../../store/actions/order_actions'
import StorageIcon from '@mui/icons-material/Storage'
import ErrorIcon from '@mui/icons-material/Error'
import { Skeleton } from "@mui/material"
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
import { Pagination, IconButton, Tooltip, Collapse, Typography, Box, Stack } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { LIMIT_GET_ORDERS_SHOP } from "../../configs/constants"
import ProgressiveImage from "../materials/progressive_image"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '1em',
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

const sortHandler = (orders, sort_by, sort_type) => {
    let sort_orders = [...orders]

    if (sort_by === 'Date Of Placing')
        sort_orders.sort((pre, next) => {
            if (sort_type === 'asc')
                return doingSortByTime(pre.createdAt, next.createdAt)
            else
                return -doingSortByTime(pre.createdAt, next.createdAt)
        })
    else if (sort_by === 'Total Price (USD)')
        sort_orders.sort((pre, next) => {
            if (sort_type === 'asc')
                return doingSortByFloatNumber(pre.total_price, next.total_price)
            else
                return -doingSortByFloatNumber(pre.total_price, next.total_price)
        })

    return sort_orders
}

const converDate = (time_string) => moment(time_string).format('DD/MM/YYYY, HH:mm:ss')

const order_statuses = {
    uncompleted: 'uncompleted',
    processing: 'processing',
    delivering: 'delivering',
    delivered: 'delivered',
}

const OrderStatusIndicator = ({ orderStatus }) => {
    let set_style = {
        padding: '10px 20px',
        borderRadius: '5px',
    }

    if (orderStatus === order_statuses.uncompleted)
        set_style = {
            ...set_style,
            backgroundColor: '#ff8b8b',
        }
    else if (orderStatus === order_statuses.processing || orderStatus === order_statuses.delivering)
        set_style = {
            ...set_style,
            backgroundColor: '#ffd995',
        }
    else if (orderStatus === order_statuses.delivered)
        set_style = {
            ...set_style,
            backgroundColor: '#74ffcd',
        }

    return (
        <div style={set_style}>
            {orderStatus}
        </div>
    )
}

const payment_statuses = {
    processing: 'processing',
    canceled: 'canceled',
    succeeded: 'succeeded',
}

const PaymentStatusIndicator = ({ paymentStatus }) => {
    let set_style = {
        padding: '10px 20px',
        borderRadius: '5px',
    }

    if (paymentStatus === payment_statuses.canceled)
        set_style = {
            ...set_style,
            backgroundColor: '#ff8b8b',
        }
    else if (paymentStatus === payment_statuses.processing)
        set_style = {
            ...set_style,
            backgroundColor: '#ffd995',
        }
    else if (paymentStatus === payment_statuses.succeeded)
        set_style = {
            ...set_style,
            backgroundColor: '#74ffcd',
        }

    return (
        <div style={set_style}>
            {paymentStatus}
        </div>
    )
}

const Row = ({ orderStatus, paymentStatus, createdAt, rowId, items, onViewOrder, totalPrice }) => {
    const [openCollapse, setOpenCollapse] = useState(false)

    return (
        <>
            <StyledTableRow>

                <TableCell>
                    <Tooltip title="View Products">
                        <IconButton
                            size="small"
                            onClick={() => setOpenCollapse(pre => !pre)}
                        >
                            {openCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </Tooltip>
                </TableCell>

                <StyledTableCell>{converDate(createdAt)}</StyledTableCell>

                <StyledTableCell align="center">
                    <OrderStatusIndicator orderStatus={orderStatus} />
                </StyledTableCell>

                <StyledTableCell align="center">
                    <PaymentStatusIndicator paymentStatus={paymentStatus} />
                </StyledTableCell>

                <StyledTableCell align="center">{totalPrice}</StyledTableCell>

                <StyledTableCell>
                    <Tooltip title="View Order">
                        <IconButton onClick={() => onViewOrder(rowId)}>
                            <LaunchIcon />
                        </IconButton>
                    </Tooltip>
                </StyledTableCell>

            </StyledTableRow>
            <StyledTableRow>
                <StyledTableCell colSpan={6}>
                    <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                gutterBottom
                                component="div"
                            >
                                Products
                            </Typography>
                            {
                                items.map(({ _id, name, image_link, price, quantity }) => (
                                    <Product key={_id}>
                                        <ProgressiveImage
                                            src={image_link}
                                            height="100px"
                                            width="100px"
                                            scss={{ border: '1px lightgrey solid' }}
                                        />

                                        <Typography
                                            fontSize="1.2em"
                                        >
                                            {name}
                                        </Typography>

                                        <Typography
                                            fontSize="1.5em"
                                        >
                                            {'Qty: ' + quantity}
                                        </Typography>

                                        <Typography
                                            fontSize="1.5em"
                                        >
                                            {'$' + price}
                                        </Typography>
                                    </Product>
                                ))
                            }
                        </Box>
                    </Collapse>
                </StyledTableCell>
            </StyledTableRow>
        </>
    )
}

const Table = ({ orders, onViewOrder, onCreateSort, sort }) => {

    const handleOnViewOrder = (order_id) => onViewOrder(order_id)

    return (
        <TableContainer component={Paper}>
            <TableMUI sx={{ minWidth: 700 }} aria-label="ProductsOfShop">
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell></StyledTableCell>

                        <StyledTableCell
                            sortDirection={sort.by === 'Date Of Placing' ? sort.type : false}
                        >
                            <TableSortLabel
                                active={sort.by === 'Date Of Placing'}
                                direction={sort.by === 'Date Of Placing' ? sort.type : 'desc'}
                                onClick={() => onCreateSort('Date Of Placing')}
                            >
                                Date Of Placing
                            </TableSortLabel>
                        </StyledTableCell>

                        <StyledTableCell align="center">
                            Order Status
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            Payment Status
                        </StyledTableCell>

                        <StyledTableCell
                            sortDirection={sort.by === 'Total Price (USD)' ? sort.type : false}
                            align="center"
                        >
                            <TableSortLabel
                                active={sort.by === 'Total Price (USD)'}
                                direction={sort.by === 'Total Price (USD)' ? sort.type : 'desc'}
                                onClick={() => onCreateSort('Total Price (USD)')}
                            >
                                Total Price (USD)
                            </TableSortLabel>
                        </StyledTableCell>

                        <StyledTableCell>
                            View
                        </StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {orders.map(({ order_status, payment_status, createdAt, items, _id, total_price }) => (
                        <React.Fragment key={_id}>
                            <Row
                                orderStatus={order_status}
                                paymentStatus={payment_status}
                                createdAt={createdAt}
                                items={items}
                                rowId={_id}
                                onViewOrder={handleOnViewOrder}
                                totalPrice={total_price}
                            />
                        </React.Fragment>
                    ))}
                </TableBody>
            </TableMUI>
        </TableContainer>
    )
}

const EmptyHeading = ({ option }) => (
    <Box
        fontSize="1.2em"
        width="100%"
        textAlign="center"
        marginTop="50px"
    >
        <StorageIcon sx={{ fontSize: '1.8em' }} />
        <Typography
            marginTop="10px"
        >
            {
                option === 'All Orders' ? (
                    "Oops! You have no order now!"
                ) : "You have no order is " + option.toLowerCase()
            }
        </Typography>
    </Box >
)

const get_number_of_pages = (count_products, maximum_number_of_orders) => {
    return Math.ceil(count_products / maximum_number_of_orders)
}

const calculate_total_price = (items) => {
    return items.reduce((accumulator, { price, quantity }) => {
        return (accumulator + (price * quantity)).toFixed(2) * 1
    }, 0)
}

const set_total_price_for_each_order = (orders) => {
    return orders.map((order) => ({ total_price: calculate_total_price(order.items), ...order }))
}

const OrdersSection = ({ option }) => {
    const { orders, loading, error, countOrders, currentPage } = useSelector(({ order_for_shop }) => order_for_shop)
    const [sort, setSort] = useState({ by: '', type: 'asc' })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleViewOrder = useCallback((order_id) => {
        navigate('/myStore/Order/' + order_id)
    }, [])

    const handleCreateSort = useCallback((label) => {
        setSort(pre => ({ by: label, type: pre.type === 'asc' ? 'desc' : 'asc' }))
    }, [])

    const updated_orders = useMemo(() => {
        if (orders && orders.length > 0) {
            let new_orders = orders

            new_orders = set_total_price_for_each_order(new_orders)

            new_orders = sortHandler(new_orders, sort.by, sort.type)

            return new_orders
        }

        return null
    }, [orders, sort])

    const switchPage = (e, new_page) => {
        if (new_page === currentPage) return

        dispatch(getOrdersForShop(LIMIT_GET_ORDERS_SHOP, new_page))
    }

    return (
        loading ? (
            <Skeleton sx={{ transform: 'scale(1)', height: '300px', marginTop: '30px' }} />
        ) : error ? (
            <Typography
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                columnGap="5px"
                fontSize="1.1em"
                fontWeight="bold"
                color="red"
                marginTop="30px"
                width="100%"
            >
                <ErrorIcon sx={{ fontSize: '1.2em' }} />
                <span>{error.message}</span>
            </Typography>
        ) : updated_orders && updated_orders.length > 0 ? (
            <OrderTable>
                <Table
                    orders={updated_orders}
                    sort={sort}
                    onViewOrder={handleViewOrder}
                    onCreateSort={handleCreateSort}
                />

                {
                    option === 'All Orders' &&
                    <Box
                        display='flex'
                        justifyContent='center'
                        marginTop="30px"
                    >
                        <Pagination
                            count={get_number_of_pages(countOrders, LIMIT_GET_ORDERS_SHOP)}
                            variant="outlined"
                            shape="rounded"
                            onChange={switchPage}
                            page={currentPage}
                        />
                    </Box>
                }
            </OrderTable>
        ) : (
            <EmptyHeading option={option} />
        )
    )
}

const options = [
    {
        title: 'All Orders',
        icon: <FilterAltIcon sx={{ color: 'white' }} />,
        tooltip: 'All Orders',
    }, {
        title: 'Uncompleted',
        icon: <FilterAltIcon sx={{ color: 'white' }} />,
        tooltip: 'Filter By The Uncompleted Orders',
    }, {
        title: 'Processing',
        icon: <FilterAltIcon sx={{ color: 'white' }} />,
        tooltip: 'Filter By The Processing Orders',
    },
]

const Orders = () => {
    const [option, setOption] = useState('All Orders')
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getOrdersForShop(LIMIT_GET_ORDERS_SHOP, 1))
    }, [dispatch])

    const switchOption = (title) => {
        if (title === option) return

        if (title === 'All Orders')
            dispatch(getOrdersForShop(LIMIT_GET_ORDERS_SHOP, 1))
        else if (title === 'Uncompleted')
            dispatch(getOrdersForShop(LIMIT_GET_ORDERS_SHOP, 1, order_statuses.uncompleted))
        else if (title === 'Processing')
            dispatch(getOrdersForShop(LIMIT_GET_ORDERS_SHOP, 1, order_statuses.processing))

        setOption(title)
    }

    return (
        <div>
            <Stack
                flexDirection="row"
                justifyContent="space-between"
            >
                <span></span>
                <OptionsSection>

                    <Typography
                        fontWeight="bold"
                        fontFamily="inherit"
                        fontSize="1em"
                    >
                        Filter By Order Status:
                    </Typography>

                    {
                        options.map(({ title, icon, tooltip }) => (
                            <Tooltip
                                title={tooltip}
                                key={title}
                                arrow
                                placement="top"
                            >
                                <Option
                                    onClick={() => switchOption(title)}
                                    sx={option === title ? { backgroundColor: 'white', color: 'black', '& svg': { color: 'black' } } : {}}
                                >
                                    {icon}
                                    <span>{title}</span>
                                </Option>
                            </Tooltip>
                        ))
                    }

                </OptionsSection>
            </Stack>

            <OrdersSection
                option={option}
            />
        </div>
    )
}

export default Orders

const OptionsSection = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '20px',
    marginTop: '20px',
    fontFamily: theme.fontFamily.nunito,
    flexWrap: 'wrap',
    rowGap: '5px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8em',
    }
}))

const Option = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    padding: '10px 20px',
    backgroundColor: 'black',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '5px',
    border: '2px black solid',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
        '& svg': {
            color: 'black',
        }
    }
})

const OrderTable = styled('div')(({ theme }) => ({
    marginTop: "30px",
    [theme.breakpoints.down('md')]: {
        fontSize: '0.8em',
    }
}))

const Product = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: '20px',
    padding: '20px 30px',
    fontFamily: theme.fontFamily.kanit,
}))