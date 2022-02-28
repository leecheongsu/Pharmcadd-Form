import { forwardRef, useContext } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import FormContext from "./FormContext";

const propTypes = {
    check: PropTypes.bool,
    htmlFor: PropTypes.string,
    hidden: PropTypes.bool,
    as: PropTypes.elementType,
};

const defaultProps = {
    hidden: false,
};

const FormLabel = forwardRef((
        {
            check,
            hidden,
            className,
            htmlFor,
            as: Component = 'label',
            ...props
        },
        ref,
    ) => {
        const { cid } = useContext(FormContext);

        return (
            <Component
                {...props}
                htmlFor={htmlFor || cid}
                className={classNames(
                    check ? 'form-check-label' : 'form-label',
                    className,
                    hidden && 'hidden',
                )}
                ref={ref}
            />
        );
    },
);

FormLabel.displayName = 'FormLabel';
FormLabel.propTypes = propTypes;
FormLabel.defaultProps = defaultProps;

export default FormLabel;
