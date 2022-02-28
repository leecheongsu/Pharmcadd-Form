import { forwardRef } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const propTypes = {
    validated: PropTypes.bool,
    as: PropTypes.elementType,
};

const Form = forwardRef((
        {
            className,
            validated,
            as: Component = 'form',
            ...props
        },
        ref,
    ) => (
        <Component
            {...props}
            noValidate={Component === 'form'}
            ref={ref}
            className={classNames(
                className,
                validated && 'was-validated'
            )}
        />
    ),
);

Form.displayName = 'Form';
Form.propTypes = propTypes;

export default Form;
