import { useCallback, useEffect, useRef } from 'react'

const InfiniteScroll = ({ onLoad }) => {
    const loader = useRef(null)

    const callback = useCallback(entries => {
        const target = entries[0]
        if (target.isIntersecting) {
            if (onLoad && typeof onLoad === 'function') onLoad()
        }
    }, [onLoad])

    const createObserver = (callback) => {
        const option = ({
            root: null,
            rootMargin: '20px',
            threshold: 0,
        })
        const observer = new IntersectionObserver(callback, option)
        if (loader.current) observer.observe(loader.current)
    }

    useEffect(() => {
        createObserver(callback)
    }, [callback])

    return (
        <div ref={loader} />
    )
}

export default InfiniteScroll
