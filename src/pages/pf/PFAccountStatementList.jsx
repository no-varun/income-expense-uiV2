import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Pagination from "../../components/common/Pagination";
import { notify } from "../../utils/notifications";
import {
    deletePFAccountStatement,
    getPFAccountStatements,
    getPFSummary
} from "../../api/pfAccountStatementApi";

const formatAmount = (amount) => `INR ${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;

const formatDate = (value, options) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-IN", options);
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);

const PFAccountStatementList = () => {
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [year, setYear] = useState(currentYear);
    const [transactionType, setTransactionType] = useState("");

    const loadStatements = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getPFAccountStatements({
                page,
                limit,
                year,
                ...(transactionType ? { transactionType } : {})
            });

            if (!response?.success) {
                throw new Error(response?.message || "Unable to fetch PF statements.");
            }

            const data = response.data || {};
            setRows(Array.isArray(data.rows) ? data.rows : []);
            setTotal(Number(data.total || 0));
        } catch (error) {
            setRows([]);
            setTotal(0);
            notify(error?.response?.data?.message || error?.message || "Unable to fetch PF statements.");
        } finally {
            setLoading(false);
        }
    }, [limit,page, transactionType, year]);

    const loadSummary = useCallback(async () => {
        try {
            const response = await getPFSummary();
            if (response?.success) setSummary(response.data || {});
        } catch (error) {
            setSummary({});
        }
    }, []);

    useEffect(() => {
        loadStatements();
    }, [loadStatements]);

    useEffect(() => {
        loadSummary();
    }, [loadSummary]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this PF statement?")) return;

        try {
            setDeletingId(id);
            const response = await deletePFAccountStatement(id);
            if (!response?.success) {
                throw new Error(response?.message || "Unable to delete PF statement.");
            }
            notify(response.message || "PF statement deleted successfully.");
            if (rows.length === 1 && page > 1) setPage(page - 1);
            else loadStatements();
            loadSummary();
        } catch (error) {
            notify(error?.response?.data?.message || error?.message || "Unable to delete PF statement.");
        } finally {
            setDeletingId(null);
        }
    };

    const updateFilter = (setter, value) => {
        setter(value);
        setPage(1);
    };

    const totalPages = Math.ceil(total / limit) || 1;

    return (
        <div className="container-fluid px-4 py-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h3 className="mb-1">PF Statements</h3>
                    <div className="text-muted">Track EPF, EPS, and pension contributions.</div>
                </div>
                <Link to="/pf-statements/add" className="btn btn-primary">
                    <FaPlus className="me-2" /> Add PF Statement
                </Link>
            </div>

            <div className="row g-3 mb-4">
                {[
                    ["Employee Share", summary.employeeShare, "text-primary"],
                    ["Employer Share", summary.employerShare, "text-success"],
                    ["Pension Share", summary.pensionShare, "text-warning"],
                    ["Total Balance", summary.totalBalance, "text-dark"]
                ].map(([label, value, color]) => (
                    <div className="col-sm-6 col-xl-3" key={label}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="text-muted small">{label}</div>
                                <div className={`fs-5 fw-bold mt-1 ${color}`}>{formatAmount(value)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card shadow-sm">
                <div className="card-body border-bottom">
                    <div className="row g-3 align-items-end">
                        <div className="col-sm-4 col-lg-3">
                            <label className="form-label">Year</label>
                            <select className="form-select" value={year} onChange={(event) => updateFilter(setYear, Number(event.target.value))}>
                                {years.map((item) => <option value={item} key={item}>{item}</option>)}
                            </select>
                        </div>
                        <div className="col-sm-4 col-lg-3">
                            <label className="form-label">Transaction Type</label>
                            <select className="form-select" value={transactionType} onChange={(event) => updateFilter(setTransactionType, event.target.value)}>
                                <option value="">All types</option>
                                <option value="CREDIT">Credit</option>
                                <option value="DEBIT">Debit</option>
                            </select>
                        </div>
                        <div className="col-sm-4 col-lg-3">
                            <label className="form-label">Rows per page</label>
                            <select className="form-select" value={limit} onChange={(event) => { setLimit(Number(event.target.value)); setPage(1); }}>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Wage Month</th>
                                <th>Transaction Date</th>
                                <th>Particulars</th>
                                <th className="text-end">EPF Wages</th>
                                <th className="text-end">EPS Wages</th>
                                <th className="text-end">Employee</th>
                                <th className="text-end">Employer</th>
                                <th className="text-end">Pension</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="9" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
                            ) : rows.length === 0 ? (
                                <tr><td colSpan="9" className="text-center text-muted py-5">No PF statements found for the selected filters.</td></tr>
                            ) : rows.map((statement) => (
                                <tr key={statement._id}>
                                    <td>{formatDate(statement.wageMonth, { month: "short", year: "numeric" })}</td>
                                    <td>{formatDate(statement.transactionDate, { day: "2-digit", month: "short", year: "numeric" })}</td>
                                    <td>
                                        <div className="fw-semibold">{statement.particulars}</div>
                                        <div className="small text-muted">{statement.referenceNumber || statement.pfAccountNumber || "-"}</div>
                                        <span className={`badge mt-1 ${statement.transactionType === "DEBIT" ? "bg-danger" : "bg-success"}`}>{statement.transactionType}</span>
                                    </td>
                                    <td className="text-end">{formatAmount(statement.epfWages)}</td>
                                    <td className="text-end">{formatAmount(statement.epsWages)}</td>
                                    <td className="text-end">{formatAmount(statement.employeeShare)}</td>
                                    <td className="text-end">{formatAmount(statement.employerShare)}</td>
                                    <td className="text-end">{formatAmount(statement.pensionShare)}</td>
                                    <td>
                                        <div className="d-flex justify-content-end gap-2">
                                            <Link to={`/pf-statements/edit/${statement._id}`} className="btn btn-sm btn-outline-primary" title="Edit PF statement" aria-label="Edit PF statement"><FaEdit /></Link>
                                            <button type="button" className="btn btn-sm btn-outline-danger" title="Delete PF statement" aria-label="Delete PF statement" disabled={deletingId === statement._id} onClick={() => handleDelete(statement._id)}>
                                                {deletingId === statement._id ? <span className="spinner-border spinner-border-sm" /> : <FaTrash />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="card-footer d-flex flex-wrap align-items-center justify-content-between gap-3 bg-white">
                        <div className="text-muted small">Page {page} of {totalPages} ({total} statements)</div>
                        <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PFAccountStatementList;
