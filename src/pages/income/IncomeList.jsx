import {
    useCallback,
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import {
    getIncomes,
    deleteIncome
} from "../../api/incomeApi";

import { getCategories } from "../../api/categoryApi";

import { getAccounts } from "../../api/accountApi";

import Pagination from "../../components/common/Pagination";

import {
    getCategoryBadgeStyle
} from "../../utils/badgeStyles";


/*
|--------------------------------------------------------------------------
| Payment Mode Images
|--------------------------------------------------------------------------
*/

const PaymentModeImages = {

    Cash:
        "/images/payment/cash.png",

    Paytm:
        "/images/payment/paytm.png",

    PhonePe:
        "/images/payment/phonepe.png",

    GPay:
        "/images/payment/GPay.png",

    Bhim:
        "/images/payment/Bhim.png",

    AmazonPay:
        "/images/payment/amazonpay.png",

    BankTransfer:
        "/images/payment/BankTransfer.png",

    Other:
        "/images/payment/card.png"

};


/*
|--------------------------------------------------------------------------
| Payment Modes
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


const IncomeList = () => {


    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] =
        useState(true);

    const [incomes, setIncomes] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [accounts, setAccounts] =
        useState([]);

    const [totalAmount, setTotalAmount] =
        useState(0);


    /*
    |--------------------------------------------------------------------------
    | Pagination
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
    | Search
    |--------------------------------------------------------------------------
    */

    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    const [categoryInput, setCategoryInput] =
        useState("");

    const [category, setCategory] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Payment Mode
    |--------------------------------------------------------------------------
    */

    const [paymentModeInput, setPaymentModeInput] =
        useState("");

    const [paymentMode, setPaymentMode] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Account
    |--------------------------------------------------------------------------
    */

    const [accountInput, setAccountInput] =
        useState("");

    const [account, setAccount] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Date
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


    /*
    |--------------------------------------------------------------------------
    | Load Categories
    |--------------------------------------------------------------------------
    */

    const loadCategories = useCallback(
        async () => {

            try {

                const response =
                    await getCategories({

                        limit: 100,

                        type: "INCOME"

                    });


                /*
                |--------------------------------------------------------------------------
                | Support:
                |
                | response.data.rows
                | response.data.data.rows
                | response.data.data
                | response.data
                |--------------------------------------------------------------------------
                */

                const payload =
                    response?.data?.success !== undefined
                        ? response.data
                        : response;


                if (
                    payload?.success
                ) {

                    const result =
                        payload.data || {};


                    const rows =
                        Array.isArray(
                            result.rows
                        )

                            ? result.rows

                            : Array.isArray(
                                result.data
                            )

                                ? result.data

                                : Array.isArray(
                                    result
                                )

                                    ? result

                                    : [];


                    setCategories(
                        rows
                    );

                } else {

                    setCategories([]);

                }

            } catch (error) {

                console.error(
                    "Category load error:",
                    error
                );

                setCategories([]);

            }

        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Load Accounts
    |--------------------------------------------------------------------------
    */

    const loadAccounts = useCallback(
        async () => {

            try {

                const response =
                    await getAccounts({

                        limit: 100,

                        status: true

                    });


                const payload =
                    response?.data?.success !== undefined
                        ? response.data
                        : response;


                if (
                    payload?.success
                ) {

                    const result =
                        payload.data || {};


                    const rows =
                        Array.isArray(
                            result.rows
                        )

                            ? result.rows

                            : Array.isArray(
                                result.data
                            )

                                ? result.data

                                : Array.isArray(
                                    result
                                )

                                    ? result

                                    : [];


                    setAccounts(
                        rows
                    );

                } else {

                    setAccounts([]);

                }

            } catch (error) {

                console.error(
                    "Account load error:",
                    error
                );

                setAccounts([]);

            }

        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Load Income
    |--------------------------------------------------------------------------
    */

 const loadIncome = useCallback(
    async () => {

        try {

            setLoading(true);


            const response = await getIncomes({

                page,

                limit,

                search,

                category,

                paymentMode,

                account,

                from: fromDate,

                to: toDate

            });


            console.log(
                "Income API Response:",
                response
            );


            /*
            |--------------------------------------------------------------------------
            | Your incomeApi.js returns response.data directly.
            |
            | Therefore response is:
            |
            | {
            |     total: 18,
            |     page: 1,
            |     limit: 10,
            |     totalPages: 2,
            |     data: [...]
            | }
            |--------------------------------------------------------------------------
            */


            const result =
                response || {};


            /*
            |--------------------------------------------------------------------------
            | Income Rows
            |--------------------------------------------------------------------------
            */

            const incomeRows =
                Array.isArray(
                    result.data
                )

                    ? result.data

                    : [];


            console.log(
                "Income Rows:",
                incomeRows
            );


            /*
            |--------------------------------------------------------------------------
            | Set Income Data
            |--------------------------------------------------------------------------
            */

            setIncomes(
                incomeRows
            );


            /*
            |--------------------------------------------------------------------------
            | Total Records
            |--------------------------------------------------------------------------
            */

            setTotal(

                Number(
                    result.total ||
                    0
                )

            );


            /*
            |--------------------------------------------------------------------------
            | Total Amount
            |--------------------------------------------------------------------------
            */

            if (
                result.totalAmount !==
                undefined
            ) {

                setTotalAmount(

                    Number(
                        result.totalAmount ||
                        0
                    )

                );

            } else {

                /*
                |--------------------------------------------------------------------------
                | Calculate amount from current page
                |--------------------------------------------------------------------------
                |
                | NOTE:
                | This is only current page total.
                |
                | If backend later provides totalAmount,
                | we will use that instead.
                |--------------------------------------------------------------------------
                */

                const calculatedAmount =
                    incomeRows.reduce(

                        (
                            sum,
                            item
                        ) => {

                            return (

                                sum +

                                Number(
                                    item.amount ||
                                    0
                                )

                            );

                        },

                        0

                    );


                setTotalAmount(
                    calculatedAmount
                );

            }

        } catch (error) {

            console.error(
                "Income load error:",
                error
            );


            console.error(
                "Income API Error:",
                error?.response?.data
            );


            setIncomes([]);

            setTotal(0);

            setTotalAmount(0);

        } finally {

            setLoading(false);

        }

    },

    [

        page,

        limit,

        search,

        category,

        paymentMode,

        account,

        fromDate,

        toDate

    ]

);

    /*
    |--------------------------------------------------------------------------
    | Initial Load
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
    | Load Income
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadIncome();

    }, [

        loadIncome

    ]);


    /*
    |--------------------------------------------------------------------------
    | Delete Income
    |--------------------------------------------------------------------------
    */

    const handleDelete =
        async (id) => {

            if (
                !window.confirm(
                    "Delete this income?"
                )
            ) {

                return;

            }


            try {

                const response =
                    await deleteIncome(
                        id
                    );


                const payload =
                    response?.data?.success !== undefined
                        ? response.data
                        : response;


                if (
                    payload?.success
                ) {

                    alert(

                        payload.message ||
                        "Income deleted successfully."

                    );


                    /*
                    |--------------------------------------------------------------------------
                    | If last record on current page
                    |--------------------------------------------------------------------------
                    */

                    if (

                        incomes.length === 1 &&

                        page > 1

                    ) {

                        setPage(
                            page - 1
                        );

                    } else {

                        loadIncome();

                    }

                } else {

                    alert(

                        payload?.message ||
                        "Unable to delete income."

                    );

                }

            } catch (error) {

                console.error(
                    "Delete Income Error:",
                    error
                );


                alert(

                    error?.response?.data?.message ||

                    error?.message ||

                    "Unable to delete income."

                );

            }

        };


    /*
    |--------------------------------------------------------------------------
    | Apply Filter
    |--------------------------------------------------------------------------
    */

    const handleFilter =
        (event) => {

            event.preventDefault();


            setSearch(
                searchInput.trim()
            );


            setCategory(
                categoryInput
            );


            setPaymentMode(
                paymentModeInput
            );


            setAccount(
                accountInput
            );


            setFromDate(
                fromDateInput
            );


            setToDate(
                toDateInput
            );


            setPage(1);

        };


    /*
    |--------------------------------------------------------------------------
    | Clear Filter
    |--------------------------------------------------------------------------
    */

    const handleClearFilter =
        () => {

            setSearchInput("");

            setSearch("");


            setCategoryInput("");

            setCategory("");


            setPaymentModeInput("");

            setPaymentMode("");


            setAccountInput("");

            setAccount("");


            setFromDateInput("");

            setToDateInput("");


            setFromDate("");

            setToDate("");


            setPage(1);

        };


    /*
    |--------------------------------------------------------------------------
    | Pagination
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
                (
                    page - 1
                ) *
                limit
            ) + 1;


    const endRecord =
        Math.min(

            page * limit,

            total

        );


    /*
    |--------------------------------------------------------------------------
    | Payment Mode Image
    |--------------------------------------------------------------------------
    */

    const getPaymentModeImage =
        (mode) => {

            if (!mode) {

                return null;

            }


            if (
                PaymentModeImages[mode]
            ) {

                return (
                    PaymentModeImages[mode]
                );

            }


            const matchedMode =
                Object.keys(
                    PaymentModeImages
                ).find(

                    key =>
                        key.toLowerCase() ===
                        String(
                            mode
                        ).toLowerCase()

                );


            if (
                matchedMode
            ) {

                return (
                    PaymentModeImages[
                        matchedMode
                    ]
                );

            }


            return (
                PaymentModeImages.Other
            );

        };


    /*
    |--------------------------------------------------------------------------
    | Get Account
    |--------------------------------------------------------------------------
    |
    | New records:
    | item.account = populated object
    |
    | Older records:
    | item.account = ObjectId
    |
    | Very old records:
    | item.bank = "icici"
    |--------------------------------------------------------------------------
    */

    const getAccount =
        (item) => {

            /*
            |--------------------------------------------------------------------------
            | Populated account
            |--------------------------------------------------------------------------
            */

            if (
                item.account &&
                typeof item.account ===
                "object"
            ) {

                return item.account;

            }


            /*
            |--------------------------------------------------------------------------
            | Account ID
            |--------------------------------------------------------------------------
            */

            if (
                item.account
            ) {

                const found =
                    accounts.find(

                        accountItem =>

                            String(
                                accountItem._id
                            ) ===
                            String(
                                item.account
                            )

                    );


                if (
                    found
                ) {

                    return found;

                }

            }


            /*
            |--------------------------------------------------------------------------
            | OLD BANK DATA
            |--------------------------------------------------------------------------
            |
            | Existing income records contain:
            |
            | bank: "icici"
            |
            | We show the bank as fallback.
            |--------------------------------------------------------------------------
            */

            if (
                item.bank
            ) {

                return {

                    name:
                        `${item.bank} Bank`,

                    bank:
                        item.bank,

                    isLegacy:
                        true

                };

            }


            return null;

        };


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate =
        (date) => {

            if (!date) {

                return "-";

            }


            const parsedDate =
                new Date(
                    date
                );


            if (
                Number.isNaN(
                    parsedDate.getTime()
                )
            ) {

                return "-";

            }


            return parsedDate.toLocaleDateString(

                "en-IN",

                {

                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"

                }

            );

        };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <div className="container-fluid">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

                <div className="d-flex align-items-center gap-4">

                    <h3 className="mb-0">

                        Income List

                    </h3>


                    <h5 className="mb-0 text-success">

                        Total Income: ₹{" "}

                        {Number(
                            totalAmount || 0
                        ).toLocaleString(

                            "en-IN",

                            {

                                minimumFractionDigits:
                                    0,

                                maximumFractionDigits:
                                    2

                            }

                        )}

                    </h5>

                </div>


                <Link
                    to="/income/add"
                    className="btn btn-primary"
                >

                    Add Income

                </Link>

            </div>


            {/* =====================================================
                FILTER
            ====================================================== */}

            <div className="card mb-3">

                <div className="card-body">

                    <form
                        className="row g-2 align-items-end"
                        onSubmit={
                            handleFilter
                        }
                    >


                        {/* SEARCH */}

                        <div className="col-12 col-lg-2">

                            <label className="form-label">

                                Search

                            </label>


                            <input
                                type="search"
                                className="form-control"
                                value={
                                    searchInput
                                }
                                onChange={
                                    event =>
                                        setSearchInput(
                                            event.target.value
                                        )
                                }
                                placeholder="Search title"
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="col-12 col-lg-2">

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


                        {/* PAYMENT */}

                        <div className="col-12 col-lg-2">

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
                                            key={
                                                mode
                                            }
                                            value={
                                                mode
                                            }
                                        >

                                            {
                                                mode
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ACCOUNT */}

                        <div className="col-12 col-lg-2">

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
                                    accountItem => (

                                        <option
                                            key={
                                                accountItem._id
                                            }
                                            value={
                                                accountItem._id
                                            }
                                        >

                                            {
                                                accountItem.name
                                            }

                                            {" - "}

                                            {
                                                accountItem.bank
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* FROM */}

                        <div className="col-6 col-lg-1">

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

                        <div className="col-6 col-lg-1">

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


                        {/* PER PAGE */}

                        <div className="col-6 col-lg-1">

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

                                <option value="75">
                                    75
                                </option>

                                <option value="100">
                                    100
                                </option>

                                <option value="150">
                                    150
                                </option>

                            </select>

                        </div>


                        {/* FILTER */}

                        <div className="col-6 col-lg-1">

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >

                                Filter

                            </button>

                        </div>


                        {/* CLEAR */}

                        <div className="col-6 col-lg-1">

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


            {/* =====================================================
                TABLE
            ====================================================== */}

            <div className="card">

                <div className="card-body table-responsive">

                    <table className="table table-bordered table-hover align-middle">

                        <thead>

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
                                    Payment
                                </th>

                                <th>
                                    Account
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
                                            className="spinner-border text-primary"
                                            role="status"
                                        />

                                        <div className="mt-2 text-muted">

                                            Loading income...

                                        </div>

                                    </td>

                                </tr>

                            ) : incomes.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center text-muted py-5"
                                    >

                                        No Record Found

                                    </td>

                                </tr>

                            ) : (

                                incomes.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const paymentImage =
                                            getPaymentModeImage(
                                                item.paymentMode
                                            );


                                        const selectedAccount =
                                            getAccount(
                                                item
                                            );


                                        return (

                                            <tr
                                                key={
                                                    item._id
                                                }
                                            >


                                                {/* NUMBER */}

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

                                                    <div className="fw-semibold">

                                                        {
                                                            item.title ||
                                                            "-"
                                                        }

                                                    </div>


                                                    {item.note && (

                                                        <small className="text-muted">

                                                            {
                                                                item.note
                                                            }

                                                        </small>

                                                    )}

                                                </td>


                                                {/* AMOUNT */}

                                                <td>

                                                    <span className="fw-bold text-success">

                                                        +₹{" "}

                                                        {Number(
                                                            item.amount ||
                                                            0
                                                        ).toLocaleString(

                                                            "en-IN",

                                                            {

                                                                minimumFractionDigits:
                                                                    2,

                                                                maximumFractionDigits:
                                                                    2

                                                            }

                                                        )}

                                                    </span>

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


                                                {/* PAYMENT */}

                                                <td>

                                                    {item.paymentMode ? (

                                                        paymentImage ? (

                                                            <img
                                                                src={
                                                                    paymentImage
                                                                }
                                                                alt={
                                                                    item.paymentMode
                                                                }
                                                                title={
                                                                    item.paymentMode
                                                                }
                                                                style={{

                                                                    width:
                                                                        "55px",

                                                                    height:
                                                                        "40px",

                                                                    objectFit:
                                                                        "contain",

                                                                    display:
                                                                        "inline-block"

                                                                }}
                                                                onError={
                                                                    event => {

                                                                        event.currentTarget.onerror =
                                                                            null;

                                                                        event.currentTarget.src =
                                                                            PaymentModeImages.Other;

                                                                    }
                                                                }
                                                            />

                                                        ) : (

                                                            <span>

                                                                {
                                                                    item.paymentMode
                                                                }

                                                            </span>

                                                        )

                                                    ) : (

                                                        <span className="text-muted">

                                                            -

                                                        </span>

                                                    )}

                                                </td>


                                                {/* ACCOUNT */}

                                                <td>

                                                    {selectedAccount ? (

                                                        <div>

                                                            <div className="fw-semibold">

                                                                {
                                                                    selectedAccount.name ||
                                                                    "-"
                                                                }

                                                            </div>


                                                            <small className="text-muted">

                                                                {
                                                                    selectedAccount.bank ||
                                                                    ""
                                                                }


                                                                {selectedAccount.accountType && (

                                                                    <>
                                                                        {" · "}

                                                                        {
                                                                            selectedAccount.accountType
                                                                        }

                                                                    </>

                                                                )}

                                                            </small>


                                                            {selectedAccount.isLegacy && (

                                                                <div>

                                                                    <small className="text-warning">

                                                                        Legacy bank

                                                                    </small>

                                                                </div>

                                                            )}

                                                        </div>

                                                    ) : (

                                                        <span className="text-muted">

                                                            Not linked

                                                        </span>

                                                    )}

                                                </td>


                                                {/* DATE */}

                                                <td>

                                                    {
                                                        formatDate(
                                                            item.date
                                                        )
                                                    }

                                                </td>


                                                {/* ACTION */}

                                                <td>

                                                    <div className="d-flex gap-2">

                                                        <Link
                                                            to={
                                                                `/income/edit/${item._id}`
                                                            }
                                                            className="btn btn-warning btn-sm"
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

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }

                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =====================================================
                    FOOTER
                ====================================================== */}

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


                    {total > 0 && (

                        <Pagination
                            page={page}
                            limit={limit}
                            total={total}
                            onPageChange={
                                nextPage => {

                                    if (

                                        nextPage >= 1 &&

                                        nextPage <=
                                        totalPages

                                    ) {

                                        setPage(
                                            nextPage
                                        );

                                    }

                                }
                            }
                        />

                    )}

                </div>

            </div>

        </div>

    );

};


export default IncomeList;