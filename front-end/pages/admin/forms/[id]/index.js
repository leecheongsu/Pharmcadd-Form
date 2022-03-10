import axios from '../../../../lib/axios'
import { INPUT_TYPE_OF_QUESTION_MAP, QUESTION_TYPE } from '../../../../assets/data'
import PageTitle from '../../../../components/PageTitle'
import Card from '../../../../components/Card'
import FormControl from '../../../../components/FormControl'
import FormSelect from '../../../../components/FormSelect'
import FormCheck from '../../../../components/FormCheck'
import LinkButton from '../../../../components/Link'

const NEW_QUESTION_TYPE = QUESTION_TYPE.map((v, i) => ({
    ...(i === 0 ? { selected: true } : {}),
    id: v.value,
    text: v.label,
}))

const FormDetail = ({ id, title, description, questions }) => {
    return (
        <>
            <PageTitle title="양식 상세" />
            <Card>
                <h3 className="font-medium text-xl text-gray-700">{title}</h3>
                {description &&
                <p className="text-sm text-gray-500 mt-2" dangerouslySetInnerHTML={{ __html: description.replace('\n', '<br />') }} />}
            </Card>

            {questions.map((v, i) => (
                <Question {...v} key={i} />
            ))}

            <div className="flex mt-3">
                <LinkButton href="/admin/forms" outline className="mr-auto">목록</LinkButton>
                <LinkButton href={`/admin/campaigns/create?formId=${id}`}>발송하기</LinkButton>
            </div>
        </>
    )
}

const Question = ({ id, title, type, options }) => {
    return (
        <Card className="my-3">
            <div className="flex gap-3">
                <h4 className="font-medium text-gray-600 w-4/5">{title}</h4>
                <FormSelect
                    name="type"
                    value={type}
                    options={NEW_QUESTION_TYPE}
                    className="form-input w-1/5"
                />
            </div>

            {/* START: 옵션 */}
            <div className="mt-2">
                {['CHOICE_SINGLE', 'CHOICE_MULTIPLE'].includes(type) && <ul>
                    {options.map(v => (
                        <li className="mb-2" key={v.id}>
                            <FormCheck name={`q${id}`} type={INPUT_TYPE_OF_QUESTION_MAP[type]} label={v.text} />
                        </li>
                    ))}
                </ul>}
                {type === 'TEXT_SHORT' && <FormControl placeholder="답변" />}
                {type === 'TEXT_LONG' && <FormControl as="textarea" rows="3" />}
            </div>
            {/* END: 옵션 */}
        </Card>
    )
}

export const getServerSideProps = async ({ params }) => {
    const { data } = await axios.get(`/backapi/admin/forms/${params.id}/detail`)

    return {
        props: {
            ...data,
        },
    }
}

export default FormDetail
