import { useState } from "react";
import { useRouter } from 'next/router'
import axios from "../../../lib/axios";
import { dayFormat } from "../../../lib/dayjs";
import { CAMPAIGNS_STATUS } from "../../../assets/data";
import { CAMPAIGNS_HEADER } from "../../../assets/tableHeaders";
import Card from "../../../components/Card";
import PageTitle from "../../../components/PageTitle";
import Board from "../../../components/Board";
import Badge from "../../../components/Badge";
import FormSelect from "../../../components/FormSelect";

const NEW_CAMPAIGNS_STATUS = [{ id: '', text: 'All Status' }, ...CAMPAIGNS_STATUS]

const Campaigns = ({ content, options: initOptions }) => {
    const router = useRouter()
    const [{ list, options }, setData] = useState({
        list: content,
        options: initOptions,
    })
    const loadData = (params) => {
        return axios.get('/backapi/admin/campaigns', { params })
            .then(({ data }) => {
                setData({
                    list: data.content,
                    options: {
                        ...params,
                        total: data.total,
                    }
                })
            })
    }
    const onChange = (e) => {
        const { name, value } = e.target
        loadData({
            ...options,
            [name]: value,
        })
    }

    return (
        <>
            <PageTitle title="설문 목록" />
            <Card>
                <Board
                    headers={CAMPAIGNS_HEADER}
                    items={list}
                    options={options}
                    onClickRow={item => router.push(`/admin/campaigns/${item.id}`)}
                    loadData={(params) => loadData(params)}
                >
                    {{
                        header: <FormSelect
                            name="status"
                            value={options.status}
                            options={NEW_CAMPAIGNS_STATUS}
                            onChange={onChange}
                            className="form-input w-1/5 mr-3"
                        />,
                        startsAt: ({ startsAt, endsAt }) => <>{dayFormat(startsAt)} ~ {dayFormat(endsAt)}</>,
                        status: ({ status }) => <Badge text="xs">{status}</Badge>
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
        status: '',
    }
    const { data } = await axios.get('/backapi/admin/campaigns', { params })
    const { total, content } = data

    return {
        props: {
            options: {
                ...params,
                total,
            },
            content,
        }
    }
}


export default Campaigns;
