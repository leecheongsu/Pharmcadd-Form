import Card from '../../components/Card'
import axios from '../../lib/axios'
import { useRouter } from 'next/router'
import FormInput from '../../components/form-input'

const MemberDetails = ({ data }) => {
    const router = useRouter()

    const handleNextClickButton = () => {
        router.push('/mypage/edit-pw')
    }

    const position = data.groups.map((v) => v.positionName)
    const setPosition = new Set(position)

    return (
        <div className="p-3">
            <Card className="campaign">
                <form>
                    <FormInput
                        label="Name"
                        name="name"
                        value={data.user.name}
                        className="form-input-plaintext mt-3"
                    />
                    <FormInput
                        label="Email"
                        name="email"
                        value={data.user.email}
                        className="form-input-plaintext mt-3"
                    />

                    <FormInput
                        label="Groups"
                        name="groups"
                        value={data.groups.map((v) => v.groupName).join(',')}
                        className="form-input-plaintext mt-3"
                    />
                    <FormInput
                        label="Positions"
                        name="position"
                        value={[...setPosition]}
                        className="form-input-plaintext mt-3"
                    />
                    <FormInput
                        label="WorkAt"
                        name="workAt"
                        value={data.timezone.country}
                        className="form-input-plaintext mt-3"
                    />
                    <button type="button" className="btn btn_block btn_outline mt-3" onClick={handleNextClickButton}>Reset Password</button>
                </form>
            </Card>
        </div>
    )
}

export const getServerSideProps = async ({ req, res }) => {
    const { data } = await axios.get('/backapi/users/self')
    return {
        props: {
            data: data,
            title: 'Profile',
        },
    }
}

export default MemberDetails
