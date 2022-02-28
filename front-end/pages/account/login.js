import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import useForm from "../../hooks/useForm";
import Card from '../../components/Card';
import Form from "../../components/Form";
import FormGroup from "../../components/FormGroup";
import FormLabel from "../../components/FormLabel";
import FormControl from "../../components/FormControl";
import Feedback from "../../components/Feedback";
import Button from "../../components/Button";
import ModalBox from "../../components/modal/ModalBox";

const Login = () => {
    const router = useRouter();
    const [{ username, password }, validated, { onChange, reset, submit }] = useForm({
        username: '',
        password: '',
    });

    const login = () => {
        return axios.post('/api/login', { username, password })
            .then(() => {
                if (router.query.redirect) {
                    router.replace(router.query.redirect)
                } else {
                    router.replace('/campaigns')
                }
            }).catch(err => {
                reset()
                /* TODO : ErrorHandler */
            })
    };

    const [isModal, setIsModal] = useState(null)

    const handleChangeModal = () => {
        setIsModal(false)
    }

    const rightButton = ({
        title : 'Confirm',
        onClick : handleChangeModal
    })

    const [modalConf, setModalConf] = useState({
        title : '',
        content : '',
        blindFilter : true,
        handleRightButton : null
    })

    useEffect(() => {
        if(router.query.result) {
            if( router.query.result === 'failed') {
                setModalConf({
                    title : 'Failed',
                    content : 'Join Failed',
                    blindFilter : true,
                    handleRightButton : rightButton
                })
                setIsModal(true)
            } else {
                setModalConf({
                    title : 'Success',
                    content : 'Join Completed',
                    blindFilter : true,
                    handleRightButton : rightButton
                })
                setIsModal(true)
            }
        }
    }, [])

    return (
        <Card className="login_box mb-0 mx-5">
            <Form validated={validated} onSubmit={e => submit(e, login)}>
                <FormGroup>
                    <FormLabel>ID</FormLabel>
                    <FormControl
                        type="email"
                        name="username"
                        placeholder="your_id@pharmcadd.com"
                        pattern=".+@pharmcadd\.com"
                        required
                        value={username}
                        onChange={onChange}
                    />
                    <Feedback>Enter your company email account.</Feedback>
                </FormGroup>
                <FormGroup className="mt-3">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={onChange}
                    />
                    <Feedback>Enter your password.</Feedback>
                </FormGroup>

                <div className="text-right">
                    <Button href="/account/find-pw" className="btn btn_link text-sm p-0">Forgot password?</Button>
                </div>
                <Button type="submit" className="btn btn_block mt-3">Login</Button>
            </Form>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p className="text-center text-xs text-gray-400 mt-4">Don't have an account</p>
            <div className="text-center mt-2">
                <Button href="/account/sign-up" className="btn btn_outline btn_block">Sign up</Button>
            </div>
            <ModalBox state={isModal} modalConf={modalConf}/>
        </Card>
    );
}

export default Login;
