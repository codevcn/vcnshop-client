class CustomAxiosError {
    constructor(error, client_message) {
        this.originalError = error
        this.statusCode = 500
        this.message = ''
        this.isUserError = false
        this.client_message = client_message
    }

    errorSetting() {
        let response_of_error = this.originalError.response

        if (response_of_error) { //if error was made by server at backend

            this.statusCode = response_of_error.status //update error status

            let data_of_response = response_of_error.data

            if (data_of_response.isUserError) //check if is error due to user or not
                this.isUserError = true

            this.message = data_of_response.message  //update error message

        } else if (this.originalError.request) { //The request was made but no response was received
            this.statusCode = 502
            this.message = 'Bad network or error from server.'
        } else { //Something happened in setting up the request that triggered an Error
            this.message = this.originalError.message
        }
    }
}

const axiosErrorHandler = (orginal_error, client_message = 'Something went wrong, please try again minutes later') => {
    let error = new CustomAxiosError(orginal_error, client_message)

    error.errorSetting()

    return error
}

export default axiosErrorHandler