import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import Card from '../../components/Card'
import axios from '../../lib/axios'
import FormRadioGroup from '../../components/FormRadioGroup'
import FormCheckGroup from '../../components/FormCheckGroup'
import ToastBox from '../../components/modal/ToastBox'
import FormText from '../../components/FormText'
import ModalBox from '../../components/modal/ModalBox'
import FormGroup from '../../components/FormGroup'
import FormLabel from '../../components/FormLabel'
import FormControl from '../../components/FormControl'
import { useRouter } from 'next/router'

const Campaign = ({ detail, campaign, createdBy, answer }) => {
    const { id, questions } = detail
    const router = useRouter()

    const initData = {}
    questions.forEach(q => {
        const { id, type } = q
        q.name = `${type}_${id}`
        initData[q.name] = ['CHOICE_MULTIPLE'].includes(q.type) ? [] : ''
    })

    const [inputData, setValue] = useState(initData)
    const onChange = ({ name, value }) => {
        setValue({
            ...inputData,
            [name]: value,
        })
    }

    const [isToast, setIsToast] = useState(false)
    const [toastData, setToastData] = useState({})

    const [editable, setEditable] = useState(false)

    useEffect(() => {
        if (answer.length > 0) {
            questions.map(q => {
                q.ti = `${q.type}_${q.id}`
                answer.map((a) => {
                    if (a.questionId === q.id) {
                        if (a.type === 'CHOICE_SINGLE' || a.type === 'CHOICE_MULTIPLE') {
                            const optionValue = a.optionIds
                            inputData[q.ti] = optionValue
                        } else {
                            const textValue = a.text
                            inputData[q.ti] = textValue
                        }
                    }
                })
            })
            setEditable(true)
        }
    }, [answer, inputData, questions])

    const onSubmit = async (e) => {
        e.preventDefault()

        const answers = questions.map(q => {
            if ('CHOICE_SINGLE' === q.type) {
                return {
                    questionId: q.id,
                    optionIds: [inputData[q.name]],
                }
            } else if ('CHOICE_MULTIPLE' === q.type) {
                return {
                    questionId: q.id,
                    optionIds: inputData[q.name],
                }
            } else {
                return {
                    questionId: q.id,
                    text: inputData[q.name],
                }
            }
        })

        await axios.post(`/backapi/campaigns/${campaign.id}/answer`, { answer: answers }).then((res) => {
            if (res.status === 200) {
                setToastData({
                    type: 'success',
                    message: 'registration succeeded',
                    blindFilter: true,
                    autoClose: true,
                })
                setIsToast(true)
            }
        }).catch((e) => {
            setToastData({
                type: 'warning',
                message: 'registration failed. try again',
                blindFilter: true,
                autoClose: true,
            })
            setIsToast(true)
        })
    }

    const handleToast = () => {
        setIsToast(false)
        if (toastData.type === 'success') {
            router.push('/campaigns')
        }
    }

    const [isModal, setIsModal] = useState(false)
    const [modalData, setModalData] = useState({})

    const reason = useRef('')

    let leftButton = ''
    let rightButton = ''

    const modalClose = () => {
        setIsModal(false)
    }

    const handleReasonChange = (e) => {
        //TODO("validation")
        reason.current = e.target.value
    }

    const reasonForRequest = () => {
        return (
            <FormGroup>
                <FormLabel className="text-left">Reason</FormLabel>
                <FormControl name="reason" as="textarea" rows="3" onChange={e => handleReasonChange(e)} />
            </FormGroup>
        )
    }

    const answerCancelRequestButton = async () => {
        console.log(reason.current)
        await axios.post(`api/campaigns/${campaign.id}/answer-cancels`, { reason: reason.current })
            .then((res) => {
                if (res.status === 200) {
                    setIsModal(false)
                    setToastData({
                        type: 'success',
                        message: 'registration succeeded',
                        blindFilter: true,
                        autoClose: true,
                    })
                    setIsToast(true)
                }
            }).catch((e) => {
                console.log(e.response)
            })
    }

    function handleEditButton() {
        leftButton = ({ title: 'cancel', onClick: modalClose })
        rightButton = ({ title: 'confirm', onClick: answerCancelRequestButton })

        setModalData({
            title: 'Notice',
            content: 'Admin Approval Required.',
            blindFilter: false,
            handleLeftButton: leftButton,
            handleRightButton: rightButton,
        })
        setIsModal(true)
    }

    return (
        <div className="p-3 campaign">
            <CampaignInfo title={detail.title} createdBy={createdBy} campaign={campaign} />
            <form onSubmit={onSubmit}>
                {questions.map(v => (
                    <QuestionItem item={v} inputData={inputData} onChange={onChange} key={`c${id}_q${v.id}`}
                                  answer={answer} />
                ))}
                <div className="text-right mt-3">
                    {editable && (
                        <button type="button" className="btn btn_outline mr-2" onClick={handleEditButton}>Reset</button>
                    )}
                    {answer.length === 0 && (
                        <button type="submit" className="btn">Submit</button>
                    )}
                </div>
            </form>
            <ToastBox state={isToast} toastOnChange={handleToast} toastConf={toastData} />
            <ModalBox state={isModal} modalConf={modalData} child={reasonForRequest()} />
        </div>
    )
}

