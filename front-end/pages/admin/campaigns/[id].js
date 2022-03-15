import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { dayFormat } from '../../../lib/dayjs'
import axios from '../../../lib/axios'
import PageTitle from '../../../components/PageTitle'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import FormLabel from '../../../components/FormLabel'
import NoData from '../../../components/NoData'
import ModalBox from '../../../components/modal/ModalBox'
import FormGroup from '../../../components/FormGroup'
import FormControl from '../../../components/FormControl'

const CampaignDetail = ({ campaign, participantGroups, participantUsers }) => {
    const router = useRouter()
    const { id, formId, title, description, startsAt, endsAt, status } = campaign

    const [{ questions, answers, cancels }, setData] = useState({
        questions: [],
        answers: [],
        cancels: [],
    })

    useEffect(() => {
        const handleData = async () => {
            const { data: questions } = await axios.get(`/backapi/admin/forms/${formId}/questions`)
            const { data: { content: answers } } = await axios.get(`/backapi/admin/campaigns/${id}/answers?page=1&itemsPerPage=100`)
            const { data: { content: cancels } } = await axios.get(`/backapi/admin/campaigns/${id}/answer-cancels`)
            setData({ questions, answers, cancels })
        }
        handleData()
    }, [formId, id])

    const answerCancelMap = {}
    answers.map(a => {
        cancels.filter(c => c.requester === a.userId).map(c => {
            answerCancelMap[a.userId] = c
        })
    })

    const cancelAnswerId = useRef(null)
    const cancelAnswers = useRef(null)

    const handleAnswerCancelButton = async (type) => {
        await axios.patch(`/backapi/admin/campaigns/${id}/answer-cancels/${cancelAnswerId.current}/${type}`, { answer: cancelAnswers.current })
            .catch((e) => {
                if (e.response.status < 500) {
                    console.log(e.response)
                }
            })
    }

    const [isVisible, setIsVisible] = useState(false)
    const modalConf = {
        title: '답변 취소 요청',
        content: '승인 혹은 거부에 대한 이유를 작성해주세요',
        blindFilter: true,
        handleLeftButton: {
            title: '승인',
            onClick: () => handleAnswerCancelButton('approve'),
        },
        handleRightButton: {
            title: '거부',
            onClick: () => handleAnswerCancelButton('reject'),
        },
    }

    const onChangeCancelAnswer = (e) => {
        cancelAnswers.current = e.target.value
    }

    const answerForRequest = () => {
        return (
            <FormGroup>
                <FormLabel className="text-left">이유</FormLabel>
                <FormControl name="answer" as="textarea" rows="3" onChange={onChangeCancelAnswer} />
            </FormGroup>
        )
    }

    const handleApprovalButton = (id) => {
        cancelAnswerId.current = id
        setIsVisible(true)
    }

    return (
        <>
            <PageTitle title="설문 발송 상세" />
            <Card>
                <div className="flex items-baseline">
                    <div>
                        <h3 className="font-medium text-xl text-gray-700">{title}</h3>
                        {description &&
                        <p className="text-sm text-gray-500 mt-2"
                           dangerouslySetInnerHTML={{ __html: description.replace('\n', '<br />') }} />}
                    </div>
                    <Badge className="ml-auto">{status}</Badge>
                </div>
                <hr className="my-3" />
                <ul className="text-sm">
                    <li>기간 : {dayFormat(startsAt)} ~ {dayFormat(endsAt)}</li>
                    {participantGroups.length > 0 && <li>대상부서 : {participantGroups.join(', ')}</li>}
                    {participantUsers.length > 0 && <li>대상유저 : {participantUsers.join(', ')}</li>}
                </ul>
            </Card>
            <Card className="mt-3">
                <FormLabel>설문 답변</FormLabel>
                {questions.length > 0 && <table className="table mt-3">
                    <thead>
                    <tr>
                        <th className="whitespace-nowrap">설문자</th>
                        {questions.map((q, i) => (
                            <th key={i}>{q.title}</th>
                        ))}
                        <th className="text-center whitespace-nowrap">답변 상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {answers.length > 0
                        ? answers.map((a, i) => (
                            // eslint-disable-next-line react/jsx-key
                            <tr key={i}>
                                <td>{a.userName}</td>
                                {questions.map((q, j) => (
                                    <td key={j}>{a[`ans${j + 1}`] || '-'}</td>
                                ))}
                                <td className="text-center">
                                    {a.createdAt
                                        ? (answerCancelMap[a.userId] === undefined
                                                ?
                                                <>완료 <span className="text-sm text-gray-400">({dayFormat(a.createdAt)})</span></>
                                                :
                                                <Button onClick={() => handleApprovalButton(answerCancelMap[a.userId].id)}>
                                                    {answerCancelMap[a.userId].approvalType}
                                                </Button>
                                        ) : <>대기중</>
                                    }
                                </td>
                            </tr>
                        ))
                        : <NoData colSpan={questions.length + 2} message="설문에 대한 답변이 없습니다." />
                    }
                    </tbody>

                </table>}
            </Card>
            <div className="flex mt-3">
                <Button outline onClick={() => router.push('/admin/campaigns')} className="mr-auto">목록</Button>
            </div>
            <div>
                <ModalBox state={isVisible} modalConf={modalConf} child={answerForRequest()} />
            </div>
        </>
    )
}

/* Server-Side Rendering */
export const getServerSideProps = async ({ params }) => {
    const { data: campaign } = await axios.get(`/backapi/admin/campaigns/${params.id}`)
    const { data: { content: participants } } = await axios.get(`/backapi/admin/campaigns/${params.id}/participants`)

    const participantGroups = []
    const participantUsers = []
    participants.forEach(({ type, groupName, userName }) => {
        if (type === 'GROUP') participantGroups.push(groupName)
        else if (type === 'USER') participantUsers.push(userName)
    })

    return {
        props: {
            campaign,
            participantGroups,
            participantUsers,
        },
    }
}

export default CampaignDetail
