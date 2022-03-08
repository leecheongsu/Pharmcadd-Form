import { forwardRef, useContext } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import FormContext from './FormContext'

const propTypes = {
    as: PropTypes.elementType,
    id: PropTypes.string,
    type: PropTypes.string,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    plaintext: PropTypes.bool,
    valid: PropTypes.bool,
    invalid: PropTypes.bool,
}

const FormControl = forwardRef((
        {
            id,
            type,
            className,
            valid = false,
            invalid = false,
            plaintext,
            err,
            as: Component = 'input', // input|textarea
            ...props
        },
        ref,
    ) => {
        const { cid } = useContext(FormContext)
        type = type || (Component === 'input' && !type ? 'text' : undefined)
        const classes = type === 'checkbox' || type === 'radio' ? 'form-check-input' : 'form-input'

        return (
            <Component
                {...props}
                id={id || cid}
                type={type}
                ref={ref}
                className={classNames(
                    classes,
                    plaintext && 'plaintext',
                    valid && 'is-valid',
                    invalid && 'is-invalid',
                    className,
                )}
                autoComplete={type !== 'password' ? undefined : 'true'}
            />
        )
    },
)

FormControl.displayName = 'FormControl'
FormControl.propTypes = propTypes

export default FormControl
