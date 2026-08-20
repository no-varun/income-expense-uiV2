import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    createInvestment
} from "../../api/investmentApi";

import {
    getActiveAccounts
} from "../../api/accountApi";


const AddInvestment = () => {

    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);

    const [loadingAccounts, setLoadingAccounts] =
        useState(true);

    const [saving, setSaving] = useState(false);

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


    const investmentTypes = [
        "FD",
        "RD",
        "SIP",
        "STOCK",
        "MUTUAL_FUND",
        "GOLD",
        "OTHER"
    ];


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


    const loadAccounts = async () => {

        try {

            setLoadingAccounts(true);

            const response =
                await getActiveAccounts();

            if (response.success) {

                const rows =
                    Array.isArray(response.data)
                        ? response.data
                        : response.data?.rows || [];

                setAccounts(rows);

            } else {

                setAccounts([]);

                alert(
                    response.message ||
                    "Unable to load accounts."
                );

            }

        } catch (error) {

            console.error(
                "Get Accounts Error:",
                error
            );

            setAccounts([]);

            alert(
                error.response?.data?.message ||
                "Unable to load accounts."
            );

        } finally {

            setLoadingAccounts(false);

        }

    };


    useEffect(() => {

        loadAccounts();

    }, []);


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(prev => ({

            ...prev,

            [name]:
                name === "status"
                    ? value === "true"
                    : value

        }));

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
        currentValue - invested;


    const returnPercentage =
        invested > 0
            ? (
                profitLoss /
                invested
            ) * 100
            : 0;


    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!form.name.trim()) {

            alert(
                "Please enter investment name."
            );

            return;

        }


        if (!form.account) {

            alert(
                "Please select account."
            );

            return;

        }


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


        const current =
            form.currentValue === ""
                ? investedAmount
                : Number(
                    form.currentValue
                );


        if (
            !Number.isFinite(current) ||
            current < 0
        ) {

            alert(
                "Please enter a valid current value."
            );

            return;

        }


        try {

            setSaving(true);


            const payload = {

                name:
                    form.name.trim(),

                type:
                    form.type,

                account:
                    form.account,

                investedAmount,

                currentValue:
                    current,

                date:
                    form.date,

                maturityDate:
                    form.maturityDate ||
                    undefined,

                status:
                    form.status,

                note:
                    form.note.trim()

            };


            const response =
                await createInvestment(
                    payload
                );


            if (response.success) {

                alert(
                    "Investment created successfully."
                );

                navigate(
                    "/investments"
                );

            } else {

                alert(
                    response.message ||
                    "Unable to create investment."
                );

            }

        } catch (error) {

            console.error(
                "Create Investment Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to create investment."
            );

        } finally {

            setSaving(false);

        }

    };


    return (

        <div className="container-fluid">

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">

                <div>

                    <h3 className="mb-1">
                        Add Investment
                    </h3>

                    <small className="text-muted">
                        Add FD, RD, SIP, Stock, Mutual Fund, Gold or Other
                    </small>

                </div>


                <Link
                    to="/investments"
                    className="btn btn-outline-secondary"
                >
                    Back
                </Link>

            </div>


            <div className="row justify-content-center">

                <div className="col-xl-8 col-lg-10">

                    <div className="card shadow-sm">

                        <div className="card-header bg-white">

                            <h5 className="mb-0">
                                Investment Details
                            </h5>

                        </div>


                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                <div className="row">


                                    {/* Name */}

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
                                            placeholder="e.g. ICICI SIP"
                                            value={form.name}
                                            onChange={handleChange}
                                            disabled={saving}
                                        />

                                    </div>


                                    {/* Type */}

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
                                            value={form.type}
                                            onChange={handleChange}
                                            disabled={saving}
                                        >

                                            {
                                                investmentTypes.map(
                                                    item => (

                                                        <option
                                                            key={item}
                                                            value={item}
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


                                    {/* Account */}

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
                                            value={form.account}
                                            onChange={handleChange}
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


                                    {/* Date */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Investment Date

                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={form.date}
                                            onChange={handleChange}
                                            disabled={saving}
                                        />

                                    </div>


                                    {/* Invested Amount */}

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
                                                min="0.01"
                                                step="0.01"
                                                placeholder="Enter amount"
                                                value={
                                                    form.investedAmount
                                                }
                                                onChange={handleChange}
                                                disabled={saving}
                                            />

                                        </div>

                                    </div>


                                    {/* Current Value */}

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
                                                placeholder="Current value"
                                                value={
                                                    form.currentValue
                                                }
                                                onChange={handleChange}
                                                disabled={saving}
                                            />

                                        </div>

                                    </div>


                                    {/* Maturity Date */}

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
                                            onChange={handleChange}
                                            disabled={saving}
                                        />

                                        <small className="text-muted">

                                            Mainly useful for FD/RD.

                                        </small>

                                    </div>


                                    {/* Status */}

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
                                            onChange={handleChange}
                                            disabled={saving}
                                        >

                                            <option value="true">
                                                Active
                                            </option>

                                            <option value="false">
                                                Inactive
                                            </option>

                                        </select>

                                    </div>


                                    {/* Note */}

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
                                            value={form.note}
                                            onChange={handleChange}
                                            disabled={saving}
                                        />

                                    </div>


                                    {/* Preview */}

                                    {
                                        invested > 0 && (

                                            <div className="col-12 mb-4">

                                                <div className="card border bg-light">

                                                    <div className="card-body">

                                                        <h6 className="mb-3">
                                                            Investment Preview
                                                        </h6>

                                                        <div className="row g-3">

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


                                <div className="d-flex gap-2">

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
                                                        <span className="spinner-border spinner-border-sm me-2" />
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