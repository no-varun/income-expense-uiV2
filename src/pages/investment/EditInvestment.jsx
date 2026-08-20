import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getInvestmentById,
    updateInvestment
} from "../../api/investmentApi";

import {
    getAccounts
} from "../../api/accountApi";


const EditInvestment = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [accounts, setAccounts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [loadingAccounts, setLoadingAccounts] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [form, setForm] = useState({

        name: "",

        type: "SIP",

        account: "",

        investedAmount: "",

        currentValue: "",

        date: "",

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
    | FORMAT DATE FOR INPUT
    |--------------------------------------------------------------------------
    */

    const formatDateForInput = (date) => {

        if (!date) {

            return "";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "";

        }


        return parsedDate
            .toISOString()
            .split("T")[0];

    };


    /*
    |--------------------------------------------------------------------------
    | NORMALIZE API RESPONSE
    |--------------------------------------------------------------------------
    |
    | Handles both:
    |
    | response = {
    |     success: true,
    |     data: {...}
    | }
    |
    | and:
    |
    | response = {
    |     data: {
    |         success: true,
    |         data: {...}
    |     }
    | }
    |
    |--------------------------------------------------------------------------
    */

    const normalizeResponse = (response) => {

        if (
            response &&
            typeof response === "object" &&
            typeof response.success === "boolean"
        ) {

            return response;

        }


        if (
            response?.data &&
            typeof response.data === "object" &&
            typeof response.data.success === "boolean"
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
                "Get Accounts Response:",
                rawResponse
            );


            const response =
                normalizeResponse(
                    rawResponse
                );


            console.log(
                "Normalized Accounts Response:",
                response
            );


            if (
                response?.success === true
            ) {

                const rows =
                    Array.isArray(
                        response.data
                    )

                        ? response.data

                        : Array.isArray(
                            response.data?.rows
                        )

                            ? response.data.rows

                            : [];


                /*
                |--------------------------------------------------------------------------
                | Only active accounts
                |--------------------------------------------------------------------------
                */

                const activeAccounts =
                    rows.filter(
                        account =>
                            account.status !== false
                    );


                setAccounts(
                    activeAccounts
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
                "Get Accounts Error:",
                error
            );


            console.error(
                "Accounts Error Response:",
                error?.response
            );


            console.error(
                "Accounts Error Data:",
                error?.response?.data
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
    | LOAD INVESTMENT
    |--------------------------------------------------------------------------
    */

    const loadInvestment = async () => {

        try {

            setLoading(true);


            const rawResponse =
                await getInvestmentById(
                    id
                );


            console.log(
                "Get Investment Response:",
                rawResponse
            );


            const response =
                normalizeResponse(
                    rawResponse
                );


            console.log(
                "Normalized Investment Response:",
                response
            );


            if (
                response?.success !== true
            ) {

                alert(
                    response?.message ||
                    "Investment not found."
                );


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
            | GET DATA
            |--------------------------------------------------------------------------
            */

            const investment =
                response.data;


            if (
                !investment
            ) {

                alert(
                    "Investment data not found."
                );


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
            | ACCOUNT ID
            |--------------------------------------------------------------------------
            |
            | Supports:
            |
            | account: {
            |     _id: "..."
            | }
            |
            | OR
            |
            | account: "..."
            |
            |--------------------------------------------------------------------------
            */

            const accountId =

                typeof investment.account ===
                "object" &&

                investment.account !== null

                    ? investment.account._id

                    : investment.account;


            console.log(
                "Investment Account:",
                investment.account
            );


            console.log(
                "Investment Account ID:",
                accountId
            );


            /*
            |--------------------------------------------------------------------------
            | SET FORM
            |--------------------------------------------------------------------------
            */

            setForm({

                name:
                    investment.name ||
                    "",

                type:
                    investment.type ||
                    "SIP",

                account:
                    accountId ||
                    "",

                investedAmount:
                    investment.investedAmount ??
                    "",

                currentValue:
                    investment.currentValue ??
                    "",

                date:
                    formatDateForInput(
                        investment.date
                    ),

                maturityDate:
                    formatDateForInput(
                        investment.maturityDate
                    ),

                status:
                    investment.status !== false,

                note:
                    investment.note ||
                    ""

            });

        } catch (error) {

            console.error(
                "Get Investment Error:",
                error
            );


            console.error(
                "Investment Error Response:",
                error?.response
            );


            console.error(
                "Investment Error Data:",
                error?.response?.data
            );


            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load investment."
            );


            navigate(
                "/investments",
                {
                    replace: true
                }
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!id) {

            navigate(
                "/investments",
                {
                    replace: true
                }
            );

            return;

        }


        loadAccounts();

        loadInvestment();

    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | HANDLE INPUT
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(
            previous => ({

                ...previous,

                [name]:
                    name === "status"

                        ? value === "true"

                        : value

            })
        );

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
    | INVESTED AMOUNT
    |--------------------------------------------------------------------------
    */

    const invested =
        Number(
            form.investedAmount || 0
        );


    /*
    |--------------------------------------------------------------------------
    | CURRENT VALUE
    |--------------------------------------------------------------------------
    */

    const currentValue =

        form.currentValue === ""

            ? invested

            : Number(
                form.currentValue || 0
            );


    /*
    |--------------------------------------------------------------------------
    | PROFIT / LOSS
    |--------------------------------------------------------------------------
    */

    const profitLoss =
        currentValue -
        invested;


    /*
    |--------------------------------------------------------------------------
    | RETURN %
    |--------------------------------------------------------------------------
    */

    const returnPercentage =

        invested > 0

            ? (
                profitLoss /
                invested
            ) * 100

            : 0;


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();


        /*
        |--------------------------------------------------------------------------
        | NAME
        |--------------------------------------------------------------------------
        */

        if (
            !form.name.trim()
        ) {

            alert(
                "Please enter investment name."
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | TYPE
        |--------------------------------------------------------------------------
        */

        if (
            !form.type
        ) {

            alert(
                "Please select investment type."
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | ACCOUNT
        |--------------------------------------------------------------------------
        */

        if (
            !form.account
        ) {

            alert(
                "Please select account."
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | DATE
        |--------------------------------------------------------------------------
        */

        if (
            !form.date
        ) {

            alert(
                "Please select investment date."
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | INVESTED AMOUNT
        |--------------------------------------------------------------------------
        */

        const investedAmount =
            Number(
                form.investedAmount
            );


        if (
            !Number.isFinite(
                investedAmount
            ) ||
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

        const current =

            form.currentValue === ""

                ? investedAmount

                : Number(
                    form.currentValue
                );


        if (
            !Number.isFinite(
                current
            ) ||
            current < 0
        ) {

            alert(
                "Please enter a valid current value."
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | FD / RD MATURITY
        |--------------------------------------------------------------------------
        */

        if (

            (
                form.type === "FD" ||
                form.type === "RD"
            )

            &&

            !form.maturityDate

        ) {

            alert(
                "Please select maturity date for FD/RD."
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | MATURITY DATE VALIDATION
        |--------------------------------------------------------------------------
        */

        if (

            form.maturityDate &&

            form.date &&

            new Date(
                form.maturityDate
            ) < new Date(
                form.date
            )

        ) {

            alert(
                "Maturity date cannot be before investment date."
            );

            return;

        }


        try {

            setSaving(true);


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
                    current,

                date:
                    form.date,

                maturityDate:
                    form.maturityDate
                        ? form.maturityDate
                        : undefined,

                status:
                    form.status,

                note:
                    form.note.trim()

            };


            console.log(
                "Update Investment Payload:",
                payload
            );


            /*
            |--------------------------------------------------------------------------
            | API
            |--------------------------------------------------------------------------
            */

            const rawResponse =
                await updateInvestment(
                    id,
                    payload
                );


            console.log(
                "Update Investment Raw Response:",
                rawResponse
            );


            const response =
                normalizeResponse(
                    rawResponse
                );


            console.log(
                "Update Investment Response:",
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
                    "Investment updated successfully."
                );


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
            | API FAILURE
            |--------------------------------------------------------------------------
            */

            alert(
                response?.message ||
                "Unable to update investment."
            );


        } catch (error) {

            console.error(
                "Update Investment Error:",
                error
            );


            console.error(
                "Update Investment Error Response:",
                error?.response
            );


            console.error(
                "Update Investment Error Data:",
                error?.response?.data
            );


            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to update investment."
            );

        } finally {

            setSaving(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="container-fluid">

                <div className="
                    d-flex
                    justify-content-center
                    align-items-center
                    py-5
                ">

                    <div className="text-center">

                        <div
                            className="
                                spinner-border
                                text-primary
                            "
                            role="status"
                        />

                        <div className="
                            text-muted
                            mt-3
                        ">

                            Loading investment...

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | PAGE
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

                        Edit Investment

                    </h3>

                    <small className="text-muted">

                        Update FD, RD, SIP, Stock, Mutual Fund or Gold

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
                FORM
            ================================================================= */}

            <div className="row justify-content-center">

                <div className="col-xl-8 col-lg-10">

                    <div className="card shadow-sm">


                        {/* ====================================================
                            HEADER
                        ===================================================== */}

                        <div className="card-header bg-white">

                            <h5 className="mb-0">

                                Investment Details

                            </h5>

                        </div>


                        {/* ====================================================
                            BODY
                        ===================================================== */}

                        <div className="card-body">

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <div className="row">


                                    {/* ==================================================
                                        NAME
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

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
                                            maxLength="150"
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


                                    {/* ==================================================
                                        TYPE
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

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


                                    {/* ==================================================
                                        ACCOUNT
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

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


                                    {/* ==================================================
                                        INVESTMENT DATE
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

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


                                    {/* ==================================================
                                        INVESTED AMOUNT
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

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
                                                min="0"
                                                step="0.01"
                                                placeholder="Enter invested amount"
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


                                    {/* ==================================================
                                        CURRENT VALUE
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

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
                                                placeholder="Enter current value"
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


                                    {/* ==================================================
                                        MATURITY DATE
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Maturity Date

                                            {
                                                (
                                                    form.type === "FD" ||
                                                    form.type === "RD"
                                                ) && (

                                                    <span className="text-danger">
                                                        {" "}*
                                                    </span>

                                                )
                                            }

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
                                                saving
                                            }
                                        />


                                        <small className="text-muted">

                                            Required for FD and RD.

                                        </small>

                                    </div>


                                    {/* ==================================================
                                        STATUS
                                    =================================================== */}

                                    <div className="col-md-6 mb-3">

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


                                    {/* ==================================================
                                        NOTE
                                    =================================================== */}

                                    <div className="col-12 mb-3">

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


                                    {/* ==================================================
                                        PREVIEW
                                    =================================================== */}

                                    {
                                        invested > 0 && (

                                            <div className="col-12 mb-4">

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

                                                                <small className="text-muted d-block">

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

                                                                <small className="text-muted d-block">

                                                                    Current Value

                                                                </small>


                                                                <strong className="fs-5 text-primary">

                                                                    {
                                                                        formatAmount(
                                                                            currentValue
                                                                        )
                                                                    }

                                                                </strong>

                                                            </div>


                                                            {/* PROFIT LOSS */}

                                                            <div className="col-md-3">

                                                                <small className="text-muted d-block">

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

                                                                <small className="text-muted d-block">

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
                                        className="btn btn-success"
                                        disabled={
                                            saving ||
                                            loadingAccounts
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

                                                        Updating...
                                                    </>
                                                )

                                                : "Update Investment"
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
export default EditInvestment;