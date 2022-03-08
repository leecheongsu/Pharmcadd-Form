import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { dayFormat } from '../../../lib/dayjs'
import axios from '../../../lib/axios'
import useForm from '../../../hooks/useForm'
import { ROLES } from '../../../assets/data'
import PageTitle from '../../../components/PageTitle'
import Card from '../../../components/Card'
import FormControl from '../../../components/FormControl'
import FormLabel from '../../../components/FormLabel'
import FormGroup from '../../../components/FormGroup'
import FormSelect from '../../../components/FormSelect'
import FormSwitch from '../../../components/FormSwitch'
import Button from '../../../components/Button'
import Form from '../../../components/Form'
import ModalBox from '../../../components/modal/ModalBox'
import Feedback from '../../../components/Feedback'

const UserDetail = ({ groups: userGroups, timezone, user: initUser }) => {
    const router = useRouter()
    const [timeZones, setTimeZones] = useState([])
    useEffect(() => {
        const handleTimeZones = async () => {
            const { data } = await axios.get('/backapi/time-zones')
            setTimeZones(data.map(v => ({
                ...v,
                text: v.country,
            })))
        }
        handleTimeZones()
    }, [])

    const [user, setUser] = useState(initUser)
    const { active, createdAt, email, id, name, timeZoneId } = user

    const handleChangeSwitch = (e) => {
        const { checked } = e.target

        return axios.patch(`/backapi/admin/users/${id}/${checked ? 'active' : 'inactive'}`)
            .then(() => {
                setUser({
                    ...user,
                    active: checked,
                })
            })
    }

    const [timeZone, setTimeZone] = useState(timeZoneId)

    const onChangeTimeZone = (e) => {
        setTimeZone(e.target.value)
    }

    const [isVisible, setIsVisible] = useState(false)
    const [modalConf, setModalConf] = useState({
        title: '',
        content: '',
        blindFilter: false,
        handleRightButton: {},
    })

    const [modalChange, setModalChange] = useState({
        modal: '',
        state: false,
    })

    const handleRightButton = () => {
        setIsVisible(false)
    }
    const rightButton = ({
        title: 'Confirm',
        onClick: handleRightButton,
    })

    useEffect(() => {
        if (modalChange.state !== false) {
            if (modalChange.modal === 'SUCCESS') {
                setModalConf({
                    title: 'Success',
                    content: 'Change is completed',
                    handleRightButton: rightButton,
                })
            } else {
                setModalConf({
                    title: 'Fail',
                    content: 'Change is failed',
                    handleRightButton: rightButton,
                })
            }
            setIsVisible(true)
        }
    }, [modalChange])

    return (
        <>
            <PageTitle title="유저 상세" />
            <div className="flex gap-3 items-start">
                <div className="flex-1">
                    <Card>
                        <FormGroup>
                            <FormLabel>이름</FormLabel>
                            <FormControl readOnly value={name} />
                        </FormGroup>
                        <FormGroup className="mt-3">
                            <FormLabel>이메일</FormLabel>
                            <FormControl readOnly value={email} />
                        </FormGroup>
                        <UserGroups list={userGroups} className="mt-3" />
                        <div className="mt-3">
                            <FormLabel>타임존</FormLabel>
                            <FormSelect options={timeZones} value={timeZone} onChange={onChangeTimeZone} readOnly
                                        className="form-input" />
                        </div>
                    </Card>
                    <div className="mt-3">
                        <Button outline onClick={() => router.push('/admin/users')}>목록</Button>
                    </div>
                </div>
                <div className="flex-initial">
                    <Card>
                        <FormLabel>생성일</FormLabel>
                        <span className="text-sm text-gray-400">{dayFormat(createdAt)}</span>
                        <div className="mt-3">
                            <FormLabel>활성화</FormLabel>
                            <FormSwitch checked={active} onChange={handleChangeSwitch} />
                        </div>
                    </Card>
                    <Card className="mt-3">
                        <UserPassword id={id} setModalChange={setModalChange} />
                    </Card>
                    <Card className="mt-3">
                        <UserAuthority user={user} setModalChange={setModalChange} />
                    </Card>
                </div>
                <ModalBox state={isVisible} modalConf={modalConf} />
            </div>
        </>
    )
}

