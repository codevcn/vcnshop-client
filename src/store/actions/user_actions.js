import { toast } from 'react-toastify'
import {
    setUpAuthSuccess,
    registerRequest, registerSuccess, registerFail,
    loginRequest, loginSuccess, loginFail,
    forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFail,
    getUserRequest, getUserSuccess, getUserFail,
    logoutSuccess,
} from '../reducers/user_reducer.js'
import axios from 'axios'
import axiosErrorHandler from '../../utils/axios_error_handler.js'
import { redirectAfterSeconds } from '../../utils/redirect_handler.js'
import {
    get_user_api,
    update_user_avatar_api,
    update_profile_api,
    change_password_api,
} from '../../apis/user_apis.js'
import {
    send_register_OTP_api,
    verify_OTP_api,
    complete_register_api,
    login_user_api,
    forgot_password_api,
    reset_password_api,
    logout_user_api,
} from '../../apis/auth_apis.js'

const setUpAuth = () => async (dispatch) => {
    dispatch(setUpAuthSuccess())
}

const sendRegisterOTP = (email) => async (dispatch) => {
    try {
        dispatch(registerRequest())

        await axios.post(send_register_OTP_api, { email })

        dispatch(registerSuccess({ registerStep: 2 }))
        toast.success('OTP was sent!')
    } catch (error) {
        let errorObject = axiosErrorHandler(error, 'Fail to send OTP, please try again some minutes later!')

        dispatch(registerFail({ error: errorObject }))

        if (errorObject.isUserError) toast.warning(errorObject.message)
        else toast.error(errorObject.message)
    }
}

const verifyRegisterOTP = (OTP_code, email) => async (dispatch) => {
    try {
        dispatch(registerRequest())

        await axios.post(verify_OTP_api, { OTP_code, email })

        dispatch(registerSuccess({ registerStep: 3 }))
        toast.success('Verify OTP successfully!')
    } catch (error) {
        let errorObject = axiosErrorHandler(error, 'Fail to verify OTP, please try again some minutes later!')

        dispatch(registerFail({ error: errorObject }))

        if (errorObject.isUserError) {
            toast.warning(errorObject.message)
            if (errorObject.statusCode === 408) setTimeout(() => { window.location.reload() }, 2000)
        } else
            toast.error(errorObject.message)
    }
}

const completeRegister = (name, email, password, gender) => async (dispatch) => {
    try {
        dispatch(registerRequest())

        await axios.post(
            complete_register_api,
            { name, email, password, gender },
            { withCredentials: true }
        )

        dispatch(registerSuccess({ isAuthenticated: true }))

        toast.success('Register Successfully!')

        redirectAfterSeconds(1000, { href: '/account' })
    } catch (error) {
        let errorObject = axiosErrorHandler(error, 'Fail to complete register, please try again some minutes later!')

        dispatch(registerFail({ error: errorObject }))

        if (errorObject.isUserError) {
            toast.warning(errorObject.message)
            if (errorObject.statusCode === 408) setTimeout(() => { window.location.reload() }, 2000)
        } else
            toast.error(errorObject.message)
    }
}

const loginUser = (email, password, redirect_route) => async (dispatch) => {
    try {
        dispatch(loginRequest())

        await axios.post(
            login_user_api,
            { email, password },
            { withCredentials: true }
        )

        dispatch(loginSuccess())

        redirectAfterSeconds(1000, { href: redirect_route })

        toast.success('Login successfully!')
    } catch (error) {
        let errorObject = axiosErrorHandler(error)

        dispatch(loginFail({ error: errorObject }))

        toast.error(errorObject.message)
    }
}

const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch(forgotPasswordRequest())

        await axios.post(forgot_password_api, { email })

        dispatch(forgotPasswordSuccess({ forgotPasswordStep: 2 }))

        toast.success('OTP was sent!')
    } catch (error) {
        let errorObject = axiosErrorHandler(error, 'Fail to send OTP, please try again some minutes later!')

        dispatch(forgotPasswordFail({ error: errorObject }))

        if (errorObject.isUserError) toast.warning(errorObject.message)
        else toast.error(errorObject.message)
    }
}

