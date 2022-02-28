import Link from 'next/link';

const Main = () => {
    const links = [
        { title: '로그인', url: '/account/login' },
        { title: '회원가입', url: '/account/sign-up' },
        { title: '비밀번호 찾기', url: '/account/find-pw' },
        { title: '프로필', url: '/mypage/profile' },
        { title: '비밀번호 변경', url: '/mypage/edit-pw' },
        { title: '캠페인 목록', url: '/campaigns' },
        { title: '캠페인 상세', url: '/campaigns/1' },
    ]
    const admins = [
        { title: '캠페인 생성', url: '/admin/campaigns/create' },
        { title: '캠페인 목록', url: '/admin/campaigns' },
        { title: '캠페인 상세', url: '/admin/campaigns/1' },
        { title: '캠페인 결과', url: '/admin/campaigns/1/result' },
        { title: '회원 목록', url: '/admin/members' },
        { title: '회원 상세', url: '/admin/members/1' },
    ]
    return (
        <div className="card login_box">
            <h2 className="text-2xl mb-3">유저 페이지</h2>
            <ul>
                {links.map((v, i) => (
                    <li key={i} className="mb-1">
                        <Link href={v.url}>
                            <a>- {v.title}</a>
                        </Link>
                    </li>
                ))}
            </ul>
            <br />

            <h2 className="text-2xl mb-3">관리자 페이지</h2>
            <ul>
                {admins.map((v, i) => (
                    <li key={i} className="mb-1">
                        <Link href={v.url}>
                            <a>- {v.title}</a>
                        </Link>
                    </li>
                ))}
            </ul>
            <br />

            <h2 className="text-2xl mb-3">스타일가이드</h2>
            <Link href="/style-guide">
                <a>- 스타일가이드</a>
            </Link>
        </div>

    )
}

export const getServerSideProps = async () => {
    return {
        redirect: {
            destination: '/campaigns',
            permanent: true,
        },
    }
}


export default Main;
