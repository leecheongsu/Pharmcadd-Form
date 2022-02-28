import Breadcrumb from "./Breadcrumb";

export default function PageTitle({ title }) {
    return (
        <header className="pageTitle flex items-center">
            <h2 className="text-lg font-medium mb-0 mr-auto">{title}</h2>
            <Breadcrumb />
        </header>
    )
}
