import Card from "../../components/Card";
import React, {useRef, useState} from "react";
import axios from "../../lib/axios";
import {useRouter} from "next/router";
import Form from "../../components/Form";
import FormLabel from "../../components/FormLabel";
import FormGroup from "../../components/FormGroup";
import FormControl from "../../components/FormControl";
import Feedback from "../../components/Feedback";
import Link from "../../components/Link";
import useForm from "../../hooks/useForm";
import ModalBox from "../../components/modal/ModalBox";

const FindPw = () => {
    const router = useRouter();
    const [{email, code, password, passwordConfirm}, validated, {submit, onChange, reset}] = useForm({
        email: '',
        code: '',
        password: '',
        passwordConfirm: '',
    })

    const sendCodeActivate = useRef(false)
    const [emailInvalid, setEmailInvalid] = useState(null)
    const onChangeWithEmailCheck = (e) => {
        onChange(e)
        const isValid = e.target.checkValidity()
        setEmailInvalid(!isValid)
        sendCodeActivate.current = true
    }

    const [inputCode, setInputCode] = useState({
        isSend: false,
        isComplete: false
    })

    const handleRightButton = () => {
        setIsModal(false)
    }

    const rightButton = ({
        title : 'Confirm',
        onClick : handleRightButton
    })

    const sendCode = async (value) => {
        setInputCode(prev => ({...prev, isSend: true}))
        await axios.post('/backapi/valid-code', {email: value})
            .then((res) => {
                if(res.status === 200) {
                    setIsModal(true)
                    setModalConf({
                        title : 'Success',
                        content : 'Send Completed',
                        blindFilter : true,
                        handleRightButton : rightButton
                    })
                }
            })
            .catch((e) => {
                if(e.response.status < 500) {
                    setIsModal(true)
                    setModalConf({
                        title : 'Fail',
                        content : 'Send Failed',
                        blindFilter : true,
                        handleRightButton : rightButton
                    })
                }
            })
    }

    const [codeInvalid, setCodeInvalid] = useState(null)
    const onChangeWithVerification = (e) => {
        onChange(e)
        const isValid = e.target.checkValidity()
        setCodeInvalid(!isValid)
        if(isValid) {
           verificationCode(e.target.value)
        }
    }

    const verificationCode = async (code) => {
        await axios.post('/backapi/valid-code/confirm', {email: email, code: code})
            .then((res) => {
                if(res.status === 200) {
                    setModalConf({
                        title : 'Success',
                        content : 'Authenticate Code Done',
                        blindFilter : true,
                        handleRightButton : rightButton
                    })
                    setIsModal(true)
                    setInputCode(prev => ({...prev, isComplete: true}))
                }
            })
            .catch((e) => {
                if(e.response.status < 500) {
                    setModalConf({
                        title : 'Failed',
                        content : 'Authenticate Code Deny',
                        blindFilter : true,
                        handleRightButton : rightButton
                    })
                    setIsModal(true)
                }
            })

    }

    const [pwdInvalid, setPwdInvalid] = useState(null)
    const onChangeWithPassword = (e) => {
        onChange(e)
        const isValid = e.target.checkValidity()
        setPwdInvalid(!isValid)
    }

    const [pwdConfirmInvalid, setPwdConfirmInvalid] = useState(null)
    const onChangePasswordConfirm = (e) => {
        onChange(e)
        const isValid = e.target.checkValidity()
        setPwdConfirmInvalid(!isValid)
    }

    const [isModal, setIsModal] = useState(null)
    const [modalConf, setModalConf] = useState({
        title : '',
        content : '',
        blindFilter : false,
        handleRightButton : []
    })

    async function handleSubmit() {
        await axios.patch('/backapi/password/reset', {email: email, code: code, newPassword: password})
            .then(async (res) => {
                if(res.status === 200) {
                    await router.push('/account/login?reset=succeeded')
                }
            })
            .catch(async (e) => {
                if(e.response.status < 500) {
                    await router.push('/account/login?reset=failed')
                }
            })
    }

    return (
        <Card className="signup-box mb-0 mx-5">
            <h2 className="pw-text">Reset password</h2>
            <Form validated={validated} onSubmit={e => submit(e, handleSubmit)}>
                <FormGroup>
                    <FormLabel>Email</FormLabel>
                    <FormControl
                        type="email"
                        name="email"
                        placeholder="your_id@pharmcadd.com"
                        pattern=".+@pharmcadd\.com"
                        required
                        value={email}
                        onChange={onChangeWithEmailCheck}
                        invalid={emailInvalid}
                    />
                    <Feedback>Enter your company email account.</Feedback>
                </FormGroup>
                {!inputCode.isComplete &&
                <div className="text-right">
                    <button type="button" onClick={() => sendCode(email)} className="btn_link text-xs"
                            disabled={!sendCodeActivate.current}>
                        {inputCode.isSend ? 'Resend code' : 'Send code'}
                    </button>
                </div>
                }
                {inputCode.isSend && !inputCode.isComplete &&
                <FormGroup>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl
                        type="password"
                        name="code"
                        required
                        value={code}
                        onChange={onChangeWithVerification}
                        pattern="[0-9]{6}"
                        minLength="6"
                        maxLength="6"
                        invalid={codeInvalid}
                    />
                    <Feedback>Enter a six-digit numbers.</Feedback>
                </FormGroup>
                }
                <FormGroup className="mt-3">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        type="password"
                        name="password"
                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                        required
                        value={password}
                        onChange={onChangeWithPassword}
                        invalid={pwdInvalid}
                    />
                    <Feedback>Enter 6 or more characters, including letters and numbers.</Feedback>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl
                        type="password"
                        name="passwordConfirm"
                        required
                        value={passwordConfirm}
                        onChange={onChangePasswordConfirm}
                        pattern={password}
                        invalid={pwdConfirmInvalid}
                    />
                    <Feedback>Passwords do not matched.</Feedback>
                </FormGroup>
                    <button type="submit" className="btn btn_block mt-5">Reset</button>
                    <div className="text-right mt-4">
                        <span className="text-sm text-gray-400 mr-2">Don&apos;t you have an account?</span>
                        <Link href="/account/sign-up">
                            <a className="btn btn_link text-sm p-0">Sign up</a>
                        </Link>
                    </div>
            </Form>
            <ModalBox state={isModal} modalConf={modalConf}/>
        </Card>
    )
}

export default FindPw;
