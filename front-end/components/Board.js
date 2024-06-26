import { useEffect, useState } from 'react'
import { dayFormat } from '../lib/dayjs'
import classNames from 'classnames'
import Search from './Search'
import NoData from './NoData'
import Pagination from './Pagination'
import Button from './Button'
import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid'

const Board = (
    {
        items = [],
        headers = [],
        searchPlaceholder = 'Search',
        options: initOptions = {},
        className,
        loadData,
        onClickRow,
        children = {},
    }) => {
    const [options, setOptions] = useState({
        ...initOptions,
        sortBy: initOptions.sortBy,
        sortDesc: initOptions.sortDesc,
    })

    //default :  updated, true
    const { sortBy, sortDesc } = options

    useEffect(() => {
        setOptions({ ...initOptions })
    }, [initOptions])
    const handleOptions = async (name, value) => {
        const newOptions = {
            ...options,
            [name]: value,
        }
        setOptions(newOptions)
        await loadData(newOptions)
    }

    const [arrowVisibleInfo, setArrowVisibleInfo] = useState({
        value: sortBy,
        isVisible: false,
    })

    useEffect(async () => {
        await loadData(options)
    }, [sortBy])

    const handleSortByButton = (value) => {
        setArrowVisibleInfo((prev) => ({...prev, isVisible : true}))
        if (sortBy === value) {
            if (sortDesc === true) {
                setOptions((prev) => ({ ...prev, sortBy: '', sortDesc: true }))
            }
            setOptions((prev) => ({ ...prev, sortDesc: sortDesc !== true }))
        } else {
            setArrowVisibleInfo((prev) => ({ ...prev, value : value}))
            setOptions((prev) => ({ ...prev, sortBy: value, sortDesc: true }))
        }
    }

    return (
        <>
            <header className={classNames(
                'flex items-center',
                className,
            )}>
                <div className="flex-none mr-auto">
                    <span className="text-xs font-bold text-gray-400">total: {options.total}</span>
                </div>
                {children.hasOwnProperty('header') && children['header']}
                {options.hasOwnProperty('keyword') && <div className="flex-initial">
                    <Search
                        placeholder={searchPlaceholder}
                        value={options.keyword}
                        onSearch={v => handleOptions('keyword', v)}
                    />
                </div>}
            </header>
            <table className="table table-board mt-3">
                <thead>
                <tr>
                    {/* TODO: 정렬 */}
                    {headers.map(({ dayFormat, value, label, ...headerProps }, i) => (
                        <th {...headerProps} key={i}>
                            {headerProps.sortable
                                ? <Button className="btn_sort flex" onClick={() => handleSortByButton(value)}>
                                    {label}
                                    {arrowVisibleInfo.value === value && arrowVisibleInfo.isVisible &&
                                    <>{sortDesc && sortBy === value ?
                                        <ArrowSmDownIcon className="w-5 h-5" />
                                        : <ArrowSmUpIcon className="w-5 h-5" />
                                    }</>}
                                </Button>
                                : <>{label}</>
                            }
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {items.map((item, i) => (
                    <tr
                        onClick={() => onClickRow(item)}
                        className={onClickRow && 'has-link'}
                        key={i}
                    >
                        {headers.map((header, j) => {
                            const v = header.value
                            let content = ''
                            if (children.hasOwnProperty(v)) content = children[v](item)
                            else if (header.hasOwnProperty('dayFormat') && dayFormat) content = dayFormat(item[v])
                            else content = item[v]
                            return <td key={j}>{content}</td>
                        })}
                    </tr>
                ))}
                <NoData colSpan={headers.length} show={!items.length} />
                </tbody>
            </table>
            <Pagination {...options} onChange={v => handleOptions('page', v)} />
        </>
    )
}

export default Board
