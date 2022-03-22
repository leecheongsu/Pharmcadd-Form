import PageHeader from '../components/PageHeader'

export default function CampaignLayout({ children }) {

    const pageTitle = children.props.title
    const userInfo = children.props.userInfo

    return (
        <div className="container_sm">
            <PageHeader title={pageTitle} userInfo={userInfo} />
            <main>{children}</main>
        </div>
    )
}