import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import classNames from 'classnames'

const propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    options: PropTypes.array,
    onChange: PropTypes.func,
    valid: PropTypes.bool,
    invalid: PropTypes.bool,
    placeholder: PropTypes.string,
}

const FormSelect = forwardRef((
        {
            value = '',
            options,
            className,
            placeholder,
            isValid: valid = false,
            isInvalid: invalid = false,
            ...props
        },
        ref,
    ) => {
        return (
            <select
                {...props}
                value={value}
                ref={ref}
                className={classNames(
                    className,
                    valid && 'is-valid',
                    invalid && 'is-invalid',
                )}
            >{placeholder && <option value="">{placeholder}</option>}
                {options.map(({ id, text }) => (
                    <option value={id} key={id}>{text}</option>
                ))}
            </select>
        )
    },
)

FormSelect.displayName = 'FormSelect'
FormSelect.propTypes = propTypes

export default FormSelect
