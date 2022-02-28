import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import classNames from "classnames";
import PropTypes from "prop-types";

const propTypes = {
    page: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    itemPerPage: PropTypes.number,
    length: PropTypes.number,
    mt: PropTypes.number,
    left: PropTypes.bool,
    as: PropTypes.elementType,
    onChange: PropTypes.func,
}

const Pagination = (
    {
        total, // 총 게시물 수
        itemsPerPage = 20, // 페이지당 뿌려질 게시물 수
        length = 5, // 페이지네이션 길이
        mt = 4, // 상단 마진 여백
        left = false, // 좌측정렬
        className,
        as: Component = 'div',
        ...props
    }
) => {
    const { page, onChange } = props
    const lastPage = Math.ceil(total / itemsPerPage)
    const firstItem = Math.max(1, Math.min(page - Math.floor(length / 2), lastPage - length + 1))
    const lastItem = Math.min(firstItem + length - 1, lastPage)

    return (
        <>
            {total > 0 && <Component className={classNames(
                !left && 'flex',
                mt && `mt-${mt}`,
                className,
            )}>
                <ul className={classNames(
                    'pagination',
                    !left && 'ml-auto',
                )}>
                    <PageFirst {...props} />
                    <PagePrev {...props} />
                    {[...new Array(lastItem - firstItem + 1)].map((v, i) => {
                        const itemPage = firstItem + i
                        return <PageItem page={itemPage} active={itemPage === page} onChange={onChange} key={i}>{itemPage}</PageItem>
                    })}
                    <PageNext {...props} lastPage={lastPage} />
                    <PageLast {...props} lastPage={lastPage} />
                </ul>
            </Component>}
        </>
    )
}

const PageFirst = ({ page, onChange }) => {
    const isFirst = page === 1

    return (
        <PageItem page={1} disabled={isFirst} onChange={onChange} className="page-arr">
            <ChevronDoubleLeftIcon />
        </PageItem>
    )
}

const PagePrev = ({ page, onChange }) => {
    const prevPage = page - 1
    const isFirst = page === 1

    return (
        <PageItem page={prevPage} disabled={isFirst} onChange={onChange} className="page-arr">
            <ChevronLeftIcon />
        </PageItem>
    )
}

const PageLast = ({ page, lastPage, onChange }) => {
    const isLast = page === lastPage

    return (
        <PageItem page={lastPage} disabled={isLast} onChange={onChange} className="page-arr">
            <ChevronDoubleRightIcon />
        </PageItem>
    )
}

const PageNext = ({ page, lastPage, onChange }) => {
    const nextPage = page + 1
    const isLast = page === lastPage

    return (
        <PageItem page={nextPage} disabled={isLast} onChange={onChange} className="page-arr">
            <ChevronRightIcon />
        </PageItem>
    )
}

const PageItem = ({ page, active, disabled, className, onChange, ...props }) => {
    const handleClick = (e) => {
        e.preventDefault()
        if (!active && !disabled) {
            onChange(page)
        }
    }

    return (
        <button
            {...props}
            type="button"
            className={classNames(
                'page-link',
                active && 'active',
                disabled && 'disabled',
                className,
            )}
            onClick={handleClick}
        />
    )
}

Pagination.propTypes = propTypes;

export default Pagination;
