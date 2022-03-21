import axios from '../../../lib/axios'
import PageTitle from '../../../components/PageTitle'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import { useState } from 'react'
import FormLabel from '../../../components/FormLabel'
import FormGroup from '../../../components/FormGroup'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid'
import FormSelect from '../../../components/FormSelect'
import ModalBox from '../../../components/modal/ModalBox'
import { useRouter } from 'next/router'
import FormControl from '../../../components/FormControl'

const Groups = ({ groups, groupTree, groupMap }) => {
    const router = useRouter()
    const groupOptions = groups.map((data) => ({
        id: data.id,
        text: data.name,
    }))

    const [isInfoVisible, setIsInfoVisible] = useState(false)

    const [groupInfo, setGroupInfo] = useState({
        users: [],
        id: 0,
        name: '',
        parentId: 0,
    })

    const handleGroupInfoButton = async (id) => {
        setIsInfoVisible(isInfoVisible === false)
        const { data: groupUsers } = await axios.get(`/backapi/admin/groups/${id}/users`)
        const { name, parentId } = groupMap[id]

        setGroupInfo({
            ...groupInfo,
            id: id,
            name: name,
            users: groupUsers,
            parentId: parentId,
        })
    }

    const onChangeGroupName = (e) => {
        const { value } = e.target
        setGroupInfo(prev => ({
            ...prev,
            name: value,
        }))
    }

    const onChangeParentGroup = (e) => {
        const { value } = e.target
        setGroupInfo(prev => ({
            ...prev,
            parentId: value,
        }))
    }

    const [isModal, setIsModal] = useState(false)
    const [modalConf, setModalConf] = useState({})
    const [disabled, setDisabled] = useState(true)

    const closeModal = () => {
        setIsModal(false)
    }

    const handleDisabledButton = () => {
        setDisabled(false)
        closeModal()
    }

    const handleUpdateParentIdButton = () => {
        setModalConf({
            content: '조직도에서 부서의 소속을 변경하시겠습니까?',
            blindFilter: true,
            handleLeftButton: {
                title: '아니요',
                onClick: () => closeModal(),
            },
            handleRightButton: {
                title: '예',
                onClick: () => handleDisabledButton(),
            },
        })
        setIsModal(true)
    }

    const handleConfirmButton = async () => {
        const { id, name, parentId } = groupInfo
        await axios.put(`/backapi/admin/groups/${id}`, { name: name, parentId: parentId })
            .then((res) => {
                if (res.status === 200) {
                    router.reload()
                }
            })
    }

    const [readOnly, setReadOnly] = useState(true)

    const handleReadOnlyButton = () => {
        setReadOnly(false)
        closeModal()
    }

    const handleUpdateNameButton = () => {
        setModalConf({
            content: '부서명을 변경하시겠습니까?',
            blindFilter: true,
            handleLeftButton: {
                title: '아니요',
                onClick: () => closeModal(),
            },
            handleRightButton: {
                title: '예',
                onClick: () => handleReadOnlyButton(),
            },
        })
        setIsModal(true)
    }

    const handleDelete = () => {
        const { id } = groupInfo
        axios.delete(`/backapi/admin/groups/${id}`)
            .then((res) => {
                if (res.status === 200) {
                    router.reload()
                }
            })
    }

    const handleDeleteGroupButton = () => {
        setModalConf({
            content: '정말로 삭제하시겠습니까?',
            handleLeftButton: {
                title: '아니요',
                onClick: () => closeModal(),
            },
            handleRightButton: {
                title: '예',
                onClick: () => handleDelete(),
            },
        })
        setIsModal(true)
    }

    const GroupItem = ({ id = 1 }) => {
        const [isSpread, setIsSpread] = useState(true)

        const item = { ...groupMap[id] }
        const groupChild = groupTree[id]

        const handleSpreadButton = () => {
            setIsSpread(isSpread !== true)
        }

        return (
            <>
                <div className="flex items-center mb-1">
                    <Button icon onClick={() => handleSpreadButton()}>
                        {groupChild && (
                            <>
                                {isSpread === true ?
                                    <ChevronDownIcon className="w-5 h-5" />
                                    : <ChevronRightIcon className="w-5 h-5" />
                                }
                            </>
                        )}
                    </Button>
                    <span className="text-sm cursor-pointer" onClick={() => handleGroupInfoButton(item.id)}>{item.name}</span>
                    {groupChild && <Button
                        link
                        className="text-xs p-0 ml-2">
                    </Button>}
                </div>
                {isSpread && groupChild && <div className="ml-7 mb-1">
                    {groupChild.map((childId, i) => (
                        <GroupItem id={childId} key={i} />
                    ))}
                </div>}
            </>
        )
    }

    return (
        <>
            <PageTitle title="부서 목록" />
            {groupTree &&
            <div className="flex flex-nowrap gap-3 mt-3">
                <Card className="flex-none pr-9">
                    <GroupItem />
                </Card>
                {isInfoVisible &&
                <>
                    {/*<div className="flex-none">*/}
                    {/*    <Card>*/}
                    {/*        <div>*/}
                    {/*            <FormGroup>*/}
                    {/*                <FormLabel>부서 직원 목록</FormLabel>*/}
                    {/*                {groupInfo.users.map(v =>*/}
                    {/*                    (<>*/}
                    {/*                        <FormLabel>-{v.name}</FormLabel>*/}
                    {/*                    </>))*/}
                    {/*                }*/}
                    {/*            </FormGroup>*/}
                    {/*        </div>*/}
                    {/*    </Card>*/}
                    {/*</div>*/}
                    <div>
                        <div className="flex gap-3 items-start">
                            <div className="flex-1">
                                <Card>
                                    <FormGroup>
                                        <FormLabel>부서명</FormLabel>
                                        <FormControl
                                            name="name"
                                            value={groupInfo.name}
                                            readOnly={readOnly}
                                            onChange={onChangeGroupName}
                                        />
                                    </FormGroup>
                                    {readOnly === true
                                        ? <Button className="btn_outline mt-3" onClick={() => handleUpdateNameButton()}>수정</Button>
                                        : <Button className="btn_outline mt-3" onClick={() => handleConfirmButton()}>확인</Button>
                                    }
                                </Card>
                            </div>
                            <div className="flex-initial">
                                <Card>
                                    <FormGroup>
                                        <FormLabel>부서 소속</FormLabel>
                                        <FormSelect
                                            name="parentGroup"
                                            value={groupInfo.parentId}
                                            onChange={onChangeParentGroup}
                                            options={groupOptions}
                                            className="form-input"
                                            disabled={disabled}
                                        />
                                        {/*    disabled추가 할 것. 수정 버튼 모달 창 후 확인 후 수정가능하도록 */}
                                    </FormGroup>
                                    {disabled === true
                                        ? <Button className="btn_outline mt-3" onClick={() => handleUpdateParentIdButton()}>수정</Button>
                                        : <Button className="btn_outline mt-3" onClick={() => handleConfirmButton()}>확인</Button>
                                    }
                                </Card>
                            </div>
                        </div>
                    </div>
                </>
                }
            </div>
            }
            {isInfoVisible &&
            <>
                <div className="mt-3">
                    <Button className="btn_outline" onClick={() => handleDeleteGroupButton()}>삭제</Button>
                </div>
            </>
            }
            <ModalBox state={isModal} modalConf={modalConf} />
        </>
    )
}

export const getServerSideProps = async () => {
    const { data: groups } = await axios.get('/backapi/admin/groups')

    const groupTree = {}
    const groupMap = {}

    groups.forEach((v) => {
        const parentId = v.parentId === null ? 0 : v.parentId
        if (parentId === 0) {
            groupTree[parentId] = [v.id]
        } else {
            groupTree[parentId] ? groupTree[parentId].push(v.id) : (groupTree[parentId] = [v.id])
        }
        groupMap[v.id] = { ...v }
    })

    return {
        props: {
            groups: groups,
            groupTree: groupTree,
            groupMap: groupMap,
        },
    }
}

export default Groups
