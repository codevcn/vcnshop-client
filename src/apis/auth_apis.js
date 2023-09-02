
const EXPRESS_SERVER = import.meta.env.VITE_EXPRESS_SERVER

export const send_register_OTP_api = EXPRESS_SERVER + '/api/auth/sendRegisterOTP/'
export const verify_OTP_api = EXPRESS_SERVER + '/api/auth/verifyOTP/'
export const complete_register_api = EXPRESS_SERVER + '/api/auth/completeRegister/'
export const login_user_api = EXPRESS_SERVER + '/api/auth/loginUser/'
export const forgot_password_api = EXPRESS_SERVER + '/api/auth/forgotPassword/'
export const reset_password_api = EXPRESS_SERVER + '/api/auth/resetPassword/'
export const logout_user_api = EXPRESS_SERVER + '/api/auth/logoutUser/'
export const google_sign_in_api = EXPRESS_SERVER + '/api/auth/googleSignIn/'
export const get_google_oauth_info_api = EXPRESS_SERVER + '/api/auth/getGoogleOAuthInfo/'
