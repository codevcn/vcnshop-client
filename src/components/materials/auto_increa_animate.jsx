import React, { useEffect, useRef } from "react"

const AutoIncreaAnimate = ({ number }) => {
    const convert_to_number = parseInt(number)
    const start = 1
    const duration_in_ms = 3000
    const ms_for_each_frame = 16
    const number_element_ref = useRef()

    useEffect(() => { // increase from start to number in duration
        let current_number = start
        let increment = Math.ceil(
            (convert_to_number - start) / (duration_in_ms / ms_for_each_frame) // 16ms for each frame (60fps)
        )
        let numberElement = number_element_ref.current

        let interval = setInterval(() => {
            current_number += increment
            if (current_number >= convert_to_number) {
                current_number = convert_to_number
                clearInterval(interval)
            }

            numberElement.innerText = current_number
        }, ms_for_each_frame)

        return () => clearInterval(interval)
    }, [number])

    return (
        <span id="AutoIncreaAnimate" ref={number_element_ref}>
            {start}
        </span>
    )
}

export default AutoIncreaAnimate