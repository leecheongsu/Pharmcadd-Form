import React, {useEffect} from "react";
import PropTypes from "prop-types";

const propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    rows: PropTypes.oneOfType(
        PropTypes.number,
        PropTypes.any
    ),
    answer: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.any
    ]),
    as: PropTypes.elementType
};

const FormText = (
    {
        label,
        name,
        disabled = false,
        readOnly = false,
        value,
        onChange,
        rows,
        answer,
        as: Component = rows !== null ? 'textarea' : 'input'
    }) => {

    let dif = ''
    let difValue = ''

    useEffect(() => {
        if(Component === 'textarea') {
            dif = 'rows'
            difValue = rows
        } else {
            dif = 'type'
            difValue = 'text'
        }
    }, [])

    const handleChange = (e) => {
        const {name, value} = e.target
        if (onChange) {
            onChange({name, value})
        }
    }

    return (
        <div>
            {label &&
            <label className="form-label">{label}</label>
            }
            <Component
                className="form-input"
                name={name}
                value={value}
                disabled={disabled}
                readOnly={readOnly}
                onChange={handleChange}
                dif={difValue}
                placeholder={answer !== null ? answer.text : ''}
            />
        </div>
    )
};

FormText.displayName = 'FormText';
FormText.propTypes = propTypes;

export default FormText;
