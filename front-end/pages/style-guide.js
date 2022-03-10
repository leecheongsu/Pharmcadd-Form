import { useEffect, useState } from 'react'
import Button from '../components/Button'
import Form from '../components/Form'
import FormGroup from '../components/FormGroup'
import FormLabel from '../components/FormLabel'
import FormSelect from '../components/FormSelect'
import FormControl from '../components/FormControl'
import Feedback from '../components/Feedback'
import FormCheck from '../components/FormCheck'
import FormCheckGroup from '../components/FormCheckGroup'
import FormRadioGroup from '../components/FormRadioGroup'
import Toastbox from '../components/modal/ToastBox'
import LinkButton from '../components/Link'

export default function StyleGuide() {
    const [validated, setValidated] = useState(false)
    const handleSubmit = (e) => {
        const form = e.currentTarget
        const hasInvalid = Array.from(form).some(v => (v.dataset && v.dataset.invalid))
        if (!form.checkValidity() || hasInvalid) {
            e.preventDefault()
            e.stopPropagation()
        }

        setValidated(true)
    }

    const [passwordInvalid, setPasswordInvalid] = useState(false)
    const validate = (e) => {
        const isValid = e.target.checkValidity()
        setPasswordInvalid(!isValid)
    }

    const items = [
        { id: 1, text: '1' },
        { id: 2, text: '2' },
        { id: 3, text: '3' },
        { id: 4, text: '4' },
        { id: 5, text: '5' },
    ]

    const [inputData, setInputData] = useState({
        checkbox: ['gilad'],
        radio: '',
        agree: false,
    })

    const { checkbox, radio, agree } = inputData
    const handleInputData = ({ name, value }) => {
        setInputData({
            ...inputData,
            [name]: value,
        })
    }

    const handleCheckChange = (e) => {
        const { name, checked } = e.target
        handleInputData({ name, value: checked })
    }

    const sampleCheckbox = [
        { id: 'gilad', text: '1' },
        { id: 'jason', text: '2' },
        { id: 'antoine', text: '3', disabled: true },
    ]

    useEffect(() => {
        setVisible(true)
    }, [])

    const [isVisible, setVisible] = useState(false)

    const closeModal = () => {
        setVisible(false)
    }

    return (
        <div className="container-fluid">

            <FormGroup id="sample_id" className="mb-3">
                <FormLabel>Text</FormLabel>
                <FormControl placeholder="placeholder..." />
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel>readOnly</FormLabel>
                <FormControl value="readOnly" readOnly />
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel>disabled</FormLabel>
                <FormControl value="disabled" disabled />
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel>plaintext</FormLabel>
                <FormControl plaintext readOnly defaultValue="email@example.com" />
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel>textarea</FormLabel>
                <FormControl as="textarea" rows="3" />
            </FormGroup>
            <br />

            {/* Form Validation */}
            <Form validated={validated} onSubmit={handleSubmit}>
                <FormGroup>
                    <FormLabel>Email</FormLabel>
                    <FormControl
                        type="email"
                        placeholder="email@sample.com"
                        pattern=".+@sample\.com"
                        required
                    />
                    <Feedback>Enter your email account.</Feedback>
                </FormGroup>
                <FormGroup className="mt-3">
                    <FormLabel>Code</FormLabel>
                    <FormControl
                        placeholder="Code"
                        required
                        maxLength="6"
                        minLength="6"
                    />
                    <Feedback>Enter 6 digits.</Feedback>
                    <Feedback type="valid">Good!</Feedback>
                </FormGroup>
                <FormGroup className="mt-3">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        type="password"
                        placeholder="Password"
                        pattern="^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6,}$"
                        required
                        onChange={validate}
                        invalid={passwordInvalid}
                    />
                    <Feedback>Enter 6 or more characters, including letters and numbers.</Feedback>
                </FormGroup>

                {/* Radio */}
                <FormRadioGroup
                    name="radio"
                    inline
                    items={sampleCheckbox}
                    required
                    value={radio}
                    onChange={handleInputData}
                    feedback="Required."
                    className="mt-3"
                    answer={null}
                />

                {/* Checkbox */}
                <FormCheckGroup
                    inline
                    name="checkbox"
                    items={sampleCheckbox}
                    value={checkbox}
                    onChange={handleInputData}
                    rule={v => v !== 2}
                    feedback="Choose two."
                    className="mt-3"
                    answer={null}
                />
                <FormCheck
                    name="agree"
                    checked={agree}
                    onChange={handleCheckChange}
                    required
                    label="Agree to terms and conditions"
                    feedback="You must agree before submitting."
                    className="mt-3"
                />

                <Button type="submit" className="mt-3">Submit</Button>
            </Form>

            <div className="mb-3">
                <label htmlFor="example-helping" className="form-label">Helping text</label>
                <input type="text" id="example-helping" className="form-input" placeholder="Helping text" />
                <span className="help-block"><small>A block of help text that breaks onto a new line and may extend beyond one line.</small></span>
            </div>

            <div className="mb-3">
                <label htmlFor="example-select" className="form-label">Input Select</label>
                <select className="form-input" id="example-select">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </div>

            <div className="mb-3">
                <FormSelect name="form-select" className="form-input"
                            value={3} options={items}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="example-fileinput" className="form-label">Default file input</label>
                <input type="file" id="example-fileinput" className="form-input" />
            </div>

            <div className="mt-3">
                <div className="form-check">
                    <input type="radio" id="customRadio1" name="customRadio" className="form-check-input" />
                    <label className="form-check-label" htmlFor="customRadio1">Toggle this custom radio</label>
                </div>
                <div className="form-check">
                    <input type="radio" id="customRadio2" name="customRadio" className="form-check-input" />
                    <label className="form-check-label" htmlFor="customRadio2">Or toggle this other custom radio</label>
                </div>
            </div>

            <div className="mt-2">
                <div className="form-check form-check-inline">
                    <input type="radio" id="customRadio3" name="customRadio1" className="form-check-input" />
                    <label className="form-check-label" htmlFor="customRadio3">Toggle this custom radio</label>
                </div>
                <div className="form-check form-check-inline">
                    <input type="radio" id="customRadio4" name="customRadio1" className="form-check-input" />
                    <label className="form-check-label" htmlFor="customRadio4">Or toggle this other custom radio</label>
                </div>
            </div>

            <div className="mt-2">
                <div className="form-check form-check-inline">
                    <input type="radio" id="customRadio5" name="customRadio2" className="form-check-input" disabled />
                    <label className="form-check-label" htmlFor="customRadio5">Toggle this custom radio</label>
                </div>
                <div className="form-check form-check-inline">
                    <input type="radio" id="customRadio6" name="customRadio2" className="form-check-input" checked
                           disabled />
                    <label className="form-check-label" htmlFor="customRadio6">Or toggle this other custom radio</label>
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-2xl font-bold mt-4">Link</h2>
                <LinkButton href="/">Link</LinkButton>{' '}
                <LinkButton href="/" active>Link</LinkButton>{' '}
                <LinkButton href="/" disabled>Link</LinkButton>{' '}
                <br />

                <h2 className="text-2xl font-bold mt-4">Button</h2>
                <Button onClick={() => console.log('click!')}>Button</Button>{' '}
                <Button type="submit" active>Submit</Button>{' '}
                <Button onClick={() => console.log('click!')} disabled>Reset</Button>{' '}

                <h2 className="text-2xl font-bold mt-4">Size</h2>
                <Button size="sm">Small</Button>{' '}
                <Button>Normal</Button>{' '}
                <Button size="lg">Large</Button>{' '}

                <h2 className="text-2xl font-bold mt-4">Style</h2>
                <Button link>Link</Button>{' '}
                <Button outline>Outline</Button>{' '}
                <Button block>Block</Button>
            </div>

            <br />
            <label className="switch-button">
                <input type="checkbox" />
                <span className="on-off-switch"></span>
            </label>

            <label className="switch-button sm">
                <input type="checkbox" />
                <span className="on-off-switch"></span>
            </label>

            <br />
            <br />

            {isVisible &&
            <Toastbox type="success" message="success!!" transition={false} onChange={closeModal} />
            }

            <div>
                <div className="alert text-center">
                    <p className="text-xl">alert 메세지 박스</p>
                    <p className="mb-3">메세지 박스 서브 내용</p>
                    <div className="text-center">
                        <Button size="sm">확인</Button>
                    </div>
                </div>
            </div>

            {/* TODO: 변수로 클릭시 보이기 */
            }
            {/*<div>
                <div className="alert text-center">
                    <p className="text-xl">alert 메세지 박스</p>
                    <p className="mb-3">메세지 박스 서브 내용</p>
                    <div className="text-center">
                        <Button size="sm">확인</button>
                    </div>
                </div>
            </div>

            <br /><br />

            <div className="toastbox show">
                <div className="toast">
                    <p>토스트 메세지</p>
                </div>
            </div>


            <br /><br /><br /><br />*/
            }

        </div>
    )
}

