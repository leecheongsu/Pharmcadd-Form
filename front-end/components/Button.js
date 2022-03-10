import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const propTypes = {
    outline: PropTypes.bool,
    block: PropTypes.bool,
    link: PropTypes.bool,
    icon: PropTypes.bool,
    active: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'lg', null]),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    target: PropTypes.oneOf(['_blank', '_self', '_parent', '_top', null]),
    type: PropTypes.oneOf(['button', 'reset', 'submit', null]),
    onClick: PropTypes.func,
}

const useButtonProps = ({ disabled, href, target, onClick, type }) => {
    const tagName = href ? 'a' : 'button'
    const meta = { tagName }

    if (tagName === 'button') {
        return [{ type: type || 'button', disabled }, meta]
    }

    const handleClick = (e) => {
        if (disabled) {
            e.preventDefault()
            e.stopPropagation()
            return
        }

        if (onClick) {
            onClick(e)
        }
    }

    if (disabled) {
        href = undefined
    }

    return [{ href, target, onClick: handleClick }, meta]
}

const Button = forwardRef((
        {
            outline = false,
            block = false,
            link = false,
            icon = false,
            disabled = false,
            active = false,
            size,
            className,
            style,
            ...props
        },
        ref,
    ) => {
        const [buttonProps, { tagName: Component }] = useButtonProps({
            disabled,
            ...props,
        })

        return <Component
            {...props}
            {...buttonProps}
            ref={ref}
            className={classNames(
                (!icon && !link) && 'btn',
                size && `btn_${size}`,
                icon && 'btn_icon',
                link && 'btn_link',
                outline && 'btn_outline',
                block && 'btn_block',
                className,
                active && 'active',
                props.href && disabled && 'disabled',
            )}
        />
    },
)

Button.displayName = 'Button'
Button.propTypes = propTypes

export default Button

