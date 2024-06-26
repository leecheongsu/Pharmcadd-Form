import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { ChevronRightIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/solid'
import axios from '../../lib/axios'
import { WORKPLACES } from '../../assets/data'
import { POLICY } from '../../assets/policy'
import Card from '../../components/Card'
import useForm from '../../hooks/useForm'
import FormGroup from '../../components/FormGroup'
import FormLabel from '../../components/FormLabel'
import FormControl from '../../components/FormControl'
import Feedback from '../../components/Feedback'
import Form from '../../components/Form'
import FormSelect from '../../components/FormSelect'
import FormCheck from '../../components/FormCheck'
import Button from '../../components/Button'
import ModalBox from '../../components/modal/ModalBox'
import LinkButton from '../../components/Link'

const SignUp = () => {
    const [{ code, name, password, email, placeOfWork, confirmPassword, policy }, validated, { onChange, submit, reset }] = useForm({
        code: '',
        name: '',
        password: '',
        confirmPassword: '',
        email: '',
        policy: false,
        placeOfWork: 'BUSAN', // default
    })

    const router = useRouter()
    const [step, setStep] = useState(0)
    const [validatedChange, setValidatedChange] = useState(validated)
    const nextStep = () => {
        setValidatedChange(false)
        setStep(step + 1)
    }

    const [positions, setPositions] = useState([])

    const [groups, setGroups] = useState(null)
    useEffect(() => {
        if (positions.isEmpty) {

        } else {
            setGroups(positions.map((data) => ({
                groupId: data.team,
                positionId: data.position,
            })))
        }
    }, [positions])

    useEffect(async () => {
        if (step >= 3) {
            await axios.post('/backapi/join', {
                code: code,
                name: name,
                username: email,
                password: password,
                email: email,
                timeZoneId: 1,
                groups: groups,
            })
                .then(async (res) => {
                    if (res.status === 200) {
                        await router.push('/account/login?result=succeeded')
                    }
                })
                .catch(async (e) => {
                    if (e.response.status < 500) {
                        await router.push('/account/login?result=failed')
                    }
                })
        }
    }, [step])

    const [isModal, setIsModal] = useState(false)
    const [modalConf, setModalConf] = useState({
        title: '',
        content: '',
        blindFilter: true,
        handleRightButton: null,
    })

    return (
        <Card className="signup-box mb-0 mx-5">
            <h2 className="signup-text">Sign up</h2>
            {step === 0
                ? <SignupStep1 email={email} password={password} code={code}
                               nextStep={nextStep} onChange={onChange} submit={submit} validated={validatedChange}
                               confirmPassword={confirmPassword} setIsModal={setIsModal} setModalConf={setModalConf} />
                : (step === 1
                        ? <SignupStep2 name={name} positions={positions} setPositions={setPositions}
                                       placeOfWork={placeOfWork} nextStep={nextStep} onChange={onChange} submit={submit}
                                       validated={validatedChange} />
                        : <SignupStep3 policy={policy} validated={validatedChange} onChange={onChange} submit={submit}
                                       nextStep={nextStep} />
                )
            }
            <ModalBox state={isModal} modalConf={modalConf} />
        </Card>
    )
}

function SignupStep1({ email, password, confirmPassword, code, nextStep, onChange, validated, submit, setIsModal, setModalConf }) {

    const [inputCode, setInputCode] = useState({
        isSend: false,
        isComplete: false,
        code: '',
    })

    const sendCodeActivate = useRef(false)
    const [emailInvalid, setEmailInvalid] = useState(null)
    const onChangeWithEmailCheck = (e) => {
        onChange(e)
        const isValid = e.target.checkValidity()
        setEmailInvalid(!isValid)
        sendCodeActivate.current = true
    }

    const handleRightButton = () => {
        setIsModal(false)
    }

    const rightButton = ({
        title: 'Confirm',
        onClick: handleRightButton,
    })

    const [emailDuplicate, setEmailDuplicate] = useState(false)
    const checkEmailAndSendCode = async (value) => {
        await axios.post('/backapi/valid-email', { email: value })
            .then((res) => {
                if (res.status === 200) {
                    axios.post('/backapi/valid-code', { email: value })
                        .then(() => {
                            setInputCode(v => ({ ...v, isSend: true }))

                            setModalConf({
                                title: 'Success',
                                content: 'Send Completed',
                                blindFilter: true,
                                handleRightButton: rightButton,
                            })
                            setIsModal(true)
                        })
                }
            }).catch((e) => {
                if (e.response.status < 500) {
                    setEmailInvalid(true)
                    setEmailDuplicate(true)
                    setModalConf({
                        title: 'Fail',
                        content: 'Send Failed',
                        blindFilter: true,
                        handleRightButton: rightButton,
                    })
                }
            })
    }

    const [codeInvalid, setCodeInvalid] = useState(null)
    const [failConfirmCode, setFailConfirmCode] = useState(false)
    const onChangeWithVerification = (e) => {
        setFailConfirmCode(false)
        onChange(e)
        const isValid = e.target.checkValidity()
        setCodeInvalid(!isValid)

        if (isValid) {
            confirmCode(e.target.value)
        }
        setInputCode(prev => ({ ...prev, code: e.target.value }))

    }
    const confirmCode = async (code) => {
        await axios.post('/backapi/valid-code/confirm', { email: email, code: code })
            .then(() => {
                setInputCode(v => ({ ...v, isComplete: true }))
                setModalConf({
                    title: 'Success',
                    content: 'Authenticate Code Done',
                    blindFilter: true,
                    handleRightButton: rightButton,
                })
                setIsModal(true)
            }).catch((e) => {
                if (e.response.status < 500) {
                    setCodeInvalid(true)
                    setFailConfirmCode(true)
                    setModalConf({
                        title: 'Fail',
                        content: 'Authenticate Code Deny',
                        blindFilter: true,
                        handleRightButton: rightButton,
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

    const [confirmPwdInvalid, setConfirmPwdInvalid] = useState(null)
    const onChangeWithConfirmPwd = (e) => {
        onChange(e)
        const isValid = e.target.checkValidity()
        setConfirmPwdInvalid(!isValid)
    }

    return (
        <Form validated={validated} onSubmit={e => submit(e, nextStep)}>
            <FormGroup>
                <FormLabel>Email</FormLabel>
                <FormControl
                    type="email"
                    name="email"
                    required
                    value={email}
                    placeholder="email@pharmcadd.com"
                    pattern=".+@pharmcadd\.com"
                    onChange={onChangeWithEmailCheck}
                    invalid={emailInvalid}
                />
                {emailDuplicate === true ? <Feedback>Entered email already exist.</Feedback>
                    : <Feedback>Enter your company email account.</Feedback>
                }
            </FormGroup>
            {!inputCode.isComplete &&
            <div className="text-right">
                <Button onClick={() => checkEmailAndSendCode(email)} link className="text-xs" disabled={!sendCodeActivate.current}>
                    {inputCode.isSend ? 'Resend code' : 'Send code'}
                </Button>
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
                {failConfirmCode ? (
                    <Feedback>Code does not matched.</Feedback>
                ) : (
                    <Feedback>Enter a six-digit numbers.</Feedback>
                )}
            </FormGroup>
            }
            <FormGroup>
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
            <FormGroup className="mt-3">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl
                    type="password"
                    name="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={onChangeWithConfirmPwd}
                    pattern={password}
                    invalid={confirmPwdInvalid}
                />
                <Feedback>Passwords do not matched.</Feedback>
            </FormGroup>
            <div className="flex justify-between mt-4">
                <div>
                    <span className="text-xs text-gray-400 mr-2">Already a member?</span>
                    <LinkButton href="/account/login" className="text-xs">Login</LinkButton>
                </div>
                <Button type="submit" disabled={!inputCode.isComplete} link className="-mr-1.5">
                    <div className="flex items-center">
                        <span className="text-sm">Next</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </div>
                </Button>
            </div>
        </Form>
    )
}

function SignupStep2({ name, positions, setPositions, placeOfWork, nextStep, onChange, validated, submit }) {
    const [nameInvalid, setNameInvalid] = useState(null)
    const onChangeWithName = (e) => {
        onChange(e)
        const isValid = e.target.checkValidity()
        setNameInvalid(!isValid)
    }

    const [workPlaces, setWorkPlaces] = useState([
        {
            id: '',
            text: '',
        }])

    useEffect(() => {
        setWorkPlaces(WORKPLACES.map((data) => ({
            id: data.label,
            text: data.value,
        })))
    }, [])

    const [teamOption, setTeamOption] = useState([])
    const [positionOption, setPositionOption] = useState([])

    useEffect(async () => {
        await axios.get('/backapi/groups').then((res) => {
            if (res.status === 200) {
                setTeamOption(res.data.map((data) => ({
                    id: data.id,
                    text: data.name,
                })))
            }
        })

        await axios.get('/backapi/positions').then((res) => {
            if (res.status === 200) {
                setPositionOption(res.data.map((data) => ({
                    id: data.id,
                    text: data.name,
                })))
            }
        })
    }, [])

    const initInputPositions = {
        team: '',
        position: '',
        teamLabel: '',
        positionLabel: '',
    }
    const [inputPositions, setInputPositions] = useState({ ...initInputPositions })
    const { team, position, teamLabel, positionLabel } = inputPositions

    const onChangePosition = e => {
        const { name, value } = e.target
        setInputPositions({
            ...inputPositions,
            [name]: value,
            [`${name}Label`]: e.target.children[value].text,
        })
    }

    const checkPositionValid = () => {
        setInputPositions({
            ...inputPositions,
        })
        return team && position
    }

    const addPosition = () => {
        if (!checkPositionValid()) return

        const newPositions = positions.concat({ team, position, teamLabel, positionLabel })
        setPositions(newPositions)
        setInputPositions({ ...initInputPositions })
    }
    const removePosition = (index) => {
        const newPositions = positions.filter((v, i) => i !== index)
        setPositions(newPositions)
    }

    const [positionState, setPositionState] = useState(null)
    useEffect(() => {
        if (positions.length === 0) {
            setPositionState(true)
        } else {
            setPositionState(false)
        }
    }, [positions])

    return (
        <Form validated={validated} onSubmit={e => submit(e, nextStep)}>
            <FormGroup>
                <FormLabel>Name</FormLabel>
                <FormControl
                    name="name"
                    required
                    value={name}
                    onChange={onChangeWithName}
                    invalid={nameInvalid}
                />
                <Feedback>Please enter your name.</Feedback>
            </FormGroup>
            <div className="flex items-center gap-3 mt-3">
                <FormGroup className="flex-1">
                    <FormLabel>Team / Position</FormLabel>
                    <FormSelect
                        name="team"
                        options={teamOption}
                        placeholder="Choose Team"
                        value={team}
                        onChange={onChangePosition}
                        className="form-input"
                    />
                    <FormSelect
                        name="position"
                        options={positionOption}
                        placeholder="Choose Position"
                        value={position}
                        onChange={onChangePosition}
                        className="form-input mt-1"
                    />
                </FormGroup>
                <Button onClick={addPosition} icon>
                    <PlusCircleIcon className="flex-auto text-gray-400 w-6 h-6 mt-8" />
                </Button>
            </div>
            {positions.length ?
                <ul className="mt-1 mb-4">
                    {positions.map(({ team, position, teamLabel, positionLabel }, i) => (
                        <li key={i}>
                        <span className="text-xs font-medium text-gray-500">
                            - {team && teamLabel}
                            , {position && positionLabel}
                        </span>
                            <Button onClick={() => removePosition(i)} icon>
                                <MinusCircleIcon className="text-gray-400 w-4 h-4 ml-2" />
                            </Button>
                        </li>
                    ))}
                </ul>
                : ''
            }
            {positionState === true ?
                <span className="text-xs font-medium text-red-500">
                    Please choose your team or position.
                </span>
                : ''
            }
            <FormControl
                type="hidden"
                name="positions"
                value={positions}
            />
            <FormGroup className="mt-3">
                <FormLabel>Place Of Work</FormLabel>
                <FormSelect name="placeOfWork" value={placeOfWork}
                            options={workPlaces} onChange={onChange} className="form-input" />
            </FormGroup>

            <div className="text-right mt-3">
                <Button type="submit" link className="-mr-1.5">
                    <div className="flex items-center">
                        <span className="text-sm">Next</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </div>
                </Button>
            </div>
        </Form>
    )
}

function SignupStep3({ policy, onChange, submit, validated, nextStep }) {
    const [policyInvalid, setPolicyInvalid] = useState(null)
    const onChangeWithPolicy = (e) => {
        const isValid = e.target.checkValidity()
        setPolicyInvalid(!isValid)
        if (isValid) {
            e.target.value = true
            onChange(e)
        }
    }

    return (
        <Form validated={validated} onSubmit={e => submit(e, nextStep)}>
            <h3 className="form-label">Terms of Use</h3>
            <textarea className="form-input" readOnly rows="10" value={POLICY} />
            <div className="text-right mt-2">
                <FormCheck
                    name="agree"
                    type="checkbox"
                    value={policy}
                    onChange={onChangeWithPolicy}
                    required
                    className="mt-3"
                    invalid={policyInvalid}
                    label="Agree to terms and conditions"
                    feedback="You must agree before submitting."
                />
            </div>
            <Button type="submit" block className="mt-4">Sign Up</Button>
        </Form>
    )
}

export default SignUp
