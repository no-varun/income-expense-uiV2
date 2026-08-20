import { useEffect, useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    createTransfer,
    getAccountBalance
} from "../../api/transferApi";

import {
    getAccounts
} from "../../api/accountApi";


const AddTransfer = () => {

    const navigate = useNavigate();


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [accounts, setAccounts] =
        useState([]);

    const [loadingAccounts, setLoadingAccounts] =
        useState(true);

    const [loadingBalance, setLoadingBalance] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [balance, setBalance] =
        useState(null);

    const [form, setForm] = useState({

        fromAccount: "",

        toAccount: "",

        amount: "",

        date:
            new Date()
                .toISOString()
                .split("T")[0],

        purpose: "",

        note: ""

    });


    /*
    |--------------------------------------------------------------------------
    | NORMALIZE API RESPONSE
    |--------------------------------------------------------------------------
    */

    const normalizeResponse = (
        response
    ) => {

        if (!response) {

            return null;

        }


        /*
        |--------------------------------------------------------------------------
        | Direct API response
        |--------------------------------------------------------------------------
        */

        if (
            typeof response === "object" &&
            response.success !== undefined
        ) {

            return response;

        }


        /*
        |--------------------------------------------------------------------------
        | Nested Axios response
        |--------------------------------------------------------------------------
        */

        if (
            response.data &&
            typeof response.data === "object" &&
            response.data.success !== undefined
        ) {

            return response.data;

        }


        return response;

    };


    /*
    |--------------------------------------------------------------------------
    | LOAD ACCOUNTS
    |--------------------------------------------------------------------------
    */

    const loadAccounts = async () => {

        try {

            setLoadingAccounts(true);


            const rawResponse =
                await getAccounts();


            console.log(
                "TRANSFER ACCOUNT RAW RESPONSE:",
                rawResponse
            );


            const response =
                normalizeResponse(
                    rawResponse
                );


            console.log(
                "TRANSFER ACCOUNT RESPONSE:",
                response
            );


            if (
                response?.success === true
            ) {

                const data =
                    response.data;


                let rows = [];


                /*
                |--------------------------------------------------------------------------
                | Response data is array
                |--------------------------------------------------------------------------
                */

                if (
                    Array.isArray(data)
                ) {

                    rows =
                        data;

                }


                /*
                |--------------------------------------------------------------------------
                | Response data.rows
                |--------------------------------------------------------------------------
                */

                else if (
                    Array.isArray(
                        data?.rows
                    )
                ) {

                    rows =
                        data.rows;

                }


                /*
                |--------------------------------------------------------------------------
                | Only active accounts
                |--------------------------------------------------------------------------
                */

                rows =
                    rows.filter(
                        account =>
                            account.status !== false
                    );


                console.log(
                    "TRANSFER ACCOUNTS:",
                    rows
                );


                setAccounts(
                    rows
                );


            } else {

                setAccounts([]);


                alert(
                    response?.message ||
                    "Unable to load accounts."
                );

            }


        } catch (error) {

            console.error(
                "Load Accounts Error:",
                error
            );


            setAccounts([]);


            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load accounts."
            );


        } finally {

            setLoadingAccounts(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadAccounts();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | LOAD ACCOUNT BALANCE
    |--------------------------------------------------------------------------
    */

    const loadBalance = async (
        accountId
    ) => {

        if (!accountId) {

            setBalance(null);

            return;

        }


        try {

            setLoadingBalance(true);

            setBalance(null);


            console.log(
                "================================"
            );

            console.log(
                "LOADING ACCOUNT BALANCE"
            );

            console.log(
                "ACCOUNT ID:",
                accountId
            );


            const rawResponse =
                await getAccountBalance(
                    accountId
                );


            console.log(
                "ACCOUNT BALANCE RAW RESPONSE:",
                rawResponse
            );


            const response =
                normalizeResponse(
                    rawResponse
                );


            console.log(
                "ACCOUNT BALANCE NORMALIZED:",
                response
            );


            /*
            |--------------------------------------------------------------------------
            | SUCCESS
            |--------------------------------------------------------------------------
            */

            if (
                response?.success === true
            ) {

                const data =
                    response.data;


                console.log(
                    "ACCOUNT BALANCE DATA:",
                    data
                );


                if (
                    data &&
                    typeof data === "object"
                ) {

                    setBalance({

                        openingBalance:
                            Number(
                                data.openingBalance ?? 0
                            ),

                        income:
                            Number(
                                data.income ?? 0
                            ),

                        expense:
                            Number(
                                data.expense ?? 0
                            ),

                        outgoingTransfer:
                            Number(
                                data.outgoingTransfer ?? 0
                            ),

                        incomingTransfer:
                            Number(
                                data.incomingTransfer ?? 0
                            ),

                        balance:
                            Number(
                                data.balance ?? 0
                            )

                    });


                    console.log(
                        "BALANCE SET SUCCESSFULLY"
                    );


                    return;

                }


                console.error(
                    "Balance data missing:",
                    response
                );


                alert(
                    "Account balance data not found."
                );


                return;

            }


            /*
            |--------------------------------------------------------------------------
            | API FAILURE
            |--------------------------------------------------------------------------
            */

            console.error(
                "Balance API returned failure:",
                response
            );


            setBalance(null);


            alert(
                response?.message ||
                "Unable to get account balance."
            );


        } catch (error) {

            console.error(
                "GET ACCOUNT BALANCE ERROR:",
                error
            );


            console.error(
                "ERROR RESPONSE:",
                error?.response
            );


            console.error(
                "ERROR DATA:",
                error?.response?.data
            );


            setBalance(null);


            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to get account balance."
            );


        } finally {

            setLoadingBalance(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | HANDLE INPUT
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;


        /*
        |--------------------------------------------------------------------------
        | FROM ACCOUNT
        |--------------------------------------------------------------------------
        */

        if (
            name === "fromAccount"
        ) {

            /*
            |--------------------------------------------------------------------------
            | Clear previous balance
            |--------------------------------------------------------------------------
            */

            setBalance(null);


            /*
            |--------------------------------------------------------------------------
            | Update source account
            |--------------------------------------------------------------------------
            */

            setForm(
                previous => ({

                    ...previous,

                    fromAccount:
                        value,

                    /*
                    |--------------------------------------------------------------------------
                    | Prevent same source/destination
                    |--------------------------------------------------------------------------
                    */

                    toAccount:
                        value ===
                        previous.toAccount
                            ? ""
                            : previous.toAccount

                })
            );


            /*
            |--------------------------------------------------------------------------
            | Load balance
            |--------------------------------------------------------------------------
            */

            if (value) {

                loadBalance(
                    value
                );

            }


            return;

        }


        /*
        |--------------------------------------------------------------------------
        | AMOUNT
        |--------------------------------------------------------------------------
        */

        if (
            name === "amount"
        ) {

            /*
            |--------------------------------------------------------------------------
            | Allow empty input
            |--------------------------------------------------------------------------
            */

            if (value === "") {

                setForm(
                    previous => ({

                        ...previous,

                        amount: ""

                    })
                );

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | Allow decimal numbers
            |--------------------------------------------------------------------------
            */

            const numericValue =
                Number(value);


            if (
                Number.isFinite(
                    numericValue
                ) &&
                numericValue >= 0
            ) {

                setForm(
                    previous => ({

                        ...previous,

                        amount:
                            value

                    })
                );

            }


            return;

        }


        /*
        |--------------------------------------------------------------------------
        | OTHER FIELDS
        |--------------------------------------------------------------------------
        */

        setForm(
            previous => ({

                ...previous,

                [name]:
                    value

            })
        );

    };


    /*
    |--------------------------------------------------------------------------
    | FORMAT CURRENCY
    |--------------------------------------------------------------------------
    */

    const formatAmount = (
        amount
    ) => {

        const number =
            Number(amount);


        if (
            !Number.isFinite(
                number
            )
        ) {

            return "₹0.00";

        }


        return number.toLocaleString(
            "en-IN",
            {

                style:
                    "currency",

                currency:
                    "INR",

                maximumFractionDigits:
                    2

            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | SELECTED FROM ACCOUNT
    |--------------------------------------------------------------------------
    */

    const selectedFromAccount =
        accounts.find(
            account =>
                account._id ===
                form.fromAccount
        );


    /*
    |--------------------------------------------------------------------------
    | SELECTED TO ACCOUNT
    |--------------------------------------------------------------------------
    */

    const selectedToAccount =
        accounts.find(
            account =>
                account._id ===
                form.toAccount
        );


    /*
    |--------------------------------------------------------------------------
    | CURRENT BALANCE
    |--------------------------------------------------------------------------
    */

    const currentBalance =
        Number(
            balance?.balance ?? 0
        );


    /*
    |--------------------------------------------------------------------------
    | MINIMUM BALANCE
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | This is ONLY displayed.
    |
    | It does NOT reduce the transferable amount.
    |
    |--------------------------------------------------------------------------
    */

    const minimumBalance =
        Number(
            selectedFromAccount?.minimumBalance ?? 0
        );


    /*
    |--------------------------------------------------------------------------
    | MAXIMUM TRANSFER
    |--------------------------------------------------------------------------
    |
    | User can transfer the complete current balance.
    |
    | Example:
    |
    | Current balance = ₹20,000
    | Minimum balance = ₹20,000
    |
    | Maximum transfer = ₹20,000
    |
    |--------------------------------------------------------------------------
    */

    const maximumTransfer =
        Math.max(
            0,
            currentBalance
        );


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

   const handleSubmit = async (e) => {

    e.preventDefault();

    const amount = Number(form.amount);

    if (!form.fromAccount) {

        alert("Please select the source account.");

        return;

    }

    if (!form.toAccount) {

        alert("Please select the destination account.");

        return;

    }

    if (
        form.fromAccount ===
        form.toAccount
    ) {

        alert(
            "From account and to account cannot be the same."
        );

        return;

    }

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid transfer amount."
        );

        return;

    }

    if (!balance) {

        alert(
            "Unable to verify source account balance."
        );

        return;

    }


    const currentBalance =
        Number(
            balance.balance || 0
        );


    /*
    |--------------------------------------------------------------------------
    | ONLY CURRENT BALANCE LIMIT
    |--------------------------------------------------------------------------
    |
    | minimumBalance is NOT used here.
    |
    */

    if (
        amount >
        currentBalance
    ) {

        alert(
            `Insufficient balance. Available balance is ₹${currentBalance.toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 2
                }
            )}.`
        );

        return;

    }


    try {

        setSaving(true);


        const payload = {

            fromAccount:
                form.fromAccount,

            toAccount:
                form.toAccount,

            amount:
                amount,

            date:
                form.date,

            purpose:
                form.purpose?.trim() || "",

            note:
                form.note?.trim() || ""

        };


        console.log(
            "CREATE TRANSFER PAYLOAD:",
            payload
        );


        const response =
            await createTransfer(
                payload
            );


        console.log(
            "CREATE TRANSFER RESPONSE:",
            response
        );


        /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

        if (
            response?.success === true
        ) {

            alert(
                response.message ||
                "Transfer created successfully."
            );


            navigate(
                "/transfers"
            );


            return;

        }


        /*
        |--------------------------------------------------------------------------
        | FAILURE
        |--------------------------------------------------------------------------
        */

        console.error(
            "TRANSFER API FAILURE:",
            response
        );


        alert(
            response?.message ||
            "Unable to create transfer."
        );


    } catch (error) {

        console.error(
            "CREATE TRANSFER ERROR:",
            error
        );


        console.error(
            "ERROR RESPONSE:",
            error?.response
        );


        console.error(
            "ERROR DATA:",
            error?.response?.data
        );


        alert(
            error?.response?.data?.message ||
            error?.message ||
            "Unable to create transfer."
        );


    } finally {

        setSaving(false);

    }

};


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="container-fluid">

            {/* ================================================================
                HEADER
            ================================================================= */}

            <div className="
                d-flex
                flex-wrap
                justify-content-between
                align-items-center
                mb-4
                gap-2
            ">

                <div>

                    <h3 className="mb-1">
                        Add Transfer
                    </h3>

                    <small className="text-muted">
                        Transfer money between your accounts
                    </small>

                </div>


                <Link
                    to="/transfers"
                    className="btn btn-outline-secondary"
                >

                    Back

                </Link>

            </div>


            {/* ================================================================
                FORM CARD
            ================================================================= */}

            <div className="row justify-content-center">

                <div className="col-xl-8 col-lg-10">

                    <div className="card shadow-sm">

                        <div className="card-header bg-white">

                            <h5 className="mb-0">
                                Transfer Details
                            </h5>

                        </div>


                        <div className="card-body">

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <div className="row">


                                    {/* ==================================================
                                        FROM ACCOUNT
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            From Account

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>


                                        <select
                                            className="form-select"
                                            name="fromAccount"
                                            value={
                                                form.fromAccount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                loadingAccounts ||
                                                saving
                                            }
                                        >

                                            <option value="">
                                                Select source account
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
                                                                account.name
                                                            }

                                                            {
                                                                account.bank
                                                                    ? ` (${account.bank})`
                                                                    : ""
                                                            }

                                                        </option>

                                                    )
                                                )
                                            }

                                        </select>

                                    </div>


                                    {/* ==================================================
                                        TO ACCOUNT
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            To Account

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>


                                        <select
                                            className="form-select"
                                            name="toAccount"
                                            value={
                                                form.toAccount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                loadingAccounts ||
                                                saving
                                            }
                                        >

                                            <option value="">
                                                Select destination account
                                            </option>


                                            {
                                                accounts
                                                    .filter(
                                                        account =>
                                                            account._id !==
                                                            form.fromAccount
                                                    )
                                                    .map(
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
                                                                    account.name
                                                                }

                                                                {
                                                                    account.bank
                                                                        ? ` (${account.bank})`
                                                                        : ""
                                                                }

                                                            </option>

                                                        )
                                                    )
                                            }

                                        </select>

                                    </div>


                                    {/* ==================================================
                                        BALANCE INFORMATION
                                    =================================================== */}

                                    <div className="col-12 mb-3">

                                        {
                                            loadingBalance && (

                                                <div className="alert alert-info mb-0">

                                                    <span
                                                        className="
                                                            spinner-border
                                                            spinner-border-sm
                                                            me-2
                                                        "
                                                    />

                                                    Checking account balance...

                                                </div>

                                            )
                                        }


                                        {
                                            !loadingBalance &&
                                            balance && (

                                                <div className="alert alert-light border mb-0">

                                                    <div className="row g-3">


                                                        {/* CURRENT BALANCE */}

                                                        <div className="col-md-4">

                                                            <small className="text-muted d-block">
                                                                Current Balance
                                                            </small>

                                                            <strong className="fs-5 text-primary">

                                                                {
                                                                    formatAmount(
                                                                        balance.balance
                                                                    )
                                                                }

                                                            </strong>

                                                        </div>


                                                        {/* MINIMUM BALANCE */}

                                                        <div className="col-md-4">

                                                            <small className="text-muted d-block">
                                                                Minimum Balance
                                                            </small>

                                                            <strong className="fs-5">

                                                                {
                                                                    formatAmount(
                                                                        minimumBalance
                                                                    )
                                                                }

                                                            </strong>

                                                            <small className="text-muted d-block">
                                                                Informational only
                                                            </small>

                                                        </div>


                                                        {/* MAXIMUM TRANSFER */}

                                                        <div className="col-md-4">

                                                            <small className="text-muted d-block">
                                                                Maximum Transfer
                                                            </small>

                                                            <strong className="fs-5 text-success">

                                                                {
                                                                    formatAmount(
                                                                        maximumTransfer
                                                                    )
                                                                }

                                                            </strong>

                                                        </div>

                                                    </div>

                                                </div>

                                            )
                                        }

                                    </div>


                                    {/* ==================================================
                                        AMOUNT
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Amount

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>


                                        <div className="input-group">

                                            <span className="input-group-text">
                                                ₹
                                            </span>


                                            <input
                                                type="number"
                                                className="form-control"
                                                name="amount"
                                                min="0.01"
                                                max={
                                                    maximumTransfer ||
                                                    undefined
                                                }
                                                step="0.01"
                                                placeholder="Enter amount"
                                                value={
                                                    form.amount
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    saving ||
                                                    !form.fromAccount ||
                                                    loadingBalance
                                                }
                                            />

                                        </div>


                                        {
                                            balance && (

                                                <small className="text-muted">

                                                    You can transfer from

                                                    {" "}

                                                    <strong>
                                                        ₹0.01
                                                    </strong>

                                                    {" "}to{" "}

                                                    <strong>
                                                        {
                                                            formatAmount(
                                                                maximumTransfer
                                                            )
                                                        }
                                                    </strong>

                                                </small>

                                            )
                                        }

                                    </div>


                                    {/* ==================================================
                                        DATE
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Transfer Date
                                        </label>


                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={
                                                form.date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>


                                    {/* ==================================================
                                        PURPOSE
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Purpose
                                        </label>


                                        <input
                                            type="text"
                                            className="form-control"
                                            name="purpose"
                                            placeholder="e.g. RD, Daily Expenses, Savings"
                                            maxLength="255"
                                            value={
                                                form.purpose
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>


                                    {/* ==================================================
                                        NOTE
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Note
                                        </label>


                                        <input
                                            type="text"
                                            className="form-control"
                                            name="note"
                                            placeholder="Optional note"
                                            maxLength="1000"
                                            value={
                                                form.note
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>


                                    {/* ==================================================
                                        PREVIEW
                                    =================================================== */}

                                    {
                                        selectedFromAccount &&
                                        selectedToAccount &&
                                        form.amount && (

                                            <div className="col-12 mb-4">

                                                <div className="alert alert-primary mb-0">

                                                    <div className="
                                                        d-flex
                                                        flex-wrap
                                                        justify-content-between
                                                        align-items-center
                                                        gap-3
                                                    ">

                                                        <div>

                                                            <small className="d-block text-muted">
                                                                From
                                                            </small>

                                                            <strong>
                                                                {
                                                                    selectedFromAccount.name
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div className="fs-4">
                                                            →
                                                        </div>


                                                        <div>

                                                            <small className="d-block text-muted">
                                                                To
                                                            </small>

                                                            <strong>
                                                                {
                                                                    selectedToAccount.name
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div>

                                                            <small className="d-block text-muted">
                                                                Amount
                                                            </small>

                                                            <strong>
                                                                {
                                                                    formatAmount(
                                                                        form.amount
                                                                    )
                                                                }
                                                            </strong>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    }

                                </div>


                                {/* ========================================================
                                    BUTTONS
                                ========================================================= */}

                                <div className="
                                    d-flex
                                    flex-wrap
                                    gap-2
                                ">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={
                                            saving ||
                                            loadingAccounts ||
                                            loadingBalance ||
                                            !form.fromAccount ||
                                            !form.toAccount ||
                                            !balance
                                        }
                                    >

                                        {
                                            saving
                                                ? (
                                                    <>
                                                        <span
                                                            className="
                                                                spinner-border
                                                                spinner-border-sm
                                                                me-2
                                                            "
                                                        />

                                                        Transferring...
                                                    </>
                                                )
                                                : "Transfer Money"
                                        }

                                    </button>


                                    <Link
                                        to="/transfers"
                                        className="btn btn-secondary"
                                    >

                                        Cancel

                                    </Link>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};


export default AddTransfer;