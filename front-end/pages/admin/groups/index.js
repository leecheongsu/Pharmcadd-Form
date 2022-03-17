import axios from '../../../lib/axios'
import PageTitle from '../../../components/PageTitle'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import { useState } from 'react'
import FormLabel from '../../../components/FormLabel'
import FormGroup from '../../../components/FormGroup'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid'
import FormSelect from '../../../components/FormSelect'

const Groups = ({ groups, groupTree, groupMap }) => {
    const groupOptions = groups.map((data) => ({
        id: data.id,
        text: data.name,
    }))

    const [isInfoVisible, setIsInfoVisible] = useState(false)

    const [groupInfo, setGroupInfo] = useState({
        users: [],
        name: '',
        parentId: 0,
    })

    const handleGroupInfoButton = async (id) => {
        setIsInfoVisible(isInfoVisible === false)
        const { data: groupUsers } = await axios.get(`/backapi/admin/groups/${id}/users`)

        setGroupInfo({
            ...groupInfo,
            users: groupUsers,
        })
    }

    const [parentGroup, setParentGroup] = useState(groupInfo.parentId)

    const onChangeParentGroup = (e) => {
        const { value } = e.target
        setParentGroup(value)

        console.log(value)
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
                    <div className="flex-none">
                        <Card>
                            <div>
                                <FormGroup>
                                    <FormLabel>부서 직원 목록</FormLabel>
                                    {groupInfo.users.map(v =>
                                        (<>
                                            <FormLabel>-{v.name}</FormLabel>
                                        </>))
                                    }
                                </FormGroup>
                            </div>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <div className="mt-3">
                                <FormGroup>
                                    <FormLabel>부서 변경</FormLabel>
                                    <FormSelect
                                        name="parentGroup"
                                        value={parentGroup}
                                        onChange={onChangeParentGroup}
                                        options={groupOptions}
                                        className="form-input"
                                    />
                                </FormGroup>
                            </div>
                        </Card>
                    </div>
                </>
                }
            </div>
            }
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
