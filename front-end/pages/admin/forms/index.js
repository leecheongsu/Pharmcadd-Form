import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from '../../../lib/axios'
import { FORMS_HEADER } from '../../../assets/tableHeaders'
import Card from '../../../components/Card'
import PageTitle from '../../../components/PageTitle'
import Board from '../../../components/Board'
import Button from '../../../components/Button'

const Forms = ({ content, options: initOptions }) => {
    const router = useRouter()
    const [{ list, options }, setData] = useState({
        list: content,
        options: initOptions,
    })
    const loadData = (params) => {
        return axios.get('/backapi/admin/forms', { params })
            .then(({ data }) => {
                setData({
                    list: data.content,
                    options: {
                        ...params,
                        total: data.total,
                    },
                })
            })
    }

    const onClickSchedules = (e, id) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`/admin/forms/${id}/schedules`)
    }

    return (
        <>
            <PageTitle title="양식 목록" />
            <Card>
                <Board
                    headers={FORMS_HEADER}
                    items={list}
                    options={options}
                    onClickRow={item => router.push(`/admin/forms/${item.id}`)}
                    loadData={(params) => loadData(params)}
                >
                    {{
                        description: ({ id }) => <Button outline onClick={e => onClickSchedules(e, id)}>스케줄링</Button>,
                    }}
                </Board>
            </Card>
        </>
    )
}

/* Server-Side Rendering */
export const getServerSideProps = async () => {
    const params = {
        page: 1,
        itemsPerPage: 10,
        sortBy: 'updatedAt',
        sortDesc: true,
        keyword: '',
    }
    const { data } = await axios.get('/backapi/admin/forms', { params })
    const { total, content } = data

    return {
        props: {
            options: {
                ...params,
                total,
            },
            content,
        },
    }
}

export default Forms
