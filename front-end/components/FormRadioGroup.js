import {useEffect, useState} from "react";
import classNames from "classnames";
import FormCheck from "./FormCheck";
import Feedback from "./Feedback";
import PropTypes from "prop-types";

const propTypes = {
    inline: PropTypes.bool,
    disabled: PropTypes.bool,
    invalid: PropTypes.bool,
    feedback: PropTypes.string,
    name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    })).isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    onChange: PropTypes.func,
    required: PropTypes.bool,
    answer: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.any
    ]),
    as: PropTypes.elementType
};

const FormRadioGroup = (
    {
        inline = false,
        disabled = false,
        invalid = false,
        required = false,
        className,
        feedback,
        feedbackType = 'invalid',
        name,
        answer,
        items: initItems = [],
        value = [],
        onChange,
        as: Component = 'div',
        ...props
    }) => {
    const [items, setItems] = useState(initItems.map(v => ({
        label: v.text,
        value: v.id,
        checked: String(v.id) === String(value)
    })));
    const handleChange = (e) => {
        const {name, value} = e.target
        const newItems = items.map(v => ({
            ...v,
            checked: String(v.value) === String(value)
        }))
        setItems(newItems);
        if (onChange) {
            onChange({name, value})
        }
    }

    useEffect(() => {
        if(answer !== null) {
            const answers = items.map(v => ({
                ...v,
                checked: String(v.label) === String(answer.text)
            }))
            setItems(answers)
        }
    }, [answer, items])

    const error = !items.some((v) => v.checked)

    return (
        <Component
            {...props}
            className={classNames(
                error && 'has-invalid',
                className,
            )}
        >
            {items.map((v, i) => (
                <FormCheck
                    {...v}
                    type="radio"
                    name={name}
                    inline={inline}
                    disabled={disabled || v.disabled}
                    invalid={error}
                    key={v.value}
                    onChange={handleChange}
                    required={required}
                />
            ))}
            {feedback && (
                <Feedback type={feedbackType}>{feedback}</Feedback>
            )}
        </Component>
    )
};

FormRadioGroup.displayName = 'FormRadioGroup';
FormRadioGroup.propTypes = propTypes;

export default FormRadioGroup;
