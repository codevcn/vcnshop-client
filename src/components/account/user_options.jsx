import React from "react"
import { styled } from '@mui/material/styles'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AllInboxIcon from '@mui/icons-material/AllInbox'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate, useLocation } from "react-router-dom"
import PasswordIcon from '@mui/icons-material/Password'
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../../store/actions/user_actions"
import { useCheckIsAdminRole } from '../../hooks/custom_hooks'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { Typography } from "@mui/material"

const icon_style = { color: 'black' }

const options = [
    { label: 'Information', icon: <AccountCircleIcon sx={icon_style} />, href: '/information' },
    { label: 'Change Password', icon: <PasswordIcon sx={icon_style} />, href: '/changePassword' },
    { label: 'My Orders', icon: <AllInboxIcon sx={icon_style} />, href: '/myOrders' },
    { label: 'Log Out', icon: <LogoutIcon sx={icon_style} />, href: -1 },
]

const Navigation = () => {
    const user = useSelector(({ user }) => user.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const indicator = useLocation().pathname.split('/account')[1]
    const check_is_admin_role = useCheckIsAdminRole()

    const handleNavigation = (href) => {
        if (href === -1) {
            dispatch(logoutUser())
        } else
            navigate('/account' + href)
    }

    return (
        <div>
            {
                user && check_is_admin_role(user.role) &&
                <Nav onClick={() => navigate('/admin')}>
                    <AdminPanelSettingsIcon sx={icon_style} />
                    <Text className="option">
                        Admin
                    </Text>
                </Nav>
            }
            {
                options.map(({ label, icon, href }) => (
                    <Nav
                        key={label}
                        onClick={() => handleNavigation(href)}
                        sx={indicator.includes(href) && { borderLeftColor: 'black' }}
                    >
                        {icon}
                        <Text
                            className="option"
                        >
                            {label}
                        </Text>
                    </Nav>
                ))
            }
        </div>
    )
}

export default Navigation

const Nav = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '8px',
    backgroundColor: '#F5F5F5',
    padding: '15px 20px',
    cursor: 'pointer',
    borderTop: '1px #d1d1d1 solid',
    borderLeft: '3px transparent solid',
    '&:last-child': {
        borderBottom: '1px #d1d1d1 solid',
    },
    '&:hover .option': {
        textDecoration: 'underline',
    },
    [theme.breakpoints.down(970)]: {
        justifyContent: 'center',
    },
}))

const Text = styled(Typography)(({ theme }) => ({
    fontFamily: '"Kanit", "sans-serif"',
    fontSize: '1.1em',
    cursor: 'pointer',
}))