const CampaignInfo = ({ title, createdBy, campaign }) => {
    const { startsAt, endsAt } = campaign
    const format = 'YYYY.MM.DD HH:mm'
    const endsAtCheck = endsAt === null ? ('No limit') : (
        `${dayjs(endsAt).format(format)}`
    )
    const duration = `${dayjs(startsAt).format(format)} - ${endsAtCheck}`

    return (
        <Card>
            <h3 className="title">{title}</h3>
            <hr className="mb-2" />
            <div className="text-right">{createdBy}</div>
            <div className="text-right text-sm">{duration}</div>
        </Card>
    )
}

const QuestionItem = ({ item, inputData, onChange, answer }) => {
    const { id, title, type, name, options, required } = item
    console.log(inputData[name])
    const value = inputData[name]
    let content

    let ans

    let readOnly

    if (answer.length > 0) {
        answer.filter(a => a.questionId === id).map(v => ans = v)
        readOnly = true
    } else {
        ans = null
        readOnly = false
    }

    if (type === 'CHOICE_SINGLE') {
        content = <FormRadioGroup name={name} value={value} onChange={onChange} items={options} readOnly={readOnly}
                                  answer={ans} />
    } else if (type === 'CHOICE_MULTIPLE') {
        content = <FormCheckGroup name={name} value={value} onChange={onChange} items={options} readOnly={readOnly}
                                  answer={ans} />
    } else if (type === 'TEXT_SHORT') {
        content = <FormText name={name} value={value} onChange={onChange} rows={null} readOnly={readOnly} answer={ans} />
    } else if (type === 'TEXT_LONG') {
        content = <FormText name={name} value={value} onChange={onChange} rows="3" readOnly={readOnly} answer={ans} />
    }

    return (
        <Card className="mt-3" key={`q${id}`}>
            <h4 className="font-bold">{title}
                {required && <span className="font-medium text-xs ml-1 necessary">*required</span>}
            </h4>
            <div className="mt-3">
                {content}
            </div>
        </Card>
    )
}

export const getServerSideProps = async ({ params }) => {
    const { id } = params
    try {
        const { data: campaignData } = await axios.get(`/backapi/campaigns/${id}`)
        const { data: formData } = await axios.get(`/backapi/forms/${campaignData.formId}/detail`)
        const { data: answerData } = await axios.get(`/backapi/campaigns/${id}/answer`)
        const { data: createdBy } = await axios.get(`/backapi/users/${campaignData.createdBy}`)

        return {
            props: {
                title: 'Write',
                detail: formData,
                campaign: campaignData,
                createdBy: createdBy.name,
                answer: answerData,
            },
        }
    } catch (e) {
        return {
            notFound: true,
        }
    }
}

export default Campaign
