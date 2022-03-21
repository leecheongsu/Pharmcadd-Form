import App from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Head from 'next/head'
import '/styles/globals.css'
import axios, { setAuth } from '../lib/axios'

const DefaultLayout = dynamic(() => import('../layouts/campaign'))
const AccountLayout = dynamic(() => import('../layouts/login'))
const AdminLayout = dynamic(() => import('../layouts/admin'))

const MyApp = ({ Component, pageProps, accessToken }) => {
    const { pathname } = useRouter()
    const Layout = pathname.startsWith('/admin') ? AdminLayout
        : (pathname.startsWith('/account') ? AccountLayout
            : DefaultLayout)

    setAuth(accessToken)

    return (
        <>
            <Head>
                <title>Pharmcadd Form</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Layout>
                <Component {...pageProps}/>
            </Layout>
        </>
    )
}

MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext)
    const { req } = appContext.ctx
    if (req) {
        setAuth(req.cookies.accessToken)
        if (req.cookies && req.cookies.accessToken) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + req.cookies.accessToken
            return { ...appProps, accessToken: req.cookies.accessToken || null }
        }
    }
    return { ...appProps }
}

export default MyApp
