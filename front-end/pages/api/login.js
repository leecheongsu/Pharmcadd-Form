import cookie from 'cookie'
import axios from '../../lib/axios'

const ApiLogin = (req, res) => {
    const { username, password } = req.body

    return axios.post('/oauth/token', null, {
        params: {
            username: username,
            password: password,
            grant_type: 'password',
            client_id: process.env.OAUTH_USER,
            client_secret: process.env.OAUTH_PASS,
        },
    }).then(({ data }) => {
        // 쿠키 httpOnly 굽기
        res.setHeader(
            'Set-Cookie',
            [
                cookie.serialize('accessToken', data.access_token, {
                    httpOnly: true,
                    maxAge: data.expires_in,
                    sameSite: 'strict',
                    path: '/',
                }),
                // cookie.serialize("refreshToken", data.refresh_token, {
                //     httpOnly: true,
                //     sameSite: "strict",
                //     path: "/",
                // }),
            ],
        )

        return res.status(200).json(data)
    }).catch(err => {
        throw err
    })
}

export default ApiLogin
