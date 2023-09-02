import React from "react"
import { styled } from '@mui/material/styles'
import { useParams } from "react-router-dom"
import { useSelector } from 'react-redux'
import Filter from "../components/search_result/filter"
import ScrollToTopBtn from '../components/scroll_to_top_btn'
import Pagination from '../components/search_result/pagination'
import { Stack, Box, Typography } from '@mui/material'
import Products from "../components/search_result/products"

const Heading = () => {
    const { keyword } = useParams()
    const { countProducts } = useSelector(({ product }) => product)

    return (
        <Stack marginTop="20px">
            <Stack alignItems="center" bgcolor="rgba(0, 0, 0, .05)" width="100%" padding="15px" boxSizing="border-box">
                <Typography color="#858585">
                    Your Search Results For:
                </Typography>
                <Typography margin="0" component="h2">
                    {keyword}
                </Typography>
            </Stack>
            <Stack marginTop="10px" fontSize="0.9em" color="gray" padding="5px" textAlign="center">
                {countProducts + (countProducts > 1 ? ' Results Found' : ' Result Found')}
            </Stack>
        </Stack>
    )
}

const SearchResult = () => {
    return (
        <SearchResultPage id="SearchResultPage">

            <Heading />

            <FilterAndProducts>
                <Filter />

                <Box width="100%" paddingRight="15px">

                    <Pagination />

                    <Products />

                </Box>
            </FilterAndProducts>

            <Typography
                color="gray"
                fontSize="0.8em"
                fontFamily="inherit"
                textAlign="center"
                width="100%"
                marginTop="50px"
                padding="10px"
                boxSizing="border-box"
                bgcolor="rgba(0,0,0,.05)"
            >
                If you are looking for the pagination then scroll up you will find them
            </Typography>

            <ScrollToTopBtn />

        </SearchResultPage>
    )
}

export default SearchResult

const SearchResultPage = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.nunito,
    paddingBottom: '30px',
}))

const FilterAndProducts = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: "20px",
    marginTop: "30px",
    padding: "0 10px",
    paddingTop: "10px",
    [theme.breakpoints.down('lg')]: {
        flexDirection: "column",
        padding: "0 20px",
    }
}))