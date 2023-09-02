import React, { useMemo, useState } from "react"
import { styled } from "@mui/material"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
} from "chart.js"
import { Bar as BarChartJs2 } from "react-chartjs-2"
import Select from '@mui/material/Select'
import moment from "moment"
import { Box } from '@mui/material'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: "top"
        },
        datalabels: {
            font: {
                size: 0,
            }
        }
    }
}

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const set_data = (orders_dataset, users_dataset, shops_dataset) => ({
    labels: labels,
    datasets: [
        {
            label: "Number Of Verified Users",
            data: labels.map((label, index) => users_dataset[index]),
            backgroundColor: "rgba(53, 162, 235, 0.5)"
        }, {
            label: "Number Of Paid Orders",
            data: labels.map((label, index) => orders_dataset[index]),
            backgroundColor: "rgba(255, 99, 132, 0.5)"
        }, {
            label: "Number Of Created Stores",
            data: labels.map((label, index) => shops_dataset[index]),
            backgroundColor: "rgba(78, 255, 125, 0.5)"
        }
    ]
})

const check_year = (time_string, year_to_compare) => {
    return year_to_compare === moment(time_string).get('year')
}

const Chart = ({ users, orders, shops }) => {
    const [year, setYear] = useState(moment().get('year'))

    const counted_users = useMemo(() => {
        let months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        let createdAt
        for (let user of users) {
            createdAt = user.createdAt
            if (createdAt && check_year(createdAt, year) && user.active)
                months[moment(createdAt).get('month')]++
        }

        return months
    }, [users, year])

    const counted_orders = useMemo(() => {
        let months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        let createdAt
        for (let order of orders) {
            createdAt = order.createdAt
            if (createdAt && check_year(createdAt, year) && order.payment_status === 'succeeded')
                months[moment(createdAt).get('month')]++
        }

        return months
    }, [orders, year])

    const counted_shops = useMemo(() => {
        let months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        let createdAt
        for (let shop of shops) {
            createdAt = shop.createdAt
            if (createdAt && check_year(createdAt, year))
                months[moment(createdAt).get('month')]++
        }

        return months
    }, [shops, year])

    const switchYear = (e) => {
        setYear(e.target.value * 1)
    }

    return (
        <Box width='100%'>
            <Box
                display='flex'
                justifyContent='space-between'
                margin='10px 0'
            >
                <span></span>
                <PickYearContainer>
                    <span>Display The Results In</span>

                    <Select
                        native
                        onChange={switchYear}
                        value={year}
                    >
                        <option value={`${year - 2}`}>{year - 2}</option>
                        <option value={`${year - 1}`}>{year - 1}</option>
                        <option value={`${year}`}>{year}</option>
                        <option value={`${year + 1}`}>{year + 1}</option>
                        <option value={`${year + 2}`}>{year + 2}</option>
                    </Select>
                </PickYearContainer>
            </Box>

            <BarChartJs2
                data={set_data(counted_orders, counted_users, counted_shops)}
                options={options}
                updateMode="active"
            />
        </Box>
    )
}

export default Chart

const PickYearContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    fontFamily: theme.fontFamily.nunito,
    fontWeight: 'bold',
    color: 'gray',
}))