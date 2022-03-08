import cookie from 'cookie'

const ApiLogout = async (req, res) => {
    // 쿠키 httpOnly 삭제
    res.setHeader(
        'Set-Cookie',
        [
            cookie.serialize('accessToken', '', {
                httpOnly: true,
                maxAge: new Date(0),
                sameSite: 'strict',
                path: '/',
            }),
            cookie.serialize('refreshToken', '', {
                httpOnly: true,
                maxAge: new Date(0),
                sameSite: 'strict',
                path: '/',
            }),
        ],
    )

    return res.status(200).json({ success: true })
}

export default ApiLogout
