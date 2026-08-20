import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaSync
} from "react-icons/fa";

import {
    getAccounts,
    deleteAccount
} from "../../api/accountApi";

const AccountList = () => {

    const [accounts, setAccounts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [deleting, setDeleting] = useState(null);

    const [search, setSearch] = useState("");

    const [bank, setBank] = useState("");

    const [accountType, setAccountType] = useState("");

    const [status, setStatus] = useState("");

    const [page, setPage] = useState(1);

    const [limit] = useState(10);

    const [total, setTotal] = useState(0);


    const totalPages = Math.ceil(total / limit);


    const loadAccounts = async () => {

        try {

            setLoading(true);

            const response = await getAccounts({

                page,

                limit,

                search,

                bank,

                accountType,

                status

            });


            if (response.success) {

                setAccounts(
                    response.data?.rows || []
                );

                setTotal(
                    response.data?.total || 0
                );

            } else {

                setAccounts([]);

                setTotal(0);

            }

        } catch (error) {

            console.error(
                "Get Accounts Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to load accounts."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadAccounts();

    }, [
        page,
        search,
        bank,
        accountType,
        status
    ]);


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this account?"
        );

        if (!confirmDelete) {

            return;

        }


        try {

            setDeleting(id);

            const response =
                await deleteAccount(id);


            if (response.success) {

                alert(
                    "Account deleted successfully."
                );

                /*
                 * If the current page becomes empty
                 * after deletion, move to previous page.
                 */
                if (
                    accounts.length === 1 &&
                    page > 1
                ) {

                    setPage(page - 1);

                } else {

                    loadAccounts();

                }

            } else {

                alert(
                    response.message ||
                    "Unable to delete account."
                );

            }

        } catch (error) {

            console.error(
                "Delete Account Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete account."
            );

        } finally {

            setDeleting(null);

        }

    };


    const handleSearch = (e) => {

        setSearch(e.target.value);

        setPage(1);

    };


    const handleBankChange = (e) => {

        setBank(e.target.value);

        setPage(1);

    };


    const handleAccountTypeChange = (e) => {

        setAccountType(e.target.value);

        setPage(1);

    };


    const handleStatusChange = (e) => {

        setStatus(e.target.value);

        setPage(1);

    };


    const handleReset = () => {

        setSearch("");

        setBank("");

        setAccountType("");

        setStatus("");

        setPage(1);

    };


    const formatAmount = (amount) => {

        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        );

    };


    return (

        <div className="container-fluid">

            {/* Header */}

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">

                <div>

                    <h3 className="mb-1">
                        Accounts
                    </h3>

                    <small className="text-muted">
                        Manage your bank and cash accounts
                    </small>

                </div>


                <div className="d-flex gap-2">

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={loadAccounts}
                        disabled={loading}
                    >

                        <FaSync
                            className="me-2"
                        />

                        Refresh

                    </button>


                    <Link
                        to="/accounts/add"
                        className="btn btn-primary"
                    >

                        <FaPlus
                            className="me-2"
                        />

                        Add Account

                    </Link>

                </div>

            </div>


            {/* Filters */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <div className="row g-3">

                        {/* Search */}

                        <div className="col-lg-4 col-md-6">

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
                                    placeholder="Search account..."
                                    value={search}
                                    onChange={handleSearch}
                                />

                            </div>

                        </div>


                        {/* Bank */}

                        <div className="col-lg-2 col-md-6">

                            <label className="form-label">

                                Bank

                            </label>

                            <select
                                className="form-select"
                                value={bank}
                                onChange={handleBankChange}
                            >

                                <option value="">
                                    All Banks
                                </option>

                                <option value="Pnb">
                                    PNB
                                </option>

                                <option value="Rbl">
                                    RBL
                                </option>

                                <option value="Icici">
                                    ICICI
                                </option>

                                <option value="Cash">
                                    Cash
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* Account Type */}

                        <div className="col-lg-2 col-md-6">

                            <label className="form-label">

                                Account Type

                            </label>

                            <select
                                className="form-select"
                                value={accountType}
                                onChange={
                                    handleAccountTypeChange
                                }
                            >

                                <option value="">
                                    All Types
                                </option>

                                <option value="Savings">
                                    Savings
                                </option>

                                <option value="Current">
                                    Current
                                </option>

                                <option value="Cash">
                                    Cash
                                </option>

                            </select>

                        </div>


                        {/* Status */}

                        <div className="col-lg-2 col-md-6">

                            <label className="form-label">

                                Status

                            </label>

                            <select
                                className="form-select"
                                value={status}
                                onChange={handleStatusChange}
                            >

                                <option value="">
                                    All
                                </option>

                                <option value="true">
                                    Active
                                </option>

                                <option value="false">
                                    Inactive
                                </option>

                            </select>

                        </div>


                        {/* Reset */}

                        <div className="col-lg-2 col-md-6 d-flex align-items-end">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={handleReset}
                            >

                                Reset Filters

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

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Account
                                    </th>

                                    <th>
                                        Bank
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Opening Balance
                                    </th>

                                    <th>
                                        Minimum Balance
                                    </th>

                                    <th>
                                        Purpose
                                    </th>

                                    <th>
                                        Status
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
                                                    colSpan="9"
                                                    className="text-center py-5"
                                                >

                                                    <div
                                                        className="spinner-border text-primary"
                                                    />

                                                    <div className="mt-2 text-muted">

                                                        Loading accounts...

                                                    </div>

                                                </td>

                                            </tr>

                                        )

                                        :

                                        accounts.length === 0

                                            ?

                                            (

                                                <tr>

                                                    <td
                                                        colSpan="9"
                                                        className="text-center py-5 text-muted"
                                                    >

                                                        No accounts found.

                                                    </td>

                                                </tr>

                                            )

                                            :

                                            accounts.map(
                                                (
                                                    account,
                                                    index
                                                ) => (

                                                    <tr
                                                        key={
                                                            account._id
                                                        }
                                                    >

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


                                                        <td>

                                                            <div className="fw-semibold">

                                                                {
                                                                    account.name
                                                                }

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <span className="badge bg-secondary">

                                                                {
                                                                    account.bank
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            {
                                                                account.accountType
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                formatAmount(
                                                                    account.openingBalance
                                                                )
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                formatAmount(
                                                                    account.minimumBalance
                                                                )
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                account.purpose ||
                                                                "-"
                                                            }

                                                        </td>


                                                        <td>

                                                            {

                                                                account.status

                                                                    ?

                                                                    (

                                                                        <span className="badge bg-success">

                                                                            Active

                                                                        </span>

                                                                    )

                                                                    :

                                                                    (

                                                                        <span className="badge bg-danger">

                                                                            Inactive

                                                                        </span>

                                                                    )

                                                            }

                                                        </td>


                                                        <td>

                                                            <div className="d-flex justify-content-end gap-2">

                                                                <Link
                                                                    to={`/accounts/edit/${account._id}`}
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    title="Edit"
                                                                >

                                                                    <FaEdit />

                                                                </Link>


                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    title="Delete"
                                                                    disabled={
                                                                        deleting ===
                                                                        account._id
                                                                    }
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            account._id
                                                                        )
                                                                    }
                                                                >

                                                                    {

                                                                        deleting ===
                                                                        account._id

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
                                    {total} accounts
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

export default AccountList;