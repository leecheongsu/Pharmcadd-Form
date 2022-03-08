import React from 'react'

/* TODO: 대체 */
const FormInput = ({ value, onChange, name, className, label, type = 'text', placeholder, readonly, help, err, valid }) => {
    const handleChange = (e) => {
        const { name, value } = e.target
        if (onChange) {
            onChange({ name, value })
        }
    }

    return (
        <div className={className + (err ? ' invalid-box' : '') + (valid ? ' valid-box' : '')}>
            {label && <label className="form-label">{label}</label>}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="form-input"
                readOnly={readonly}
                autoComplete={type !== 'password' ? undefined : 'true'}
            />
            {err && <span className="help-block"><small>{err}</small></span>}
            {help && <span className="help-block"><small>{help}</small></span>}
        </div>
    )
}

export default React.memo(FormInput)
