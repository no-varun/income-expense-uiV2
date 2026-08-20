import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaSync,
    FaExchangeAlt
} from "react-icons/fa";

import {
    getTransfers,
    deleteTransfer
} from "../../api/transferApi";

import {
    getAccounts
} from "../../api/accountApi";

const TransferList = () => {

    const [transfers, setTransfers] = useState([]);

    const [accounts, setAccounts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [accountsLoading, setAccountsLoading] =
        useState(true);

    const [deleting, setDeleting] = useState(null);

    const [search, setSearch] = useState("");

    const [fromAccount, setFromAccount] =
        useState("");

    const [toAccount, setToAccount] =
        useState("");

    const [dateFrom, setDateFrom] =
        useState("");

    const [dateTo, setDateTo] =
        useState("");

    const [page, setPage] = useState(1);

    const [limit] = useState(10);

    const [total, setTotal] = useState(0);


    const totalPages =
        Math.ceil(total / limit);


    /**
     * Load Active Accounts
     */
    const loadAccounts = async () => {

        try {

            setAccountsLoading(true);

            const response = await getAccounts();

            if (response.success) {

                /*
                 * Depending on your backend response,
                 * support both:
                 *
                 * data: []
                 *
                 * and
                 *
                 * data: { rows: [] }
                 */

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
                "Get Active Accounts Error:",
                error
            );

            setAccounts([]);

            alert(
                error.response?.data?.message ||
                "Unable to load accounts."
            );

        } finally {

            setAccountsLoading(false);

        }

    };


    /**
     * Load Transfers
     */
    const loadTransfers = async () => {

        try {

            setLoading(true);

            const params = {
                page,
                limit
            };


            /*
             * Do not send empty filters.
             */
            if (search.trim()) {

                params.search =
                    search.trim();

            }


            if (fromAccount) {

                params.fromAccount =
                    fromAccount;

            }


            if (toAccount) {

                params.toAccount =
                    toAccount;

            }


            if (dateFrom) {

                params.dateFrom =
                    dateFrom;

            }


            if (dateTo) {

                params.dateTo =
                    dateTo;

            }


            const response =
                await getTransfers(params);


            if (response.success) {

                setTransfers(
                    response.data?.rows || []
                );

                setTotal(
                    response.data?.total || 0
                );

            } else {

                setTransfers([]);

                setTotal(0);

            }

        } catch (error) {

            console.error(
                "Get Transfers Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to load transfers."
            );

        } finally {

            setLoading(false);

        }

    };


    /**
     * Initial Accounts
     */
    useEffect(() => {

        loadAccounts();

    }, []);


    /**
     * Load Transfers when filters change
     */
    useEffect(() => {

        loadTransfers();

    }, [
        page,
        search,
        fromAccount,
        toAccount,
        dateFrom,
        dateTo
    ]);


    /**
     * Search
     */
    const handleSearch = (e) => {

        setSearch(
            e.target.value
        );

        setPage(1);

    };


    /**
     * From Account
     */
    const handleFromAccountChange = (e) => {

        setFromAccount(
            e.target.value
        );

        setPage(1);

    };


    /**
     * To Account
     */
    const handleToAccountChange = (e) => {

        setToAccount(
            e.target.value
        );

        setPage(1);

    };


    /**
     * Date From
     */
    const handleDateFromChange = (e) => {

        setDateFrom(
            e.target.value
        );

        setPage(1);

    };


    /**
     * Date To
     */
    const handleDateToChange = (e) => {

        setDateTo(
            e.target.value
        );

        setPage(1);

    };


    /**
     * Reset Filters
     */
    const handleReset = () => {

        setSearch("");

        setFromAccount("");

        setToAccount("");

        setDateFrom("");

        setDateTo("");

        setPage(1);

    };


    /**
     * Delete Transfer
     */
    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this transfer?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeleting(id);

            const response =
                await deleteTransfer(id);


            if (response.success) {

                alert(
                    "Transfer deleted successfully."
                );


                /*
                 * If the current page has
                 * only one record, go back.
                 */
                if (
                    transfers.length === 1 &&
                    page > 1
                ) {

                    setPage(
                        page - 1
                    );

                } else {

                    loadTransfers();

                }

            } else {

                alert(
                    response.message ||
                    "Unable to delete transfer."
                );

            }

        } catch (error) {

            console.error(
                "Delete Transfer Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete transfer."
            );

        } finally {

            setDeleting(null);

        }

    };


    /**
     * Format Currency
     */
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


    /**
     * Format Date
     */
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


    /**
     * Account Label
     */
    const getAccountLabel = (account) => {

        if (!account) {

            return "-";

        }

        return `${account.name || "Account"}${account.bank
            ? ` (${account.bank})`
            : ""
            }`;

    };


    return (

        <div className="container-fluid">

            {/* Header */}

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">

                <div>

                    <h3 className="mb-1">

                        Transfers

                    </h3>

                    <small className="text-muted">

                        Move money between your accounts

                    </small>

                </div>


                <div className="d-flex gap-2">

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={loadTransfers}
                        disabled={loading}
                    >

                        <FaSync className="me-2" />

                        Refresh

                    </button>


                    <Link
                        to="/transfers/add"
                        className="btn btn-primary"
                    >

                        <FaPlus className="me-2" />

                        Add Transfer

                    </Link>

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
                                    placeholder="Search purpose or note..."
                                    value={search}
                                    onChange={
                                        handleSearch
                                    }
                                />

                            </div>

                        </div>


                        {/* From Account */}

                        <div className="col-xl-2 col-lg-4 col-md-6">

                            <label className="form-label">

                                From Account

                            </label>

                            <select
                                className="form-select"
                                value={fromAccount}
                                onChange={
                                    handleFromAccountChange
                                }
                                disabled={
                                    accountsLoading
                                }
                            >

                                <option value="">

                                    All Accounts

                                </option>


                                {

                                    accounts.map(
                                        account => (

                                            <option
                                                key={
                                                    account._id
                                                }
                                                value={
                                                    account._id
                                                }
                                            >

                                                {
                                                    getAccountLabel(
                                                        account
                                                    )
                                                }

                                            </option>

                                        )
                                    )

                                }

                            </select>

                        </div>


                        {/* To Account */}

                        <div className="col-xl-2 col-lg-4 col-md-6">

                            <label className="form-label">

                                To Account

                            </label>

                            <select
                                className="form-select"
                                value={toAccount}
                                onChange={
                                    handleToAccountChange
                                }
                                disabled={
                                    accountsLoading
                                }
                            >

                                <option value="">

                                    All Accounts

                                </option>


                                {

                                    accounts.map(
                                        account => (

                                            <option
                                                key={
                                                    account._id
                                                }
                                                value={
                                                    account._id
                                                }
                                            >

                                                {
                                                    getAccountLabel(
                                                        account
                                                    )
                                                }

                                            </option>

                                        )
                                    )

                                }

                            </select>

                        </div>


                        {/* Date From */}

                        <div className="col-xl-2 col-lg-4 col-md-6">

                            <label className="form-label">

                                From Date

                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={dateFrom}
                                onChange={
                                    handleDateFromChange
                                }
                            />

                        </div>


                        {/* Date To */}

                        <div className="col-xl-2 col-lg-4 col-md-6">

                            <label className="form-label">

                                To Date

                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={dateTo}
                                onChange={
                                    handleDateToChange
                                }
                            />

                        </div>


                        {/* Reset */}

                        <div className="col-xl-1 col-lg-4 col-md-6 d-flex align-items-end">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={handleReset}
                                title="Reset filters"
                            >

                                Reset

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* Transfer Table */}

            <div className="card shadow-sm">

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        From
                                    </th>

                                    <th>
                                        To
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Purpose
                                    </th>

                                    <th>
                                        Note
                                    </th>

                                    <th className="text-end">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {

                                    loading

                                        ?

                                        (

                                            <tr>

                                                <td
                                                    colSpan="8"
                                                    className="text-center py-5"
                                                >

                                                    <div
                                                        className="spinner-border text-primary"
                                                        role="status"
                                                    />

                                                    <div className="text-muted mt-2">

                                                        Loading transfers...

                                                    </div>

                                                </td>

                                            </tr>

                                        )

                                        :

                                        transfers.length === 0

                                            ?

                                            (

                                                <tr>

                                                    <td
                                                        colSpan="8"
                                                        className="text-center py-5"
                                                    >

                                                        <FaExchangeAlt
                                                            size={35}
                                                            className="text-muted mb-3"
                                                        />

                                                        <div className="text-muted">

                                                            No transfers found.

                                                        </div>

                                                    </td>

                                                </tr>

                                            )

                                            :

                                            (

                                                transfers.map(
                                                    (
                                                        transfer,
                                                        index
                                                    ) => (

                                                        <tr
                                                            key={
                                                                transfer._id
                                                            }
                                                        >

                                                            {/* Number */}

                                                            <td>

                                                                {
                                                                    (
                                                                        page -
                                                                        1
                                                                    ) *
                                                                        limit +
                                                                    index +
                                                                    1
                                                                }

                                                            </td>


                                                            {/* Date */}

                                                            <td>

                                                                {
                                                                    formatDate(
                                                                        transfer.date
                                                                    )
                                                                }

                                                            </td>


                                                            {/* From */}

                                                            <td>

                                                                <div className="fw-semibold">

                                                                    {
                                                                        transfer.fromAccount?.name ||
                                                                        "-"
                                                                    }

                                                                </div>

                                                                <small className="text-muted">

                                                                    {
                                                                        transfer.fromAccount?.bank ||
                                                                        ""
                                                                    }

                                                                </small>

                                                            </td>


                                                            {/* To */}

                                                            <td>

                                                                <div className="fw-semibold">

                                                                    {
                                                                        transfer.toAccount?.name ||
                                                                        "-"
                                                                    }

                                                                </div>

                                                                <small className="text-muted">

                                                                    {
                                                                        transfer.toAccount?.bank ||
                                                                        ""
                                                                    }

                                                                </small>

                                                            </td>


                                                            {/* Amount */}

                                                            <td>

                                                                <span className="fw-bold text-primary">

                                                                    {
                                                                        formatAmount(
                                                                            transfer.amount
                                                                        )
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* Purpose */}

                                                            <td>

                                                                {
                                                                    transfer.purpose ||
                                                                    "-"
                                                                }

                                                            </td>


                                                            {/* Note */}

                                                            <td>

                                                                <span
                                                                    className="text-muted"
                                                                    style={{
                                                                        maxWidth:
                                                                            "220px",
                                                                        display:
                                                                            "inline-block",
                                                                        whiteSpace:
                                                                            "nowrap",
                                                                        overflow:
                                                                            "hidden",
                                                                        textOverflow:
                                                                            "ellipsis"
                                                                    }}
                                                                    title={
                                                                        transfer.note ||
                                                                        ""
                                                                    }
                                                                >

                                                                    {
                                                                        transfer.note ||
                                                                        "-"
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* Action */}

                                                            <td>

                                                                <div className="d-flex justify-content-end gap-2">

                                                                    {/* 
                                                                    No edit route
                                                                    yet because
                                                                    transfer
                                                                    editing
                                                                    requires
                                                                    balance
                                                                    recalculation.
                                                                    */}

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        title="Delete"
                                                                        disabled={
                                                                            deleting ===
                                                                            transfer._id
                                                                        }
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                transfer._id
                                                                            )
                                                                        }
                                                                    >

                                                                        {

                                                                            deleting ===
                                                                            transfer._id

                                                                                ?

                                                                                (

                                                                                    <span
                                                                                        className="spinner-border spinner-border-sm"
                                                                                    />

                                                                                )

                                                                                :

                                                                                <FaTrash />

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

                    totalPages > 1 &&

                    (

                        <div className="card-footer bg-white">

                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">

                                <div className="text-muted">

                                    Showing page{" "}

                                    <strong>
                                        {page}
                                    </strong>

                                    {" "}of{" "}

                                    <strong>
                                        {totalPages}
                                    </strong>

                                    {" "}(
                                    {total} transfers
                                    )

                                </div>


                                <div className="d-flex gap-2">

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        disabled={
                                            page <= 1
                                        }
                                        onClick={() =>
                                            setPage(
                                                page - 1
                                            )
                                        }
                                    >

                                        Previous

                                    </button>


                                    <button
                                        type="button"
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

export default TransferList;