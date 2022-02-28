import { useRouter } from 'next/router'
import { ChevronRightIcon } from '@heroicons/react/solid'

export default function Breadcrumb() {
    const { asPath } = useRouter()
    const queryIndex = asPath.indexOf('?')
    const pathway = asPath
        .slice(0, queryIndex !== -1 ? queryIndex : asPath.length)
        .split('/')
        .filter(v => !!v)
        .map((v, i, arr) => ({
            text: v,
            link: '/' + arr.filter((f,j) => j <= i).join('/'),
        }))

    return (
        <ol className="breadcrumb">
            {pathway.map((v, i) => (
                <li key={i} className="flex items-center">
                    {i > 0 ? <ChevronRightIcon className="w-4 h-4 text-gray-300 mx-2" /> : ''}
                    <BreadcrumbItem text={v.text} href={v.link} />
                </li>
            ))}
        </ol>
    )
}

function BreadcrumbItem({ text, href }) {
    const router = useRouter()
    const isActive = router.asPath === href

    if (!isActive) {
        const handleClick = e => {
            e.preventDefault()
            router.push(href).then()
        }
        return (
            <a href={href} onClick={handleClick} className="breadcrumbItem">
                {text}
            </a>
        )
    } else {
        return (
            <span className="breadcrumbItem text-gray-400">
                {text}
            </span>
        )
    }
}
