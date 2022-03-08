import { memo, useEffect, useState } from 'react'
import classNames from 'classnames'
import FormControl from './FormControl'
import Button from './Button'

const Search = (
    {
        keyword: initKeyword,
        placeholder,
        className,
        onSearch,
    }) => {
    const [keyword, setKeyword] = useState(initKeyword)
    useEffect(() => {
        setKeyword(initKeyword)
    }, [initKeyword])

    const onChange = (e) => {
        setKeyword(e.target.value)
    }
    const onClick = () => {
        onSearch(keyword)
    }
    const onKeyDown = ({ key, target }) => {
        if (key === 'Enter') {
            onSearch(target.value)
        }
    }

    return (
        <div className={classNames(
            'form-search flex',
            className,
        )}>
            <FormControl
                placeholder={placeholder}
                value={keyword}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className="flex-1"
            />
            <Button onClick={onClick} className="flex-none">Search</Button>
        </div>
    )
}

export default memo(Search)
