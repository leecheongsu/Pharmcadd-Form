import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '../../../../lib/axios'
import { dayFormat } from '../../../../lib/dayjs'
import { time2string } from '../../../../utils/time'
import PageTitle from '../../../../components/PageTitle'
import Card from '../../../../components/Card'
import Badge from '../../../../components/Badge'
import FormSwitch from '../../../../components/FormSwitch'

const FormSchedules = ({ data }) => {
    const router = useRouter()
    const [timeZonesMap, setTimeZonesMap] = useState(null)
    useEffect(() => {
        const handleTimeZones = async () => {
            const { data: timeZones } = await axios.get('/backapi/time-zones')
            const map = {}
            timeZones.forEach(v => {
                map[v.id] = { ...v }
            })
            setTimeZonesMap(map)
        }
        handleTimeZones()
    }, [])

    const [list, setList] = useState(data)
    const handleChangeSwitch = (e) => {
        const { name: i, value: scheduleId, checked } = e.target
        const { id } = router.query

        return axios.patch(`/backapi/admin/forms/${id}/schedules/${scheduleId}/${checked ? 'active' : 'inactive'}`)
            .then(() => {
                const newList = [...list]
                newList.splice(i, 1, { ...list[i], active: checked })
                setList(newList)
            })
            .catch(() => {
                axios.get(`/backapi/admin/forms/${id}/schedules`)
                    .then(({ data }) => {
                        setList(data)
                    })
            })
    }

    return (
        <>
            <PageTitle title="스케줄링 목록" />
            <header>
                <span className="text-xs font-bold text-gray-400">total: {list.length}</span>
            </header>
            <div className="flex flex-wrap gap-3 mt-3">
                {timeZonesMap && list.sort((a, b) => a.id - b.id)
                    .map((item, i) => (<Card className="w-1/4 text-sm" key={item.id}>
                        <div className="flex items-center">
                            <Badge text="xs">{item.type}</Badge>
                            <Badge text="xs" className="ml-1">{timeZonesMap[item.timeZoneId].country}</Badge>
                            <FormSwitch
                                sm
                                name={i}
                                value={item.id}
                                checked={item.active}
                                onChange={handleChangeSwitch}
                                className="ml-auto"
                            />
                        </div>
                        <div className="mt-3 h-12">
                            {item.type === 'CRON'
                                ? <>
                                    <div>Cron : {item.cronExpression}</div>
                                    <div>Duration : {time2string(item.cronDuration)}</div>
                                </>
                                : <>
                                    <div>Start : {item.startsAt}</div>
                                    {item.endsAt && <div>End: {item.endsAt}</div>}
                                </>
                            }
                        </div>
                        <span className="text-xs text-gray-400">{dayFormat(item.createdAt)}</span>
                    </Card>))}
            </div>
        </>
    )
}

/* Server-Side Rendering */
export const getServerSideProps = async ({ params }) => {
    const { data } = await axios.get(`/backapi/admin/forms/${params.id}/schedules`)

    return {
        props: {
            data,
        },
    }
}

export default FormSchedules
