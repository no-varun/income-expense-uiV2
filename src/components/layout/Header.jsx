import { useEffect, useState } from "react";
import { FaBars, FaUserCircle, FaSignOutAlt, FaPalette, FaCheck } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const THEME_OPTIONS = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "ocean", label: "Ocean" },
    { value: "forest", label: "Forest" },
    { value: "violet", label: "Violet" },
    { value: "slate", label: "Slate" },
    { value: "rose", label: "Rose" },
    { value: "teal", label: "Teal" },
];

const Header = ({ sidebarOpen, setSidebarOpen, closeMenuSignal, onHeaderMenuOpen }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("income-expense-theme");
        return THEME_OPTIONS.some((option) => option.value === savedTheme) ? savedTheme : "light";
    });
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("income-expense-theme", theme);
    }, [theme]);

    useEffect(() => {
        setProfileMenuOpen(false);
        setThemeMenuOpen(false);
    }, [closeMenuSignal]);

    const handleLogout = () => {
        logout();
        setProfileMenuOpen(false);
        navigate("/login", { replace: true });
    };

    const getTitle = () => {

        const path = location.pathname;

        if (path === "/") return "Dashboard";

        if (path.startsWith("/categories/add")) return "Add Category";
        if (path.startsWith("/categories/edit")) return "Edit Category";
        if (path.startsWith("/categories")) return "Category";

        if (path.startsWith("/items/add")) return "Add Item";
        if (path.startsWith("/items/edit")) return "Edit Item";
        if (path.startsWith("/items")) return "Items";

        if (path.startsWith("/income/add")) return "Add Income";
        if (path.startsWith("/income/edit")) return "Edit Income";
        if (path.startsWith("/income")) return "Income";

        if (path.startsWith("/expense/add")) return "Add Expense";
        if (path.startsWith("/expense/edit")) return "Edit Expense";
        if (path.startsWith("/expense")) return "Expense";

        if (path.startsWith("/reports")) return "Reports";

        if (path.startsWith("/charts")) return "Charts";

        if (path.startsWith("/profile")) return "Profile";

        return "Income Expense Tracker";

    };

    return (

        <header
            className="header bg-white shadow-sm sticky-top"
            style={{
                borderBottom: "1px solid #dee2e6",
                zIndex: 1030
            }}
        >

            <div className="container-fluid h-100">

                <div className="d-flex align-items-center justify-content-between h-100">

                    {/* Left */}

                    <div className="d-flex align-items-center">

                        <button
                            className="btn btn-outline-primary d-lg-none me-3"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >

                            <FaBars />

                        </button>

                        <h4
                            className="fw-bold mb-0"
                            style={{ fontSize: "1.3rem" }}
                        >

                            {getTitle()}

                        </h4>

                    </div>

                    {/* Right */}

                    <div className="d-flex align-items-center gap-3">
                        <div className="dropdown theme-menu">
                            <button
                                type="button"
                                className="btn btn-outline-secondary theme-toggle"
                                aria-expanded={themeMenuOpen}
                                aria-label="Choose color theme"
                                title="Choose color theme"
                                onClick={() => {
                                    setProfileMenuOpen(false);
                                    setThemeMenuOpen((open) => !open);
                                    onHeaderMenuOpen?.();
                                }}
                            >
                                <FaPalette aria-hidden="true" />
                            </button>
                            {themeMenuOpen && (
                                <div className="dropdown-menu dropdown-menu-end show mt-2 theme-menu-options">
                                    {THEME_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className="dropdown-item d-flex align-items-center justify-content-between"
                                            aria-pressed={theme === option.value}
                                            onClick={() => {
                                                setTheme(option.value);
                                                setThemeMenuOpen(false);
                                            }}
                                        >
                                            {option.label}
                                            {theme === option.value && <FaCheck aria-hidden="true" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="dropdown">
                            <button
                                type="button"
                                className="btn btn-link text-decoration-none text-dark p-0 d-flex align-items-center"
                                aria-expanded={profileMenuOpen}
                                aria-label="Open profile menu"
                                onClick={() => {
                                    setThemeMenuOpen(false);
                                    setProfileMenuOpen((open) => !open);
                                    onHeaderMenuOpen?.();
                                }}
                            >
                                <FaUserCircle size={38} className="text-primary me-2" />
                                <span className="d-none d-md-block text-start">
                                    <span className="d-block fw-semibold">Welcome Admin</span>
                                    <small className="text-muted">Account menu</small>
                                </span>
                            </button>

                            {profileMenuOpen && (
                                <div className="dropdown-menu dropdown-menu-end show mt-2">
                                    <Link
                                        to="/profile"
                                        className="dropdown-item"
                                        onClick={() => setProfileMenuOpen(false)}
                                    >
                                        <FaUserCircle className="me-2" />Profile
                                    </Link>
                                    <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                                        <FaSignOutAlt className="me-2" />Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>

        </header>

    );

};

export default Header;
