import { useMemo, useState } from "react";
import axios from "../../../lib/axios";
import { dayFormat } from "../../../lib/dayjs";
import PageTitle from "../../../components/PageTitle";
import Card from "../../../components/Card";
import Search from "../../../components/Search";
import NoData from "../../../components/NoData";

const Groups = ({ data: list }) => {
    const groupMap = {}
    list.forEach(v => {
        groupMap[v.id] = v.name
    })

    const [keyword, setKeyword] = useState('')
    const search = (text) => {
        setKeyword(text)
    }

    const newList = useMemo(() => {
        return list.filter(v => v.name.includes(keyword))
    }, [keyword])

    return (
        <>
            <PageTitle title="부서 목록" />
            <Card>
                <header className="flex items-center">
                    <div className="flex-none mr-8">
                        <span className="text-xs font-bold text-gray-400">total: {list.length}</span>
                    </div>
                    <div className="flex-initial ml-auto">
                        <Search value={keyword} placeholder="keyword" onSearch={search} />
                    </div>
                </header>
                <table className="table table-board mt-3">
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>이름</th>
                        <th>경로</th>
                        <th>생성일</th>
                        <th>수정일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {newList.length > 0
                        ? newList.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.pathways.map(id => groupMap[id]).join(' > ')}</td>
                                <td>{dayFormat(item.createdAt)}</td>
                                <td>{dayFormat(item.updatedAt)}</td>
                            </tr>
                        ))
                        : <NoData colSpan={5} />}
                    </tbody>
                </table>
            </Card>
        </>
    )
}

export const getServerSideProps = async () => {
    const { data } = await axios.get('/backapi/admin/groups')

    return {
        props: {
            data,
        }
    }
}

export default Groups;
