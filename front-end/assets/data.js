export const TEAMS = [
    { label: 'MD/Quantum', value: 1 },
    { label: 'Bio Assay Lab', value: 2 },
    { label: '신사업기획팀', value: 3 },
    { label: 'Drug Design', value: 4 },
    { label: 'Network Theory', value: 5 },
    { label: 'AI/Homology', value: 6 },
    { label: 'IT 부문/개발', value: 7 },
    { label: 'IDC Center', value: 8 },
    { label: '데이터설계팀', value: 9 },
    { label: '정보보안팀', value: 10 },
    { label: '서버관리팀', value: 11 },
    { label: 'BD 본부', value: 12 },
    { label: 'MS 본부', value: 13 },
    { label: '비서실', value: 14 },
    { label: '인사/총무팀', value: 15 },
    { label: 'R&D지원팀', value: 16 },
    { label: '홍보/IR팀', value: 17 },
    { label: '재무/회계팀', value: 18 }
]

export const TEAMS_MAP = {
    1: { label: 'MD/Quantum', value: 1 },
    2: { label: 'Bio Assay Lab', value: 2 },
    3: { label: '신사업기획팀', value: 3 },
    4: { label: 'Drug Design', value: 4 },
    5: { label: 'Network Theory', value: 5 },
    6: { label: 'AI/Homology', value: 6 },
    7: { label: 'IT 부문/개발', value: 7 },
    8: { label: 'IDC Center', value: 8 },
    9: { label: '데이터설계팀', value: 9 },
    10: { label: '정보보안팀', value: 10 },
    11: { label: '서버관리팀', value: 11 },
    12: { label: 'BD 본부', value: 12 },
    13: { label: 'MS 본부', value: 13 },
    14: { label: '비서실', value: 14 },
    15: { label: '인사/총무팀', value: 15 },
    16: { label: 'R&D지원팀', value: 16 },
    17: { label: '홍보/IR팀', value: 17 },
    18: { label: '재무/회계팀', value: 18 }
}

export const POSITIONS = [
    { label: '대표이사', value: 1 },
    { label: '부사장', value: 2 },
    { label: '이사', value: 3 },
    { label: '전무이사', value: 4 },
    { label: '상무이사', value: 5 },
    { label: '이사', value: 6 },
    { label: '부장', value: 7 },
    { label: '차장', value: 8 },
    { label: '과장', value: 9 },
    { label: '대리', value: 10 },
    { label: '주임', value: 11 },
    { label: '사원', value: 12 },
    { label: '연구소장', value: 13 },
    { label: '수석연구원', value: 14 },
    { label: '책임연구원', value: 15 },
    { label: '선임연구원', value: 16 },
    { label: '연구원', value: 17 },
    { label: '기타', value: 18 }
]

export const POSITIONS_MAP = {
    1: { label: '대표이사', value: 1 },
    2: { label: '부사장', value: 2 },
    3: { label: '이사', value: 3 },
    4: { label: '전무이사', value: 4 },
    5: { label: '상무이사', value: 5 },
    6: { label: '이사', value: 6 },
    7: { label: '부장', value: 7 },
    8: { label: '차장', value: 8 },
    9: { label: '과장', value: 9 },
    10: { label: '대리', value: 10 },
    11: { label: '주임', value: 11 },
    12: { label: '사원', value: 12 },
    13: { label: '연구소장', value: 13 },
    14: { label: '수석연구원', value: 14 },
    15: { label: '책임연구원', value: 15 },
    16: { label: '선임연구원', value: 16 },
    17: { label: '연구원', value: 17 },
    18: { label: '기타', value: 18 }
}

export const WORKPLACES = [
    { label: 'Busan', value: 'BUSAN' },
    { label: 'Seoul', value: 'SEOUL' },
    { label: 'India', value: 'INDIA' }
]

export const QUESTION_TYPE = [
    { label: '객관식(단답)', value: 'CHOICE_SINGLE' },
    { label: '객관식(다수)', value: 'CHOICE_MULTIPLE' },
    { label: '주관식(단답)', value: 'TEXT_SHORT' },
    { label: '서술형', value: 'TEXT_LONG' },
    // { label: '날짜', value: 'DATE', disabled: true },
    // { label: '날짜&시간', value: 'DATE_TIME', disabled: true },
    // { label: '첨부파일', value: 'ATTACHMENT', disabled: true }
]

export const QUESTION_TYPE_MAP = {
    1: { label: '객관식(단답)', value: 'CHOICE_SINGLE' },
    2: { label: '객관식(다수)', value: 'CHOICE_MULTIPLE' },
    3: { label: '주관식(단답)', value: 'TEXT_SHORT' },
    4: { label: '서술형', value: 'TEXT_LONG' },
    5: { label: '날짜', value: 'DATE' },
    6: { label: '날짜&시간', value: 'DATE_TIME' },
    7: { label: '첨부파일', value: 'ATTACHMENT' }
}

export const INPUT_TYPE_OF_QUESTION_MAP = {
    'CHOICE_SINGLE': 'radio',
    'CHOICE_MULTIPLE': 'checkbox',
    'TEXT_SHORT': 'text',
    'TEXT_LONG': 'textarea',
}

export const ROLES = [
    { text: '유저', id: 'USER' },
    { text: '캠페인 관리자', id: 'CAMPAIGN_ADMIN' },
    { text: '관리자', id: 'ADMIN' }
]

export const CAMPAIGNS_STATUS = [
    { id: 'READY', text: 'Ready' },
    { id: 'RUNNING', text: 'Running' },
    { id: 'SUSPENDED', text: 'Suspended' },
    { id: 'FINISHED', text: 'Finished' },
    { id: 'STOPPED', text: 'Stopped' }
]
