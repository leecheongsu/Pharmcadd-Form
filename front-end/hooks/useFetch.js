import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from '../lib/axios'

function useFetch(currentPage, requestUrl, query) {
    const { type, keyword } = query
    const [content, setContent] = useState([])
    const [count, setCount] = useState(0)
    const prevType = useRef('READY')

    const getQuery = useCallback(async () => {
            try {
                const response = await axios.get(`${requestUrl}`, { params: query })
                if (keyword !== null) {
                    await setContent(response.data.content)
                } else {
                    if (type !== prevType.current) {
                        prevType.current = type
                        await setContent(response.data.content)
                    } else {
                        await setContent((prev) => [...prev, ...response.data.content])
                    }
                }
                await setCount(response.data.total)
            } catch
                (err) {
                console.log(err)
            }
        }
        , [query, currentPage])

    useEffect(() => {
        getQuery(query)
    }, [requestUrl, getQuery, currentPage])

    return { content, count }
}

export default useFetch
