import { forwardRef } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const propTypes = {
    btn: PropTypes.bool,
    icon: PropTypes.bool,
    outline: PropTypes.bool,
    block: PropTypes.bool,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    href: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['sm', 'lg', null]),
}

const LinkButton = forwardRef((
    {
        href,
        btn = false,
        icon = false,
        outline = false,
        block = false,
        active = false,
        disabled = false,
        size,
        className,
        ...props
    },
    ref,
) => {
    return <Link href={href}>
        <a
            {...props}
            ref={ref}
            className={classNames(
                (btn || outline || block) && 'btn',
                size && `btn_${size}`,
                icon && 'btn_icon',
                (!btn && !icon && !outline && !block) && 'btn_link',
                outline && 'btn_outline',
                block && 'btn_block',
                className,
                active && 'active',
                props.href && disabled && 'disabled',
            )}
        />
    </Link>

})

LinkButton.displayName = 'Link'
LinkButton.propTypes = propTypes

export default LinkButton
