import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import dayjs, { dayFormat } from '../../lib/dayjs'
import axios from '../../lib/axios'
import Button from '../../components/Button'
import Search from '../../components/Search'
import useScroll from '../../hooks/useScroll'

const Campaigns = ({ data: initData, options: initOptions }) => {
    const options = useRef(initOptions)
    const [info, setInfo] = useState({
        list: initData.content,
        total: initData.total,
    })
    const activeInfinite = useMemo(() => info.list.length < info.total, [info])

    const loadData = (add = false) => {
        return axios.get('/backapi/campaigns', { params: options.current })
            .then(({ data }) => {
                setInfo(v => ({
                    list: add ? [...v.list, ...data.content] : data.content,
                    total: data.total,
                }))
            })
    }

    const handleSearch = async (text) => {
        options.current = {
            ...options.current,
            keyword: text,
            page: 1,
        }
        await loadData()
    }

    const handleType = async (type) => {
        if (options.current.type === type) return
        options.current = {
            ...options.current,
            type: type,
            page: 1,
        }
        await loadData()
    }

    const [page] = useScroll(info.total, 10)

    useEffect(async () => {
        if (activeInfinite) {
            options.current = {
                ...options.current,
                page: options.current.page + 1,
            }
            await loadData(true)
        }
    }, [page])

    return (
        <div className="px-3">
            <div className="grid grid-cols-2">
                <Button outline active={options.current.type === 'READY'} size="lg" onClick={() => handleType('READY')}>READY</Button>
                <Button outline active={options.current.type === 'COMPLETED'} size="lg" onClick={() => handleType('COMPLETED')}>FINISHED</Button>
            </div>
            <header className="flex justify-between items-center my-4">
                <div className="flex-none mr-8">
                    <span className="text-xs font-bold text-gray-400">total: {info.total}</span>
                </div>
                <div className="flex-initial">
                    <Search placeholder="keyword" onSearch={handleSearch} />
                </div>
            </header>
            {info.list.length > 0
                ? <ul className="grid grid-cols-2 gap-3">
                    {info.list.map((item, i) => (
                        <li key={i}>
                            <CampaignItem item={item} type={options.current.type} />
                        </li>
                    ))}
                </ul>
                : <div className="plain-center">
                    <span>No results.</span>
                </div>
            }
        </div>
    )
}

const CampaignItem = ({ item, type }) => {
    const { id, title, endsAt } = item
    const dDay = endsAt ? `D-${dayjs().diff(dayFormat(endsAt, 'YYYY-MM-DD'), 'day') || 'day'}` : 'Unsubmitted'

    return (
        <Link href={`/campaigns/${id}`}>
            <a className="card cam-card">
                <h3 className="surname text-2xl mb-5">{title}</h3>
                <div className="text-right">
                    <span className="d-day">{type === 'READY' ? dDay : 'Completed'}</span>
                </div>
            </a>
        </Link>
    )
}

/* Server-Side Rendering */
export const getServerSideProps = async () => {
    const params = ({
        page: 1,
        type: 'READY',
        itemsPerPage: 10,
        keyword: '',
    })
    const { data } = await axios.get('/backapi/campaigns', { params })
    const { data: userInfo } = await axios.get('/backapi/users/self')

    return {
        props: {
            title: 'Campaigns',
            options: params,
            userInfo: userInfo,
            data,
        },
    }
}

export default Campaigns
