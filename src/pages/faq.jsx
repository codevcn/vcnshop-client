import React, { startTransition, useEffect, useMemo, useRef, useState } from "react"
import { styled } from '@mui/material/styles'
import { Box, Typography, Collapse, IconButton, Tooltip } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'
import faqList from '../configs/faq.json'
import ControlPointIcon from '@mui/icons-material/ControlPoint'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import { useDebounce } from "../hooks/custom_hooks"

const Questions = ({ questions }) => {
    const [openedQuestions, setOpenedQuestions] = useState([])

    const checkIsOpen = (question_to_check) => {
        return openedQuestions.some((question) => question === question_to_check)
    }

    const openQuestion = (question_to_open) => {
        if (checkIsOpen(question_to_open)) {
            setOpenedQuestions(pre => pre.filter((question) => question !== question_to_open))
        } else {
            setOpenedQuestions(pre => [...pre, question_to_open])
        }
    }

    return (
        <QuestionsSection>
            {
                questions.map(({ question, answer }) => (
                    <Question key={question}>
                        <QuesBtn
                            onClick={() => openQuestion(question)}
                        >
                            <span>{question}</span>

                            <Tooltip title={checkIsOpen(question) ? "Close" : "View"}>
                                <IconButton>
                                    {
                                        checkIsOpen(question) ?
                                            <RemoveCircleOutlineIcon sx={{ fontSize: '0.9em' }} />
                                            :
                                            <ControlPointIcon sx={{ fontSize: '0.9em' }} />
                                    }
                                </IconButton>
                            </Tooltip>
                        </QuesBtn>

                        <Collapse
                            in={checkIsOpen(question)}
                            timeout="auto"
                        >
                            <Typography
                                component="div"
                                color="gray"
                                fontSize="0.85em"
                                marginTop="5px"
                                whiteSpace="pre-wrap"
                            >
                                {
                                    answer.map((item) => (
                                        <div
                                            key={item}
                                            dangerouslySetInnerHTML={{ __html: item }}
                                        />
                                    ))
                                }
                            </Typography>
                        </Collapse>
                    </Question>
                ))
            }
        </QuestionsSection>
    )
}

const filterQuestions = (list, keyword) => {
    let regex = new RegExp(keyword, 'gi')

    return list.filter(({ question, answer }) => {
        return regex.test(question) || regex.test(answer)
    })
}

const FAQ = () => {
    const [questions, setQuestions] = useState(null)
    const debounce = useDebounce()
    const search_input_ref = useRef()

    const init_questions = useMemo(() => {
        return Object.entries(faqList).map(([question, answer]) => ({ question, answer }))
    }, [])

    useEffect(() => {
        if (questions === null) {
            startTransition(() => {
                setQuestions(init_questions)
            })
        }
    }, [questions, init_questions])

    const searching = (e) => {
        let keyword = e.target.value

        startTransition(() => {
            setQuestions(
                filterQuestions(init_questions, keyword)
            )
        })
    }

    const clearSearch = () => {
        startTransition(() => {
            setQuestions(init_questions)
        })

        search_input_ref.current.value = ''
    }

    return (
        <FAQSection
            id="FAQ-Section"
        >

            <Typography
                fontWeight="bold"
                fontSize="0.8em"
            >
                FAQs
            </Typography>

            <Title>
                Frequently Asked Questions
            </Title>

            <Typography
                fontSize="0.8em"
            >
                Have questions ? Were're here to help
            </Typography>

            <Box
                display="flex"
                alignItems="center"
                marginTop="20px"
                border='1px lightgrey solid'
                borderRadius='5px'
                padding="10px 20px"
                columnGap="5px"
            >
                <SearchIcon sx={{ fontSize: '1.4em' }} />

                <SearchInput
                    placeholder="Search questions..."
                    onChange={debounce(searching, 250)}
                    ref={search_input_ref}
                />

                <IconButton onClick={clearSearch}>
                    <CloseIcon
                        sx={{ fontSize: '1em' }}
                    />
                </IconButton>
            </Box>

            {
                questions &&
                <Questions questions={questions} />
            }

        </FAQSection >
    )
}

export default FAQ

const FAQSection = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '50px 30px',
    marginTop: '20px',
    fontFamily: theme.fontFamily.nunito,
    width: '100%',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        padding: '30px 10px',
    },
}))

const Title = styled('h2')(({ theme }) => ({
    fontFamily: 'inherit',
    fontSize: '2em',
    fontWeight: 'bold',
    margin: '20px 0',
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.2em',
    }
}))

const SearchInput = styled('input')(({ theme }) => ({
    border: 'none',
    padding: '0',
    width: '300px',
    outline: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    fontSize: '1em',
    paddingLeft: '10px',
    [theme.breakpoints.down('sm')]: {
        width: '150px',
        fontSize: '0.9em',
    }
}))

const QuestionsSection = styled('div')(({ theme }) => ({
    marginTop: "50px",
    width: "50%",
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
        marginTop: "20px",
    }
}))

const Question = styled('div')(({ theme }) => ({
    padding: '20px 0',
    borderBottom: '1px lightgrey solid',
    '&:last-of-type': {
        borderBottom: 'none',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.85em',
    }
}))

const QuesBtn = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    fontSize: "1.1em",
    fontWeight: "bold",
    fontFamily: "inherit",
    cursor: 'pointer',
    padding: '0',
    border: 'none',
    backgroundColor: 'white',
    columnGap: '15px',
})