const UserGroups = ({ list, className }) => {
    const [{ groups, positions }, setData] = useState({
        groups: [],
        positions: [],
    })
    useEffect(() => {
        const handleData = async () => {
            const { data: groups } = await axios.get('/backapi/admin/groups')
            const { data: positions } = await axios.get('/backapi/admin/positions')

            setData({
                groups: groups.map(v => ({ id: v.id, text: v.name })),
                positions: positions.map(v => ({ id: v.id, text: v.name })),
            })
        }
        handleData()
    }, [])

    return (
        <div className={className}>
            <FormLabel>부서 / 직급</FormLabel>
            <ul>
                {list.map((v, i) => (
                    <li className="flex gap-3 mt-2" key={i}>
                        <FormSelect
                            name="group"
                            options={groups}
                            value={v.groupId}
                            readOnly
                            className="flex-1 form-input"
                        />
                        <FormSelect
                            name="positions"
                            options={positions}
                            value={v.positionId}
                            readOnly
                            className="flex-1 form-input"
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

const UserPassword = ({ id, setModalChange }) => {
    const [inputData, validated, { onChange, submit, reset }] = useForm({
        password: '',
    })
    const { password } = inputData

    const handleRightButton = () => {
        setIsVisible(false)
    }
    const rightButton = ({
        title: 'Confirm',
        onClick: handleRightButton,
    })

    const changePassword = () => {
        axios.patch(`/backapi/admin/users/${id}/password`, inputData)
            .then((res) => {
                if (res.status === 200) {
                    setModalChange({
                        modal: 'SUCCESS',
                        state: true,
                    })
                }
            })
            .catch((e) => {
                if (e.response.status < 500) {
                    setModalChange({
                        modal: 'FAILED',
                        state: true,
                    })
                }
            })
    }

    const [pwdInvalid, setPwdInvalid] = useState(false)
    const onChangeWithPassword = (e) => {
        onChange(e)
        const isValid = e.target.checkValidity()
        setPwdInvalid(!isValid)
    }

    return (
        <Form validated={validated} onSubmit={e => submit(e, changePassword)}>
            <FormGroup>
                <FormLabel>새 비밀번호</FormLabel>
                <FormControl name="password" type="password"
                             value={password}
                             pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                             onChange={onChangeWithPassword}
                             invalid={pwdInvalid} />
                <Feedback>Enter 6 or more characters,
                    <br />including letters and numbers.
                </Feedback>
            </FormGroup>
            <Button outline type="submit" className="mt-3">재설정</Button>
        </Form>
    )
}

const UserAuthority = ({ user, setModalChange }) => {
    const [{ role }, validated, { onChange, submit, reset }] = useForm({
        role: '',
    })

    const [data, setData] = useState({
        role: role,
    })

    const handleSubmitButton = (e) => {
        axios.patch(`/backapi/admin/users/${user.id}/role`, data)
            .then((res) => {
                if (res.status === 200) {
                    setModalChange({
                        modal: 'SUCCESS',
                        state: true,
                    })
                }
            })
            .catch((e) => {
                if (e.response.status < 500) {
                    setModalChange({
                        modal: 'FAILED',
                        state: true,
                    })
                }
            })
    }

    const onChangeRole = (e) => {
        onChange(e)
        setData({
            role: e.target.value,
        })
    }

    return (
        <Form validated={validated} onSubmit={e => submit(e, handleSubmitButton)}>
            <FormGroup>
                <FormLabel>권한</FormLabel>
                <FormSelect name="role" value={role} options={ROLES}
                            onChange={onChangeRole} className="form-input" />
            </FormGroup>
            <Button outline type="submit" className="mt-3">재설정</Button>
        </Form>
    )
}

/* Server-Side Rendering */
export const getServerSideProps = async ({ params }) => {
    const { data } = await axios.get(`/backapi/admin/users/${params.id}/detail`)

    return {
        props: {
            ...data,
        },
    }
}

export default UserDetail
