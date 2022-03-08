import { forwardRef } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const propTypes = {
    outline: PropTypes.bool,
    pill: PropTypes.bool,
    text: PropTypes.string,
    as: PropTypes.elementType,
}

const Badge = forwardRef(
    (
        {
            bg = 'primary',
            outline = false,
            pill = false,
            text = 'sm',
            className,
            as: Component = 'span',
            ...props
        },
        ref,
    ) => {
        return (
            <Component
                ref={ref}
                {...props}
                className={classNames(
                    'badge',
                    className,
                    outline && 'badge-outline',
                    pill && `rounded-pill`,
                    text && `text-${text}`,
                    (!outline && bg) && `bg-${bg}`,
                )}
            />
        )
    },
)

Badge.displayName = 'Badge'
Badge.propTypes = propTypes

export default Badge
