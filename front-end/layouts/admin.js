import { useState } from "react";
import Navbar from '../components/admin/navbar'
import SideMenu from '../components/admin/sideMenu'
import Footer from '../components/admin/footer'

const AdminLayout = ({ children }) => {
    const [showSideMenu, setShowSideMenu] = useState(true)
    const onChange = () => {
        setShowSideMenu(!showSideMenu)
    }

    return (
        <div className="flex flex-nowrap">
            <SideMenu show={showSideMenu} className="flex-none" />
            <div className="content-area flex-1">
                <Navbar onClickMenu={onChange} />
                <main className="content px-4">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default AdminLayout;