const verifyOTPOfForgotPassword = (OTP_code, email) => async (dispatch) => {
    try {
        dispatch(forgotPasswordRequest())

        await axios.post(verify_OTP_api, { OTP_code, email })

        dispatch(forgotPasswordSuccess({ forgotPasswordStep: 3 }))

        toast.success('Verify OTP successfully!')
    } catch (error) {
        let errorObject = axiosErrorHandler(error, 'Fail to verify OTP, please try again some minutes later!')

        dispatch(forgotPasswordFail({ error: errorObject }))

        if (errorObject.isUserError) {
            toast.warning(errorObject.message)
            if (errorObject.statusCode === 408) setTimeout(() => { window.location.reload() }, 2000)
        } else
            toast.error(errorObject.message)
    }
}

// only for register period
const resetPassword = (email, new_password) => async (dispatch) => {
    try {
        dispatch(forgotPasswordRequest())

        await axios.post(
            reset_password_api,
            { newPassword: new_password, email },
            { withCredentials: true }
        )

        dispatch(forgotPasswordSuccess({ isAuthenticated: true }))

        toast.success('Reset Password Successfully!')

        redirectAfterSeconds(1000, { isReload: false, href: '/account' })
    } catch (error) {
        let errorObject = axiosErrorHandler(error, 'Fail to reset password, please try again some minutes later!')

        dispatch(forgotPasswordFail({ error: errorObject }))

        if (errorObject.isUserError) {
            toast.warning(errorObject.message)
            if (errorObject.statusCode === 408) setTimeout(() => { window.location.reload() }, 2000)
        } else
            toast.error(errorObject.message)
    }
}

const getUser = () => async (dispatch) => {
    try {
        dispatch(getUserRequest())

        let { data } = await axios.get(get_user_api, { withCredentials: true })

        dispatch(getUserSuccess({ ...data.user }))
    } catch (error) {
        let errorObject = axiosErrorHandler(error)

        dispatch(getUserFail({ error: errorObject }))
    }
}

const updateUserAvatar = (avatar) => async (dispatch) => {
    try {
        let formData = new FormData()
        formData.set('avatarImage', avatar)

        let { data } = await axios.put(update_user_avatar_api, formData, { withCredentials: true })

        dispatch(getUserSuccess({ avatar: data.avatarUrl }))

        toast.success('Update user avatar successfully!')
    } catch (error) {
        let errorObject = axiosErrorHandler(error, 'Fail to update avatar, please try again some minutes later!')

        dispatch(getUserFail({ error: errorObject }))

        if (errorObject.isUserError) {
            toast.warning(errorObject.message)
        } else
            toast.error(errorObject.message)
    }
}

const updateProfile = (nameOfUser, gender) => async (dispatch) => {
    try {
        dispatch(getUserRequest())

        await axios.put(
            update_profile_api,
            { nameOfUser, gender },
            { withCredentials: true }
        )

        dispatch(getUserSuccess({ name: nameOfUser, gender }))

        toast.success('Update profile successfully!')
    } catch (error) {
        let errorObject = axiosErrorHandler(error)

        dispatch(getUserFail({ error: errorObject }))

        toast.error(errorObject.message)
    }
}

const changePassword = (oldPassword, newPassword) => async (dispatch) => {
    try {
        dispatch(getUserRequest())

        await axios.put(
            change_password_api,
            { oldPassword, newPassword },
            { withCredentials: true }
        )

        dispatch(getUserSuccess())

        toast.success('Change password successfully!')
    } catch (error) {
        let errorObject = axiosErrorHandler(error)

        dispatch(getUserFail({ error: errorObject }))

        toast.error(errorObject.message)
    }
}

const logoutUser = () => async (dispatch) => {
    try {
        await axios.post(logout_user_api, {}, { withCredentials: true })

        dispatch(logoutSuccess())

        toast.success('Logout successfully!')

        redirectAfterSeconds(1000, { isReload: false, href: '/' })
    } catch (error) {
        toast.error('Fail to logout, please try again some minutes later!')
    }
}

export {
    setUpAuth,
    sendRegisterOTP, verifyRegisterOTP, completeRegister,
    loginUser,
    forgotPassword, verifyOTPOfForgotPassword, resetPassword,
    getUser,
    updateUserAvatar, updateProfile, changePassword,
    logoutUser,
}