import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    deleteExpense,
    exportExpensesExcel,
    getExpenses,
    importExpensesExcel
} from "../../api/expenseApi";

import {
    getCategories
} from "../../api/categoryApi";

import {
    getShops
} from "../../api/shopApi";

import {
    getAccounts
} from "../../api/accountApi";

import Pagination
    from "../../components/common/Pagination";


const ExpenseList = () => {

    const fileInputRef = useRef(null);


    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    const [expenses, setExpenses] = useState([]);

    const [categories, setCategories] = useState([]);

    const [shops, setShops] = useState([]);

    const [accounts, setAccounts] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    const [total, setTotal] = useState(0);

    const [totalPages, setTotalPages] = useState(1);

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);


    /*
    |--------------------------------------------------------------------------
    | TOTAL EXPENSE
    |--------------------------------------------------------------------------
    */

    const [totalAmount, setTotalAmount] = useState(0);


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);

    const [importing, setImporting] = useState(false);

    const [exporting, setExporting] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    */

    const [searchInput, setSearchInput] = useState("");

    const [search, setSearch] = useState("");


    const [categoryInput, setCategoryInput] = useState("");

    const [category, setCategory] = useState("");


    const [accountInput, setAccountInput] = useState("");

    const [account, setAccount] = useState("");


    const [shopTypeInput, setShopTypeInput] = useState("");

    const [shopType, setShopType] = useState("");


    const [shopInput, setShopInput] = useState("");

    const [shop, setShop] = useState("");


    const [paymentModeInput, setPaymentModeInput] = useState("");

    const [paymentMode, setPaymentMode] = useState("");


    const [fromDateInput, setFromDateInput] = useState("");

    const [toDateInput, setToDateInput] = useState("");


    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");


    /*
    |--------------------------------------------------------------------------
    | NORMALIZE API RESPONSE
    |--------------------------------------------------------------------------
    */

    const normalizeResponse = (response) => {

        if (!response) {
            return null;
        }


        /*
        |--------------------------------------------------------------------------
        | Axios response
        |--------------------------------------------------------------------------
        */

        if (
            response?.data?.success !== undefined
        ) {

            return response.data;

        }


        /*
        |--------------------------------------------------------------------------
        | Normal API response
        |--------------------------------------------------------------------------
        */

        if (
            response?.success !== undefined
        ) {

            return response;

        }


        return response;

    };


    /*
    |--------------------------------------------------------------------------
    | LOAD CATEGORIES
    |--------------------------------------------------------------------------
    */

    const loadCategories = useCallback(
        async () => {
            try {
                const response = await getCategories({ limit: 100, type: "EXPENSE" });
                console.log("Category Response:", response);
                const payload = normalizeResponse(response);
                let rows = [];
                if (Array.isArray(payload)) {
                    rows = payload;
                } else if (Array.isArray(payload?.data)) {
                    rows = payload.data;
                } else if (Array.isArray(payload?.data?.rows)) {
                    rows = payload.data.rows;
                }
                setCategories(rows);
            } catch (error) {
                console.error("Category Error:", error);
                setCategories([]);
            }
        },
        []
    );
    const loadShops = useCallback(
        async () => {
            try {
                const response = await getShops({ limit: 100, status: true });
                console.log("Shop Response:", response);
                const payload = normalizeResponse(response);

                let rows = [];
                if (Array.isArray(payload)) {
                    rows = payload;
                } else if (Array.isArray(payload?.data)) {
                    rows = payload.data;
                } else if (Array.isArray(payload?.data?.rows)) {
                    rows = payload.data.rows;
                }
                setShops(rows);
            } catch (error) {
                console.error("Shop Error:", error);
                setShops([]);
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
                        limit: 100,
                        status: true
                    });


                console.log(
                    "Account Response:",
                    response
                );


                const payload =
                    normalizeResponse(
                        response
                    );


                let rows = [];


                /*
                |--------------------------------------------------------------------------
                | Account API can return:
                |
                | {
                |    total: 3,
                |    page: 1,
                |    limit: 100,
                |    rows: []
                | }
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

                else if (
                    Array.isArray(
                        payload?.data?.data
                    )
                ) {

                    rows =
                        payload.data.data;

                }


                console.log(
                    "Account Rows:",
                    rows
                );


                setAccounts(
                    rows
                );

            } catch (error) {

                console.error(
                    "Account Error:",
                    error
                );

                setAccounts([]);

            }

        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | LOAD EXPENSES
    |--------------------------------------------------------------------------
    */

    const loadExpenses = useCallback(
        async () => {

            try {

                setLoading(true);


                const params = {

                    page,

                    limit,

                    search,

                    category,

                    account,

                    shopType,

                    shop,

                    paymentMode,

                    from: fromDate,

                    to: toDate

                };


                console.log(
                    "================================"
                );

                console.log(
                    "EXPENSE REQUEST"
                );

                console.log(
                    params
                );


                const response =
                    await getExpenses(
                        params
                    );


                console.log(
                    "================================"
                );

                console.log(
                    "EXPENSE API RESPONSE"
                );

                console.log(
                    response
                );


                /*
                |--------------------------------------------------------------------------
                | VARIABLES
                |--------------------------------------------------------------------------
                */

                let rows = [];

                let totalRecords = 0;

                let pages = 1;


                /*
                |--------------------------------------------------------------------------
                | CASE 1
                |
                | API returns array
                |
                | [
                |   {...},
                |   {...}
                | ]
                |--------------------------------------------------------------------------
                */

                if (
                    Array.isArray(
                        response
                    )
                ) {

                    rows =
                        response;

                    totalRecords =
                        rows.length;

                    pages =
                        Math.max(
                            1,
                            Math.ceil(
                                totalRecords /
                                limit
                            )
                        );

                }


                /*
                |--------------------------------------------------------------------------
                | CASE 2
                |
                | {
                |   success: true,
                |   data: [...]
                | }
                |--------------------------------------------------------------------------
                */

                else if (
                    response &&
                    typeof response ===
                    "object"
                ) {

                    /*
                    |--------------------------------------------------------------------------
                    | data is array
                    |--------------------------------------------------------------------------
                    */

                    if (
                        Array.isArray(
                            response.data
                        )
                    ) {

                        rows =
                            response.data;


                        totalRecords =
                            Number(
                                response.total ||
                                rows.length
                            );


                        pages =
                            Number(
                                response.totalPages ||
                                Math.ceil(
                                    totalRecords /
                                    limit
                                )
                            );

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | data is object
                    |
                    | {
                    |    data: {
                    |       total: 428,
                    |       page: 1,
                    |       limit: 10,
                    |       totalPages: 43,
                    |       data: []
                    |    }
                    | }
                    |--------------------------------------------------------------------------
                    */

                    else if (
                        response.data &&
                        typeof response.data ===
                        "object"
                    ) {

                        const result =
                            response.data;


                        if (
                            Array.isArray(
                                result.data
                            )
                        ) {

                            rows =
                                result.data;


                            totalRecords =
                                Number(
                                    result.total ||
                                    rows.length
                                );


                            pages =
                                Number(
                                    result.totalPages ||
                                    Math.ceil(
                                        totalRecords /
                                        (
                                            result.limit ||
                                            limit
                                        )
                                    )
                                );

                        }

                    }

                }


                /*
                |--------------------------------------------------------------------------
                | LOG RESULT
                |--------------------------------------------------------------------------
                */

                console.log(
                    "EXPENSE ROWS:",
                    rows
                );


                console.log(
                    "EXPENSE ROW COUNT:",
                    rows.length
                );


                console.log(
                    "TOTAL RECORDS:",
                    totalRecords
                );


                console.log(
                    "TOTAL PAGES:",
                    pages
                );


                /*
                |--------------------------------------------------------------------------
                | SET STATE
                |--------------------------------------------------------------------------
                */

                setExpenses(
                    rows
                );


                setTotal(
                    totalRecords
                );


                setTotalPages(
                    pages
                );


                /*
                |--------------------------------------------------------------------------
                | TOTAL AMOUNT
                |--------------------------------------------------------------------------
                */

                const amount =
                    rows.reduce(
                        (
                            sum,
                            item
                        ) => {

                            return (
                                sum +
                                Number(
                                    item?.amount ||
                                    0
                                )
                            );

                        },
                        0
                    );


                setTotalAmount(
                    amount
                );


            } catch (error) {

                console.error(
                    "================================"
                );


                console.error(
                    "EXPENSE FETCH ERROR"
                );


                console.error(
                    error
                );


                console.error(
                    "ERROR RESPONSE:",
                    error?.response?.data
                );


                setExpenses([]);

                setTotal(0);

                setTotalPages(1);

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
            account,
            shopType,
            shop,
            paymentMode,
            fromDate,
            toDate
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadCategories();

        loadShops();

        loadAccounts();

    }, [
        loadCategories,
        loadShops,
        loadAccounts
    ]);


    /*
    |--------------------------------------------------------------------------
    | EXPENSE LOAD
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | loadExpenses() not loadExpense()
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadExpenses();

    }, [
        loadExpenses
    ]);


    /*
    |--------------------------------------------------------------------------
    | FILTER
    |--------------------------------------------------------------------------
    */

    const handleFilter = (
        event
    ) => {

        event.preventDefault();


        setSearch(
            searchInput.trim()
        );


        setCategory(
            categoryInput
        );


        setAccount(
            accountInput
        );


        setShopType(
            shopTypeInput
        );


        setShop(
            shopInput
        );


        setPaymentMode(
            paymentModeInput
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
    | CLEAR
    |--------------------------------------------------------------------------
    */

    const handleClear = () => {

        setSearchInput("");

        setCategoryInput("");

        setAccountInput("");

        setShopTypeInput("");

        setShopInput("");

        setPaymentModeInput("");

        setFromDateInput("");

        setToDateInput("");


        setSearch("");

        setCategory("");

        setAccount("");

        setShopType("");

        setShop("");

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

    const handleDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this expense?"
            );


        if (!confirmed) {

            return;

        }


        try {

            const response =
                await deleteExpense(
                    id
                );


            const payload =
                normalizeResponse(
                    response
                );


            if (
                payload?.success
            ) {

                alert(
                    payload.message ||
                    "Expense deleted successfully."
                );


                /*
                |--------------------------------------------------------------------------
                | IMPORTANT
                |--------------------------------------------------------------------------
                */

                loadExpenses();

            } else {

                alert(
                    payload?.message ||
                    "Delete failed."
                );

            }

        } catch (error) {

            console.error(
                "Delete Expense Error:",
                error
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Delete failed."

            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | IMPORT CLICK
    |--------------------------------------------------------------------------
    */

    const handleImportClick = () => {

        if (
            fileInputRef.current
        ) {

            fileInputRef.current.click();

        }

    };


    /*
    |--------------------------------------------------------------------------
    | IMPORT EXCEL
    |--------------------------------------------------------------------------
    */

    const handleImport = async (
        event
    ) => {

        const file =
            event.target.files?.[0];


        if (!file) {

            return;

        }


        try {

            setImporting(true);


            const response =
                await importExpensesExcel(
                    file
                );


            const payload =
                normalizeResponse(
                    response
                );


            if (
                payload?.success
            ) {

                alert(
                    payload.message ||
                    "Expenses imported successfully."
                );


                setPage(1);


                /*
                |--------------------------------------------------------------------------
                | IMPORTANT
                |--------------------------------------------------------------------------
                */

                loadExpenses();

            } else {

                alert(
                    payload?.message ||
                    "Import failed."
                );

            }

        } catch (error) {

            console.error(
                "Import Error:",
                error
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Import failed."

            );

        } finally {

            setImporting(false);


            event.target.value = "";

        }

    };


    /*
    |--------------------------------------------------------------------------
    | EXPORT EXCEL
    |--------------------------------------------------------------------------
    */

    const handleExport = async () => {

        try {

            setExporting(true);


            const blob =
                await exportExpensesExcel({

                    search,

                    category,

                    account,

                    shopType,

                    shop,

                    paymentMode,

                    from: fromDate,

                    to: toDate

                });


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "expense-export.xlsx";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                url
            );

        } catch (error) {

            console.error(
                "Export Error:",
                error
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Export failed."

            );

        } finally {

            setExporting(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | FILTERED SHOPS
    |--------------------------------------------------------------------------
    */

    const filteredShops =
        shops.filter(
            item => {

                if (
                    !shopTypeInput
                ) {

                    return true;

                }


                return (

                    String(
                        item.type || ""
                    ).toUpperCase() ===

                    String(
                        shopTypeInput
                    ).toUpperCase()

                );

            }
        );


    /*
    |--------------------------------------------------------------------------
    | ACCOUNT NAME
    |--------------------------------------------------------------------------
    */

    const getAccountName = (
        item
    ) => {

        /*
        |--------------------------------------------------------------------------
        | Populated account
        |--------------------------------------------------------------------------
        */

        if (
            item?.account?.name
        ) {

            return item.account.name;

        }


        /*
        |--------------------------------------------------------------------------
        | Account ID
        |--------------------------------------------------------------------------
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
                    "-"
                );

            }

        }


        return "-";

    };


    /*
    |--------------------------------------------------------------------------
    | SHOP NAME
    |--------------------------------------------------------------------------
    */

    const getShopName = (
        item
    ) => {

        /*
        |--------------------------------------------------------------------------
        | Populated shop
        |--------------------------------------------------------------------------
        */

        if (
            item?.shop?.name
        ) {

            return item.shop.name;

        }


        /*
        |--------------------------------------------------------------------------
        | shopName
        |--------------------------------------------------------------------------
        */

        if (
            item?.shopName
        ) {

            return item.shopName;

        }


        /*
        |--------------------------------------------------------------------------
        | Shop ID
        |--------------------------------------------------------------------------
        */

        if (
            typeof item?.shop ===
            "string"
        ) {

            const found =
                shops.find(
                    shopItem =>
                        String(
                            shopItem?._id
                        ) ===
                        String(
                            item.shop
                        )
                );


            if (found) {

                return (
                    found.name ||
                    "-"
                );

            }

        }


        return "-";

    };


    /*
    |--------------------------------------------------------------------------
    | FORMAT AMOUNT
    |--------------------------------------------------------------------------
    */

    const formatAmount = (
        amount
    ) => {

        return Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | FORMAT DATE
    |--------------------------------------------------------------------------
    */

    const formatDate = (
        date
    ) => {

        if (!date) {

            return "-";

        }


        const parsedDate =
            new Date(date);


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
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | PAGINATION DISPLAY
    |--------------------------------------------------------------------------
    */

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
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="container-fluid px-4 py-3">


            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">

                <div>

                    <h3 className="mb-1 fw-bold">

                        Expense List

                    </h3>


                    <div className="text-danger fw-semibold fs-5">

                        Total Expense: ₹
                        {formatAmount(
                            totalAmount
                        )}

                    </div>

                </div>


                <div className="d-flex gap-2 flex-wrap">

                    <input
                        ref={
                            fileInputRef
                        }
                        type="file"
                        accept=".xlsx,.xls"
                        className="d-none"
                        onChange={
                            handleImport
                        }
                    />


                    <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={
                            handleImportClick
                        }
                        disabled={
                            importing
                        }
                    >

                        {importing
                            ? "Importing..."
                            : "Import Excel"
                        }

                    </button>


                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={
                            handleExport
                        }
                        disabled={
                            exporting
                        }
                    >

                        {exporting
                            ? "Exporting..."
                            : "Export Excel"
                        }

                    </button>


                    <Link
                        to="/expense/add"
                        className="btn btn-primary"
                    >

                        + Add Expense

                    </Link>

                </div>

            </div>


            {/* FILTER CARD */}

            <div className="card border-0 shadow-sm mb-3">

                <div className="card-body">

                    <form
                        onSubmit={
                            handleFilter
                        }
                    >

                        <div className="row g-3 align-items-end">


                            {/* SEARCH */}

                            <div className="col-12 col-md-6 col-lg-2">

                                <label className="form-label">
                                    Search
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search title"
                                    value={
                                        searchInput
                                    }
                                    onChange={
                                        event =>
                                            setSearchInput(
                                                event.target.value
                                            )
                                    }
                                />

                            </div>


                            {/* CATEGORY */}

                            <div className="col-12 col-md-6 col-lg-2">

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

                            <div className="col-12 col-md-6 col-lg-2">

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
                                                    "Unnamed Account"
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* SHOP TYPE */}

                            <div className="col-12 col-md-6 col-lg-2">

                                <label className="form-label">
                                    Shop Type
                                </label>

                                <select
                                    className="form-select"
                                    value={
                                        shopTypeInput
                                    }
                                    onChange={
                                        event => {

                                            setShopTypeInput(
                                                event.target.value
                                            );

                                            setShopInput("");

                                        }
                                    }
                                >

                                    <option value="">
                                        All Shop Types
                                    </option>

                                    <option value="ONLINE">
                                        ONLINE
                                    </option>

                                    <option value="OFFLINE">
                                        OFFLINE
                                    </option>

                                </select>

                            </div>


                            {/* SHOP */}

                            <div className="col-12 col-md-6 col-lg-2">

                                <label className="form-label">
                                    Shop
                                </label>

                                <select
                                    className="form-select"
                                    value={
                                        shopInput
                                    }
                                    onChange={
                                        event =>
                                            setShopInput(
                                                event.target.value
                                            )
                                    }
                                >

                                    <option value="">
                                        All Shops
                                    </option>


                                    {filteredShops.map(
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

                            <div className="col-12 col-md-6 col-lg-2">

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

                                    <option value="Cash">
                                        Cash
                                    </option>

                                    <option value="AmazonPay">
                                        Amazon Pay
                                    </option>

                                    <option value="BankTransfer">
                                        Bank Transfer
                                    </option>

                                    <option value="Bhim">
                                        Bhim
                                    </option>

                                    <option value="GPay">
                                        GPay
                                    </option>

                                    <option value="Paytm">
                                        Paytm
                                    </option>

                                    <option value="PhonePe">
                                        PhonePe
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* FROM */}

                            <div className="col-12 col-md-6 col-lg-2">

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

                            <div className="col-12 col-md-6 col-lg-2">

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

                            <div className="col-12 col-md-6 col-lg-1">

                                <label className="form-label">
                                    Per Page
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

                                    <option value="100">
                                        100
                                    </option>

                                </select>

                            </div>


                            {/* FILTER */}

                            <div className="col-12 col-md-6 col-lg-1">

                                <button
                                    type="submit"
                                    className="btn btn-dark w-100"
                                >

                                    Filter

                                </button>

                            </div>


                            {/* CLEAR */}

                            <div className="col-12 col-md-6 col-lg-1">

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-100"
                                    onClick={
                                        handleClear
                                    }
                                >

                                    Clear

                                </button>

                            </div>

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
                                    Shop Type
                                </th>

                                <th>
                                    Shop
                                </th>

                                <th>
                                    Payment Mode
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Note
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
                                        colSpan="11"
                                        className="text-center py-5"
                                    >

                                        <div
                                            className="spinner-border text-primary"
                                        />

                                        <div className="mt-2 text-muted">

                                            Loading expenses...

                                        </div>

                                    </td>

                                </tr>

                            ) : expenses.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="11"
                                        className="text-center py-5"
                                    >

                                        <div className="text-muted">

                                            No Record Found

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                expenses.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item._id
                                            }
                                        >

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


                                            <td className="fw-semibold">

                                                {
                                                    item.title ||
                                                    "-"
                                                }

                                            </td>


                                            <td className="fw-semibold text-danger">

                                                ₹
                                                {formatAmount(
                                                    item.amount
                                                )}

                                            </td>


                                            <td>

                                                {
                                                    item.category?.name ||
                                                    "-"
                                                }

                                            </td>


                                            <td>

                                                {
                                                    getAccountName(
                                                        item
                                                    )
                                                }

                                            </td>


                                            <td>

                                                {item.shopType ===
                                                    "ONLINE" ? (

                                                    <span className="badge bg-primary">

                                                        ONLINE

                                                    </span>

                                                ) : item.shopType ===
                                                    "OFFLINE" ? (

                                                    <span className="badge bg-success">

                                                        OFFLINE

                                                    </span>

                                                ) : (

                                                    "-"

                                                )}

                                            </td>


                                            <td>

                                                {
                                                    getShopName(
                                                        item
                                                    )
                                                }

                                            </td>


                                            <td>

                                                {
                                                    item.paymentMode ||
                                                    "-"
                                                }

                                            </td>


                                            <td>

                                                {
                                                    formatDate(
                                                        item.date
                                                    )
                                                }

                                            </td>


                                            <td>

                                                {
                                                    item.note ||
                                                    "-"
                                                }

                                            </td>


                                            <td className="text-nowrap">

                                                <Link
                                                    to={
                                                        `/expense/edit/${item._id}`
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

                    <div className="text-muted">

                        Showing{" "}
                        {startRecord}
                        {" "}to{" "}
                        {endRecord}
                        {" "}of{" "}
                        {total}
                        {" "}records

                    </div>


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


export default ExpenseList;