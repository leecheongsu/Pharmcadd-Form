import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '../../../lib/axios'
import { USERS_HEADER } from '../../../assets/tableHeaders'
import PageTitle from '../../../components/PageTitle'
import Card from '../../../components/Card'
import Board from '../../../components/Board'
import FormSelect from '../../../components/FormSelect'
import Badge from '../../../components/Badge'

const Users = ({ content, options: initOptions }) => {
    const router = useRouter()
    const [{ list, options }, setData] = useState({
        list: content,
        options: initOptions,
    })
    const [groups, setGroups] = useState([])
    useEffect(() => {
        const handleGroups = async () => {
            const { data } = await axios.get('/backapi/admin/groups')
            setGroups(data.map(v => ({
                id: v.id,
                text: v.name,
            })))
        }
        handleGroups()
    }, [])

    const [positions, setPositions] = useState([])
    useEffect(async () => {
        const { data } = await axios.get('/backapi/positions')
        setPositions(data.map(v => ({
            id: v.id,
            text: v.name,
        })))
    }, [])

    const loadData = (params) => {
        return axios.get('/backapi/admin/users', { params })
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
    const onChange = (e) => {
        const { name, value } = e.target
        loadData({
            ...options,
            ...options.page = 1,
            [name]: value,
        })
    }

    return (
        <div>
            <PageTitle title="회원 목록" />
            <Card>
                <Board
                    headers={USERS_HEADER}
                    items={list}
                    options={options}
                    onClickRow={item => router.push(`/admin/users/${item.id}`)}
                    loadData={(params) => loadData(params)}
                >
                    {{
                        header: <div className="flex items-center">
                            <FormSelect
                                name="groupId"
                                value={options.groupId}
                                options={groups}
                                onChange={onChange}
                                className="form-input mr-3"
                            />
                            <FormSelect
                                name="positionId"
                                value={options.positionId}
                                options={positions}
                                onChange={onChange}
                                className="form-input mr-3"
                                placeholder="전체"
                            />
                        </div>,
                        groupNames: ({ groupNames }) => <div className="badge-group">
                            {groupNames.length > 0
                                ? groupNames.map((name, i) => (<Badge outline pill text="xs" key={i}>{name}</Badge>))
                                : '-'}
                        </div>,
                        positionNames: ({ positionNames }) => <div className="badge-group">
                            {positionNames.length > 0
                                ? (<Badge outline pill text="xs">{new Set([...positionNames])}</Badge>)
                                : '-'
                            }
                        </div>,
                        active: ({ active }) => <Badge text="xs">{active ? 'ON' : 'OFF'}</Badge>,
                    }}
                </Board>
            </Card>
        </div>
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
        groupId: '',
        positionId: '',
        includeSubgroup: true,
    }
    const { data } = await axios.get('/backapi/admin/users', { params })
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

export default Users
