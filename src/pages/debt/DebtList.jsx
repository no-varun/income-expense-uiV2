import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getDebts,
    deleteDebt
} from "../../api/debtApi";

import {
    getCategories
} from "../../api/categoryApi";

import {
    getAccounts
} from "../../api/accountApi";

import Pagination from "../../components/common/Pagination";

import {
    getCategoryBadgeStyle
} from "../../utils/badgeStyles";


const DebtList = () => {

    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    const [debts, setDebts] = useState([]);

    const [categories, setCategories] = useState([]);

    const [accounts, setAccounts] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);

    const [total, setTotal] = useState(0);


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | FILTER INPUTS
    |--------------------------------------------------------------------------
    */

    const [searchInput, setSearchInput] = useState("");

    const [categoryInput, setCategoryInput] = useState("");

    const [accountInput, setAccountInput] = useState("");

    const [paymentModeInput, setPaymentModeInput] = useState("");

    const [fromDateInput, setFromDateInput] = useState("");

    const [toDateInput, setToDateInput] = useState("");


    /*
    |--------------------------------------------------------------------------
    | APPLIED FILTERS
    |--------------------------------------------------------------------------
    */

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [account, setAccount] = useState("");

    const [paymentMode, setPaymentMode] = useState("");

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");


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
    | NORMALIZE CATEGORY RESPONSE
    |--------------------------------------------------------------------------
    */

    const normalizeList = (response) => {

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        if (Array.isArray(response?.rows)) {
            return response.rows;
        }

        if (Array.isArray(response?.data?.data)) {
            return response.data.data;
        }

        if (Array.isArray(response?.data?.rows)) {
            return response.data.rows;
        }

        return [];

    };


    /*
    |--------------------------------------------------------------------------
    | LOAD CATEGORIES
    |--------------------------------------------------------------------------
    */

    const loadCategories = useCallback(async () => {

        try {

            const response = await getCategories({
                limit: 100,
                type: "DEBT"
            });

            console.log(
                "Debt Category Response:",
                response
            );

            if (response?.success) {

                setCategories(
                    normalizeList(response)
                );

            } else {

                setCategories([]);

            }

        } catch (error) {

            console.error(
                "Debt Category Error:",
                error
            );

            setCategories([]);

        }

    }, []);


    /*
    |--------------------------------------------------------------------------
    | LOAD ACCOUNTS
    |--------------------------------------------------------------------------
    */

    const loadAccounts = useCallback(async () => {

        try {

            const response = await getAccounts({
                limit: 100,
                status: true
            });

            console.log(
                "Debt Account Response:",
                response
            );

            if (response?.success) {

                setAccounts(
                    normalizeList(response)
                );

            } else {

                setAccounts([]);

            }

        } catch (error) {

            console.error(
                "Debt Account Error:",
                error
            );

            setAccounts([]);

        }

    }, []);


    /*
    |--------------------------------------------------------------------------
    | LOAD DEBTS
    |--------------------------------------------------------------------------
    */

    const loadDebt = useCallback(async () => {
    try {
        setLoading(true);

        const params = {
            page,
            limit,
            search,
            category,
            account,
            paymentMode,
            from: fromDate,
            to: toDate
        };

        Object.keys(params).forEach((key) => {
            if (
                params[key] === "" ||
                params[key] === undefined ||
                params[key] === null
            ) {
                delete params[key];
            }
        });

        console.log("=================================");
        console.log("DEBT REQUEST:", params);

        const response = await getDebts(params);

        console.log("DEBT RAW RESPONSE:", response);
        console.log("DEBT RESPONSE DATA:", response?.data);
        console.log("DEBT RESPONSE DATA DATA:", response?.data?.data);

        /*
        |--------------------------------------------------------------------------
        | FIND ACTUAL API OBJECT
        |--------------------------------------------------------------------------
        */

        let apiData = response;

        /*
         * Case:
         * Axios response
         *
         * response.data = {
         *    success: true,
         *    data: [...]
         * }
         */

        if (
            apiData &&
            apiData.data &&
            typeof apiData.data === "object" &&
            !Array.isArray(apiData.data) &&
            (
                apiData.data.success !== undefined ||
                apiData.data.data !== undefined ||
                apiData.data.total !== undefined
            )
        ) {
            apiData = apiData.data;
        }

        console.log("DEBT API DATA:", apiData);

        /*
        |--------------------------------------------------------------------------
        | CHECK SUCCESS
        |--------------------------------------------------------------------------
        */

        if (
            apiData?.success === false
        ) {
            console.error(
                "Debt API returned failure:",
                apiData
            );

            setDebts([]);
            setTotal(0);

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | EXTRACT ROWS
        |--------------------------------------------------------------------------
        */

        let rows = [];

        /*
         * Format 1:
         *
         * {
         *   success: true,
         *   data: [...]
         * }
         */

        if (
            Array.isArray(apiData?.data)
        ) {
            rows = apiData.data;
        }

        /*
         * Format 2:
         *
         * {
         *   success: true,
         *   data: {
         *      data: [...]
         *   }
         * }
         */

        else if (
            Array.isArray(apiData?.data?.data)
        ) {
            rows = apiData.data.data;
        }

        /*
         * Format 3:
         *
         * {
         *   data: {
         *      rows: [...]
         *   }
         * }
         */

        else if (
            Array.isArray(apiData?.data?.rows)
        ) {
            rows = apiData.data.rows;
        }

        /*
         * Format 4:
         *
         * {
         *   rows: [...]
         * }
         */

        else if (
            Array.isArray(apiData?.rows)
        ) {
            rows = apiData.rows;
        }

        /*
         * Format 5:
         *
         * Direct array
         */

        else if (
            Array.isArray(apiData)
        ) {
            rows = apiData;
        }

        console.log(
            "DEBT FINAL ROWS:",
            rows
        );

        console.log(
            "DEBT FINAL ROW COUNT:",
            rows.length
        );

        /*
        |--------------------------------------------------------------------------
        | SET DATA
        |--------------------------------------------------------------------------
        */

        setDebts(rows);

        /*
        |--------------------------------------------------------------------------
        | TOTAL
        |--------------------------------------------------------------------------
        */

        let totalRecords = 0;

        if (
            typeof apiData?.total === "number"
        ) {
            totalRecords = apiData.total;
        }

        else if (
            typeof apiData?.data?.total === "number"
        ) {
            totalRecords = apiData.data.total;
        }

        else {
            totalRecords = rows.length;
        }

        setTotal(totalRecords);

        console.log(
            "DEBT TOTAL:",
            totalRecords
        );

    } catch (error) {

        console.error(
            "DEBT FETCH ERROR:",
            error
        );

        console.error(
            "DEBT ERROR RESPONSE:",
            error?.response?.data
        );

        setDebts([]);

        setTotal(0);

    } finally {

        setLoading(false);
    }

}, [
    page,
    limit,
    search,
    category,
    account,
    paymentMode,
    fromDate,
    toDate
]);


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
    | LOAD DEBT LIST
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadDebt();

    }, [
        loadDebt
    ]);


    /*
    |--------------------------------------------------------------------------
    | FILTER
    |--------------------------------------------------------------------------
    */

    const handleFilter = (event) => {

        event.preventDefault();

        setPage(1);

        setSearch(searchInput);

        setCategory(categoryInput);

        setAccount(accountInput);

        setPaymentMode(paymentModeInput);

        setFromDate(fromDateInput);

        setToDate(toDateInput);

    };


    /*
    |--------------------------------------------------------------------------
    | CLEAR FILTER
    |--------------------------------------------------------------------------
    */

    const handleClear = () => {

        setSearchInput("");

        setCategoryInput("");

        setAccountInput("");

        setPaymentModeInput("");

        setFromDateInput("");

        setToDateInput("");

        setSearch("");

        setCategory("");

        setAccount("");

        setPaymentMode("");

        setFromDate("");

        setToDate("");

        setPage(1);

    };


    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this debt?"
        );

        if (!confirmed) {
            return;
        }


        try {

            const response = await deleteDebt(id);


            if (response?.success) {

                alert(
                    response.message ||
                    "Debt deleted successfully."
                );


                /*
                |--------------------------------------------------------------------------
                | If last record on current page
                |--------------------------------------------------------------------------
                */

                if (
                    debts.length === 1 &&
                    page > 1
                ) {

                    setPage(
                        page - 1
                    );

                } else {

                    loadDebt();

                }

            } else {

                alert(
                    response?.message ||
                    "Unable to delete debt."
                );

            }

        } catch (error) {

            console.error(
                "Delete Debt Error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to delete debt."
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | ACCOUNT LABEL
    |--------------------------------------------------------------------------
    */

    const getAccountLabel = (accountItem) => {

        if (!accountItem) {
            return "-";
        }


        if (typeof accountItem === "string") {
            return accountItem;
        }


        if (accountItem.name) {
            return accountItem.name;
        }


        if (accountItem.accountName) {
            return accountItem.accountName;
        }


        if (accountItem.title) {
            return accountItem.title;
        }


        return "-";

    };


    /*
    |--------------------------------------------------------------------------
    | TOTAL DEBT
    |--------------------------------------------------------------------------
    */

    const totalDebt = debts.reduce(
        (sum, item) => {

            return (
                sum +
                Number(
                    item.amount || 0
                )
            );

        },
        0
    );


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

        <div
            className="container-fluid px-0 w-100"
            style={{
                maxWidth: "100%"
            }}
        >

            {/* HEADER */}

            <div
                className="
                    d-flex
                    justify-content-between
                    align-items-center
                    mb-3
                    px-1
                "
            >

                <div>

                    <h3 className="mb-1">
                        Debt List
                    </h3>


                    <div className="text-danger">

                        Total Debt: ₹
                        {totalDebt.toLocaleString(
                            "en-IN",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </div>

                </div>


                <Link
                    to="/debt/add"
                    className="btn btn-primary"
                >

                    Add Debt

                </Link>

            </div>


            {/* FILTER CARD */}

            <div className="card mb-3">

                <div className="card-body">

                    <form
                        onSubmit={handleFilter}
                        className="row g-2 align-items-end"
                    >

                        {/* SEARCH */}

                        <div className="col-12 col-md-6 col-lg-2">

                            <label className="form-label mb-1">
                                Search
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search title"
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="col-12 col-md-6 col-lg-2">

                            <label className="form-label mb-1">
                                Category
                            </label>

                            <select
                                className="form-select"
                                value={categoryInput}
                                onChange={(event) =>
                                    setCategoryInput(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Categories
                                </option>


                                {categories.map(
                                    (item) => (

                                        <option
                                            key={item._id}
                                            value={item._id}
                                        >
                                            {item.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ACCOUNT */}

                        <div className="col-12 col-md-6 col-lg-2">

                            <label className="form-label mb-1">
                                Account
                            </label>

                            <select
                                className="form-select"
                                value={accountInput}
                                onChange={(event) =>
                                    setAccountInput(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Accounts
                                </option>


                                {accounts.map(
                                    (item) => (

                                        <option
                                            key={item._id}
                                            value={item._id}
                                        >
                                            {getAccountLabel(item)}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* PAYMENT MODE */}

                        <div className="col-12 col-md-6 col-lg-2">

                            <label className="form-label mb-1">
                                Payment Mode
                            </label>

                            <select
                                className="form-select"
                                value={paymentModeInput}
                                onChange={(event) =>
                                    setPaymentModeInput(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Payment Modes
                                </option>


                                {paymentModes.map(
                                    (mode) => (

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


                        {/* FROM */}

                        <div className="col-6 col-md-3 col-lg-1">

                            <label className="form-label mb-1">
                                From
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={fromDateInput}
                                onChange={(event) =>
                                    setFromDateInput(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* TO */}

                        <div className="col-6 col-md-3 col-lg-1">

                            <label className="form-label mb-1">
                                To
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={toDateInput}
                                onChange={(event) =>
                                    setToDateInput(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* PER PAGE */}

                        <div className="col-6 col-md-3 col-lg-1">

                            <label className="form-label mb-1">
                                Per page
                            </label>

                            <select
                                className="form-select"
                                value={limit}
                                onChange={(event) => {

                                    setLimit(
                                        Number(
                                            event.target.value
                                        )
                                    );

                                    setPage(1);

                                }}
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

                                <option value="100">
                                    100
                                </option>

                            </select>

                        </div>


                        {/* BUTTONS */}

                        <div className="col-6 col-md-3 col-lg-1">

                            <div className="d-flex gap-1">

                                <button
                                    type="submit"
                                    className="btn btn-dark"
                                >
                                    Filter
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handleClear}
                                >
                                    Clear
                                </button>

                            </div>

                        </div>

                    </form>

                </div>

            </div>


            {/* TABLE */}

            <div className="card">

                <div className="table-responsive">

                    <table
                        className="
                            table
                            table-bordered
                            table-hover
                            align-middle
                            mb-0
                        "
                    >

                        <thead className="table-light">

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Title
                                </th>

                                <th>
                                    Total Amount
                                </th>

                                <th>
                                    Pending Amount
                                </th>

                                <th>
                                    Recovered Amount
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
                                        colSpan="10"
                                        className="text-center py-5"
                                    >

                                        <div
                                            className="
                                                spinner-border
                                                spinner-border-sm
                                                me-2
                                            "
                                        />

                                        Loading...

                                    </td>

                                </tr>

                            ) : debts.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="10"
                                        className="
                                            text-center
                                            text-muted
                                            py-5
                                        "
                                    >

                                        No Record Found

                                    </td>

                                </tr>

                            ) : (

                                debts.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const amount =
                                            Number(
                                                item.amount || 0
                                            );


                                        const pending =
                                            Number(
                                                item.pendingAmount ?? 0
                                            );


                                        const recovered =
                                            Math.max(
                                                0,
                                                amount - pending
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
                                                            (page - 1) *
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


                                                {/* TOTAL */}

                                                <td>

                                                    ₹{" "}

                                                    {amount.toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }
                                                    )}

                                                </td>


                                                {/* PENDING */}

                                                <td>

                                                    <span className="text-danger">

                                                        ₹{" "}

                                                        {pending.toLocaleString(
                                                            "en-IN",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            }
                                                        )}

                                                    </span>

                                                </td>


                                                {/* RECOVERED */}

                                                <td>

                                                    <span className="text-success">

                                                        ₹{" "}

                                                        {recovered.toLocaleString(
                                                            "en-IN",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
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
                                                            "-"
                                                        }

                                                    </span>

                                                </td>


                                                {/* ACCOUNT */}

                                                <td>

                                                    {
                                                        getAccountLabel(
                                                            item.account
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

                                                <td>

                                                    <div className="d-flex gap-1">

                                                        <Link
                                                            to={
                                                                `/debt/edit/${item._id}`
                                                            }
                                                            className="
                                                                btn
                                                                btn-warning
                                                                btn-sm
                                                            "
                                                        >

                                                            Edit

                                                        </Link>


                                                        <button
                                                            type="button"
                                                            className="
                                                                btn
                                                                btn-danger
                                                                btn-sm
                                                            "
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


                {/* FOOTER */}

                <div
                    className="
                        card-footer
                        bg-white
                        d-flex
                        justify-content-between
                        align-items-center
                        flex-wrap
                        gap-2
                    "
                >

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
                            onPageChange={(nextPage) => {

                                if (
                                    nextPage >= 1 &&
                                    nextPage <= totalPages
                                ) {

                                    setPage(
                                        nextPage
                                    );

                                }

                            }}
                        />

                    )}

                </div>

            </div>

        </div>

    );

};


export default DebtList;