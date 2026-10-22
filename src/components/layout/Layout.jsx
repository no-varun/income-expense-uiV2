import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);
    const [headerMenuCloseSignal, setHeaderMenuCloseSignal] = useState(0);
    const [sidebarGroupCloseSignal, setSidebarGroupCloseSignal] = useState(0);
    const closeHeaderMenus = () => setHeaderMenuCloseSignal((signal) => signal + 1);
    const closeSidebarGroups = () => setSidebarGroupCloseSignal((signal) => signal + 1);

    return (

        <div
            className="d-flex"
            style={{
                minHeight: "100vh",
                overflowX: "clip"
            }}
        >

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onMenuInteract={closeHeaderMenus}
                closeGroupSignal={sidebarGroupCloseSignal}
            />

            <div
              className="main-content flex-grow-1 d-flex flex-column"
                style={{
                    minHeight: "100vh",
                    background: "#f5f6fa",
                    minWidth: 0
                }}
            >

                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    closeMenuSignal={headerMenuCloseSignal}
                    onHeaderMenuOpen={closeSidebarGroups}
                />

                <main
                    className="flex-grow-1 p-3 p-md-4"
                >

                    <Outlet />

                </main>

                <Footer />

            </div>

        </div>

    );

};

export default Layout;
