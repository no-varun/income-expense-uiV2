import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaMoneyBillWave, FaHandHoldingUsd, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import BrandImage from "../../components/common/BrandImage";
import Pagination from "../../components/common/Pagination";
import { getLoans, deleteLoan, repayLoan } from "../../api/loanApi";
import { getCategories } from "../../api/categoryApi";
import { getAccounts } from "../../api/accountApi";
import { getCategoryBadgeStyle, getPaymentModeBadgeClass } from "../../utils/badgeStyles";
import { notify } from "../../utils/notifications";

const LoanList = () => {
    const [loans, setLoans] = useState([]);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    const [totals, setTotals] = useState({
        totalAmount: 0,
        totalPendingAmount: 0,
        totalRepaidAmount: 0
    });

    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchInput, setSearchInput] = useState("");
    const [categoryInput, setCategoryInput] = useState("");
    const [accountInput, setAccountInput] = useState("");
    const [statusInput, setStatusInput] = useState("");
    const [fromDateInput, setFromDateInput] = useState("");
    const [toDateInput, setToDateInput] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [account, setAccount] = useState("");
    const [status, setStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Repayment Modal State
    const [repayModalOpen, setRepayModalOpen] = useState(false);
    const [repayingLoan, setRepayingLoan] = useState(null);
    const [repayAmount, setRepayAmount] = useState("");
    const [repayAccount, setRepayAccount] = useState("");
    const [repayDate, setRepayDate] = useState(new Date().toISOString().split("T")[0]);
    const [repayNote, setRepayNote] = useState("");
    const [repayLoading, setRepayLoading] = useState(false);

    // Load Categories & Accounts
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [catRes, accRes] = await Promise.all([
                    getCategories({ limit: 100, type: "LOAN" }),
                    getAccounts({ limit: 100 })
                ]);
                const catRows = catRes?.data?.rows || catRes?.data || catRes?.rows || [];
                const accRows = accRes?.data?.rows || accRes?.data || accRes?.rows || [];
                setCategories(Array.isArray(catRows) ? catRows : []);
                setAccounts(Array.isArray(accRows) ? accRows : []);
            } catch {
                // Ignore filter load error
            }
        };
        fetchFilters();
    }, []);

    // Load Loans
    const loadLoans = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page,
                limit
            };

            if (search) params.search = search;
            if (category) params.category = category;
            if (account) params.account = account;
            if (fromDate) params.from = fromDate;
            if (toDate) params.to = toDate;

            if (status === "pending") {
                params.pendingOnly = "true";
            } else if (status === "repaid") {
                params.loanRepaid = "true";
            }

            const response = await getLoans(params);

            let loanRows = [];
            let totalCount = 0;
            let aggTotal = 0;
            let aggPending = 0;
            let aggRepaid = 0;

            if (response?.success && response?.data) {
                const inner = response.data;
                loanRows = Array.isArray(inner?.data) ? inner.data : (Array.isArray(inner) ? inner : []);
                totalCount = inner?.total || loanRows.length;
                aggTotal = Number(inner?.totalAmount || 0);
                aggPending = Number(inner?.totalPendingAmount || 0);
                aggRepaid = Number(inner?.totalRepaidAmount || Math.max(0, aggTotal - aggPending));
            } else if (Array.isArray(response?.data)) {
                loanRows = response.data;
                totalCount = response?.total || loanRows.length;
            } else if (Array.isArray(response)) {
                loanRows = response;
                totalCount = loanRows.length;
            }

            // Fallback calculation for summary totals if not returned by server
            if (aggTotal === 0 && loanRows.length > 0) {
                aggTotal = loanRows.reduce((sum, item) => sum + Number(item.amount || 0), 0);
                aggPending = loanRows.reduce((sum, item) => sum + Number(item.pendingAmount ?? item.amount ?? 0), 0);
                aggRepaid = Math.max(0, aggTotal - aggPending);
            }

            setLoans(loanRows);
            setTotal(totalCount);
            setTotals({
                totalAmount: aggTotal,
                totalPendingAmount: aggPending,
                totalRepaidAmount: aggRepaid
            });
        } catch (error) {
            notify(error?.response?.data?.message || error?.message || "Failed to load loans.");
            setLoans([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, category, account, status, fromDate, toDate]);

    useEffect(() => {
        loadLoans();
    }, [loadLoans]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setSearch(searchInput.trim());
        setCategory(categoryInput);
        setAccount(accountInput);
        setStatus(statusInput);
        setFromDate(fromDateInput);
        setToDate(toDateInput);
        setPage(1);
    };

    const handleFilterReset = () => {
        setSearchInput("");
        setCategoryInput("");
        setAccountInput("");
        setStatusInput("");
        setFromDateInput("");
        setToDateInput("");

        setSearch("");
        setCategory("");
        setAccount("");
        setStatus("");
        setFromDate("");
        setToDate("");
        setPage(1);
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete loan "${title}"? Any remaining unpaid loan balance will be deducted from the account.`)) {
            return;
        }

        try {
            const response = await deleteLoan(id);
            const isSuccess = response?.success === true || response?.data?.success === true;
            if (isSuccess) {
                notify(response?.message || "Loan deleted successfully.");
                loadLoans();
            } else {
                notify(response?.message || "Failed to delete loan.");
            }
        } catch (error) {
            notify(error?.response?.data?.message || error?.message || "Unable to delete loan.");
        }
    };

    const openRepayModal = (loan) => {
        setRepayingLoan(loan);
        setRepayAmount("");
        setRepayAccount(loan.account?._id || loan.account || "");
        setRepayDate(new Date().toISOString().split("T")[0]);
        setRepayNote("");
        setRepayModalOpen(true);
    };

    const handleRepaySubmit = async (e) => {
        e.preventDefault();
        if (!repayingLoan) return;

        const amountNum = Number(repayAmount);
        const pendingNum = Number(repayingLoan.pendingAmount ?? repayingLoan.amount);

        if (!Number.isFinite(amountNum) || amountNum <= 0) {
            notify("Please enter a valid repayment amount greater than 0.");
            return;
        }

        if (amountNum > pendingNum) {
            notify(`Repayment amount cannot exceed pending balance of ₹${pendingNum.toLocaleString("en-IN")}`);
            return;
        }

        if (!repayAccount) {
            notify("Please select a repayment account.");
            return;
        }

        try {
            setRepayLoading(true);
            const response = await repayLoan(repayingLoan._id, {
                amount: amountNum,
                account: repayAccount,
                date: repayDate,
                note: repayNote.trim()
            });

            const isSuccess = response?.success === true || response?.data?.success === true;
            if (isSuccess) {
                notify(response?.message || "Repayment recorded successfully.");
                setRepayModalOpen(false);
                setRepayingLoan(null);
                loadLoans();
            } else {
                notify(response?.message || "Failed to record repayment.");
            }
        } catch (error) {
            notify(error?.response?.data?.message || error?.message || "Failed to record repayment.");
        } finally {
            setRepayLoading(false);
        }
    };

    const formatCurrency = (val) => {
        return Number(val || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="container-fluid py-2 px-0">
            {/* PAGE HEADER */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <h3 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                        <FaHandHoldingUsd className="text-primary" /> Loans (Borrowed)
                    </h3>
                    <small className="text-muted">
                        Manage borrowed loans, track repayments, and monitor liabilities
                    </small>
                </div>
                <Link to="/loans/add" className="btn btn-primary rounded-pill px-3 shadow-sm d-flex align-items-center gap-2">
                    <FaPlus /> Take Loan
                </Link>
            </div>

            {/* SUMMARY CARDS */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-primary text-white">
                        <div className="card-body p-3">
                            <div className="text-white-50 small fw-medium">Total Loan Taken</div>
                            <div className="fs-4 fw-bold mt-1">₹ {formatCurrency(totals.totalAmount)}</div>
                            <small className="text-white-50">{total} loan records</small>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-danger text-white">
                        <div className="card-body p-3">
                            <div className="text-white-50 small fw-medium">Pending Loan Balance</div>
                            <div className="fs-4 fw-bold mt-1">₹ {formatCurrency(totals.totalPendingAmount)}</div>
                            <small className="text-white-50">Current outstanding liability</small>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-success text-white">
                        <div className="card-body p-3">
                            <div className="text-white-50 small fw-medium">Repaid So Far</div>
                            <div className="fs-4 fw-bold mt-1">₹ {formatCurrency(totals.totalRepaidAmount)}</div>
                            <small className="text-white-50">Returned to lenders</small>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white border">
                        <div className="card-body p-3">
                            <div className="text-muted small fw-medium">Active Loans</div>
                            <div className="fs-4 fw-bold text-dark mt-1">
                                {loans.filter(l => Number(l.pendingAmount ?? l.amount) > 0).length}
                            </div>
                            <small className="text-muted">Loans with balance remaining</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTER CARD */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-3">
                    <form onSubmit={handleFilterSubmit}>
                        <div className="row g-2 align-items-end">
                            <div className="col-12 col-md-3">
                                <label className="form-label small fw-semibold text-muted mb-1">Search</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Search by title..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>

                            <div className="col-6 col-md-2">
                                <label className="form-label small fw-semibold text-muted mb-1">Category</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={categoryInput}
                                    onChange={(e) => setCategoryInput(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-6 col-md-2">
                                <label className="form-label small fw-semibold text-muted mb-1">Account</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={accountInput}
                                    onChange={(e) => setAccountInput(e.target.value)}
                                >
                                    <option value="">All Accounts</option>
                                    {accounts.map(acc => (
                                        <option key={acc._id} value={acc._id}>{acc.name} ({acc.bank})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-6 col-md-2">
                                <label className="form-label small fw-semibold text-muted mb-1">Status</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={statusInput}
                                    onChange={(e) => setStatusInput(e.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending Only</option>
                                    <option value="repaid">Fully Repaid</option>
                                </select>
                            </div>

                            <div className="col-6 col-md-3 d-flex gap-2">
                                <button type="submit" className="btn btn-primary btn-sm rounded-pill flex-grow-1">
                                    Filter
                                </button>
                                <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={handleFilterReset}>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive mb-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: "5%" }}>#</th>
                                <th>Loan Title</th>
                                <th className="text-end">Total Amount</th>
                                <th className="text-end">Pending Balance</th>
                                <th className="text-end">Repaid</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Receiving Account</th>
                                <th>Date</th>
                                <th className="text-center" style={{ width: "16%" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="10" className="text-center py-5">
                                        <div className="spinner-border text-primary spinner-border-sm me-2" role="status" />
                                        <span>Loading loans...</span>
                                    </td>
                                </tr>
                            ) : loans.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="text-center py-5 text-muted">
                                        <FaHandHoldingUsd className="fs-1 text-muted mb-2 opacity-50" />
                                        <div>No loans found.</div>
                                        <Link to="/loans/add" className="btn btn-sm btn-outline-primary mt-2 rounded-pill">
                                            Take a Loan
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                loans.map((loan, idx) => {
                                    const amount = Number(loan.amount || 0);
                                    const pending = Number(loan.pendingAmount ?? loan.amount);
                                    const repaid = Math.max(0, amount - pending);
                                    const isRepaid = pending === 0;

                                    return (
                                        <tr key={loan._id}>
                                            <td className="text-muted small">{(page - 1) * limit + idx + 1}</td>
                                            <td>
                                                <div className="fw-semibold text-dark">{loan.title}</div>
                                                {loan.note && (
                                                    <small className="text-muted text-truncate d-block" style={{ maxWidth: "220px" }}>
                                                        {loan.note}
                                                    </small>
                                                )}
                                            </td>
                                            <td className="text-end fw-bold">₹ {formatCurrency(amount)}</td>
                                            <td className="text-end fw-bold text-danger">
                                                ₹ {formatCurrency(pending)}
                                            </td>
                                            <td className="text-end text-success fw-semibold">
                                                ₹ {formatCurrency(repaid)}
                                            </td>
                                            <td>
                                                {isRepaid ? (
                                                    <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
                                                        <FaCheckCircle size={11} /> Fully Repaid
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle d-inline-flex align-items-center gap-1">
                                                        <FaExclamationCircle size={11} /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {loan.category?.name ? (
                                                    <span className="badge" style={getCategoryBadgeStyle(loan.category)}>
                                                        {loan.category.name}
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-light text-muted">General</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <BrandImage type="bank" value={loan.account?.bank || loan.bank} size="1.6rem" />
                                                    <span className="small fw-medium">
                                                        {loan.account?.name || "Account"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="small text-muted">
                                                {loan.date ? new Date(loan.date).toLocaleDateString("en-IN") : "-"}
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-1">
                                                    {!isRepaid && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-success rounded-pill px-2 py-1 small"
                                                            onClick={() => openRepayModal(loan)}
                                                            title="Repay installment"
                                                        >
                                                            <FaMoneyBillWave className="me-1" /> Repay
                                                        </button>
                                                    )}
                                                    <Link
                                                        to={`/loans/edit/${loan._id}`}
                                                        className="btn btn-sm btn-outline-primary p-1 rounded-circle"
                                                        style={{ width: "30px", height: "30px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                                        title="Edit loan"
                                                    >
                                                        <FaEdit size={13} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger p-1 rounded-circle"
                                                        style={{ width: "30px", height: "30px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                                        onClick={() => handleDelete(loan._id, loan.title)}
                                                        title="Delete loan"
                                                    >
                                                        <FaTrash size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {total > limit && (
                    <div className="card-footer bg-white border-top py-3 d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} loans
                        </small>
                        <Pagination
                            page={page}
                            limit={limit}
                            total={total}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </div>
                )}
            </div>

            {/* REPAYMENT MODAL */}
            {repayModalOpen && repayingLoan && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow rounded-4">
                            <div className="modal-header border-bottom py-3">
                                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                                    <FaMoneyBillWave className="text-success" /> Record Loan Repayment
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setRepayModalOpen(false)}
                                    disabled={repayLoading}
                                />
                            </div>
                            <form onSubmit={handleRepaySubmit}>
                                <div className="modal-body p-4">
                                    {/* LOAN INFO CARD */}
                                    <div className="p-3 rounded-3 bg-light border mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-bold">{repayingLoan.title}</div>
                                                <small className="text-muted">
                                                    Total Loan: ₹{formatCurrency(repayingLoan.amount)}
                                                </small>
                                            </div>
                                            <div className="text-end">
                                                <div className="small text-muted">Pending Balance</div>
                                                <div className="fs-5 fw-bold text-danger">
                                                    ₹{formatCurrency(repayingLoan.pendingAmount ?? repayingLoan.amount)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* REPAYMENT AMOUNT */}
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label className="form-label small fw-semibold text-dark mb-0">
                                                Repayment Amount <span className="text-danger">*</span>
                                            </label>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 small text-decoration-none"
                                                onClick={() => setRepayAmount(String(repayingLoan.pendingAmount ?? repayingLoan.amount))}
                                            >
                                                Pay Full Balance
                                            </button>
                                        </div>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">₹</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="0.00"
                                                min="0.01"
                                                max={Number(repayingLoan.pendingAmount ?? repayingLoan.amount)}
                                                step="0.01"
                                                value={repayAmount}
                                                onChange={(e) => setRepayAmount(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* REPAYMENT ACCOUNT */}
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-dark">
                                            Deduct From Account <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            value={repayAccount}
                                            onChange={(e) => setRepayAccount(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Account</option>
                                            {accounts.map(acc => (
                                                <option key={acc._id} value={acc._id}>
                                                    {acc.name} ({acc.bank}) - ₹{formatCurrency(acc.openingBalance)}
                                                </option>
                                            ))}
                                        </select>
                                        <small className="text-muted">
                                            The repayment will be debited from this account's balance.
                                        </small>
                                    </div>

                                    {/* DATE */}
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-dark">Repayment Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={repayDate}
                                            onChange={(e) => setRepayDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* NOTE */}
                                    <div className="mb-0">
                                        <label className="form-label small fw-semibold text-dark">Repayment Note</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Month 1 EMI, Partial return, Reference no."
                                            value={repayNote}
                                            onChange={(e) => setRepayNote(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer border-top py-3">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary rounded-pill px-3"
                                        onClick={() => setRepayModalOpen(false)}
                                        disabled={repayLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success rounded-pill px-4"
                                        disabled={repayLoading}
                                    >
                                        {repayLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                                Recording...
                                            </>
                                        ) : (
                                            "Confirm Repayment"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoanList;
