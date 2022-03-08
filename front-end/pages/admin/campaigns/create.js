import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { localDateTime } from '../../../lib/dayjs'
import { XIcon } from '@heroicons/react/solid'
import axios from '../../../lib/axios'
import useForm from '../../../hooks/useForm'
import PageTitle from '../../../components/PageTitle'
import Card from '../../../components/Card'
import Form from '../../../components/Form'
import FormControl from '../../../components/FormControl'
import FormSelect from '../../../components/FormSelect'
import Button from '../../../components/Button'
import FormLabel from '../../../components/FormLabel'
import FormCheck from '../../../components/FormCheck'
import Badge from '../../../components/Badge'

const CampaignCreate = ({ formInfo }) => {
    const router = useRouter()
    const [hasSchedule, setHasSchedule] = useState(false)
    const [inputData, validated, { onChange, handleChange, submit: handleSubmit }] = useForm({
        formId: formInfo.id || '',
        title: formInfo.title || '',
        description: formInfo.description || '',
        startsAt: '',
        endsAt: '',
        // accessModifier: 'PRIVATE',
        timeZoneId: '',
        participants: [],

        // schedule
        type: 'CRON',
        cronExpression: '0 0 8 ? * MON-SAT',
        cronDuration: '86400000',
        active: true,
    })
    const { title, description, startsAt, endsAt, timeZoneId, participants, cronExpression } = inputData
    const [timeZones, setTimeZones] = useState([])
    useEffect(() => {
        const handleTimeZones = async () => {
            const { data } = await axios.get('/backapi/time-zones')
            setTimeZones(data.map(v => ({
                ...v,
                text: v.country,
            })))
            handleChange('timeZoneId', data[0].id)
        }
        handleTimeZones()
    }, [handleChange])

    const onChangeSchedule = (e) => {
        const { checked } = e.target
        setHasSchedule(checked)
    }

    const onSubmit = () => {
        const data = {
            ...inputData,
            startsAt: localDateTime(inputData.startsAt),
            endsAt: localDateTime(inputData.endsAt),
        }
        if (hasSchedule) {
            const formId = router.query.formId
            return axios.post(`/backapi/admin/forms/${formId}/schedules`, data)
                .then(({ data }) => {
                    router.push(`/admin/forms/${formId}`)
                })
        } else {
            return axios.post('/backapi/admin/campaigns', data)
                .then(({ data }) => {
                    router.push(`/admin/campaigns/${data.id}`)
                })
        }
    }

    return (
        <>
            <PageTitle title="설문 발송" />
            <Form validated={validated} onSubmit={e => handleSubmit(e, onSubmit)}>
                <Card>
                    <FormLabel>내용</FormLabel>
                    <FormControl
                        name="title"
                        placeholder="발송 제목"
                        required
                        value={title}
                        onChange={onChange}
                    />
                    <FormControl
                        name="description"
                        placeholder="발송 내용"
                        value={description}
                        onChange={onChange}
                        as="textarea"
                        rows={3}
                        className="mt-2"
                    />
                </Card>
                {/* MEMO: 스케줄링을 돌리는 기간 설정 */}
                <Card className="mt-3">
                    <div className="flex items-center mb-2">
                        <FormLabel className="mb-0">기간</FormLabel>
                        <FormCheck
                            name="group"
                            checked={hasSchedule}
                            onChange={onChangeSchedule}
                            label="스케줄링"
                            text="xs"
                            className="flex items-center ml-auto"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <FormControl
                            name="startsAt"
                            type="datetime-local"
                            disabled={hasSchedule}
                            value={startsAt}
                            onChange={onChange}
                        />
                        <span>~</span>
                        <FormControl
                            name="endsAt"
                            type="datetime-local"
                            disabled={hasSchedule}
                            min={startsAt}
                            value={endsAt}
                            onChange={onChange}
                        />
                        <span className="font-bold text-xs text-gray-500 whitespace-nowrap ml-4">Time Zone</span>
                        <FormSelect
                            name="timeZoneId"
                            value={timeZoneId}
                            options={timeZones}
                            onChange={onChange}
                            className="form-input"
                        />
                    </div>
                    {hasSchedule && <div className="mt-3">
                        <FormLabel>주기 설정</FormLabel>
                        <FormControl
                            name="cronExpression"
                            placeholder="CRON"
                            value={cronExpression}
                            required
                            onChange={onChange}
                        />
                    </div>}
                </Card>
                <Participants onChange={handleChange} />
                <div className="text-right mt-3">
                    <Button type="submit" disabled={participants.length === 0}>발송하기</Button>
                </div>
            </Form>
        </>
    )
}

