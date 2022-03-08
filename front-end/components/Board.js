import { useEffect, useState } from 'react'
import { dayFormat } from '../lib/dayjs'
import classNames from 'classnames'
import Search from './Search'
import NoData from './NoData'
import Pagination from './Pagination'

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
    })
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
                        <th {...headerProps} key={i}>{label}</th>
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
