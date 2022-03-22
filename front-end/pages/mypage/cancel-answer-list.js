import Card from '../../components/Card'
import FormLabel from '../../components/FormLabel'
import axios from '../../lib/axios'
import FormGroup from '../../components/FormGroup'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import DateRange from 'react-date-range/dist/components/DateRange'
import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import FormSelect from '../../components/FormSelect'
import { CANCEL_ANSWER_STATUS } from '../../assets/data'
import FormControl from '../../components/FormControl'
import dayjs from 'dayjs'
import classNames from 'classnames'

const CancelAnswerList = ({ total, content, params: initOptions }) => {

    const [options, setOptions] = useState({
        ...initOptions,
    })

    const [data, setData] = useState({
        total: total,
        content: content,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        const params = { ...options }
        const { data: { total, content } } = await axios.get('/backapi/users/self/answer-cancels', { params })

        setData({
            total: total,
            content: content,
        })

    }, [options])

    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }])

    const [isSpread, setIsSpread] = useState(false)

    const handleSelectButton = () => {
        setIsSpread(!isSpread)
    }

    const onChange = (e) => {
        const { name, value } = e.target
        setOptions(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const onChangeDateRange = (item) => {
        setState([item.selection])
        setOptions(prev => ({
            ...prev,
            rangeFrom: dayjs([item.selection.startDate]).format('YYYY-MM-DD'),
            rangeTo: dayjs([item.selection.endDate]).format('YYYY-MM-DD'),
        }))
    }

    return (
        <>
            <div className="p-3">
                <Card className="campaign">
                    <div>
                        <FormGroup>
                            <FormLabel>Select Options</FormLabel>
                            <FormSelect
                                name="status"
                                value={options.status}
                                className="form-input"
                                onChange={onChange}
                                options={CANCEL_ANSWER_STATUS}
                            />
                            <Button className="btn_link form-input" onClick={() => handleSelectButton()}>
                                Select Duration
                            </Button>
                            {isSpread === true &&
                            <DateRange
                                editableDateInputs={true}
                                onChange={item => onChangeDateRange(item)}
                                moveRangeOnFirstSelection={false}
                                ranges={state}
                            />
                            }
                        </FormGroup>
                    </div>
                </Card>
                <FormLabel className="ml-3 mt-3">Total : {data.total}</FormLabel>
                {data.content.length > 0 &&
                data.content.map((v, i) => (
                    <>
                        <Card className="campaign mt-3 flex">
                            <div className="mt-2">
                                <FormLabel className={classNames(
                                    v.status === 'REQUEST' ? 'badge-outline' : (
                                        v.status === 'APPROVE' ? 'badge-green' : 'badge-red'
                                    ), 'h-10 pt-2',
                                )}>{v.status}</FormLabel>
                            </div>
                            <div className="ml-3 mt-1">
                                <FormLabel>Date : {dayjs(v.createdAt).format('YYYY-MM-DD')}</FormLabel>
                                {v.status === 'REQUEST'
                                    ? <FormLabel className="mr-3">Reason : {v.reason}</FormLabel>
                                    : (v.status === 'APPROVE'
                                            ? <FormLabel className="mr-3 ">Answer : {v.answer}</FormLabel>
                                            : <FormLabel className="mr-3 badge-rose">Answer : {v.answer}</FormLabel>
                                    )}
                            </div>
                        </Card>

                    </>
                ))
                }
            </div>
        </>
    )
}

export const getServerSideProps = async () => {
    const params = ({
        status: 'REQUEST',
    })

    const { data: { total, content } } = await axios.get('/backapi/users/self/answer-cancels', { params })

    return {
        props: {
            title: 'Inquiry',
            total: total,
            content: content,
            params: params,
        },
    }
}

export default CancelAnswerList