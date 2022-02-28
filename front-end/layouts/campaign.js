import PageHeader from '../components/PageHeader'

export default function CampaignLayout({ children }) {
    const pageTitle = children.props.title
    return (
        <div className="container_sm">
            <PageHeader title={pageTitle} />
            <main>{children}</main>
        </div>
    )
}

