import React from 'react'
import newId from '../utils/uid'

/* TODO: 대체 */
const FormCheck = ({ type = 'checkbox', label, name, checked, onChange, className, err }) => {
    const id = newId()
    return (
        <div className={className + (err ? ' invalid-box' : '')}>
            <div className="form-check">
                <input id={id} type={type} name={name} className="form-check-input"
                       checked={checked} onChange={onChange} />
                <label className="form-check-label" htmlFor={id}>{label}</label>
            </div>
            {err && <span className="help-block"><small>{err}</small></span>}
        </div>
    )
}

export default React.memo(FormCheck)
