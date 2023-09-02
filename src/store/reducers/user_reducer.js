import { createSlice, current } from '@reduxjs/toolkit'
import {
    AUTH_STATUS_AUTHENTICATED,
    AUTH_STATUS_NOT_AUTHENTICATED,
    AUTH_STATUS_IS_LOGOUTED,
} from '../../configs/constants'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        auth: {
            registerStep: 1,
            forgotPasswordStep: 1,
            authStatus: null,
        },
        loading: false,
        error: null,
    },
    reducers: {
        setUpAuthSuccess: (state, action) => {
            state.auth.registerStep = 1
            state.auth.forgotPasswordStep = 1
        },


        getUserRequest: (state, action) => {
            state.error = null
            state.loading = true
        },
        getUserSuccess: (state, action) => {
            let update_account = action.payload
            if (update_account) {
                let current_user = current(state).user
                state.user = {
                    ...current_user,
                    ...update_account,
                }
            }

            state.auth.authStatus = AUTH_STATUS_AUTHENTICATED
            state.loading = false
        },
        getUserFail: (state, action) => {
            state.error = action.payload.error
            state.auth.authStatus = AUTH_STATUS_NOT_AUTHENTICATED
            state.loading = false
        },


        registerRequest: (state, action) => {
            state.error = null
            state.loading = true
        },
        registerSuccess: (state, action) => {
            if (action.payload.isAuthenticated) {
                state.auth.authStatus = AUTH_STATUS_AUTHENTICATED
            } else {
                state.auth.registerStep = action.payload.registerStep
            }
            state.loading = false
        },
        registerFail: (state, action) => {
            state.error = action.payload.error
            state.loading = false
        },


        loginRequest: (state, action) => {
            state.error = null
            state.loading = true
        },
        loginSuccess: (state, action) => {
            state.auth.authStatus = AUTH_STATUS_AUTHENTICATED
            state.loading = false
        },
        loginFail: (state, action) => {
            state.error = action.payload.error
            state.loading = false
        },


        forgotPasswordRequest: (state, action) => {
            state.error = null
            state.loading = true
        },
        forgotPasswordSuccess: (state, action) => {
            if (action.payload.isAuthenticated) {
                state.auth.authStatus = AUTH_STATUS_AUTHENTICATED
            } else {
                state.auth.forgotPasswordStep = action.payload.forgotPasswordStep
            }
            state.loading = false
        },
        forgotPasswordFail: (state, action) => {
            state.error = action.payload.error
            state.loading = false
        },


        logoutSuccess: (state, action) => {
            state.auth.authStatus = AUTH_STATUS_IS_LOGOUTED
        },
    },
})

export const {
    setUpAuthSuccess,
    registerRequest, registerSuccess, registerFail,
    loginRequest, loginSuccess, loginFail,
    forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFail,
    getUserRequest, getUserSuccess, getUserFail,
    logoutSuccess,
    getUsersByAdminRequest, getUsersByAdminSuccess, getUsersByAdminFail,
} = userSlice.actions

export default userSlice.reducer