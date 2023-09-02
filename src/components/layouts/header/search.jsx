import React, { useEffect, useRef, useState, forwardRef, startTransition } from "react"
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useDebounce } from '../../../hooks/custom_hooks'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Stack, Typography, Box, LinearProgress, Tooltip, Drawer } from '@mui/material'
import { useTheme } from "@emotion/react"
import { get_products_name_api } from '../../../apis/product_apis'
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const remove_class = (ele_of_suggestions, index_to_remove) => {
    ele_of_suggestions[index_to_remove].classList.remove('arrow_keyboard_focusing')
}

const add_class = (ele_of_suggestions, index_to_add) => {
    ele_of_suggestions[index_to_add].classList.add('arrow_keyboard_focusing')
}

const Search = ({ handleSetSuggestions, suggestionsRef, handleSubmitSearch }) => {
    const [suggestionsData, setSuggestionsData] = useState(null)
    const suggestions = useRef()
    const first_keyword = useRef('')
    const debounce = useDebounce()
    const search_input_ref = useRef()
    const suggestion_index = useRef(-1)

    const getSuggestions = async () => {
        try {
            let response = await axios.get(get_products_name_api)
            setSuggestionsData(response.data.list)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getSuggestions()
    }, [])

    const searching = (e) => {
        let keywrod = e.target.value.toLowerCase()
        if (keywrod === '') return handleSetSuggestions([])

        let result_list = []
        let match = true
        let lower_case

        for (let product_name of suggestionsData) {
            lower_case = product_name.toLowerCase()
            match = true
            for (let i = 0; i < keywrod.length; i++)
                if (keywrod[i] !== lower_case[i] && i < keywrod.length)
                    match = false
            if (match) result_list.push(product_name)
            if (result_list.length === 10) break
        }

        handleSetSuggestions(result_list)
        suggestions.current = result_list
        first_keyword.current = keywrod
    }

    const catchOnKeyboard = e => {
        if (e.key === 'Backspace') return suggestion_index.current = -1

        catchArrowKeyboard(e)
        catchEnterKeyboard(e)
    }

    const catchEnterKeyboard = (e) => {
        if (e.key !== 'Enter') return

        submitSearch()
    }

    const catchArrowKeyboard = e => {
        let keyboard = e.key
        if (keyboard !== 'ArrowDown' && keyboard !== 'ArrowUp') return

        let ele_of_suggestions = suggestionsRef.current.children
        let pre_suggestion_index = suggestion_index.current

        if (keyboard === 'ArrowDown') {
            if (pre_suggestion_index === -1) {
                add_class(ele_of_suggestions, 0)

                suggestion_index.current++

                search_input_ref.current.value = suggestions.current[0]
            } else if (pre_suggestion_index < ele_of_suggestions.length - 1) {
                remove_class(ele_of_suggestions, pre_suggestion_index)
                add_class(ele_of_suggestions, pre_suggestion_index + 1)

                suggestion_index.current++

                search_input_ref.current.value = suggestions.current[pre_suggestion_index + 1]
            } else if (pre_suggestion_index === ele_of_suggestions.length - 1) {
                remove_class(ele_of_suggestions, pre_suggestion_index)
                add_class(ele_of_suggestions, 0)

                suggestion_index.current = 0

                search_input_ref.current.value = suggestions.current[0]
            }
        } else {
            if (pre_suggestion_index === 0) {
                remove_class(ele_of_suggestions, pre_suggestion_index)

                suggestion_index.current--

                search_input_ref.current.value = first_keyword.current
            } else if (pre_suggestion_index === -1) {
                let current_suggestion_index = ele_of_suggestions.length - 1

                add_class(ele_of_suggestions, current_suggestion_index)

                suggestion_index.current = current_suggestion_index

                search_input_ref.current.value = suggestions.current[current_suggestion_index]
            } else if (pre_suggestion_index > 0) {
                remove_class(ele_of_suggestions, pre_suggestion_index)
                add_class(ele_of_suggestions, pre_suggestion_index - 1)

                suggestion_index.current--

                search_input_ref.current.value = suggestions.current[pre_suggestion_index - 1]
            }
        }
    }

    const submitSearch = () => {
        handleSubmitSearch(search_input_ref.current.value)
    }

    return (
        <SearchInputContainer>
            <Stack
                flexDirection="row"
                height="40px"
            >
                <SearchInput
                    ref={search_input_ref}
                    id="SearchDialogInput"
                    type="text"
                    placeholder={"Find Products By Name..."}
                    readOnly={!suggestionsData}
                    onChange={debounce((e) => searching(e), 400)}
                    onKeyDown={catchOnKeyboard}
                    maxLength={100}
                    autoComplete="off"
                />

                <SearchIconWrapper onClick={submitSearch}>
                    <SearchIcon
                        sx={{
                            fontSize: '1.2em',
                            transform: 'rotateY(180deg)',
                            transition: 'transform 0.5s',
                            color: 'white',
                        }}
                    />
                </SearchIconWrapper>
            </Stack>

            {
                !suggestionsData &&
                <Box color="black">
                    <LinearProgress color="inherit" />
                </Box>
            }
        </SearchInputContainer>
    )
}

