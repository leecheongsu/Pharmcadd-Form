import Card from "../../components/Card";
import FormInput from "../../components/form-input";
import React, { useRef, useState } from "react";
import useInputs from "../../hooks/useInputs";
import useValidation from "../../hooks/useValidation";
import axios from "../../lib/axios";
import { useRouter } from "next/router";
import Link from "next/link";

const FindPw = () => {
    const router = useRouter();
    const [{ email, code, password, passwordConfirm }, onChange] = useInputs({
        email: '',
        code: '',
        password: '',
        passwordConfirm: ''
    })

    const [valid, validate, validateForm] = useValidation({
        email: {
            rules: [v => !!v, v => v.endsWith('@pharmcadd.com')],
            message: 'Enter your company email account.',
        },
        code: {
            rules: [v => !!v, v => v.match(/[0-9]{6}/)],
            message: 'Enter 6 digits.'
        },
        password: {
            rules: [v => !!v, v => v.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)],
            message: 'Enter 6 or more characters, including letters and numbers.',
        },
        passwordConfirm: {
            rules: [v => !!v, v => (v === comparePassword.current)],
            message: 'Passwords do not match.',
        }
    })

    const onChangeItem = (e) => {
        validate(e)
        onChange(e)
    }

    /* code */
    const [codeStatus, setCodeStatus] = useState({
        isSend: false,
        isError: false,
        message: 'Code does not match.'
    })
    const sendCode = (value) => {
        axios.post('/backapi/valid-code', { email: value }).then(() => {
            setCodeStatus(v => ({ ...v, isSend: true, isError: false }))
        })
    }
    const onChangeCode = (e) => {
        onChangeItem(e)
        setCodeStatus(v => ({ ...v, isError: false }))
    }

    /* password */
    const comparePassword = useRef(password); /* FIXME: 더 좋은 방법은? */
    const onChangePassword = (e) => {
        onChangeItem(e)
        comparePassword.current = e.target.value;
    }

    const handleSubmit = () => {
        axios.patch('/backapi/password', {
            email, code, password
        }).then(() => {
            /* TODO : 성공 모달 */
            router.push('/account/login')
        }).catch(err => {
            setCodeStatus(v => ({ ...v, isError: true }))
            /* TODO : ErrorHandler */
        })
    }

    return (
        <Card className="pw_box mb-0 mx-5">
            <form onSubmit={v => validateForm(v, handleSubmit)}>
                <h2 className="pw-text">Reset password</h2>
                <FormInput type="email" name="email" label="Email" placeholder="your_id@pharmcadd.com" err={valid.email.error}
                           value={email} onChange={onChangeItem} readonly={codeStatus.isSend} />
                <div className="text-right">
                    <button type="button" onClick={() => sendCode(email)} className="btn_link text-xs"
                            disabled={!email || valid.email.error}>{codeStatus.isSend ? 'Resend code' : 'Send code'}
                    </button>
                </div>

                <FormInput name="code" placeholder="Verification code" err={valid.code.error || (codeStatus.isError && codeStatus.message)}
                           value={code} onChange={onChangeCode} className="mt-2" />

                <FormInput type="password" name="password" label="Password" err={valid.password.error}
                           value={password} onChange={onChangePassword}
                           className="mt-5" />
                <FormInput type="password" name="passwordConfirm" label="Password confirm" err={valid.passwordConfirm.error}
                           value={passwordConfirm} onChange={onChangeItem} className="mt-2" />

                <button type="submit" className="btn btn_block mt-5">Reset the password</button>
                <div className="text-right mt-4">
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <span className="text-sm text-gray-400 mr-2">Don't have an account?</span>
                    <Link href="/account/sign-up">
                        <a className="btn btn_link text-sm p-0">Sign up</a>
                    </Link>
                </div>
            </form>
        </Card>
    )
}

export default FindPw;
