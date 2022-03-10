import { forwardRef } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const propTypes = {
    icon: PropTypes.bool,
    outline: PropTypes.bool,
    block: PropTypes.bool,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    href: PropTypes.string.isRequired,
}

const LinkButton = forwardRef((
    {
        href,
        icon = false,
        outline = false,
        block = false,
        active = false,
        disabled = false,
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
                (!icon && !outline && !block) && 'btn_link',
                icon && 'btn_icon',
                (outline || block) && 'btn',
                outline && 'btn_outline',
                block && 'btn_block',
                active && 'active',
                disabled && 'disabled',
                className,
            )}
        />
    </Link>

})

LinkButton.displayName = 'Link'
LinkButton.propTypes = propTypes

export default LinkButton
