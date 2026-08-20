import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaPlus,
    FaSearch,
    FaSync,
    FaEdit,
    FaTrash,
    FaChartLine
} from "react-icons/fa";

import {
    getInvestments,
    getInvestmentSummary,
    deleteInvestment
} from "../../api/investmentApi";

import {
    getAccounts
} from "../../api/accountApi";


const InvestmentList = () => {

    const [investments, setInvestments] = useState([]);

    const [accounts, setAccounts] = useState([]);

    const [summary, setSummary] = useState({
        totalInvested: 0,
        totalCurrentValue: 0,
        totalProfitLoss: 0,
        returnPercentage: 0,
        typeSummary: []
    });

    const [loading, setLoading] = useState(true);

    const [accountsLoading, setAccountsLoading] = useState(true);

    const [deleting, setDeleting] = useState(null);

    const [search, setSearch] = useState("");

    const [type, setType] = useState("");

    const [account, setAccount] = useState("");

    const [status, setStatus] = useState("");

    const [dateFrom, setDateFrom] = useState("");

    const [dateTo, setDateTo] = useState("");

    const [page, setPage] = useState(1);

    const limit = 10;

    const [total, setTotal] = useState(0);


    const investmentTypes = [
        "FD",
        "RD",
        "SIP",
        "STOCK",
        "MUTUAL_FUND",
        "GOLD",
        "OTHER"
    ];


    const getTypeLabel = (value) => {

        const labels = {
            FD: "FD",
            RD: "RD",
            SIP: "SIP",
            STOCK: "Stock",
            MUTUAL_FUND: "Mutual Fund",
            GOLD: "Gold",
            OTHER: "Other"
        };

        return labels[value] || value;

    };


    const getTypeBadge = (value) => {

        switch (value) {

            case "FD":
                return "bg-warning text-dark";

            case "RD":
                return "bg-info text-dark";

            case "SIP":
                return "bg-primary";

            case "STOCK":
                return "bg-success";

            case "MUTUAL_FUND":
                return "bg-secondary";

            case "GOLD":
                return "bg-warning text-dark";

            default:
                return "bg-dark";

        }

    };


    const loadAccounts = async () => {

        try {

            setAccountsLoading(true);

            const response =
                await getAccounts();

            if (response.success) {

                const rows =
                    Array.isArray(response.data)
                        ? response.data
                        : response.data?.rows || [];

                setAccounts(rows);

            } else {

                setAccounts([]);

            }

        } catch (error) {

            console.error(
                "Get Accounts Error:",
                error
            );

            setAccounts([]);

        } finally {

            setAccountsLoading(false);

        }

    };


    const loadInvestments = async () => {

        try {

            setLoading(true);

            const params = {
                page,
                limit
            };


            if (search.trim()) {
                params.search = search.trim();
            }

            if (type) {
                params.type = type;
            }

            if (account) {
                params.account = account;
            }

            if (status !== "") {
                params.status = status;
            }

            if (dateFrom) {
                params.dateFrom = dateFrom;
            }

            if (dateTo) {
                params.dateTo = dateTo;
            }


            const response =
                await getInvestments(params);


            if (response.success) {

                setInvestments(
                    response.data?.rows || []
                );

                setTotal(
                    response.data?.total || 0
                );

            } else {

                setInvestments([]);

                setTotal(0);

            }

        } catch (error) {

            console.error(
                "Get Investments Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to load investments."
            );

        } finally {

            setLoading(false);

        }

    };


    const loadSummary = async () => {

        try {

            const response =
                await getInvestmentSummary();

            if (response.success) {

                setSummary(
                    response.data || {}
                );

            }

        } catch (error) {

            console.error(
                "Get Investment Summary Error:",
                error
            );

        }

    };


    useEffect(() => {

        loadAccounts();

    }, []);


    useEffect(() => {

        loadInvestments();

    }, [
        page,
        search,
        type,
        account,
        status,
        dateFrom,
        dateTo
    ]);


    useEffect(() => {

        loadSummary();

    }, []);


    const handleReset = () => {

        setSearch("");
        setType("");
        setAccount("");
        setStatus("");
        setDateFrom("");
        setDateTo("");
        setPage(1);

    };


    const handleRefresh = () => {

        loadInvestments();
        loadSummary();

    };


    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this investment?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setDeleting(id);

            const response =
                await deleteInvestment(id);


            if (response.success) {

                alert(
                    "Investment deleted successfully."
                );

                if (
                    investments.length === 1 &&
                    page > 1
                ) {

                    setPage(page - 1);

                } else {

                    loadInvestments();

                }

                loadSummary();

            } else {

                alert(
                    response.message ||
                    "Unable to delete investment."
                );

            }

        } catch (error) {

            console.error(
                "Delete Investment Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete investment."
            );

        } finally {

            setDeleting(null);

        }

    };


    const formatAmount = (amount) => {

        return Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        );

    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    const profitLossClass = (value) => {

        if (Number(value) > 0) {
            return "text-success";
        }

        if (Number(value) < 0) {
            return "text-danger";
        }

        return "text-muted";

    };


    const totalPages =
        Math.ceil(total / limit);


    return (

        <div className="container-fluid">

            {/* Header */}

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">

                <div>

                    <h3 className="mb-1">
                        Investments
                    </h3>

                    <small className="text-muted">
                        Manage FD, RD, SIP, Stocks, Mutual Funds and Gold
                    </small>

                </div>


                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleRefresh}
                        disabled={loading}
                    >

                        <FaSync className="me-2" />

                        Refresh

                    </button>


                    <Link
                        to="/investments/add"
                        className="btn btn-primary"
                    >

                        <FaPlus className="me-2" />

                        Add Investment

                    </Link>

                </div>

            </div>


            {/* Summary */}

            <div className="row g-3 mb-4">

                <div className="col-xl-3 col-md-6">

                    <div className="card shadow-sm h-100">

                        <div className="card-body">

                            <small className="text-muted">
                                Total Invested
                            </small>

                            <h4 className="mt-2 mb-0">

                                {
                                    formatAmount(
                                        summary.totalInvested
                                    )
                                }

                            </h4>

                        </div>

                    </div>

                </div>


                <div className="col-xl-3 col-md-6">

                    <div className="card shadow-sm h-100">

                        <div className="card-body">

                            <small className="text-muted">
                                Current Value
                            </small>

                            <h4 className="mt-2 mb-0 text-primary">

                                {
                                    formatAmount(
                                        summary.totalCurrentValue
                                    )
                                }

                            </h4>

                        </div>

                    </div>

                </div>


                <div className="col-xl-3 col-md-6">

                    <div className="card shadow-sm h-100">

                        <div className="card-body">

                            <small className="text-muted">
                                Profit / Loss
                            </small>

                            <h4
                                className={`mt-2 mb-0 ${profitLossClass(
                                    summary.totalProfitLoss
                                )}`}
                            >

                                {
                                    Number(
                                        summary.totalProfitLoss || 0
                                    ) >= 0
                                        ? "+"
                                        : ""
                                }

                                {
                                    formatAmount(
                                        summary.totalProfitLoss
                                    )
                                }

                            </h4>

                        </div>

                    </div>

                </div>


                <div className="col-xl-3 col-md-6">

                    <div className="card shadow-sm h-100">

                        <div className="card-body">

                            <small className="text-muted">
                                Return
                            </small>

                            <h4
                                className={`mt-2 mb-0 ${profitLossClass(
                                    summary.totalProfitLoss
                                )}`}
                            >

                                {
                                    Number(
                                        summary.returnPercentage || 0
                                    ).toFixed(2)
                                }%

                            </h4>

                        </div>

                    </div>

                </div>

            </div>


            {/* Filters */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <div className="row g-3">

                        {/* Search */}

                        <div className="col-xl-3 col-lg-4 col-md-6">

                            <label className="form-label">
                                Search
                            </label>

                            <div className="input-group">

                                <span className="input-group-text">
                                    <FaSearch />
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search investment..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                />

                            </div>

                        </div>


                        {/* Type */}

                        <div className="col-xl-2 col-lg-4 col-md-6">

                            <label className="form-label">
                                Type
                            </label>

                            <select
                                className="form-select"
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                    setPage(1);
                                }}
                            >

                                <option value="">
                                    All Types
                                </option>

                                {
                                    investmentTypes.map(item => (

                                        <option
                                            key={item}
                                            value={item}
                                        >

                                            {
                                                getTypeLabel(item)
                                            }

                                        </option>

                                    ))
                                }

                            </select>

                        </div>


                        {/* Account */}

                        <div className="col-xl-2 col-lg-4 col-md-6">

                            <label className="form-label">
                                Account
                            </label>

                            <select
                                className="form-select"
                                value={account}
                                onChange={(e) => {
                                    setAccount(e.target.value);
                                    setPage(1);
                                }}
                                disabled={accountsLoading}
                            >

                                <option value="">
                                    All Accounts
                                </option>

                                {
                                    accounts.map(item => (

                                        <option
                                            key={item._id}
                                            value={item._id}
                                        >

                                            {item.name}

                                            {
                                                item.bank
                                                    ? ` (${item.bank})`
                                                    : ""
                                            }

                                        </option>

                                    ))
                                }

                            </select>

                        </div>


                        {/* Status */}

                        <div className="col-xl-2 col-lg-4 col-md-6">

                            <label className="form-label">
                                Status
                            </label>

                            <select
                                className="form-select"
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setPage(1);
                                }}
                            >

                                <option value="">
                                    All Status
                                </option>

                                <option value="true">
                                    Active
                                </option>

                                <option value="false">
                                    Inactive
                                </option>

                            </select>

                        </div>


                        {/* From */}

                        <div className="col-xl-1 col-lg-4 col-md-6">

                            <label className="form-label">
                                From
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={dateFrom}
                                onChange={(e) => {
                                    setDateFrom(e.target.value);
                                    setPage(1);
                                }}
                            />

                        </div>


                        {/* To */}

                        <div className="col-xl-1 col-lg-4 col-md-6">

                            <label className="form-label">
                                To
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={dateTo}
                                onChange={(e) => {
                                    setDateTo(e.target.value);
                                    setPage(1);
                                }}
                            />

                        </div>


                        {/* Reset */}

                        <div className="col-xl-1 col-lg-4 col-md-6 d-flex align-items-end">

                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={handleReset}
                            >

                                Reset

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* Table */}

            <div className="card shadow-sm">

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>#</th>

                                    <th>Date</th>

                                    <th>Investment</th>

                                    <th>Type</th>

                                    <th>Account</th>

                                    <th>Invested</th>

                                    <th>Current Value</th>

                                    <th>Profit / Loss</th>

                                    <th>Return</th>

                                    <th>Maturity</th>

                                    <th>Status</th>

                                    <th className="text-end">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {
                                    loading ? (

                                        <tr>

                                            <td
                                                colSpan="12"
                                                className="text-center py-5"
                                            >

                                                <div className="spinner-border text-primary" />

                                                <div className="text-muted mt-2">
                                                    Loading investments...
                                                </div>

                                            </td>

                                        </tr>

                                    ) : investments.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="12"
                                                className="text-center py-5"
                                            >

                                                <FaChartLine
                                                    size={35}
                                                    className="text-muted mb-3"
                                                />

                                                <div className="text-muted">
                                                    No investments found.
                                                </div>

                                            </td>

                                        </tr>

                                    ) : (

                                        investments.map(
                                            (investment, index) => (

                                                <tr
                                                    key={
                                                        investment._id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            (
                                                                page - 1
                                                            ) *
                                                                limit +
                                                            index +
                                                            1
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            formatDate(
                                                                investment.date
                                                            )
                                                        }
                                                    </td>


                                                    <td>

                                                        <div className="fw-semibold">
                                                            {
                                                                investment.name
                                                            }
                                                        </div>

                                                        {
                                                            investment.note && (

                                                                <small className="text-muted">
                                                                    {
                                                                        investment.note
                                                                    }
                                                                </small>

                                                            )
                                                        }

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`badge ${getTypeBadge(
                                                                investment.type
                                                            )}`}
                                                        >

                                                            {
                                                                getTypeLabel(
                                                                    investment.type
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="fw-semibold">
                                                            {
                                                                investment.account?.name ||
                                                                "-"
                                                            }
                                                        </div>

                                                        <small className="text-muted">
                                                            {
                                                                investment.account?.bank ||
                                                                ""
                                                            }
                                                        </small>

                                                    </td>


                                                    <td className="fw-semibold">

                                                        {
                                                            formatAmount(
                                                                investment.investedAmount
                                                            )
                                                        }

                                                    </td>


                                                    <td className="fw-semibold text-primary">

                                                        {
                                                            formatAmount(
                                                                investment.currentValue
                                                            )
                                                        }

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`fw-bold ${profitLossClass(
                                                                investment.profitLoss
                                                            )}`}
                                                        >

                                                            {
                                                                Number(
                                                                    investment.profitLoss || 0
                                                                ) >= 0
                                                                    ? "+"
                                                                    : ""
                                                            }

                                                            {
                                                                formatAmount(
                                                                    investment.profitLoss
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                profitLossClass(
                                                                    investment.profitLoss
                                                                )
                                                            }
                                                        >

                                                            {
                                                                Number(
                                                                    investment.returnPercentage || 0
                                                                ) >= 0
                                                                    ? "+"
                                                                    : ""
                                                            }

                                                            {
                                                                Number(
                                                                    investment.returnPercentage || 0
                                                                ).toFixed(2)
                                                            }%

                                                        </span>

                                                    </td>


                                                    <td>

                                                        {
                                                            investment.maturityDate
                                                                ? formatDate(
                                                                    investment.maturityDate
                                                                )
                                                                : "-"
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            investment.status
                                                                ? (
                                                                    <span className="badge bg-success">
                                                                        Active
                                                                    </span>
                                                                )
                                                                : (
                                                                    <span className="badge bg-secondary">
                                                                        Inactive
                                                                    </span>
                                                                )
                                                        }

                                                    </td>


                                                    <td>

                                                        <div className="d-flex justify-content-end gap-2">

                                                            <Link
                                                                to={`/investments/edit/${investment._id}`}
                                                                className="btn btn-sm btn-outline-primary"
                                                                title="Edit"
                                                            >

                                                                <FaEdit />

                                                            </Link>


                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                disabled={
                                                                    deleting ===
                                                                    investment._id
                                                                }
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        investment._id
                                                                    )
                                                                }
                                                            >

                                                                {
                                                                    deleting ===
                                                                    investment._id
                                                                        ? (
                                                                            <span className="spinner-border spinner-border-sm" />
                                                                        )
                                                                        : (
                                                                            <FaTrash />
                                                                        )
                                                                }

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )
                                }

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* Pagination */}

                {
                    totalPages > 1 && (

                        <div className="card-footer bg-white">

                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">

                                <div className="text-muted">

                                    Page{" "}
                                    <strong>{page}</strong>
                                    {" "}of{" "}
                                    <strong>{totalPages}</strong>

                                    {" "}(
                                    {total} investments
                                    )

                                </div>


                                <div className="d-flex gap-2">

                                    <button
                                        className="btn btn-outline-primary"
                                        disabled={page <= 1}
                                        onClick={() =>
                                            setPage(
                                                page - 1
                                            )
                                        }
                                    >
                                        Previous
                                    </button>


                                    <button
                                        className="btn btn-outline-primary"
                                        disabled={
                                            page >=
                                            totalPages
                                        }
                                        onClick={() =>
                                            setPage(
                                                page + 1
                                            )
                                        }
                                    >
                                        Next
                                    </button>

                                </div>

                            </div>

                        </div>

                    )
                }

            </div>

        </div>

    );

};

export default InvestmentList;