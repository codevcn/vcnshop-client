const redirectAfterSeconds = (miliseconds_to_go = 0, { isReload, href, target }) => {

    let timeout = setTimeout(() => {

        if (isReload) {
            window.location.reload()
        } else {
            window.open(href || '/', target || '_self')
        }

    }, miliseconds_to_go)

    return timeout
}

export {
    redirectAfterSeconds,
}