const Suggestions = forwardRef(({ suggestions }, ref) => {

    const Suggestion = ({ suggestion }) => {
        return (
            <SuggestionSection
                href={'/search/' + suggestion}
                key={suggestion}
            >
                <Stack
                    flexDirection="row"
                    alignItems="center"
                    columnGap="5px"
                >
                    <SearchIcon sx={{ fontSize: '1.2em' }} />
                    <span>{suggestion}</span>
                </Stack>
                <Stack
                    flexDirection="row"
                    alignItems="center"
                    position="absolute"
                    top="0"
                    right="0"
                    height="100%"
                >
                    <SearchIcon
                        sx={{
                            opacity: '0',
                            marginRight: '30px',
                            fontSize: '1.3em',
                        }}
                    />
                </Stack>
            </SuggestionSection>
        )
    }

    return (
        suggestions && suggestions.length > 0 &&
        <>
            <Stack
                border="1px white solid"
                width="100%"
                boxSizing="border-box"
                bgcolor="white"
                marginTop="15px"
                ref={ref}
            >
                {
                    suggestions.map((suggestion) => (
                        <Suggestion suggestion={suggestion} key={suggestion} />
                    ))
                }
            </Stack>

            <Stack
                flexDirection="row"
                alignItems="center"
                columnGap="5px"
                fontWeight="bold"
                width="100%"
                padding="8px 30px"
                boxSizing="border-box"
            >
                <SearchIcon sx={{ fontSize: '1.2em' }} />
                <span>...</span>
            </Stack>
        </>
    )
})

const SearchSection = ({ handleOpenSearch }) => {
    const [suggestions, setSuggestions] = useState([])
    const theme = useTheme()
    const suggestions_ref = useRef()
    const { t } = useTranslation('home_page')
    const navigate = useNavigate()

    const handleSetSuggestions = (suggestions_list) => {
        setSuggestions(suggestions_list)
    }

    const handleSubmitSearch = (keyword) => {
        if (keyword === '')
            return toast.warning('Please enter the product name you want to search')

        navigate('/search/' + keyword)
        handleOpenSearch(false)
    }

    return (
        <Stack
            alignItems="center"
            width="100%"
            boxSizing="border-box"
            fontFamily={theme.fontFamily.nunito}
        >

            <Stack
                position="relative"
                width="100%"
                alignItems="center"
            >
                <Typography
                    component="label"
                    htmlFor="SearchDialogInput"
                    fontFamily={theme.fontFamily.kanit}
                    fontSize="2.2em"
                    fontWeight="bold"
                    marginTop="10px"
                >
                    VCN SHOP
                </Typography>

                <Tooltip title={t("Close")}>
                    <CloseSearchIcon onClick={() => handleOpenSearch(false)} />
                </Tooltip>
            </Stack>

            <Search
                handleSetSuggestions={handleSetSuggestions}
                suggestionsRef={suggestions_ref}
                handleSubmitSearch={handleSubmitSearch}
            />

            <Suggestions suggestions={suggestions} ref={suggestions_ref} />

        </Stack>
    )
}

const SearchButton = () => {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation('home_page')

    const handleOpenSearch = (is_open) => {
        startTransition(() => {
            setOpen(is_open)
        })
    }

    return (
        <>
            <Drawer
                anchor="top"
                open={open}
                onClose={() => handleOpenSearch(false)}
            >
                <Box
                    width="100%"
                    paddingBottom="20px"
                >
                    <SearchSection handleOpenSearch={handleOpenSearch} />
                </Box>
            </Drawer>

            <Tooltip
                title={t('Tap to search')}
            >
                <SearchBtn
                    onClick={() => handleOpenSearch(true)}
                >
                    <SearchIcon sx={{ color: 'black' }} />
                    <Placeholder>
                        {t('Find Product By Names...')}
                    </Placeholder>
                </SearchBtn>
            </Tooltip>
        </>
    )
}

export default React.memo(SearchButton)

const SearchInputContainer = styled('div')(({ theme }) => ({
    width: "50%",
    rowGap: "5px",
    marginTop: "15px",
    [theme.breakpoints.down('md')]: {
        width: "90%",
    },
}))

const SearchInput = styled('input')({
    outline: 'unset',
    width: '100%',
    height: '100%',
    padding: '3px 15px',
    border: '1.5px black solid',
    boxSizing: 'border-box',
    fontSize: '0.9em',
})

const SearchIconWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    boxSizing: 'border-box',
    border: '1.5px black solid',
    borderLeft: 'unset',
    padding: '5px 15px',
    cursor: 'pointer',
    backgroundColor: 'black',
    '&:hover svg': {
        transform: 'rotateY(0deg)',
    }
})

const CloseSearchIcon = styled(CloseIcon)(({ theme }) => ({
    fontSize: '2.2em',
    color: 'black',
    position: 'absolute',
    top: '10px',
    right: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.2)',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '2em',
    }
}))

const SuggestionSection = styled('a')({
    display: 'block',
    textDecoration: 'unset',
    color: 'black',
    padding: '8px 30px',
    cursor: 'pointer',
    position: 'relative',
    '&.arrow_keyboard_focusing': {
        backgroundColor: 'rgba(0,0,0,.05)',
        fontWeight: 'bold',
        '& svg': {
            opacity: '1',
        }
    },
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,.05)',
        fontWeight: 'bold',
        '& svg': {
            opacity: '1',
        }
    },
})

const SearchBtn = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '5px 10px',
    columnGap: '10px',
    cursor: 'pointer',
    border: '1.5px gray solid',
    overflow: 'hidden',
    backgroundColor: 'white',
    transition: 'border-radius 0.2s',
    '&:hover': {
        borderRadius: '10px',
    },
    [theme.breakpoints.down('md')]: {
        border: 'none',
    },
}))

const Placeholder = styled('div')(({ theme }) => ({
    fontFamily: theme.fontFamily.nunito,
    fontSize: '0.9em',
    color: 'rgba(0,0,0,0.8)',
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}))