const Participants = ({ onChange }) => {
    const [{ groups, groupTree, groupMap }, setGroupInfo] = useState({
        groups: [],
        groupTree: null,
        groupMap: {},
    })
    const [{ users, userMap }, setUserInfo] = useState({
        users: [],
        userMap: {},
    })

    useEffect(() => {
        const handleInfo = async () => {
            const { data: groups } = await axios.get('/backapi/admin/groups')
            const groupTree = {}
            const groupMap = {}
            groups.forEach(v => {
                const parentId = v.parentId | 0
                groupTree[parentId] ? groupTree[parentId].push(v.id) : (groupTree[parentId] = [v.id])
                groupMap[v.id] = { ...v, checked: false }
            })
            setGroupInfo({
                groups,
                groupTree,
                groupMap,
            })

            const params = { groupId: 1, includeSubgroup: true, itemsPerPage: 999 }
            const { data: { content: users } } = await axios.get('/backapi/admin/users', { params })
            const userMap = {}
            users.forEach(v => {
                userMap[v.id] = { ...v, checked: false }
            })
            setUserInfo({
                users,
                userMap,
            })
        }
        handleInfo()
    }, [])

    /* useMemo */
    const selectedGroups = useMemo(() => {
        return Object.keys(groupMap)
            .filter(key => groupMap[key].checked)
            .map(id => ({
                type: 'GROUP',
                groupId: id,
                includeSubgroup: false,
            }))
    }, [groupMap])

    const selectedUsers = useMemo(() => {
        return Object.keys(userMap)
            .filter(key => userMap[key].checked)
            .map(id => ({
                type: 'USER',
                userId: id,
            }))
    }, [userMap])

    useEffect(() => {
        onChange('participants', [...selectedGroups, ...selectedUsers])
    }, [selectedGroups, selectedUsers, onChange])

    const onChangeCheck = (e) => {
        const { value, checked, name } = e.target
        handleChecked(name, value, checked)
    }

    const handleChecked = (type, id, checked) => {
        if (type === 'user') {
            setUserInfo({
                users,
                userMap: {
                    ...userMap,
                    [id]: {
                        ...userMap[id],
                        checked: checked,
                    },
                },
            })
        } else if (type === 'group') {
            setGroupInfo({
                groups,
                groupTree,
                groupMap: {
                    ...groupMap,
                    [id]: {
                        ...groupMap[id],
                        checked: checked,
                    },
                },
            })
        }
    }

    const handleCheckedAll = ({ id }, checked) => {
        const includedGroupIds = groups
            .filter(v => v.pathways.includes(id))
            .map(v => v.id)

        /* set GroupMap */
        const temp = {}
        includedGroupIds.forEach(id => {
            temp[id] = {
                ...groupMap[id],
                checked: checked,
            }
        })
        setGroupInfo({
            groups,
            groupTree,
            groupMap: {
                ...groupMap,
                ...temp,
            },
        })
    }

    const setUsers = async ({ id: groupId }) => {
        const params = { groupId, includeSubgroup: true, itemsPerPage: 999 }
        const { data: { content } } = await axios.get('/backapi/admin/users', { params })
        setUserInfo({
            userMap,
            users: content,
        })
    }

    const RecGroupItem = ({ id = 1 }) => {
        const item = groupMap[id]
        const groupChild = groupTree[id]

        return (
            <>
                <div className="flex items-center mb-1">
                    <FormCheck
                        name="group"
                        checked={item.checked}
                        value={item.id}
                        onChange={onChangeCheck}
                    />
                    <span className="text-sm cursor-pointer" onClick={() => setUsers(item)}>{item.name}</span>
                    {groupChild && <Button
                        link
                        onClick={() => handleCheckedAll(item, !item.checked)}
                        className="text-xs p-0 ml-2">
                        {item.checked ? '전체해제' : '전체선택'}
                    </Button>}
                </div>
                {groupChild && <div className="ml-7 mb-1">
                    {groupChild.map((childId, i) => (
                        <RecGroupItem id={childId} key={i} />
                    ))}
                </div>}
            </>
        )
    }

    return (
        <>
            {groupTree && <div className="flex flex-nowrap items-stretch gap-3 mt-3">
                <Card className="flex-none pr-9">
                    <FormLabel className="mb-4">부서 목록</FormLabel>
                    <RecGroupItem />
                </Card>
                <Card className="flex-1">
                    <FormLabel className="mb-4">회원 목록</FormLabel>
                    <div className="overflow-y-auto" style={{ maxHeight: '620px' }}>
                        {users.length > 0 && <ul>
                            {users.map(v => (
                                <li key={v.id} className="mb-1">
                                    <FormCheck
                                        name="user"
                                        label={`${v.name} (${v.groupNames.join(', ')})`}
                                        checked={userMap[v.id].checked}
                                        value={v.id}
                                        text="sm"
                                        className="flex items-start"
                                        onChange={onChangeCheck}
                                    />
                                </li>
                            ))}
                        </ul>}
                    </div>
                </Card>
                <Card className="flex-1">
                    <FormLabel className="mb-4">대상 부서</FormLabel>
                    {selectedGroups.length > 0
                        ? <div className="badge-group">
                            {selectedGroups.map(({ groupId: id }) => (
                                <Badge pill text="xs" key={id}>
                                    <span className="flex items-center">
                                        {groupMap[id].name}
                                        <XIcon onClick={() => handleChecked('group', id)} className="w-4 h-4 cursor-pointer ml-1" />
                                    </span>
                                </Badge>
                            ))}
                        </div>
                        : <p className="text-sm text-gray-400">선택된 부서가 없습니다.</p>
                    }
                    <FormLabel className="mt-6 mb-4">대상 회원</FormLabel>
                    {selectedUsers.length > 0
                        ? <div className="badge-group">
                            {selectedUsers.map(({ userId: id }) => (
                                <Badge pill text="xs" key={id}>
                                    <span className="flex items-center">
                                        {userMap[id].name}
                                        <XIcon onClick={() => handleChecked('user', id)} className="w-4 h-4 cursor-pointer ml-1" />
                                    </span>
                                </Badge>
                            ))}
                        </div>
                        : <p className="text-sm text-gray-400">선택된 회원이 없습니다.</p>
                    }
                </Card>
            </div>
            }
        </>
    )
}

/* Server-Side Rendering */
export const getServerSideProps = async ({ query }) => {
    if (query.formId) {
        const { data } = await axios.get(`/backapi/admin/forms/${query.formId}`)

        return {
            props: {
                formInfo: data,
            },
        }
    }

    return {
        redirect: {
            destination: '/admin/forms',
        },
    }
}

export default CampaignCreate
