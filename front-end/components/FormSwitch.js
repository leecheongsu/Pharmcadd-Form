import { forwardRef } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    checked: PropTypes.bool,
}

const FormSwitch = forwardRef((
        {
            disabled = false,
            className,
            sm = false,
            ...props
        },
        ref,
    ) => {
        return (
            <label
                className={classNames(
                    'switch-button',
                    sm && 'sm',
                    className,
                )}
            >
                <input
                    {...props}
                    type="checkbox"
                    ref={ref}
                />
                <span className="on-off-switch"></span>
            </label>
        )
    },
)

FormSwitch.displayName = 'FormSwitch'
FormSwitch.propTypes = propTypes

export default FormSwitch
