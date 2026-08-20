import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getSavings,
    deleteSaving
} from "../../api/savingApi";

import {
    getCategories
} from "../../api/categoryApi";

import {
    getAccounts
} from "../../api/accountApi";

import Pagination
    from "../../components/common/Pagination";

import {
    getCategoryBadgeStyle
} from "../../utils/badgeStyles";


const SavingList = () => {

    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] =
        useState(true);

    const [savings, setSavings] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [accounts, setAccounts] =
        useState([]);


    /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    const [page, setPage] =
        useState(1);

    const [limit, setLimit] =
        useState(10);

    const [total, setTotal] =
        useState(0);


    /*
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    */

    const [fromDateInput, setFromDateInput] =
        useState("");

    const [toDateInput, setToDateInput] =
        useState("");

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");


    const [categoryInput, setCategoryInput] =
        useState("");

    const [category, setCategory] =
        useState("");


    const [accountInput, setAccountInput] =
        useState("");

    const [account, setAccount] =
        useState("");


    const [paymentModeInput, setPaymentModeInput] =
        useState("");

    const [paymentMode, setPaymentMode] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | PAYMENT MODES
    |--------------------------------------------------------------------------
    */

    const paymentModes = [
        "Cash",
        "Paytm",
        "PhonePe",
        "GPay",
        "Bhim",
        "AmazonPay",
        "BankTransfer",
        "Other"
    ];


    /*
    |--------------------------------------------------------------------------
    | LOAD CATEGORIES
    |--------------------------------------------------------------------------
    */

    const loadCategories = useCallback(
        async () => {

            try {

                const response =
                    await getCategories({
                        limit: 100,
                        type: "SAVING"
                    });


                console.log(
                    "Saving Category Response:",
                    response
                );


                const payload =
                    response?.data ||
                    response;


                let rows = [];


                if (
                    Array.isArray(payload)
                ) {

                    rows = payload;

                }

                else if (
                    Array.isArray(
                        payload?.data
                    )
                ) {

                    rows =
                        payload.data;

                }

                else if (
                    Array.isArray(
                        payload?.rows
                    )
                ) {

                    rows =
                        payload.rows;

                }

                else if (
                    Array.isArray(
                        payload?.data?.rows
                    )
                ) {

                    rows =
                        payload.data.rows;

                }


                setCategories(
                    rows
                );


            } catch (error) {

                console.error(
                    "Saving category error:",
                    error
                );

                setCategories([]);

            }

        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | LOAD ACCOUNTS
    |--------------------------------------------------------------------------
    */

    const loadAccounts = useCallback(
        async () => {

            try {

                const response =
                    await getAccounts({
                        page: 1,
                        limit: 100
                    });


                console.log(
                    "Saving Account Response:",
                    response
                );


                const payload =
                    response?.data ||
                    response;


                let rows = [];


                /*
                |--------------------------------------------------------------------------
                | Your account API may return:
                |
                | {
                |     total: 0,
                |     page: 1,
                |     limit: 100,
                |     rows: []
                | }
                |
                |--------------------------------------------------------------------------
                */

                if (
                    Array.isArray(payload)
                ) {

                    rows =
                        payload;

                }

                else if (
                    Array.isArray(
                        payload?.rows
                    )
                ) {

                    rows =
                        payload.rows;

                }

                else if (
                    Array.isArray(
                        payload?.data
                    )
                ) {

                    rows =
                        payload.data;

                }

                else if (
                    Array.isArray(
                        payload?.data?.rows
                    )
                ) {

                    rows =
                        payload.data.rows;

                }


                setAccounts(
                    rows
                );


            } catch (error) {

                console.error(
                    "Saving account error:",
                    error
                );

                setAccounts([]);

            }

        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | LOAD SAVINGS
    |--------------------------------------------------------------------------
    */

    const loadSavings = useCallback(
        async () => {

            try {

                setLoading(true);


                const params = {

                    page,

                    limit,

                    from: fromDate,

                    to: toDate,

                    category,

                    account,

                    paymentMode

                };


                console.log(
                    "================================"
                );

                console.log(
                    "SAVING REQUEST"
                );

                console.log(
                    params
                );


                const response =
                    await getSavings(
                        params
                    );


                console.log(
                    "SAVING API RESPONSE"
                );

                console.log(
                    response
                );


                /*
                |--------------------------------------------------------------------------
                | IMPORTANT
                |
                | savingApi.js already returns response.data
                |
                | So response is:
                |
                | {
                |    total: 20,
                |    page: 1,
                |    limit: 10,
                |    totalPages: 2,
                |    data: [...]
                | }
                |--------------------------------------------------------------------------
                */

                const payload =
                    response;


                let rows = [];


                /*
                |--------------------------------------------------------------------------
                | CASE 1
                |
                | API:
                |
                | {
                |    data: [...]
                | }
                |--------------------------------------------------------------------------
                */

                if (
                    Array.isArray(
                        payload?.data
                    )
                ) {

                    rows =
                        payload.data;

                }


                /*
                |--------------------------------------------------------------------------
                | CASE 2
                |
                | API:
                |
                | {
                |    rows: [...]
                | }
                |--------------------------------------------------------------------------
                */

                else if (
                    Array.isArray(
                        payload?.rows
                    )
                ) {

                    rows =
                        payload.rows;

                }


                /*
                |--------------------------------------------------------------------------
                | CASE 3
                |
                | API directly returns array
                |--------------------------------------------------------------------------
                */

                else if (
                    Array.isArray(
                        payload
                    )
                ) {

                    rows =
                        payload;

                }


                console.log(
                    "SAVING ROWS",
                    rows
                );


                setSavings(
                    rows
                );


                setTotal(
                    Number(
                        payload?.total ??
                        rows.length
                    )
                );


            } catch (error) {

                console.error(
                    "Saving load error:",
                    error
                );


                console.error(
                    "Saving error response:",
                    error?.response?.data
                );


                setSavings([]);

                setTotal(0);

            } finally {

                setLoading(false);

            }

        },
        [
            page,
            limit,
            fromDate,
            toDate,
            category,
            account,
            paymentMode
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadCategories();

        loadAccounts();

    }, [
        loadCategories,
        loadAccounts
    ]);


    /*
    |--------------------------------------------------------------------------
    | LOAD SAVINGS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadSavings();

    }, [
        loadSavings
    ]);


    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    const handleDelete =
        async (
            id
        ) => {

            if (
                !window.confirm(
                    "Delete this saving?"
                )
            ) {

                return;

            }


            try {

                const response =
                    await deleteSaving(
                        id
                    );


                if (
                    response?.success
                ) {

                    alert(
                        response.message ||
                        "Saving deleted successfully."
                    );


                    if (
                        savings.length === 1 &&
                        page > 1
                    ) {

                        setPage(
                            page - 1
                        );

                    } else {

                        loadSavings();

                    }

                } else {

                    alert(
                        response?.message ||
                        "Unable to delete saving."
                    );

                }

            } catch (error) {

                console.error(
                    "Delete saving error:",
                    error
                );


                alert(
                    error?.response?.data?.message ||
                    "Failed to delete saving."
                );

            }

        };


    /*
    |--------------------------------------------------------------------------
    | FILTER
    |--------------------------------------------------------------------------
    */

    const handleFilter =
        (event) => {

            event.preventDefault();


            setFromDate(
                fromDateInput
            );

            setToDate(
                toDateInput
            );

            setCategory(
                categoryInput
            );

            setAccount(
                accountInput
            );

            setPaymentMode(
                paymentModeInput
            );


            setPage(1);

        };


    /*
    |--------------------------------------------------------------------------
    | CLEAR
    |--------------------------------------------------------------------------
    */

    const handleClearFilter =
        () => {

            setFromDateInput("");

            setToDateInput("");

            setCategoryInput("");

            setAccountInput("");

            setPaymentModeInput("");


            setFromDate("");

            setToDate("");

            setCategory("");

            setAccount("");

            setPaymentMode("");


            setPage(1);

        };


    /*
    |--------------------------------------------------------------------------
    | ACCOUNT NAME
    |--------------------------------------------------------------------------
    */

    const getAccountName =
        (item) => {

            /*
            | Backend populated account
            */

            if (
                item?.account?.name
            ) {

                return item.account.name;

            }


            if (
                item?.account?.accountName
            ) {

                return item.account.accountName;

            }


            /*
            | Backend returns account ID
            */

            if (
                typeof item?.account ===
                "string"
            ) {

                const found =
                    accounts.find(
                        accountItem =>
                            String(
                                accountItem?._id
                            ) ===
                            String(
                                item.account
                            )
                    );


                if (found) {

                    return (
                        found.name ||
                        found.accountName ||
                        found.title ||
                        "-"
                    );

                }

            }


            return "-";

        };


    /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    const totalPages =
        Math.ceil(
            total / limit
        ) || 1;


    const startRecord =
        total === 0
            ? 0
            : (
                (page - 1) *
                limit
            ) + 1;


    const endRecord =
        Math.min(
            page * limit,
            total
        );


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="container-fluid px-4 py-3">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <div>

                    <h3 className="mb-0">
                        Saving List
                    </h3>

                    <div className="text-muted small mt-1">

                        Total Savings: ₹
                        {savings.reduce(
                            (
                                sum,
                                item
                            ) =>
                                sum +
                                Number(
                                    item.amount || 0
                                ),
                            0
                        ).toLocaleString(
                            "en-IN",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </div>

                </div>


                <Link
                    to="/saving/add"
                    className="btn btn-primary"
                >

                    Add Saving

                </Link>

            </div>


            {/* FILTER */}

            <div className="card border-0 shadow-sm mb-3">

                <div className="card-body">

                    <form
                        className="row g-3 align-items-end"
                        onSubmit={
                            handleFilter
                        }
                    >

                        {/* FROM */}

                        <div className="col-12 col-md-2">

                            <label className="form-label">
                                From
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={
                                    fromDateInput
                                }
                                onChange={
                                    event =>
                                        setFromDateInput(
                                            event.target.value
                                        )
                                }
                            />

                        </div>


                        {/* TO */}

                        <div className="col-12 col-md-2">

                            <label className="form-label">
                                To
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={
                                    toDateInput
                                }
                                onChange={
                                    event =>
                                        setToDateInput(
                                            event.target.value
                                        )
                                }
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="col-12 col-md-2">

                            <label className="form-label">
                                Category
                            </label>

                            <select
                                className="form-select"
                                value={
                                    categoryInput
                                }
                                onChange={
                                    event =>
                                        setCategoryInput(
                                            event.target.value
                                        )
                                }
                            >

                                <option value="">
                                    All Categories
                                </option>


                                {categories.map(
                                    item => (

                                        <option
                                            key={
                                                item._id
                                            }
                                            value={
                                                item._id
                                            }
                                        >

                                            {
                                                item.name
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ACCOUNT */}

                        <div className="col-12 col-md-2">

                            <label className="form-label">
                                Account
                            </label>

                            <select
                                className="form-select"
                                value={
                                    accountInput
                                }
                                onChange={
                                    event =>
                                        setAccountInput(
                                            event.target.value
                                        )
                                }
                            >

                                <option value="">
                                    All Accounts
                                </option>


                                {accounts.map(
                                    item => (

                                        <option
                                            key={
                                                item._id
                                            }
                                            value={
                                                item._id
                                            }
                                        >

                                            {
                                                item.name ||
                                                item.accountName ||
                                                item.title ||
                                                "Unnamed Account"
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* PAYMENT MODE */}

                        <div className="col-12 col-md-2">

                            <label className="form-label">
                                Payment Mode
                            </label>

                            <select
                                className="form-select"
                                value={
                                    paymentModeInput
                                }
                                onChange={
                                    event =>
                                        setPaymentModeInput(
                                            event.target.value
                                        )
                                }
                            >

                                <option value="">
                                    All Payment Modes
                                </option>


                                {paymentModes.map(
                                    mode => (

                                        <option
                                            key={mode}
                                            value={mode}
                                        >
                                            {mode}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* PER PAGE */}

                        <div className="col-6 col-md-1">

                            <label className="form-label">
                                Per page
                            </label>

                            <select
                                className="form-select"
                                value={
                                    limit
                                }
                                onChange={
                                    event => {

                                        setLimit(
                                            Number(
                                                event.target.value
                                            )
                                        );

                                        setPage(1);

                                    }
                                }
                            >

                                <option value="10">
                                    10
                                </option>

                                <option value="25">
                                    25
                                </option>

                                <option value="50">
                                    50
                                </option>

                            </select>

                        </div>


                        {/* FILTER */}

                        <div className="col-6 col-md-1">

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >

                                Filter

                            </button>

                        </div>


                        {/* CLEAR */}

                        <div className="col-6 col-md-1">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={
                                    handleClearFilter
                                }
                            >

                                Clear

                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* TABLE */}

            <div className="card border-0 shadow-sm">

                <div className="table-responsive">

                    <table className="table table-bordered table-hover align-middle mb-0">

                        <thead className="table-light">

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Title
                                </th>

                                <th>
                                    Amount
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Account
                                </th>

                                <th>
                                    Payment Mode
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-5"
                                    >

                                        <div
                                            className="spinner-border spinner-border-sm me-2"
                                        />

                                        Loading...

                                    </td>

                                </tr>

                            ) : savings.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center text-muted py-5"
                                    >

                                        No Record Found

                                    </td>

                                </tr>

                            ) : (

                                savings.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item._id
                                            }
                                        >

                                            {/* # */}

                                            <td>

                                                {
                                                    (
                                                        (
                                                            page -
                                                            1
                                                        ) *
                                                        limit
                                                    ) +
                                                    index +
                                                    1
                                                }

                                            </td>


                                            {/* TITLE */}

                                            <td>

                                                {
                                                    item.title ||
                                                    "-"
                                                }

                                            </td>


                                            {/* AMOUNT */}

                                            <td className="fw-semibold text-danger">

                                                ₹{" "}

                                                {Number(
                                                    item.amount ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }
                                                )}

                                            </td>


                                            {/* CATEGORY */}

                                            <td>

                                                <span
                                                    className="badge"
                                                    style={
                                                        getCategoryBadgeStyle(
                                                            item.category
                                                        )
                                                    }
                                                >

                                                    {
                                                        item.category?.name ||
                                                        item.categoryName ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* ACCOUNT */}

                                            <td>

                                                {
                                                    getAccountName(
                                                        item
                                                    )
                                                }

                                            </td>


                                            {/* PAYMENT */}

                                            <td>

                                                {
                                                    item.paymentMode ||
                                                    "-"
                                                }

                                            </td>


                                            {/* DATE */}

                                            <td>

                                                {
                                                    item.date
                                                        ? new Date(
                                                            item.date
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )
                                                        : "-"
                                                }

                                            </td>


                                            {/* ACTION */}

                                            <td className="text-nowrap">

                                                <Link
                                                    to={
                                                        `/saving/edit/${item._id}`
                                                    }
                                                    className="btn btn-warning btn-sm me-2"
                                                >

                                                    Edit

                                                </Link>


                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleDelete(
                                                            item._id
                                                        )
                                                    }
                                                >

                                                    Delete

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* FOOTER */}

                <div className="card-footer bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">

                    <small className="text-muted">

                        Showing{" "}

                        {startRecord}

                        {" "}to{" "}

                        {endRecord}

                        {" "}of{" "}

                        {total}

                        {" "}records

                    </small>


                    <Pagination
                        page={
                            page
                        }
                        limit={
                            limit
                        }
                        total={
                            total
                        }
                        onPageChange={
                            nextPage => {

                                if (
                                    nextPage >= 1 &&
                                    nextPage <= totalPages
                                ) {

                                    setPage(
                                        nextPage
                                    );

                                }

                            }
                        }
                    />

                </div>

            </div>

        </div>

    );

};


export default SavingList;