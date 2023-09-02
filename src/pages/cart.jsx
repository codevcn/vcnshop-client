import React from "react"
import { styled } from '@mui/material/styles'
import Summary from "../components/cart/summary_section"
import ProductCards from "../components/cart/product_cards"
import { useSelector } from "react-redux"
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import ScrollToTopBtn from '../components/scroll_to_top_btn'

const Cart = () => {
    const { cartItems } = useSelector(({ cart }) => cart)

    return (
        <CartPage id="CartPage">
            <PageTitle>
                <StyledShoppingBagIcon />
                <Text>
                    {'SHOPPING CART - ( ITEMS: ' + cartItems.length + ' )'}
                </Text>
            </PageTitle>

            <CartContainer>
                {
                    cartItems &&
                    <>
                        <ProductCards cartItems={cartItems} />
                        <Summary cartItems={cartItems} />
                    </>
                }
            </CartContainer>

            <ScrollToTopBtn />
        </CartPage>
    )
}

export default Cart

const CartPage = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
    padding: '0 50px',
    [theme.breakpoints.down('lg')]: {
        padding: '0 10px',
    },
}))

const StyledShoppingBagIcon = styled(ShoppingBagIcon)(({ theme }) => ({
    fontSize: '1.8em',
    [theme.breakpoints.down('lg')]: {
        fontSize: '1.3em',
    },
    [theme.breakpoints.down('lg')]: {
        fontSize: '2.5em',
    },
}))

const Text = styled('h2')(({ theme }) => ({
    fontSize: '1.8em',
    fontFamily: theme.fontFamily.kanit,
    margin: '0',
}))

const PageTitle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginLeft: '20px',
    transform: 'scaleY(0.8)',
    [theme.breakpoints.down('lg')]: {
        fontSize: '1.3em',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.5em',
    },
}))

const CartContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    boxSizing: 'border-box',
    paddingTop: '10px',
    borderTop: '2px black solid',
    [theme.breakpoints.down('lg')]: {
        fontSize: '0.9em',
        flexDirection: 'column',
    },
}))