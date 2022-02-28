// Fake users data
export const campaigns = [{
    "id": 1,
    "title": "제목",
    "createdBy": "홍길동",
    "status": "READY",
    "startDate": "2021111613:120301",
    "endDate": "2021111613:120301",
    "createdAt": "2021111613:120301",
    "updatedAt": "2021111613:120301",
    "questions": [
        {
            "id": 1,
            "content": "RADIO 질문",
            "type": "RADIO",
            "min": 1,
            "max": 1,
            "required": true,
            "choice": [
                {
                    "id": 1,
                    "content": "YES"
                },
                {
                    "id": 2,
                    "content": "NO"
                }
            ]
        },
        {
            "id": 2,
            "content": "CHECK 질문 (필수)",
            "type": "CHECK",
            "min": 1,
            "max": 1,
            "required": true,
            "choice": [
                {
                    "id": 3,
                    "content": "Fever"
                },
                {
                    "id": 4,
                    "content": "Cough"
                },
                {
                    "id": 5,
                    "content": "Nothing"
                }
            ]
        },
        {
            "id": 3,
            "content": "CHECK 질문2 (선택)",
            "type": "CHECK",
            "min": 0,
            "max": 3,
            "required": false,
            "choice": [
                {
                    "id": 6,
                    "content": "Fever"
                },
                {
                    "id": 7,
                    "content": "Cough"
                },
                {
                    "id": 8,
                    "content": "Nothing"
                }
            ]
        },
        {
            "id": 4,
            "content": "SHORT_TEXT 질문",
            "type": "SHORT_TEXT"
        },
        {
            "id": 5,
            "content": "LONG_TEXT 질문",
            "type": "LONG_TEXT"
        }
    ],
    "answers": [
        {
            "type": "RADIO",
            "questionId": 1,
            "content": [1]
        },
        {
            "type": "CHECK",
            "questionId": 2,
            "content": [4]
        },
        {
            "type": "CHECK",
            "questionId": 3,
            "content": [3, 4]
        },
        {
            "type": "SHORT_TEXT",
            "questionId": 4,
            "summary": "짧은 답장"
        },
        {
            "type": "LONG_TEXT",
            "questionId": 5,
            "summary": "긴 답변"
        }
    ]
},
    {
        "id": 2,
        "title": "제목2222",
        "createdBy": "홍길동",
        "status": "READY",
        "startDate": "2021111613:120301",
        "endDate": "2021111613:120301",
        "createdAt": "2021111613:120301",
        "updatedAt": "2021111613:120301",
        "questions": [
            {
                "id": 1,
                "content": "RADIO 질문",
                "type": "RADIO",
                "min": 1,
                "max": 1,
                "required": true,
                "choice": [
                    {
                        "id": 1,
                        "content": "YES"
                    },
                    {
                        "id": 2,
                        "content": "NO"
                    }
                ]
            },
            {
                "id": 2,
                "content": "CHECK 질문 (필수)",
                "type": "CHECK",
                "min": 1,
                "max": 1,
                "required": true,
                "choice": [
                    {
                        "id": 3,
                        "content": "Fever"
                    },
                    {
                        "id": 4,
                        "content": "Cough"
                    },
                    {
                        "id": 5,
                        "content": "Nothing"
                    }
                ]
            },
            {
                "id": 3,
                "content": "CHECK 질문2 (선택)",
                "type": "CHECK",
                "min": 0,
                "max": 3,
                "required": false,
                "choice": [
                    {
                        "id": 6,
                        "content": "Fever"
                    },
                    {
                        "id": 7,
                        "content": "Cough"
                    },
                    {
                        "id": 8,
                        "content": "Nothing"
                    }
                ]
            },
            {
                "id": 4,
                "content": "SHORT_TEXT 질문",
                "type": "SHORT_TEXT"
            },
            {
                "id": 5,
                "content": "LONG_TEXT 질문",
                "type": "LONG_TEXT"
            }
        ],
        "answers": [
            {
                "type": "RADIO",
                "questionId": 1,
                "content": [1]
            },
            {
                "type": "CHECK",
                "questionId": 2,
                "content": [4]
            },
            {
                "type": "CHECK",
                "questionId": 3,
                "content": [3, 4]
            },
            {
                "type": "SHORT_TEXT",
                "questionId": 4,
                "summary": "짧은 답장"
            },
            {
                "type": "LONG_TEXT",
                "questionId": 5,
                "summary": "긴 답변"
            }
        ]
    }
]

export const people = [
    {
        id: '1',
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        gender: 'male',
    },
    {
        id: '2',
        name: 'C-3PO',
        height: '167',
        mass: '75',
        hair_color: 'n/a',
        skin_color: 'gold',
        eye_color: 'yellow',
        gender: 'n/a',
    },
    {
        id: '3',
        name: 'R2-D2',
        height: '96',
        mass: '32',
        hair_color: 'n/a',
        skin_color: 'white, blue',
        eye_color: 'red',
        gender: 'n/a',
    },
    {
        id: '4',
        name: 'Darth Vader',
        height: '202',
        mass: '136',
        hair_color: 'none',
        skin_color: 'white',
        eye_color: 'yellow',
        gender: 'male',
    },
    {
        id: '5',
        name: 'Leia Organa',
        height: '150',
        mass: '49',
        hair_color: 'brown',
        skin_color: 'light',
        eye_color: 'brown',
        gender: 'female',
    },
    {
        id: '6',
        name: 'Owen Lars',
        height: '178',
        mass: '120',
        hair_color: 'brown, grey',
        skin_color: 'light',
        eye_color: 'blue',
        gender: 'male',
    },
    {
        id: '7',
        name: 'Beru Whitesun Lars',
        height: '165',
        mass: '75',
        hair_color: 'brown',
        skin_color: 'light',
        eye_color: 'blue',
        gender: 'female',
    },
    {
        id: '8',
        name: 'R5-D4',
        height: '97',
        mass: '32',
        hair_color: 'n/a',
        skin_color: 'white, red',
        eye_color: 'red',
        gender: 'n/a',
    },
    {
        id: '9',
        name: 'Biggs Darklighter',
        height: '183',
        mass: '84',
        hair_color: 'black',
        skin_color: 'light',
        eye_color: 'brown',
        gender: 'male',
    },
    {
        id: '10',
        name: 'Obi-Wan Kenobi',
        height: '182',
        mass: '77',
        hair_color: 'auburn, white',
        skin_color: 'fair',
        eye_color: 'blue-gray',
        gender: 'male',
    },
]
