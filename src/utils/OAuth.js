import { toast } from 'react-toastify'
import baseCustomEvent from './custom_event'
import eventNames from '../configs/event_names'
import { POST_MESSAGE_ID } from '../configs/constants'
import axios from 'axios'
import { get_google_oauth_info_api } from '../apis/auth_apis'

const EXPRESS_SERVER = import.meta.env.VITE_EXPRESS_SERVER

class OAuthFeature {
    #post_message_id = POST_MESSAGE_ID
    #popup = null;

    #getPostMessageID() {
        return this.#post_message_id
    }
    #getPopup() {
        return this.#popup
    }

    #setPopup(popup) {
        this.#popup = popup
    }

    async getGoogleOAuthURL() {
        let { data } = await axios.get(get_google_oauth_info_api)
        let options = {
            redirect_uri: data.redirect_uri,
            client_id: data.client_id,
            access_type: data.access_type,
            response_type: data.response_type,
            state: data.state,
            scope: data.scope,
        }

        let root_url = data.url

        let query_str = new URLSearchParams(options).toString()

        return `${root_url}?${query_str}`
    }

    setPopupWindow(google_oauth_url) {
        let heightPopup = 550
        let widthPopup = 500
        let leftPosition = (window.innerWidth - widthPopup) / 2
        let topPosition = (window.innerHeight - heightPopup) / 2

        let options = `width=${widthPopup},height=${heightPopup},left=${leftPosition},top=${topPosition},resizable=yes,scrollbars=yes`

        let popup = window.open(
            google_oauth_url,
            '_blank',
            options
        )

        this.#setPopup(popup)
    }

    closePopup() {
        if (!this.#getPopup()) return
        this.#getPopup().close()
        this.#setPopup(null)
    }

    clean() {
        this.closePopup()
        window.removeEventListener('message', () => { })
    }

    checkMessage(origin, original_data) {
        if (origin !== EXPRESS_SERVER) return null
        if (typeof original_data !== 'string') return null

        let data = JSON.parse(original_data)
        if (data.id !== this.#getPostMessageID())
            return null

        if (data.status === 'fail') {
            toast.error(data.message)
            return null
        }

        return data
    }

    setMessageListener() {
        const handleMessage = (e) => {
            let data = this.checkMessage(e.origin, e.data)
            if (data === null) return

            let { access_token } = data
            baseCustomEvent.dispatch(eventNames.ACCESS_TOKEN_GOOGLE, { access_token })

            this.clean()
        }

        window.addEventListener('message', handleMessage)
    }

    // function to check if the popup is forced to close by user
    setPopupWatcher() {
        let popup_is_closed
        let interval = setInterval(() => {
            popup_is_closed = !this.#getPopup() || this.#getPopup().closed
            if (popup_is_closed) {
                this.clean()
                clearInterval(interval)
            }
        }, 250) // to check per 0.25s
    }

    async openGoogleOAuth() {
        let google_oauth_url = await this.getGoogleOAuthURL()

        this.setPopupWindow(google_oauth_url)

        this.setPopupWatcher()

        this.setMessageListener()
    }
}

const oAuthFeature = new OAuthFeature()

export default oAuthFeature