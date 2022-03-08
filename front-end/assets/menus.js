export const ADMIN_MENUS = [
    {
        cate: 'campaign',
        items: [
            { title: '양식 생성', link: '/admin/forms/create' },
            { title: '양식 목록', link: '/admin/forms' },
            // { title: '설문 발송', link: '/admin/campaigns/create' },
            { title: '설문 목록', link: '/admin/campaigns' },
        ],
    },
    {
        cate: 'user',
        items: [
            { title: '부서 목록', link: '/admin/groups' },
            { title: '회원 목록', link: '/admin/users' },
        ],
    },
]
