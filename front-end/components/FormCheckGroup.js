import { forwardRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import Feedback from './Feedback'
import FormCheck from './FormCheck'
import PropTypes from 'prop-types'

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
        ]).isRequired,
    })).isRequired,
    value: PropTypes.array,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    rule: PropTypes.func,
    answer: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.any,
    ]),
    as: PropTypes.elementType,
}

const FormCheckGroup = (
    {
        inline = false,
        disabled = false,
        invalid = false,
        required = false,
        className,
        feedback,
        feedbackType = 'invalid',
        name,
        items: initItems = [],
        value = [],
        onChange,
        rule,
        answer,
        as: Component = 'div',
        ...props
    }) => {
    const [items, setItems] = useState(initItems.map(v => ({
        label: v.text,
        value: v.id,
        checked: value.includes(v.value),
    })))
    const handleChange = (e, i) => {
        const item = items[i]
        const newItems = [...items]
        newItems.splice(i, 1, { ...item, checked: e.target.checked })
        setItems(newItems)

        if (onChange && name) {
            onChange({ name, value: newItems.filter(v => v.checked).map(v => v.value) })
        }
    }

    const n = items.filter((v) => v.checked).length
    const error = (required ? n === 0 : false) || (rule ? rule(n) : false)

    useEffect(() => {
        let text = []

        if (answer !== null) {
            const textAnswer = answer.text.split(',')
            textAnswer.map(t => {
                text += t
            })
            const ansItems = [...items]
            ansItems.map((v) => {
                v.checked = text.includes(v.label)
            })
            setItems(ansItems)
        }
    }, [answer, items])

    return (
        <Component
            {...props}
            className={classNames(
                error && 'has-invalid',
                className,
            )}
        >
            {/* data-invalid : handleSubmit에서 프로그래밍적 invalid를 찾기위해 */}
            {items.map((v, i) => (
                <FormCheck
                    {...v}
                    type="checkbox"
                    name={name}
                    inline={inline}
                    disabled={disabled || v.disabled}
                    invalid={error}
                    {...(error ? { 'data-invalid': true } : {})}
                    onChange={e => handleChange(e, i)}
                    key={v.value}
                />
            ))}
            {feedback && (
                <Feedback type={feedbackType}>{feedback}</Feedback>
            )}
        </Component>
    )
}

FormCheckGroup.displayName = 'FormCheckGroup'
FormCheckGroup.propTypes = propTypes

export default FormCheckGroup
