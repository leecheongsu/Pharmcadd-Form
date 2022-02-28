import React, { useState } from "react";
import { useRouter } from "next/router";
import { PlusCircleIcon, PlusIcon, TrashIcon, XIcon, ArrowCircleUpIcon, ArrowCircleDownIcon } from "@heroicons/react/outline";
import axios from "../../../lib/axios";
import { INPUT_TYPE_OF_QUESTION_MAP, QUESTION_TYPE } from "../../../assets/data";
import useForm from "../../../hooks/useForm";
import PageTitle from "../../../components/PageTitle";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import FormControl from "../../../components/FormControl";
import FormSelect from "../../../components/FormSelect";
import Button from "../../../components/Button";
import FormCheck from "../../../components/FormCheck";

const NEW_QUESTION_TYPE = QUESTION_TYPE.map((v, i) => ({
    ...(i === 0 ? { selected: true } : {}),
    id: v.value,
    text: v.label
}))

const FormCreate = () => {
    const router = useRouter();
    const [inputData, validated, { onChange, handleChange, submit: handleSubmit }] = useForm({
        title: '',
        description: '',
        questions: [
            {
                title: '',
                type: 'CHOICE_SINGLE',
                options: [
                    { text: '' }
                ]
            }
        ]
    });
    const { title, description, questions } = inputData

    const addQuestion = () => {
        const item = {
            title: '',
            type: 'CHOICE_SINGLE',
            options: [
                { text: '' }
            ]
        }
        const newQuestions = [...questions, item]
        handleChange('questions', newQuestions)
    }

    const deleteQuestion = (index) => {
        const newQuestions = [...questions]
        newQuestions.splice(index, 1)
        handleChange('questions', newQuestions)
    }

    const handleQuestion = (index, value) => {
        // console.log(index, value)
        const newQuestions = [...questions]
        newQuestions.splice(index, 1, value)
        handleChange('questions', newQuestions)
    }

    const onSubmit = () => {
        const data = {
            title, description, questions: questions.map(v => ({
                title: v.title,
                type: v.type,
                options: ['CHOICE_SINGLE', 'CHOICE_MULTIPLE'].includes(v.type) ? v.options : [],
            }))
        }
        axios.post('/backapi/admin/forms', data)
            .then(({ data }) => {
                router.push(`/admin/forms/${data.id}`)
                // console.log(data)
            })
    }

    return (
        <>
            <PageTitle title="양식 생성" />
            <Form validated={validated} onSubmit={e => handleSubmit(e, onSubmit)}>
                <Card>
                    <FormControl
                        name="title"
                        placeholder="설문 제목"
                        required
                        value={title}
                        onChange={onChange}
                    />
                    <FormControl
                        name="description"
                        placeholder="설문 내용"
                        value={description}
                        onChange={onChange}
                        as="textarea"
                        rows={3}
                        className="mt-2"
                    />
                </Card>

                {questions.map((v, i) => (
                    <Question
                        data={v}
                        id={i}
                        handleQuestion={handleQuestion}
                        onDelete={() => deleteQuestion(i)}
                        key={i}
                    />
                ))}

                <div className="flex items-start justify-between mt-3">
                    <Button icon onClick={addQuestion} className="card p-3">
                        <PlusCircleIcon className="w-7 h-7 text-gray-400" />
                    </Button>
                    <Button type="submit">설문 저장</Button>
                </div>
            </Form>
        </>
    )
}

const Question = ({ id, data: initData, handleQuestion, onDelete }) => {
    const [inputData, setInputData] = useState(initData);
    const { title, type, options } = inputData
    const handleInputData = (name, value) => {
        const temp = {
            ...inputData,
            [name]: value,
        }
        setInputData(temp);
        handleQuestion(id, temp)
    };

    const onChange = (e) => {
        const { name, value } = e.target
        handleInputData(name, value)
    }

    const addOption = () => {
        const newOptions = [...options, { text: '' }]
        handleInputData('options', newOptions)
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

    const onChangeOption = (e) => {
        const { name, value } = e.target
        options[name].text = value.replace(/^[\s\uFEFF\xA0]+/gi, '') /* 앞 공백 제거 */
        handleInputData('options', options)
    }

    return (
        <Card className="my-3">
            <div className="flex gap-3">
                <FormControl
                    name="title"
                    placeholder="질문"
                    required
                    value={title}
                    onChange={onChange}
                    className="w-4/5"
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
                {/* TODO: onDuplicate */}
                {/*<Button icon className="ml-auto" onClick={onDuplicate}>*/}
                {/*    <DocumentDuplicateIcon className="w-6 h-6 text-gray-400" />*/}
                {/*</Button>*/}
                <Button icon className="ml-auto" onClick={onDelete}>
                    <TrashIcon className="w-6 h-6 text-gray-400" />
                </Button>
                {/* NOTE: 무조건 답변해야함.. */}
                {/*<span className="v-line mx-5"></span>
                <span className="flex-none text-sm mr-3">필수</span>
                <label className="switch-button sm">
                    <input type="checkbox" />
                    <span className="on-off-switch"></span>
                </label>*/}
            </div>
        </Card>
    )
}

export default FormCreate;
