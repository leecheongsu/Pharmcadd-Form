import { useRouter } from 'next/router'
import { ChevronLeftIcon, DocumentIcon, DocumentReportIcon, DocumentTextIcon, HomeIcon, SearchIcon } from '@heroicons/react/solid'
import { LogoutIcon, UserCircleIcon } from '@heroicons/react/outline'
import axios from 'axios'
import Button from './Button'

export default function PageHeader({ title = 'title' }) {
    const router = useRouter()
    const logout = async () => {
        axios.post('/api/logout').then(() => {
            router.push('/account/login')
        }).catch(err => {
            console.log('로그아웃 실패')
            /* TODO : ErrorHandler */
        })
    }

    return (
        <header className="page_header grid grid-cols-6 items-center px-2 mb-3">
            <div className="leading-none">
                {router.pathname !== '/campaigns'
                && <Button icon onClick={() => router.back()}><ChevronLeftIcon className="w-6 h-6 text-gray-500" /></Button>}
            </div>
            <h2 className="col-start-2 col-span-4 text-center">
                <span className="text-lg font-bold">{title}</span>
            </h2>
            <div className="leading-none text-right">
                {router.pathname.startsWith('/mypage') &&
                <Button icon onClick={logout}>
                    <LogoutIcon className="w-6 h-6 text-gray-500" />
                </Button>
                }
            </div>
            <div className="bottom_menu">
                <div>
                    <Button icon onClick={() => router.push('/campaigns')}>
                        <HomeIcon className="w-6 h-6 text-gray-500" />
                    </Button>
                </div>
                <div>
                    <Button icon>
                        <SearchIcon className="w-6 h-6 text-gray-500" />
                    </Button>
                </div>
                <div>
                    <Button icon onClick={() => router.push('/mypage/cancel-answer-list')}>
                        <DocumentTextIcon className="w-6 h-6 text-gray-500" />
                    </Button>
                </div>
                <div>
                    <Button icon onClick={() => router.push('/mypage/profile')}>
                        <UserCircleIcon className="w-6 h-6 text-gray-500" />
                    </Button>
                </div>
            </div>
        </header>
    )
}