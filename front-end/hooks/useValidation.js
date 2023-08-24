import { useState, useCallback } from 'react'

function useValidation(initialValid) {
    const newInitialValid = addStatus(initialValid)
    const [valid, setValid] = useState(newInitialValid)

    const checkValid = (v) => {
        const { name, value } = getValueByType(v)
        const item = valid[name]
        const hasError = item.rules.some(f => !f(value))
        setValid(v => ({
                ...v,
                [name]: {
                    ...v[name],
                    check: true,
                    error: hasError ? (item.message || hasError) : hasError, // false or Error Message
                },
            }),
        )
        return !hasError
    }

    const validate = useCallback(e => checkValid(e.target), [])

    const validateForm = useCallback((e, callback) => {
        e.preventDefault()
        const isFormValid = Array.from(e.target)
            .filter(({ name }) => !!name && valid.hasOwnProperty(name) && (!valid[name].check || valid[name].error))
            .map(v => checkValid(v))
            .every(v => !!v)
        if (isFormValid) callback()
    }, [])

    const resetValidateForm = useCallback(() => setValid(newInitialValid), [newInitialValid])

    return [valid, validate, validateForm, resetValidateForm]
}

const getValueByType = (v) => {
    const { name, value, type, checked } = v
    return { name, value: type === 'checkbox' ? checked : value }
}

const addStatus = (obj) => {
    const newObj = {}
    const keys = Object.keys(obj)
    keys.forEach(key => {
        newObj[key] = {
            ...obj[key],
            check: false,
            error: false,
        }
    })
    return newObj
}
