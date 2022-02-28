import { forwardRef } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const propTypes = {
    type: PropTypes.oneOf(['valid', 'invalid']),
    as: PropTypes.elementType,
};

const Feedback = forwardRef((
        {
            className,
            type = 'invalid',
            tooltip = false,
            as: Component = 'div',
            ...props
        },
        ref,
    ) => (
        <Component
            {...props}
            ref={ref}
            className={classNames(
                className,
                `${type}-feedback`,
            )}
        />
    ),
);

Feedback.displayName = 'Feedback';
Feedback.propTypes = propTypes;

export default Feedback;
