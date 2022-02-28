import classNames from "classnames";

const NoData = (
    {
        center = true,
        message = '데이터가 존재하지 않습니다.',
        colSpan,
        show = true,
        as: Component = 'tr',
        ...props
    }) => {
    const messageBox = <span className="text-sm text-gray-400">{message}</span>
    const content = Component === 'tr' ? <td colSpan={colSpan}>{messageBox}</td> : { messageBox }

    return (
        <>
            {show && <Component
                {...props}
                className={classNames(
                    center && 'text-center'
                )}>
                {content}
            </Component>}
        </>
    )
}

export default NoData;
