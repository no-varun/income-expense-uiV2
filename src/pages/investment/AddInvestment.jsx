import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    createInvestment
} from "../../api/investmentApi";

import {
    getAccounts
} from "../../api/accountApi";


const AddInvestment = () => {

    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [accounts, setAccounts] = useState([]);

    const [loadingAccounts, setLoadingAccounts] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | FORM
    |--------------------------------------------------------------------------
    */

    const [form, setForm] = useState({

        name: "",

        type: "SIP",

        account: "",

        investedAmount: "",

        currentValue: "",

        date:
            new Date()
                .toISOString()
                .split("T")[0],

        maturityDate: "",

        status: true,

        note: ""

    });


    /*
    |--------------------------------------------------------------------------
    | INVESTMENT TYPES
    |--------------------------------------------------------------------------
    */

    const investmentTypes = [

        "FD",

        "RD",

        "SIP",

        "STOCK",

        "MUTUAL_FUND",

        "GOLD",

        "OTHER"

    ];


    /*
    |--------------------------------------------------------------------------
    | TYPE LABEL
    |--------------------------------------------------------------------------
    */

    const getTypeLabel = (type) => {

        const labels = {

            FD: "Fixed Deposit",

            RD: "Recurring Deposit",

            SIP: "SIP",

            STOCK: "Stock",

            MUTUAL_FUND: "Mutual Fund",

            GOLD: "Gold",

            OTHER: "Other"

        };

        return labels[type] || type;

    };


    /*
    |--------------------------------------------------------------------------
    | MATURITY DATE REQUIRED?
    |--------------------------------------------------------------------------
    */

    const requiresMaturityDate =
        form.type === "FD" ||
        form.type === "RD";


    /*
    |--------------------------------------------------------------------------
    | LOAD ACCOUNTS
    |--------------------------------------------------------------------------
    */

    const loadAccounts = async () => {

        try {

            setLoadingAccounts(true);

            setError("");

            const response =
                await getAccounts();

            console.log(
                "Account API Response:",
                response
            );


            /*
            |--------------------------------------------------------------------------
            | SUPPORT BOTH RESPONSE FORMATS
            |--------------------------------------------------------------------------
            |
            | Format 1:
            |
            | {
            |   success: true,
            |   data: {
            |      rows: []
            |   }
            | }
            |
            | Format 2:
            |
            | {
            |   total: 3,
            |   rows: []
            | }
            |
            */

            const result =
                response?.data?.rows !== undefined
                    ? response.data
                    : response;


            const rows =
                Array.isArray(result?.rows)
                    ? result.rows

                    : Array.isArray(result)
                        ? result

                        : [];


            console.log(
                "Account Rows:",
                rows
            );


            setAccounts(rows);


        } catch (error) {

            console.error(
                "Get Accounts Error:",
                error
            );

            setAccounts([]);

            setError(
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
    | HANDLE CHANGE
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        /*
        |--------------------------------------------------------------------------
        | TYPE CHANGE
        |--------------------------------------------------------------------------
        */

        if (name === "type") {

            setForm(prev => ({

                ...prev,

                type: value,

                /*
                 * Clear maturity date for non FD/RD
                 */
                maturityDate:
                    value === "FD" ||
                        value === "RD"
                        ? prev.maturityDate
                        : ""

            }));

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | STATUS
        |--------------------------------------------------------------------------
        */

        if (name === "status") {

            setForm(prev => ({

                ...prev,

                status:
                    value === "true"

            }));

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | NORMAL FIELD
        |--------------------------------------------------------------------------
        */

        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    /*
    |--------------------------------------------------------------------------
    | FORMAT AMOUNT
    |--------------------------------------------------------------------------
    */

    const formatAmount = (amount) => {

        const number =
            Number(amount || 0);


        return number.toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | CALCULATED VALUES
    |--------------------------------------------------------------------------
    */

    const invested =
        Number(
            form.investedAmount || 0
        );


    const currentValue =
        form.currentValue === ""
            ? invested
            : Number(
                form.currentValue || 0
            );


    const profitLoss =
        currentValue -
        invested;


    const returnPercentage =
        invested > 0
            ? (
                profitLoss /
                invested
            ) *
            100

            : 0;


    /*
    |--------------------------------------------------------------------------
    | VALIDATE DATE
    |--------------------------------------------------------------------------
    */

    const validateDates = () => {

        /*
        |--------------------------------------------------------------------------
        | Non FD/RD
        |--------------------------------------------------------------------------
        */

        if (!requiresMaturityDate) {

            return true;

        }


        /*
        |--------------------------------------------------------------------------
        | FD/RD MATURITY REQUIRED
        |--------------------------------------------------------------------------
        */

        if (!form.maturityDate) {

            alert(
                "Please select maturity date for FD/RD."
            );

            return false;

        }


        /*
        |--------------------------------------------------------------------------
        | INVESTMENT DATE
        |--------------------------------------------------------------------------
        */

        if (!form.date) {

            alert(
                "Please select investment date."
            );

            return false;

        }


        /*
        |--------------------------------------------------------------------------
        | COMPARE DATE STRINGS
        |--------------------------------------------------------------------------
        |
        | YYYY-MM-DD strings can safely be compared.
        |
        */

        if (
            form.maturityDate <
            form.date
        ) {

            alert(
                "Maturity date cannot be before investment date."
            );

            return false;

        }


        return true;

    };


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (saving) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | NAME
        |--------------------------------------------------------------------------
        */

        if (!form.name.trim()) {

            alert("Please enter investment name.");

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | ACCOUNT
        |--------------------------------------------------------------------------
        */

        if (!form.account) {

            alert("Please select account.");

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | INVESTED AMOUNT
        |--------------------------------------------------------------------------
        */

        const investedAmount =
            Number(form.investedAmount);


        if (
            !Number.isFinite(investedAmount) ||
            investedAmount <= 0
        ) {

            alert(
                "Please enter a valid invested amount."
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | CURRENT VALUE
        |--------------------------------------------------------------------------
        */

        const currentValue =
            form.currentValue === ""
                ? investedAmount
                : Number(form.currentValue);


        if (
            !Number.isFinite(currentValue) ||
            currentValue < 0
        ) {

            alert(
                "Please enter a valid current value."
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | INVESTMENT DATE
        |--------------------------------------------------------------------------
        */

        if (!form.date) {

            alert(
                "Please select investment date."
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | MATURITY DATE
        |--------------------------------------------------------------------------
        */

        const requiresMaturityDate =
            form.type === "FD" ||
            form.type === "RD";


        if (requiresMaturityDate) {

            if (!form.maturityDate) {

                alert(
                    "Please select maturity date for FD/RD."
                );

                return;
            }


            if (
                form.maturityDate <
                form.date
            ) {

                alert(
                    "Maturity date cannot be before investment date."
                );

                return;
            }

        }


        /*
        |--------------------------------------------------------------------------
        | PAYLOAD
        |--------------------------------------------------------------------------
        */

        const payload = {

            name:
                form.name.trim(),

            type:
                form.type,

            account:
                form.account,

            investedAmount:
                investedAmount,

            currentValue:
                currentValue,

            date:
                form.date,

            status:
                Boolean(form.status),

            note:
                form.note.trim()

        };


        /*
        |--------------------------------------------------------------------------
        | ONLY FD/RD SEND MATURITY DATE
        |--------------------------------------------------------------------------
        */

        if (
            requiresMaturityDate &&
            form.maturityDate
        ) {

            payload.maturityDate =
                form.maturityDate;

        }


        console.log(
            "Create Investment Payload:",
            payload
        );


        try {

            setSaving(true);


            /*
            |--------------------------------------------------------------------------
            | CREATE
            |--------------------------------------------------------------------------
            */

            const response =
                await createInvestment(
                    payload
                );


            console.log(
                "Create Investment Response:",
                response
            );


            /*
            |--------------------------------------------------------------------------
            | HANDLE ALL POSSIBLE API RESPONSE FORMATS
            |--------------------------------------------------------------------------
            |
            | FORMAT 1
            |
            | {
            |   success: true,
            |   message: "...",
            |   data: {...}
            | }
            |
            | FORMAT 2
            |
            | {
            |   data: {
            |      success: true,
            |      message: "...",
            |      data: {...}
            |   }
            | }
            |
            | FORMAT 3
            |
            | {
            |   _id: "...",
            |   name: "FD",
            |   type: "FD",
            |   investedAmount: 2343
            | }
            |
            | YOUR CURRENT API IS RETURNING FORMAT 3.
            |
            */


            const isSuccess =

                response?.success === true ||

                response?.data?.success === true ||

                /*
                 * Created investment object
                 */
                Boolean(
                    response?._id &&
                    response?.name &&
                    response?.type
                );


            /*
            |--------------------------------------------------------------------------
            | SUCCESS
            |--------------------------------------------------------------------------
            */

            if (isSuccess) {

                const message =

                    response?.message ||

                    response?.data?.message ||

                    "Investment created successfully.";


                console.log(
                    "Investment Created Successfully:",
                    response
                );


                alert(message);


                /*
                |--------------------------------------------------------------------------
                | GO BACK TO LIST
                |--------------------------------------------------------------------------
                */

                navigate(
                    "/investments",
                    {
                        replace: true
                    }
                );


                return;
            }


            /*
            |--------------------------------------------------------------------------
            | ERROR
            |--------------------------------------------------------------------------
            */

            const errorMessage =

                response?.message ||

                response?.data?.message ||

                "Unable to create investment.";


            console.error(
                "Create Investment Failed:",
                response
            );


            alert(errorMessage);


        } catch (error) {

            console.error(
                "Create Investment Error:",
                error
            );


            /*
            |--------------------------------------------------------------------------
            | AXIOS ERROR
            |--------------------------------------------------------------------------
            */

            const errorResponse =
                error?.response?.data;


            const errorMessage =

                errorResponse?.message ||

                errorResponse?.error ||

                error?.message ||

                "Unable to create investment.";


            alert(errorMessage);


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

                        Add Investment

                    </h3>


                    <small className="text-muted">

                        Add FD, RD, SIP, Stock,
                        Mutual Fund, Gold or Other

                    </small>

                </div>


                <Link
                    to="/investments"
                    className="btn btn-outline-secondary"
                >

                    Back

                </Link>

            </div>


            {/* ================================================================
                ERROR
            ================================================================= */}

            {error && (

                <div className="alert alert-danger">

                    {error}

                </div>

            )}


            {/* ================================================================
                FORM
            ================================================================= */}

            <div className="row justify-content-center">

                <div className="col-xl-8 col-lg-10">

                    <div className="card shadow-sm">


                        {/* HEADER */}

                        <div className="card-header bg-white">

                            <h5 className="mb-0">

                                Investment Details

                            </h5>

                        </div>


                        {/* BODY */}

                        <div className="card-body">

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >


                                <div className="row">


                                    {/* =================================================
                                        NAME
                                    ================================================== */}

                                    <div className="
                                        col-md-6
                                        mb-3
                                    ">

                                        <label className="form-label">

                                            Investment Name

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>


                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="e.g. ICICI SIP"
                                            value={
                                                form.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>


                                    {/* =================================================
                                        TYPE
                                    ================================================== */}

                                    <div className="
                                        col-md-6
                                        mb-3
                                    ">

                                        <label className="form-label">

                                            Investment Type

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>


                                        <select
                                            className="form-select"
                                            name="type"
                                            value={
                                                form.type
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        >

                                            {
                                                investmentTypes.map(
                                                    item => (

                                                        <option
                                                            key={
                                                                item
                                                            }
                                                            value={
                                                                item
                                                            }
                                                        >

                                                            {
                                                                getTypeLabel(
                                                                    item
                                                                )
                                                            }

                                                        </option>

                                                    )
                                                )
                                            }

                                        </select>

                                    </div>


                                    {/* =================================================
                                        ACCOUNT
                                    ================================================== */}

                                    <div className="
                                        col-md-6
                                        mb-3
                                    ">

                                        <label className="form-label">

                                            Account

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>


                                        <select
                                            className="form-select"
                                            name="account"
                                            value={
                                                form.account
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

                                                {
                                                    loadingAccounts
                                                        ? "Loading accounts..."
                                                        : "Select account"
                                                }

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


                                    {/* =================================================
                                        DATE
                                    ================================================== */}

                                    <div className="
                                        col-md-6
                                        mb-3
                                    ">

                                        <label className="form-label">

                                            Investment Date

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

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


                                    {/* =================================================
                                        INVESTED
                                    ================================================== */}

                                    <div className="
                                        col-md-6
                                        mb-3
                                    ">

                                        <label className="form-label">

                                            Invested Amount

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
                                                name="investedAmount"
                                                min="0.01"
                                                step="0.01"
                                                placeholder="Enter amount"
                                                value={
                                                    form.investedAmount
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    saving
                                                }
                                            />

                                        </div>

                                    </div>


                                    {/* =================================================
                                        CURRENT VALUE
                                    ================================================== */}

                                    <div className="
                                        col-md-6
                                        mb-3
                                    ">

                                        <label className="form-label">

                                            Current Value

                                        </label>


                                        <div className="input-group">

                                            <span className="input-group-text">

                                                ₹

                                            </span>


                                            <input
                                                type="number"
                                                className="form-control"
                                                name="currentValue"
                                                min="0"
                                                step="0.01"
                                                placeholder="Current value"
                                                value={
                                                    form.currentValue
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    saving
                                                }
                                            />

                                        </div>

                                    </div>


                                    {/* =================================================
                                        MATURITY
                                    ================================================== */}

                                    <div className="
                                        col-md-6
                                        mb-3
                                    ">

                                        <label className="form-label">

                                            Maturity Date

                                            {requiresMaturityDate && (

                                                <span className="text-danger">
                                                    {" "}*
                                                </span>

                                            )}

                                        </label>


                                        <input
                                            type="date"
                                            className="form-control"
                                            name="maturityDate"
                                            value={
                                                form.maturityDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving ||
                                                !requiresMaturityDate
                                            }
                                            min={
                                                form.date || undefined
                                            }
                                        />


                                        <small className="text-muted">

                                            {
                                                requiresMaturityDate

                                                    ? "Required for FD/RD."

                                                    : "Not required for this investment type."
                                            }

                                        </small>

                                    </div>


                                    {/* =================================================
                                        STATUS
                                    ================================================== */}

                                    <div className="
                                        col-md-6
                                        mb-3
                                    ">

                                        <label className="form-label">

                                            Status

                                        </label>


                                        <select
                                            className="form-select"
                                            name="status"
                                            value={
                                                String(
                                                    form.status
                                                )
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        >

                                            <option value="true">

                                                Active

                                            </option>


                                            <option value="false">

                                                Inactive

                                            </option>

                                        </select>

                                    </div>


                                    {/* =================================================
                                        NOTE
                                    ================================================== */}

                                    <div className="
                                        col-12
                                        mb-3
                                    ">

                                        <label className="form-label">

                                            Note

                                        </label>


                                        <textarea
                                            className="form-control"
                                            name="note"
                                            rows="3"
                                            maxLength="1000"
                                            placeholder="Optional note"
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


                                    {/* =================================================
                                        PREVIEW
                                    ================================================== */}

                                    {
                                        invested > 0 && (

                                            <div className="
                                                col-12
                                                mb-4
                                            ">

                                                <div className="
                                                    card
                                                    border
                                                    bg-light
                                                ">

                                                    <div className="card-body">

                                                        <h6 className="mb-3">

                                                            Investment Preview

                                                        </h6>


                                                        <div className="row g-3">


                                                            {/* INVESTED */}

                                                            <div className="col-md-3">

                                                                <small className="
                                                                    text-muted
                                                                    d-block
                                                                ">

                                                                    Invested

                                                                </small>


                                                                <strong className="fs-5">

                                                                    {
                                                                        formatAmount(
                                                                            invested
                                                                        )
                                                                    }

                                                                </strong>

                                                            </div>


                                                            {/* CURRENT */}

                                                            <div className="col-md-3">

                                                                <small className="
                                                                    text-muted
                                                                    d-block
                                                                ">

                                                                    Current Value

                                                                </small>


                                                                <strong className="
                                                                    fs-5
                                                                    text-primary
                                                                ">

                                                                    {
                                                                        formatAmount(
                                                                            currentValue
                                                                        )
                                                                    }

                                                                </strong>

                                                            </div>


                                                            {/* PROFIT */}

                                                            <div className="col-md-3">

                                                                <small className="
                                                                    text-muted
                                                                    d-block
                                                                ">

                                                                    Profit / Loss

                                                                </small>


                                                                <strong
                                                                    className={
                                                                        profitLoss >= 0
                                                                            ? "fs-5 text-success"
                                                                            : "fs-5 text-danger"
                                                                    }
                                                                >

                                                                    {
                                                                        profitLoss >= 0
                                                                            ? "+"
                                                                            : ""
                                                                    }


                                                                    {
                                                                        formatAmount(
                                                                            profitLoss
                                                                        )
                                                                    }

                                                                </strong>

                                                            </div>


                                                            {/* RETURN */}

                                                            <div className="col-md-3">

                                                                <small className="
                                                                    text-muted
                                                                    d-block
                                                                ">

                                                                    Return

                                                                </small>


                                                                <strong
                                                                    className={
                                                                        profitLoss >= 0
                                                                            ? "fs-5 text-success"
                                                                            : "fs-5 text-danger"
                                                                    }
                                                                >

                                                                    {
                                                                        returnPercentage >= 0
                                                                            ? "+"
                                                                            : ""
                                                                    }


                                                                    {
                                                                        returnPercentage.toFixed(
                                                                            2
                                                                        )
                                                                    }%

                                                                </strong>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    }

                                </div>


                                {/* =================================================
                                    BUTTONS
                                ================================================== */}

                                <div className="
                                    d-flex
                                    gap-2
                                ">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={
                                            saving ||
                                            loadingAccounts
                                        }
                                    >

                                        {
                                            saving

                                                ? (

                                                    <>

                                                        <span className="
                                                            spinner-border
                                                            spinner-border-sm
                                                            me-2
                                                        " />

                                                        Saving...

                                                    </>

                                                )

                                                : "Save Investment"
                                        }

                                    </button>


                                    <Link
                                        to="/investments"
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


export default AddInvestment;