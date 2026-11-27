import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaCheckCircle,
    FaClock,
    FaArrowUp,
    FaArrowDown,
    FaWallet
} from "react-icons/fa";
import { notify } from "../../utils/notifications";
import {
    getNextMonthPlans,
    getNextMonthPlanSummary,
    deleteNextMonthPlan,
    updateNextMonthPlanStatus
} from "../../api/nextMonthPlanApi";
import NextMonthPlanForm from "../../components/nextMonthPlan/NextMonthPlanForm";

const formatMonthYearLabel = (monthYearStr) => {
    if (!monthYearStr) return "";
    const [year, month] = monthYearStr.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};

const getRelativeMonthYear = (offsetMonths = 1) => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
};

const formatAmount = (value) => {
    const num = Number(value || 0);
    return num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const NextMonthPlanList = () => {
    // Default to NEXT month (offset +1)
    const [selectedMonthYear, setSelectedMonthYear] = useState(() => getRelativeMonthYear(1));
    const [plans, setPlans] = useState([]);
    const [summary, setSummary] = useState({
        totalPlannedIncome: 0,
        totalPlannedExpense: 0,
        netSavings: 0,
        savingsRate: 0,
        pendingExpense: 0,
        completedExpense: 0,
        pendingIncome: 0,
        completedIncome: 0,
        totalItems: 0,
        incomeItemsCount: 0,
        expenseItemsCount: 0
    });

    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState(""); // "" | "Income" | "Expense"
    const [statusFilter, setStatusFilter] = useState("");
    const [search, setSearch] = useState("");

    // Modal state for quick add/edit
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [modalDefaultType, setModalDefaultType] = useState("Expense");

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [plansRes, summaryRes] = await Promise.all([
                getNextMonthPlans({
                    monthYear: selectedMonthYear,
                    type: typeFilter || undefined,
                    status: statusFilter || undefined,
                    search: search.trim() || undefined,
                    limit: 100
                }),
                getNextMonthPlanSummary(selectedMonthYear)
            ]);

            const planRows = plansRes?.data?.rows || plansRes?.data?.data || plansRes?.data || [];
            setPlans(Array.isArray(planRows) ? planRows : []);

            const sumData = summaryRes?.data?.data || summaryRes?.data || {};
            setSummary({
                totalPlannedIncome: Number(sumData.totalPlannedIncome || 0),
                totalPlannedExpense: Number(sumData.totalPlannedExpense || 0),
                netSavings: Number(sumData.netSavings || 0),
                savingsRate: Number(sumData.savingsRate || 0),
                pendingExpense: Number(sumData.pendingExpense || 0),
                completedExpense: Number(sumData.completedExpense || 0),
                pendingIncome: Number(sumData.pendingIncome || 0),
                completedIncome: Number(sumData.completedIncome || 0),
                totalItems: Number(sumData.totalItems || 0),
                incomeItemsCount: Number(sumData.incomeItemsCount || 0),
                expenseItemsCount: Number(sumData.expenseItemsCount || 0)
            });
        } catch (error) {
            notify(error.response?.data?.message || "Failed to load next month plans");
        } finally {
            setLoading(false);
        }
    }, [selectedMonthYear, typeFilter, statusFilter, search]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const changeMonth = (delta) => {
        const [year, month] = selectedMonthYear.split("-").map(Number);
        const newDate = new Date(year, month - 1 + delta, 1);
        const y = newDate.getFullYear();
        const m = String(newDate.getMonth() + 1).padStart(2, "0");
        setSelectedMonthYear(`${y}-${m}`);
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete planned item: "${title}"?`)) {
            return;
        }
        try {
            const res = await deleteNextMonthPlan(id);
            if (res.success || res.message) {
                notify(res.message || "Plan item deleted");
                loadData();
            }
        } catch (error) {
            notify(error.response?.data?.message || "Delete failed");
        }
    };

    const handleToggleStatus = async (item) => {
        const newStatus = item.status === "Completed" ? "Pending" : "Completed";
        try {
            const res = await updateNextMonthPlanStatus(item._id, newStatus);
            if (res.success || res.data) {
                notify(`Marked as ${newStatus}`);
                loadData();
            }
        } catch (error) {
            notify(error.response?.data?.message || "Status update failed");
        }
    };

    const openAddModal = (type = "Expense") => {
        setEditingItem(null);
        setModalDefaultType(type);
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setModalDefaultType(item.type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleFormSuccess = () => {
        closeModal();
        loadData();
    };

    const expenseRatio = summary.totalPlannedIncome > 0
        ? Math.min(100, Math.round((summary.totalPlannedExpense / summary.totalPlannedIncome) * 100))
        : (summary.totalPlannedExpense > 0 ? 100 : 0);

    return (
        <div className="container-fluid py-3">
            {/* Header Section */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h3 className="mb-1 fw-bold text-dark d-flex align-items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        Next Month Planning
                    </h3>
                    <p className="text-muted small mb-0">
                        Forecast future income and expenses. <em>(Will never deduct or credit account balances)</em>
                    </p>
                </div>

                {/* Actions */}
                <div className="d-flex flex-wrap gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-success d-inline-flex align-items-center gap-1 fw-semibold"
                        onClick={() => openAddModal("Income")}
                    >
                        <FaPlus size={12} /> Plan Income
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary d-inline-flex align-items-center gap-1 fw-semibold shadow-sm"
                        onClick={() => openAddModal("Expense")}
                    >
                        <FaPlus size={12} /> Plan Expense
                    </button>
                </div>
            </div>

            {/* Month Selector Bar */}
            <div className="card shadow-sm border-0 mb-4 bg-white">
                <div className="card-body py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary rounded-circle"
                            style={{ width: "34px", height: "34px", padding: 0 }}
                            onClick={() => changeMonth(-1)}
                            title="Previous Month"
                        >
                            <FaChevronLeft size={12} />
                        </button>
                        <div className="px-3 py-1 bg-light rounded-3 fw-bold fs-5 text-dark">
                            {formatMonthYearLabel(selectedMonthYear)}
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary rounded-circle"
                            style={{ width: "34px", height: "34px", padding: 0 }}
                            onClick={() => changeMonth(1)}
                            title="Next Month"
                        >
                            <FaChevronRight size={12} />
                        </button>
                    </div>

                    {/* Quick month pills */}
                    <div className="d-flex align-items-center gap-2">
                        <input
                            type="month"
                            className="form-control form-control-sm"
                            style={{ width: "160px" }}
                            value={selectedMonthYear}
                            onChange={(e) => e.target.value && setSelectedMonthYear(e.target.value)}
                        />
                        <button
                            type="button"
                            className={`btn btn-sm ${selectedMonthYear === getRelativeMonthYear(0) ? "btn-dark" : "btn-outline-dark"}`}
                            onClick={() => setSelectedMonthYear(getRelativeMonthYear(0))}
                        >
                            Current Month
                        </button>
                        <button
                            type="button"
                            className={`btn btn-sm ${selectedMonthYear === getRelativeMonthYear(1) ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setSelectedMonthYear(getRelativeMonthYear(1))}
                        >
                            Next Month
                        </button>
                    </div>
                </div>
            </div>

            {/* Planning Summary Cards */}
            <div className="row g-3 mb-4">
                {/* Planned Income */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card shadow-sm border-0 h-100 rounded-3 border-start border-4 border-success">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted small fw-semibold">Planned Income</span>
                                <div className="badge bg-success-subtle text-success p-2 rounded-circle">
                                    <FaArrowDown size={14} />
                                </div>
                            </div>
                            <h4 className="fw-bold text-success mb-1">
                                ₹ {formatAmount(summary.totalPlannedIncome)}
                            </h4>
                            <div className="small text-muted">
                                {summary.incomeItemsCount} income {summary.incomeItemsCount === 1 ? "source" : "sources"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Planned Expense */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card shadow-sm border-0 h-100 rounded-3 border-start border-4 border-danger">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted small fw-semibold">Planned Expense</span>
                                <div className="badge bg-danger-subtle text-danger p-2 rounded-circle">
                                    <FaArrowUp size={14} />
                                </div>
                            </div>
                            <h4 className="fw-bold text-danger mb-1">
                                ₹ {formatAmount(summary.totalPlannedExpense)}
                            </h4>
                            <div className="small text-muted">
                                {summary.expenseItemsCount} planned {summary.expenseItemsCount === 1 ? "expense" : "expenses"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Net Savings */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className={`card shadow-sm border-0 h-100 rounded-3 border-start border-4 ${summary.netSavings >= 0 ? "border-primary" : "border-warning"}`}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted small fw-semibold">Net Planned Savings</span>
                                <div className={`badge ${summary.netSavings >= 0 ? "bg-primary-subtle text-primary" : "bg-warning-subtle text-warning"} p-2 rounded-circle`}>
                                    <FaWallet size={14} />
                                </div>
                            </div>
                            <h4 className={`fw-bold mb-1 ${summary.netSavings >= 0 ? "text-primary" : "text-danger"}`}>
                                {summary.netSavings >= 0 ? "+" : ""}₹ {formatAmount(summary.netSavings)}
                            </h4>
                            <div className="small text-muted">
                                Savings rate: {summary.savingsRate}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Expenses */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card shadow-sm border-0 h-100 rounded-3 border-start border-4 border-warning">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted small fw-semibold">Pending to Spend</span>
                                <div className="badge bg-warning-subtle text-warning p-2 rounded-circle">
                                    <FaClock size={14} />
                                </div>
                            </div>
                            <h4 className="fw-bold text-warning-emphasis mb-1">
                                ₹ {formatAmount(summary.pendingExpense)}
                            </h4>
                            <div className="small text-muted">
                                Done: ₹ {formatAmount(summary.completedExpense)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget Utilization Progress Bar */}
            {summary.totalPlannedIncome > 0 && (
                <div className="card shadow-sm border-0 mb-4 bg-white">
                    <div className="card-body py-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="small fw-semibold text-muted">
                                Planned Budget Allocation: <strong>{expenseRatio}% of Income</strong>
                            </span>
                            <span className="small text-muted">
                                Remaining to allocate / save: <strong>₹ {formatAmount(summary.netSavings)}</strong>
                            </span>
                        </div>
                        <div className="progress" style={{ height: "10px" }}>
                            <div
                                className={`progress-bar ${expenseRatio > 100 ? "bg-danger" : expenseRatio > 80 ? "bg-warning" : "bg-success"}`}
                                role="progressbar"
                                style={{ width: `${Math.min(100, expenseRatio)}%` }}
                                aria-valuenow={expenseRatio}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter and Items Table Card */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-bottom py-3">
                    <div className="row g-2 align-items-center">
                        {/* Type Tabs */}
                        <div className="col-12 col-md-5">
                            <div className="btn-group btn-group-sm w-100" role="group">
                                <button
                                    type="button"
                                    className={`btn ${typeFilter === "" ? "btn-dark" : "btn-outline-dark"}`}
                                    onClick={() => setTypeFilter("")}
                                >
                                    All ({summary.totalItems})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${typeFilter === "Expense" ? "btn-danger" : "btn-outline-danger"}`}
                                    onClick={() => setTypeFilter("Expense")}
                                >
                                    Expenses ({summary.expenseItemsCount})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${typeFilter === "Income" ? "btn-success" : "btn-outline-success"}`}
                                    onClick={() => setTypeFilter("Income")}
                                >
                                    Incomes ({summary.incomeItemsCount})
                                </button>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="col-6 col-md-3">
                            <select
                                className="form-select form-select-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Search Input */}
                        <div className="col-6 col-md-4">
                            <input
                                type="search"
                                className="form-control form-control-sm"
                                placeholder="Search plan item..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-body p-0 table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: "40px" }}></th>
                                <th>Type</th>
                                <th>Title / Description</th>
                                <th className="text-center">Expected Date</th>
                                <th className="text-center">Priority</th>
                                <th className="text-end">Amount</th>
                                <th className="text-center">Status</th>
                                <th className="text-center" style={{ width: "120px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-5 text-muted">
                                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                        Loading plans for {formatMonthYearLabel(selectedMonthYear)}...
                                    </td>
                                </tr>
                            ) : plans.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-5 text-muted">
                                        <div className="mb-2 fs-4">📋</div>
                                        <div className="fw-semibold">No planned items for {formatMonthYearLabel(selectedMonthYear)}</div>
                                        <div className="small mt-1">Start planning your future income and expenses.</div>
                                        <div className="mt-3 d-flex justify-content-center gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() => openAddModal("Income")}
                                            >
                                                + Plan Income
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary"
                                                onClick={() => openAddModal("Expense")}
                                            >
                                                + Plan Expense
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                plans.map((item) => {
                                    const isIncome = item.type === "Income";
                                    const isDone = item.status === "Completed";
                                    return (
                                        <tr key={item._id} className={isDone ? "table-light opacity-75" : ""}>
                                            {/* Quick checkbox toggle */}
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0 text-decoration-none"
                                                    onClick={() => handleToggleStatus(item)}
                                                    title={isDone ? "Mark as Pending" : "Mark as Completed"}
                                                >
                                                    {isDone ? (
                                                        <FaCheckCircle className="text-success fs-5" />
                                                    ) : (
                                                        <div
                                                            className="border border-2 rounded-circle"
                                                            style={{ width: "18px", height: "18px", margin: "auto" }}
                                                        ></div>
                                                    )}
                                                </button>
                                            </td>

                                            {/* Type */}
                                            <td>
                                                <span className={`badge ${isIncome ? "bg-success" : "bg-danger"}`}>
                                                    {item.type}
                                                </span>
                                            </td>

                                            {/* Title & Notes */}
                                            <td>
                                                <div className={`fw-semibold ${isDone ? "text-decoration-line-through text-muted" : "text-dark"}`}>
                                                    {item.title}
                                                </div>
                                                {item.notes && (
                                                    <div className="small text-muted text-truncate" style={{ maxWidth: "300px" }}>
                                                        {item.notes}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Expected Date */}
                                            <td className="text-center text-muted small">
                                                {item.expectedDate
                                                    ? new Date(item.expectedDate).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short"
                                                    })
                                                    : "-"}
                                            </td>

                                            {/* Priority */}
                                            <td className="text-center">
                                                <span
                                                    className={`badge ${
                                                        item.priority === "High"
                                                            ? "bg-danger-subtle text-danger"
                                                            : item.priority === "Medium"
                                                            ? "bg-warning-subtle text-warning-emphasis"
                                                            : "bg-secondary-subtle text-secondary"
                                                    }`}
                                                >
                                                    {item.priority || "Medium"}
                                                </span>
                                            </td>

                                            {/* Amount */}
                                            <td className={`text-end fw-bold ${isIncome ? "text-success" : "text-danger"}`}>
                                                {isIncome ? "+" : "-"}₹ {formatAmount(item.amount)}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm py-0 px-2 rounded-pill ${
                                                        isDone
                                                            ? "btn-success"
                                                            : item.status === "Cancelled"
                                                            ? "btn-secondary"
                                                            : "btn-outline-warning text-dark"
                                                    }`}
                                                    onClick={() => handleToggleStatus(item)}
                                                >
                                                    {item.status || "Pending"}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => openEditModal(item)}
                                                    title="Edit Plan"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(item._id, item.title)}
                                                    title="Delete Plan"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Add / Edit Modal */}
            {modalOpen && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content shadow border-0">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">
                                    {editingItem ? "Edit Planned Item" : `Plan Next Month ${modalDefaultType}`}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body p-4">
                                <NextMonthPlanForm
                                    initialData={editingItem}
                                    defaultType={modalDefaultType}
                                    defaultMonthYear={selectedMonthYear}
                                    onSuccess={handleFormSuccess}
                                    onCancel={closeModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NextMonthPlanList;
