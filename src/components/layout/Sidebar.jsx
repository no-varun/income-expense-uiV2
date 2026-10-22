import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    FaTachometerAlt,
    FaTags,
    FaBoxOpen,
    FaMoneyBillWave,
    FaWallet,
    FaChartBar,
    FaChartPie,
    FaTimes,
    FaStore,
    FaUniversity,
    FaExchangeAlt,
    FaChartLine,
    FaGlassWhiskey,
    FaCalendarAlt,
    FaFileAlt,
    FaGem,
    FaChevronDown,
} from "react-icons/fa";

const menuGroups = [
       {
        title: "Management",
        icon: <FaUniversity />,
        paths: ["/categories", "/items", "/shops", "/milk"],
        items: [
            { title: "Categories", path: "/categories", icon: <FaTags /> },
            { title: "Items", path: "/items", icon: <FaBoxOpen /> },
            { title: "Shops", path: "/shops", icon: <FaStore /> },
            { title: "Milk Management", path: "/milk", icon: <FaGlassWhiskey /> },
        ],
    },
    {
        title: "Financial",
        icon: <FaMoneyBillWave />,
        paths: ["/income", "/expense", "/saving", "/debt", "/transfers", "/accounts"],
        items: [
            { title: "Income", path: "/income", icon: <FaMoneyBillWave /> },
            { title: "Expense", path: "/expense", icon: <FaWallet /> },
            { title: "Transfers", path: "/transfers", icon: <FaExchangeAlt /> },
            { title: "Debt", path: "/debt", icon: <FaWallet /> },
            { title: "Accounts", path: "/accounts", icon: <FaUniversity /> },
            // { title: "Savings", path: "/saving", icon: <FaChartLine /> },
        ],
    },
    {
        title: "Assets & Planning",
        icon: <FaGem />,
        paths: ["/investments", "/preciousItem", "/future-planning"],
        items: [
            { title: "Investments", path: "/investments", icon: <FaChartLine /> },
            { title: "Precious Items", path: "/preciousItem", icon: <FaGem /> },
            { title: "Future Planning", path: "/future-planning", icon: <FaCalendarAlt /> },
        ],
    },
    {
        title: "Insights",
        icon: <FaChartBar />,
        paths: ["/reports", "/charts"],
        items: [
            { title: "Reports", path: "/reports", icon: <FaChartBar /> },
            { title: "Daily Chart", path: "/charts/daily", icon: <FaChartLine /> },
            { title: "This Week Chart", path: "/charts/weekly", icon: <FaCalendarAlt /> },
            { title: "Week Wise Chart", path: "/charts/week-wise", icon: <FaChartBar /> },
            { title: "Shop Wise Expense", path: "/charts/shop-wise", icon: <FaStore /> },
            { title: "Monthly Chart", path: "/charts/monthly", icon: <FaChartLine /> },
            { title: "Yearly Chart", path: "/charts/yearly", icon: <FaCalendarAlt /> },
            { title: "Category Chart", path: "/charts/category", icon: <FaTags /> },
            { title: "Item Wise Chart", path: "/charts/titleType", icon: <FaBoxOpen /> },
            { title: "Payment Mode Chart", path: "/charts/payment-mode", icon: <FaWallet /> },
            { title: "Dashboard Chart", path: "/charts/dashboard", icon: <FaChartPie /> },
        ],
    },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const [openGroups, setOpenGroups] = useState(() =>
        Object.fromEntries(
            menuGroups
                .filter((group) => group.paths.some((path) => location.pathname.startsWith(path)))
                .map((group) => [group.title, true]),
        ),
    );

    const closeSidebar = () => setSidebarOpen(false);
    const toggleGroup = (title) => {
        setOpenGroups((current) => ({ ...current, [title]: !current[title] }));
    };
    const linkClass = ({ isActive }) =>
        `nav-link d-flex align-items-center text-light ${isActive ? "bg-primary text-white fw-bold" : ""}`;

    return (
        <>
            {sidebarOpen && (
                <div
                    className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
                    style={{ background: "rgba(0,0,0,0.5)", zIndex: 1040 }}
                    onClick={closeSidebar}
                />
            )}

            <aside className={`sidebar bg-dark text-white d-flex flex-column shadow ${sidebarOpen ? "sidebar-open" : ""}`}>
                <div className="d-lg-none text-end p-3">
                    <button type="button" className="btn btn-outline-light btn-sm" onClick={closeSidebar} aria-label="Close navigation">
                        <FaTimes />
                    </button>
                </div>

                <div className="py-3 text-center border-bottom">
                    <h4 className="fw-bold mb-0">💰 Income Tracker</h4>
                    <small>Admin Panel</small>
                </div>

                <div className="flex-grow-1 overflow-auto">
                    <ul className="nav flex-column py-3">
                        <li className="nav-item">
                            <NavLink to="/" end className={linkClass} onClick={closeSidebar}>
                                <span className="me-3 fs-5"><FaTachometerAlt /></span>Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/documents" className={linkClass} onClick={closeSidebar}>
                                <span className="me-3 fs-5"><FaFileAlt /></span>Documents
                            </NavLink>
                        </li>

                        {menuGroups.map((group) => {
                            const isOpen = Boolean(openGroups[group.title]);
                            const isActive = group.paths.some((path) =>
                                path === "/charts" ? location.pathname.startsWith(path) : location.pathname === path || location.pathname.startsWith(`${path}/`),
                            );

                            return (
                                <li className="nav-item" key={group.title}>
                                    <button
                                        type="button"
                                        className={`btn w-100 text-start px-4 py-3 d-flex align-items-center ${isActive ? "text-white fw-bold" : "text-light"}`}
                                        aria-expanded={isOpen}
                                        onClick={() => toggleGroup(group.title)}
                                    >
                                        <span className="me-3 fs-5">{group.icon}</span>
                                        <span className="flex-grow-1">{group.title}</span>
                                        <FaChevronDown className={`small transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {isOpen && (
                                        <ul className="nav flex-column pb-2">
                                            {group.items.map((item) => (
                                                <li key={item.path}>
                                                    <NavLink
                                                        to={item.path}
                                                        end={item.path === "/charts"}
                                                        className={(linkState) => `${linkClass(linkState)} ps-5 py-2`}
                                                        onClick={closeSidebar}
                                                    >
                                                        <span className="me-2">{item.icon || "•"}</span>
                                                        {item.title}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}

                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
