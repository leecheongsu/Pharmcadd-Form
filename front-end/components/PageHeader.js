import { useRouter } from 'next/router'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { LogoutIcon, UserCircleIcon, VariableIcon } from '@heroicons/react/outline'
import axios from "axios";
import Link from "./Link";
import Button from "./Button";

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
        <header className="page_header grid grid-cols-6 items-center mb-3">
            <div className="leading-none">
                {router.pathname !== '/campaigns'
                && <Button icon onClick={() => router.back()}><ChevronLeftIcon className="w-6 h-6 text-gray-500" /></Button>}
            </div>
            <h2 className="col-start-2 col-span-4 text-center">
                <span className="text-lg font-bold">{title}</span>
            </h2>
            <div className="leading-none text-right">
                {router.pathname.startsWith('/mypage')
                    ? <Button icon onClick={logout}> <LogoutIcon className="w-6 h-6 text-gray-500" /></Button>
                    : <Link icon href="/mypage/profile"><UserCircleIcon className="w-6 h-6 text-gray-500" /></Link>
                }
            </div>
        </header>
    )
}
