
const EXPRESS_SERVER = import.meta.env.VITE_EXPRESS_SERVER

export const get_user_api = EXPRESS_SERVER + '/api/user/getUser/'
export const update_user_avatar_api = EXPRESS_SERVER + '/api/user/updateUserAvatar/'
export const update_profile_api = EXPRESS_SERVER + '/api/user/updateProfile/'
export const change_password_api = EXPRESS_SERVER + '/api/user/changePassword/'
export const get_users_by_admin_api = EXPRESS_SERVER + '/api/user/getUsersByAdmin/'
export const get_user_location_api = EXPRESS_SERVER + '/api/user/getUserLocation/'
