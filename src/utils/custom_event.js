class BaseCustomEvent {

    subscribe(event_name, listener) {
        document.addEventListener(event_name, listener)
    }

    unsubscribe(event_name, listener) {
        document.removeEventListener(event_name, listener)
    }

    dispatch(event_name, data) {
        let event = new CustomEvent(event_name, { detail: data })

        document.dispatchEvent(event)
    }

}

const baseCustomEvent = new BaseCustomEvent()

export default baseCustomEvent