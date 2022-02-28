import {useRouter} from "next/router";
import Image from 'next/image'
import classNames from "classnames";
import {ADMIN_MENUS} from "../../assets/menus";
import Link from "../Link";
import axios from "axios";
import {LogoutIcon} from "@heroicons/react/outline";
import Button from "../Button";

const SideMenu = ({show, className}) => {
    const {asPath} = useRouter()
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
        <div className={classNames(
            'side_menu',
            show && 'show',
            className,
        )}>
            <div className="_inner flex flex-col">
                <Link href="/admin" className="logo">
                    <Image
                        src="/PharmCADD_CI.png"
                        alt="Pharmcadd"
                        width={110}
                        height={39}
                    />
                </Link>
                <nav className="py-5">
                    {ADMIN_MENUS.map((menu, index) => (
                        <div className="mb-8" key={index}>
                            <span className="cate capitalize ml-7 mb-2">{menu.cate}</span>
                            <ul className="menu">
                                {menu.items.map((item, i) => (
                                    <li key={i}>
                                        <Link
                                            href={item.link}
                                            active={item.link === asPath}
                                            className="pl-7 py-2"
                                        >{item.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
                <div className="py-5 ml-7 mt-auto text-sm">
                    <Button icon onClick={logout}>
                            <LogoutIcon className="w-6 h-6 text-gray-500"/>
                        <span className="w-6 h-6 text-gray-500">Logout</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SideMenu;
