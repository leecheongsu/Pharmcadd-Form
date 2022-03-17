export const FORMS_HEADER = [
    { label: 'No.', value: 'id', sortable : true },
    { label: '제목', value: 'title', className: 'w-full' },
    { label: '생성자', value: 'createdByName' },
    { label: '수정자', value: 'updatedByName' },
    { label: '생성일', value: 'createdAt', dayFormat: true },
    { label: '수정일', value: 'updatedAt', dayFormat: true },
    { label: '', value: 'description' },
]

export const CAMPAIGNS_HEADER = [
    { label: 'No.', value: 'id', sortable : true },
    { label: '제목', value: 'title', className: 'w-full' },
    { label: '상태', value: 'status' },
    { label: '기간', value: 'startsAt' },
    { label: '생성일', value: 'createdAt', dayFormat: true },
]

export const USERS_HEADER = [
    { label: 'No.', value: 'id', sortable: true },
    { label: '이름', value: 'name', className: 'w-1/4', sortable: true },
    { label: '메일', value: 'email' },
    { label: '부서', value: 'groupNames' },
    { label: '직책', value: 'positionNames' },
    { label: '생성일', value: 'createdAt', dayFormat: true },
    { label: '활성화', value: 'active' },
]

