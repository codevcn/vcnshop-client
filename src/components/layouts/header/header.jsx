import React from "react"
import Notice from './notice'
import Navigation from './navigation'
import suspenseComponent from "../../../utils/suspense"

const Header = () => {
    return (
        <div id="HeaderArea">
            <Notice />
            <Navigation />
        </div>
    )
}

export default suspenseComponent(Header)()