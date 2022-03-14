import axios from '../../../../lib/axios'
import { INPUT_TYPE_OF_QUESTION_MAP, QUESTION_TYPE } from '../../../../assets/data'
import PageTitle from '../../../../components/PageTitle'
import Card from '../../../../components/Card'
import FormControl from '../../../../components/FormControl'
import Form from '../../../../components/Form'
import useForm from '../../../../hooks/useForm'
import FormSelect from '../../../../components/FormSelect'
import FormCheck from '../../../../components/FormCheck'
import Button from '../../../../components/Button'
import { ArrowCircleDownIcon, ArrowCircleUpIcon, PlusCircleIcon, PlusIcon, TrashIcon, XIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import ModalBox from '../../../../components/modal/ModalBox'
import { useRouter } from 'next/router'

const NEW_QUESTION_TYPE = QUESTION_TYPE.map((v, i) => ({
    ...(i === 0 ? { selected: true } : {}),
    id: v.value,
    text: v.label,
}))

const FormUpdate = ({ id, title, description, questions }) => {
    const router = useRouter()

    const [isModal, setIsModal] = useState(false)

    const handleModalClose = () => {
        setIsModal(false)
    }

    const modalClose = ({
        title: 'Confirm',
        onClick: handleModalClose,
    })

    const goBack = ({
        title: 'Confirm',
        onClick: () => router.back(),
    })

    const [modalConf, setModalConf] = useState({
        title: '',
        content: '',
        blindFilter: true,
        handleRightButton: modalClose,
    })

    const [inputData, validated, { onChange, handleChange, submit: handleSubmit, reset }] = useForm({
        title: title,
        description: description,
        questions: questions,
    })

    const handleQuestion = (index, value) => {
        const newQuestions = [...inputData.questions]
        newQuestions.splice(index, 1, value)
        handleChange('questions', newQuestions)
    }

    const deleteQuestion = (index) => {
        const newQuestions = [...inputData.questions]
        newQuestions.splice(index, 1)
        handleChange('questions', newQuestions)
    }

    const addQuestion = () => {
        const item = {
            title: '',
            type: 'CHOICE_SINGLE',
            options: [
                { text: '' },
            ],
        }
        const newQuestions = [...inputData.questions, item]
        handleChange('questions', newQuestions)
    }

    const onSubmit = async () => {
        const { title, description } = inputData
        const submitQuestions = [...inputData.questions]
        console.log(title, description, submitQuestions)

        const data = {
            id, title, description, questions: submitQuestions.map(v => ({
                title: v.title,
                type: v.type,
                options: ['CHOICE_SINGLE', 'CHOICE_MULTIPLE'].includes(v.type) ? v.options : [],
            })),
        }

        await axios.put(`/backapi/admin/forms/${id}`, data)
            .then((res) => {
                if (res.status === 200) {
                    setModalConf({
                        title: 'Succeeded',
                        content: 'Update Complete',
                        blindFilter: true,
                        handleRightButton: goBack,
                    })
                    setIsModal(true)
                }
            })
            .catch((e) => {
                if (e.response.status < 500) {
                    setModalConf({
                        title: 'Failed',
                        content: 'Update Incomplete',
                        blindFilter: true,
                        handleRightButton: modalClose,
                    })
                    setIsModal(true)
                }
            })
    }

    return (
        <>
            <PageTitle title="양식 수정" />
            <Form validated={validated} onSubmit={e => handleSubmit(e, onSubmit)}>
                <Card>
                    <FormControl
                        name="title"
                        value={inputData.title}
                        onChange={onChange}
                        required
                    />
                    <FormControl
                        name="description"
                        value={inputData.description}
                        onChange={onChange}
                        required
                        as="textarea"
                        rows={3}
                        className="mt-2"
                    />
                </Card>
                {inputData.questions.map((v, i) => (
                    <Question
                        data={v}
                        key={i}
                        id={i}
                        handleQuestion={handleQuestion}
                        onDelete={() => deleteQuestion(i)}
                    />
                ))}

                <div className="flex items-start justify-between mt-3">
                    <Button icon onClick={addQuestion} className="card p-3">
                        <PlusCircleIcon className="w-7 h-7 text-gray-400" />
                    </Button>
                    <Button type="submit">수정 완료</Button>
                </div>
                <ModalBox state={isModal} modalConf={modalConf} />
            </Form>
        </>
    )
}

const Question = ({ id, data: initData, handleQuestion, onDelete }) => {
    const [inputData, setInputData] = useState(initData)
    const { title, type, options } = inputData
    const handleInputData = (name, value) => {
        const temp = {
            ...inputData,
            [name]: value,
        }
        setInputData(temp)
        handleQuestion(id, temp)
    }

    const onChange = (e) => {
        const { name, value } = e.target
        handleInputData(name, value)
    }

    const onChangeOption = (e) => {
        const { name, value } = e.target
        options[name].text = value.replace(/^[\s\uFEFF\xA0]+/gi, '')
        handleInputData('options', options)
    }

    const deleteOption = (index) => {
        const newOptions = [...options]
        newOptions.splice(index, 1)
        handleInputData('options', newOptions)
    }

    const handleOrderOption = (index, type) => {
        const newOptions = [...options]
        const [item] = newOptions.splice(index, 1)
        const newIndex = type === 'up' ? index - 1 : index + 1
        newOptions.splice(newIndex, 0, item)
        handleInputData('options', newOptions)
    }

    const addOption = () => {
        const newOptions = [...options, { text: '' }]
        handleInputData('options', newOptions)
    }

    return (
        <Card className="my-3">
            <div className="flex gap-3">
                <FormControl
                    name="title"
                    value={title}
                    required
                    className="w-4/5"
                    onChange={onChange}
                />
                <FormSelect
                    name="type"
                    value={type}
                    options={NEW_QUESTION_TYPE}
                    onChange={onChange}
                    className="form-input w-1/5"
                />
            </div>
            {/* START: 옵션 */}
            <div className="mt-3">
                {['CHOICE_SINGLE', 'CHOICE_MULTIPLE'].includes(type) && <ul>
                    {options.map((v, i) => (
                        <li className="flex items-center mb-2" key={i}>
                            <FormCheck name="sample" type={INPUT_TYPE_OF_QUESTION_MAP[type]} readOnly />
                            <FormControl name={i} placeholder="옵션" required value={v.text} onChange={onChangeOption} />
                            <Button icon onClick={() => deleteOption(i)} className="ml-3">
                                <XIcon className="w-6 h-6 text-gray-400" />
                            </Button>
                            <Button icon disabled={i === 0} onClick={() => handleOrderOption(i, 'up')} className="ml-10">
                                <ArrowCircleUpIcon className="w-7 h-7 text-primary" />
                            </Button>
                            <Button icon disabled={i === options.length - 1} onClick={() => handleOrderOption(i, 'down')} className="ml-1">
                                <ArrowCircleDownIcon className="w-7 h-7 text-primary" />
                            </Button>
                        </li>
                    ))}
                    <li className="flex items-center">
                        <FormCheck name="sample" type={INPUT_TYPE_OF_QUESTION_MAP[type]} readOnly />
                        <Button outline onClick={addOption} className="flex items-center">추가 <PlusIcon className="w-4 h-4 ml-1" /></Button>
                    </li>
                </ul>}
                {type === 'TEXT_SHORT' && <FormControl placeholder="답변 부분" readOnly />}
                {type === 'TEXT_LONG' && <FormControl as="textarea" rows="3" placeholder="답변 부분" readOnly />}
            </div>
            {/* END: 옵션 */}
            <hr className="mt-4 mb-2" />
            <div className="flex items-center">
                <Button icon className="ml-auto" onClick={onDelete}>
                    <TrashIcon className="w-6 h-6 text-gray-400" />
                </Button>
            </div>
        </Card>
    )
}

export const getServerSideProps = async ({ params }) => {
    const { data } = await axios.get(`/backapi/admin/forms/${params.id}/detail`)

    return {
        props: {
            ...data,
        },
    }
}

export default FormUpdate