import { useCallback, useState } from 'react';

const useForm = (initialForm) => {
    const [form, setForm] = useState(initialForm);
    const [validated, setValidated] = useState(false);

    const onChange = useCallback(e => {
        const { name, value } = e.target;
        handleChange(name, value)
    }, []);

    const handleChange = useCallback((name, value) => {
        setForm(form => ({ ...form, [name]: value }));
    }, []);

    const submit = (e, callback) => {
        e.preventDefault();
        const form = e.currentTarget;
        const hasInvalid = Array.from(form).some(v => (v.dataset && v.dataset.invalid))
        if (!form.checkValidity() || hasInvalid) {
            e.stopPropagation();
        } else {
            callback()
        }
        setValidated(true);
    };

    const reset = useCallback(() => setForm(initialForm), [initialForm]);

    return [form, validated, { reset, onChange, handleChange, submit }];
}

export default useForm;
