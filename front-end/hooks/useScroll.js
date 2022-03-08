import React, { useEffect, useMemo, useState } from 'react'
import { throttle } from 'lodash'

const useScroll = (totalPage, limit) => {
    const [page, setPage] = useState(1)
    const ScrollingPage = useMemo(() => throttle(() => {
            let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
            let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
            let clientHeight = document.documentElement.clientHeight

            if (scrollHeight - 35 <= Math.round(scrollTop + clientHeight)
                && Math.round(scrollTop + clientHeight) <= scrollHeight && page < totalPage) {
                console.log(totalPage)
                setPage(page + limit)
            }
        }, 300),
        [page, totalPage])

    useEffect(() => {
        window.addEventListener('scroll', ScrollingPage)
        return () => {
            window.removeEventListener('scroll', ScrollingPage)
        }
    }, [ScrollingPage])

    return [page]
}

export default useScroll
