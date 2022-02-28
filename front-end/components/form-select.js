import React from 'react';

/* TODO: 대체 */
const FormSelect = ({ value, onChange, name, className, label, help, options, err, placeholder }) => {
    return (
        <div className={className + (err ? ' invalid-box' : '')}>
            {label && <label className="form-label">{label}</label>}
            <select name={name} value={value} onChange={onChange} className="form-input">
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(v => (
                    <option value={v.value} key={v.value}>{v.label}</option>
                ))}
            </select>
            {help && <span className="help-block"><small>{help}</small></span>}
        </div>
    );
}

export default React.memo(FormSelect);
