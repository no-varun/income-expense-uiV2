import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    createTransfer,
    getAccountBalance
} from "../../api/transferApi";

import {
    getActiveAccounts
} from "../../api/accountApi";

const AddTransfer = () => {

    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);

    const [loadingAccounts, setLoadingAccounts] =
        useState(true);

    const [loadingBalance, setLoadingBalance] =
        useState(false);

    const [saving, setSaving] = useState(false);

    const [balance, setBalance] = useState(null);

    const [form, setForm] = useState({

        fromAccount: "",

        toAccount: "",

        amount: "",

        date: new Date()
            .toISOString()
            .split("T")[0],

        purpose: "",

        note: ""

    });


    /**
     * Load Active Accounts
     */
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
                "Load Accounts Error:",
                error
            );

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


    /**
     * Load Source Account Balance
     */
    const loadBalance = async (accountId) => {

        if (!accountId) {

            setBalance(null);

            return;

        }

        try {

            setLoadingBalance(true);

            const response =
                await getAccountBalance(
                    accountId
                );

            if (response.success) {

                setBalance(
                    response.data
                );

            } else {

                setBalance(null);

                alert(
                    response.message ||
                    "Unable to get account balance."
                );

            }

        } catch (error) {

            console.error(
                "Get Account Balance Error:",
                error
            );

            setBalance(null);

            alert(
                error.response?.data?.message ||
                "Unable to get account balance."
            );

        } finally {

            setLoadingBalance(false);

        }

    };


    /**
     * Handle Input
     */
    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm({

            ...form,

            [name]: value

        });


        if (name === "fromAccount") {

            loadBalance(value);

            /*
             * If destination is same as
             * newly selected source,
             * clear destination.
             */
            if (
                value === form.toAccount
            ) {

                setForm(prev => ({

                    ...prev,

                    fromAccount: value,

                    toAccount: ""

                }));

            }

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
     * Selected Source Account
     */
    const selectedFromAccount =
        accounts.find(
            account =>
                account._id ===
                form.fromAccount
        );


    /**
     * Selected Destination Account
     */
    const selectedToAccount =
        accounts.find(
            account =>
                account._id ===
                form.toAccount
        );


    /**
     * Calculate Maximum Transfer
     */
    const maximumTransfer = balance
        ? Math.max(
            0,
            Number(balance.balance || 0) -
            Number(
                selectedFromAccount?.minimumBalance || 0
            )
        )
        : 0;


    /**
     * Submit
     */
    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!form.fromAccount) {

            alert(
                "Please select the source account."
            );

            return;

        }


        if (!form.toAccount) {

            alert(
                "Please select the destination account."
            );

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


        const amount =
            Number(form.amount);


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


        if (
            amount >
            Number(balance.balance || 0)
        ) {

            alert(
                `Insufficient balance. Available balance is ${formatAmount(
                    balance.balance
                )}.`
            );

            return;

        }


        if (
            amount >
            maximumTransfer
        ) {

            alert(
                `You must maintain a minimum balance of ${formatAmount(
                    selectedFromAccount?.minimumBalance
                )}. Maximum transferable amount is ${formatAmount(
                    maximumTransfer
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

                amount,

                date:
                    form.date,

                purpose:
                    form.purpose.trim(),

                note:
                    form.note.trim()

            };


            const response =
                await createTransfer(
                    payload
                );


            if (response.success) {

                alert(
                    "Transfer created successfully."
                );

                navigate(
                    "/transfers"
                );

            } else {

                alert(
                    response.message ||
                    "Unable to create transfer."
                );

            }

        } catch (error) {

            console.error(
                "Create Transfer Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to create transfer."
            );

        } finally {

            setSaving(false);

        }

    };


    return (

        <div className="container-fluid">

            {/* Header */}

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">

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


                                    {/* From Account */}

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


                                    {/* To Account */}

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

                                                accounts.map(
                                                    account => (

                                                        account._id !==
                                                        form.fromAccount &&

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


                                    {/* Available Balance */}

                                    <div className="col-12 mb-3">

                                        {

                                            loadingBalance

                                                ?

                                                (

                                                    <div className="alert alert-info">

                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                        />

                                                        Checking account balance...

                                                    </div>

                                                )

                                                :

                                                balance &&

                                                (

                                                    <div className="alert alert-light border">

                                                        <div className="row g-3">

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


                                                            <div className="col-md-4">

                                                                <small className="text-muted d-block">

                                                                    Minimum Balance

                                                                </small>

                                                                <strong className="fs-5">

                                                                    {
                                                                        formatAmount(
                                                                            selectedFromAccount?.minimumBalance
                                                                        )
                                                                    }

                                                                </strong>

                                                            </div>


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


                                    {/* Amount */}

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
                                                step="0.01"
                                                placeholder="Enter amount"
                                                value={
                                                    form.amount
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    saving
                                                }
                                            />

                                        </div>

                                        {

                                            maximumTransfer > 0 &&

                                            (

                                                <small className="text-muted">

                                                    Maximum transferable:

                                                    {" "}

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


                                    {/* Date */}

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


                                    {/* Purpose */}

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


                                    {/* Note */}

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


                                    {/* Transfer Preview */}

                                    {

                                        selectedFromAccount &&
                                        selectedToAccount &&
                                        form.amount &&

                                        (

                                            <div className="col-12 mb-4">

                                                <div className="alert alert-primary">

                                                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">

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


                                {/* Buttons */}

                                <div className="d-flex flex-wrap gap-2">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={
                                            saving ||
                                            loadingAccounts ||
                                            loadingBalance ||
                                            !form.fromAccount ||
                                            !form.toAccount
                                        }
                                    >

                                        {

                                            saving

                                                ?

                                                (

                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                        />

                                                        Transferring...

                                                    </>

                                                )

                                                :

                                                "Transfer Money"

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