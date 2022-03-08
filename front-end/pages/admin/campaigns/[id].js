import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { dayFormat } from '../../../lib/dayjs'
import axios from '../../../lib/axios'
import PageTitle from '../../../components/PageTitle'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import FormLabel from '../../../components/FormLabel'
import NoData from '../../../components/NoData'

const CampaignDetail = ({ campaign, participantGroups, participantUsers }) => {
    const router = useRouter()
    const { id, formId, title, description, startsAt, endsAt, status } = campaign

    const [{ questions, answers }, setData] = useState({
        questions: [],
        answers: [],
    })
    useEffect(() => {
        const handleData = async () => {
            const { data: questions } = await axios.get(`/backapi/admin/forms/${formId}/questions`)
            const { data: { content: answers } } = await axios.get(`/backapi/admin/campaigns/${id}/answers?page=1&itemsPerPage=100`)
            setData({ questions, answers })
        }
        handleData()
    }, [formId, id])

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
                            <tr key={i}>
                                <td>{a.userName}</td>
                                {questions.map((q, j) => (
                                    <td key={j}>{a[`ans${j + 1}`] || '-'}</td>
                                ))}
                                <td className="text-center">
                                    {a.createdAt
                                        ? <>완료 <span className="text-sm text-gray-400">({dayFormat(a.createdAt)})</span></>
                                        : <>대기중</>
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
