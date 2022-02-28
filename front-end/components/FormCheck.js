import { forwardRef, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import getUid from "../utils/uid";
import PropTypes from "prop-types";
import FormContext from "./FormContext";
import Feedback from "./Feedback";
import FormLabel from "./FormLabel";
import FormControl from "./FormControl";

const propTypes = {
    as: PropTypes.elementType,
    id: PropTypes.string,
    inline: PropTypes.bool,
    text: PropTypes.string,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.node,
    type: PropTypes.oneOf(['radio', 'checkbox']),
    valid: PropTypes.bool,
    invalid: PropTypes.bool,
};

const FormCheck = forwardRef((
        {
            id,
            inline = false,
            disabled = false,
            text = '',
            valid = false,
            invalid = false,
            readOnly = false,
            feedback,
            feedbackType,
            className,
            type = 'checkbox',
            label,
            as = 'input',
            ...props
        },
        ref,
    ) => {
        const [cid, setCid] = useState(id);
        const checkContext = useMemo(() => ({ cid }), [cid]);
        useEffect(() => {
            if (!id) {
                const newId = getUid()
                setCid(newId)
            }
        }, [id])

        return (
            <FormContext.Provider value={checkContext}>
                <div
                    className={classNames(
                        'form-check',
                        inline && 'inline',
                        className,
                    )}
                >
                    <FormControl
                        {...props}
                        type={type}
                        ref={ref}
                        valid={valid}
                        invalid={invalid}
                        disabled={Boolean(disabled) || Boolean(readOnly)}
                        className={classNames(
                            disabled && 'disabled',
                        )}
                        as={as}
                    />
                    {label && (
                        <FormLabel
                            check
                            className={classNames(
                                text && `text-${text}`
                            )}
                        >{label}</FormLabel>
                    )}
                    {feedback && (
                        <Feedback type={feedbackType}>{feedback}</Feedback>
                    )}
                </div>
            </FormContext.Provider>
        );
    },
);

FormCheck.displayName = 'FormCheck';
FormCheck.propTypes = propTypes;

export default FormCheck;
