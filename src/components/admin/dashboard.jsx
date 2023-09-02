import React from "react"
import { styled } from '@mui/material/styles'
import PeopleIcon from '@mui/icons-material/People'
import AllInboxIcon from '@mui/icons-material/AllInbox'
import InventoryIcon from '@mui/icons-material/Inventory'
import ErrorIcon from '@mui/icons-material/Error'
import DashboardChart from "./dashboard_chart"
import AutoIncreaAnimate from "../materials/auto_increa_animate"
import StoreIcon from '@mui/icons-material/Store'
import { Box } from "@mui/material"

const style_for_icons = {
    color: 'white',
}

const set_sums = (count_orders, count_users, count_produtcs, count_shops) => [
    {
        label: 'Orders\'s Total',
        icon: <AllInboxIcon sx={style_for_icons} />,
        count: count_orders,
    }, {
        label: 'Users\'s Total',
        icon: <PeopleIcon sx={style_for_icons} />,
        count: count_users,
    }, {
        label: 'Products\'s Total',
        icon: <InventoryIcon sx={style_for_icons} />,
        count: count_produtcs,
    }, {
        label: 'Stores\'s Total',
        icon: <StoreIcon sx={style_for_icons} />,
        count: count_shops,
    },
]

const Dashboard = ({ users, orders, products, shops }) => {

    return (
        <DashBoardSection id="DashBoardSection">
            <Box width='100%' >
                <Title>Totals</Title>
                <Note>
                    <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                    <span>Display the totals up to now</span>
                </Note>
            </Box>

            <Totals>
                {
                    set_sums(orders.length, users.length, products.length, shops.length)
                        .map(({ label, icon, count }) => (
                            <Total key={label}>
                                <div className="total_container">
                                    <Box
                                        padding='10px'
                                        backgroundColor='black'
                                        height='fit-content'
                                        borderRadius='5px'
                                    >
                                        {icon}
                                    </Box>

                                    <div>
                                        <Box
                                            marginBottom='5px'
                                            color='gray'
                                        >
                                            {label}
                                        </Box>

                                        <Box
                                            textAlign='right'
                                            fontSize='1.5em'
                                            fontWeight='bold'
                                        >
                                            <AutoIncreaAnimate number={count} />
                                        </Box>
                                    </div>
                                </div>
                            </Total>
                        ))
                }
            </Totals>

            <Box
                id="BarChartSection"
                width='100%'
                marginTop='30px'
            >
                <Title>Verified Users And Paid Orders</Title>
                
                <Note>
                    <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                    <span>Display the users was verified and the orders was paid and the stores was registered via months</span>
                </Note>

                <DashboardChart
                    users={users}
                    orders={orders}
                    shops={shops}
                />
            </Box>
        </DashBoardSection>
    )
}

export default Dashboard

const DashBoardSection = styled('div')(({ theme }) => ({
    display: 'flex',
    rowGap: '20px',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
}))

const Totals = styled('div')({
    display: 'flex',
    columnGap: '20px',
    rowGap: '20px',
    justifyContent: 'space-evenly',
    width: '100%',
    flexWrap: 'wrap',
})

const Total = styled('div')({
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 0px 3px gray',
    width: '230px',
    boxSizing: 'border-box',
    '& .total_container': {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: '20px',
        columnGap: '30px',
        borderBottom: '1px lightgrey solid',
        borderRadius: '10px',
    }
})

const Title = styled('div')({
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    width: '100%',
    boxSizing: 'border-box',
})

const Note = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginTop: '5px',
    paddingLeft: '10px',
    marginBottom: '10px',
    '& span': {
        fontFamily: theme.fontFamily.nunito,
        fontSize: '0.8em',
    }
}))