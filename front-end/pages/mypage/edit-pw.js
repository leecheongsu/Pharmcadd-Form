import Card from '../../components/Card'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import axios from '../../lib/axios'
import ToastBox from '../../components/modal/ToastBox'
import FormControl from '../../components/FormControl'
import FormGroup from '../../components/FormGroup'
import FormLabel from '../../components/FormLabel'
import Feedback from '../../components/Feedback'
import Form from '../../components/Form'
import useForm from '../../hooks/useForm'

export const getServerSideProps = async () => {
    return {
        props: {
            title: 'Reset Password',
        },
    }
}

const EditPw = () => {
    const router = useRouter()

    const [isVisible, setIsVisible] = useState(false)
    const onSetIsVisible = (active) => {
        setIsVisible(active)
    }

    const [toastData, setToastData] = useState({})

    const [{ password, newPassword, confirmPassword }, validated, { onChange, reset, submit }] = useForm({
        password: '',
        newPassword: '',
        confirmPassword: '',
    })

    async function handleNextButton() {
        await axios.patch('/backapi/users/self/password', { password: password, newPassword: newPassword })
            .then((res) => {
                if (res.status === 200) {
                    setToastData({
                        type: 'info',
                        message: 'complete password reset :)',
                        blindFilter: true,
                        autoClose: false,
                    })
                }
                onSetIsVisible(true)
            })
            .catch((e) => {
                if (e.response.status < 500) {
                    setToastData({
                        type: 'warning',
                        message: 'you entered incorrect password. try again!',
                        blindFilter: true,
                        autoClose: false,

                    })
                }
                onSetIsVisible(true)
            })
    }

    const handleToast = () => {
        setIsVisible(false)

        if (toastData.type === 'info') {
            router.back()
        } else {
            reset()
        }
    }

    const [invalid, setInvalid] = useState(false)

    const onChangeWithInvaildCheck = (e) => {
        onChange(e)
        const isValid = e.target.checkValidity()
        setInvalid(!isValid)
    }

    return (
        <div className="p-3">
            <Card className="campaign">
                <Form validated={validated} onSubmit={e => submit(e, handleNextButton)}>
                    <FormGroup className="mt-3">
                        <FormLabel>Password</FormLabel>
                        <FormControl
                            type="password"
                            name="password"
                            required
                            value={password}
                            onChange={onChange}
                        />
                        <Feedback>Please enter a password.</Feedback>
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <FormLabel>New Password</FormLabel>
                        <FormControl
                            type="password"
                            name="newPassword"
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                            required
                            value={newPassword}
                            onChange={e => onChangeWithInvaildCheck(e)}
                            invalid={invalid}
                        />
                        <Feedback>Enter 6 or more characters, including letters and numbers.</Feedback>
                    </FormGroup>

                    <FormGroup className="mt-3">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl
                            type="password"
                            name="confirmPassword"
                            required
                            pattern={newPassword}
                            value={confirmPassword}
                            onChange={onChange}
                        />
                        <Feedback>Passwords do not match.</Feedback>
                    </FormGroup>
                    <button type="submit" className="btn btn_block btn_outline mt-3">
                        Confirm
                    </button>
                </Form>
                <div>
                    <ToastBox state={isVisible} toastOnChange={handleToast} toastConf={toastData} />
                </div>
            </Card>
        </div>
    )
}

export default EditPw
