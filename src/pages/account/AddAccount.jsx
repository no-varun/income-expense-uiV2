import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createAccount
} from "../../api/accountApi";


const AddAccount = () => {

    const navigate = useNavigate();


    /*
    |--------------------------------------------------------------------------
    | FORM
    |--------------------------------------------------------------------------
    */

    const [form, setForm] = useState({

        name: "",

        bank: "Rbl",

        accountType: "Savings",

        openingBalance: "",

        minimumBalance: "",

        purpose: "",

        status: true

    });


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | HANDLE CHANGE
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        setForm(
            previous => ({

                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value

            })
        );

    };


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.name.trim()) {

            alert("Account name is required.");

            return;

        }

        if (!form.bank) {

            alert("Bank is required.");

            return;

        }

        if (
            form.openingBalance === "" ||
            Number(form.openingBalance) < 0
        ) {

            alert(
                "Please enter a valid opening balance."
            );

            return;

        }

        if (
            form.minimumBalance === "" ||
            Number(form.minimumBalance) < 0
        ) {

            alert(
                "Please enter a valid minimum balance."
            );

            return;

        }


        try {

            setLoading(true);


            const payload = {

                name:
                    form.name.trim(),

                bank:
                    form.bank,

                accountType:
                    form.accountType,

                openingBalance:
                    Number(
                        form.openingBalance || 0
                    ),

                minimumBalance:
                    Number(
                        form.minimumBalance || 0
                    ),

                purpose:
                    form.purpose.trim(),

                status:
                    Boolean(
                        form.status
                    )

            };


            console.log(
                "================================="
            );

            console.log(
                "CREATE ACCOUNT PAYLOAD:",
                payload
            );


            const response =
                await createAccount(
                    payload
                );


            console.log(
                "CREATE ACCOUNT FINAL RESPONSE:",
                response
            );


            console.log(
                "SUCCESS VALUE:",
                response?.success
            );


            console.log(
                "MESSAGE VALUE:",
                response?.message
            );


            console.log(
                "DATA VALUE:",
                response?.data
            );


            /*
            |--------------------------------------------------------------------------
            | SUCCESS
            |--------------------------------------------------------------------------
            */

            if (
                response &&
                response.success === true
            ) {

                alert(
                    response.message ||
                    "Account created successfully."
                );


                /*
                | Redirect only after confirmed success
                */

                navigate(
                    "/accounts"
                );


                return;

            }


            /*
            |--------------------------------------------------------------------------
            | BACKEND RETURNED FAILURE
            |--------------------------------------------------------------------------
            */

            alert(

                response?.message ||

                "Unable to create account."

            );


        } catch (error) {

            console.error(
                "================================="
            );

            console.error(
                "CREATE ACCOUNT ERROR:",
                error
            );


            console.error(
                "ERROR RESPONSE:",
                error?.response
            );


            console.error(
                "ERROR RESPONSE DATA:",
                error?.response?.data
            );


            const message =

                error?.response?.data?.message ||

                error?.response?.data?.error ||

                error?.message ||

                "Unable to create account.";


            alert(
                message
            );


        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="container-fluid px-4 py-4">

            {/* ================================================================
                HEADER
            ================================================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        Add Account
                    </h2>

                    <div className="text-muted">
                        Create a new bank or cash account
                    </div>

                </div>


                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate("/accounts")
                    }
                    disabled={loading}
                >
                    Back
                </button>

            </div>


            {/* ================================================================
                FORM CARD
            ================================================================= */}

            <div className="card shadow-sm">

                <div className="card-header bg-white">

                    <h4 className="mb-0">
                        Account Information
                    </h4>

                </div>


                <div className="card-body">

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div className="row g-4">

                            {/* ==================================================
                                ACCOUNT NAME
                            =================================================== */}

                            <div className="col-md-6">

                                <label className="form-label">

                                    Account Name

                                    <span className="text-danger">
                                        {" "}*
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="e.g. RBL Salary Account"
                                    value={
                                        form.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loading
                                    }
                                />


                                <small className="text-muted">

                                    Give your account a meaningful name.

                                </small>

                            </div>


                            {/* ==================================================
                                BANK
                            =================================================== */}

                            <div className="col-md-6">

                                <label className="form-label">

                                    Bank

                                    <span className="text-danger">
                                        {" "}*
                                    </span>

                                </label>


                                <select
                                    name="bank"
                                    className="form-select"
                                    value={
                                        form.bank
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loading
                                    }
                                >

                                    <option value="Pnb">
                                        PNB
                                    </option>

                                    <option value="Rbl">
                                        RBL
                                    </option>

                                    <option value="icici">
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


                            {/* ==================================================
                                ACCOUNT TYPE
                            =================================================== */}

                            <div className="col-md-6">

                                <label className="form-label">

                                    Account Type

                                </label>


                                <select
                                    name="accountType"
                                    className="form-select"
                                    value={
                                        form.accountType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loading
                                    }
                                >

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


                            {/* ==================================================
                                OPENING BALANCE
                            =================================================== */}

                            <div className="col-md-6">

                                <label className="form-label">

                                    Opening Balance

                                </label>


                                <div className="input-group">

                                    <span className="input-group-text">
                                        ₹
                                    </span>


                                    <input
                                        type="number"
                                        name="openingBalance"
                                        className="form-control"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        value={
                                            form.openingBalance
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                    />

                                </div>

                            </div>


                            {/* ==================================================
                                MINIMUM BALANCE
                            =================================================== */}

                            <div className="col-md-6">

                                <label className="form-label">

                                    Minimum Balance

                                </label>


                                <div className="input-group">

                                    <span className="input-group-text">
                                        ₹
                                    </span>


                                    <input
                                        type="number"
                                        name="minimumBalance"
                                        className="form-control"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        value={
                                            form.minimumBalance
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                    />

                                </div>


                                <small className="text-muted">

                                    Minimum amount you want to maintain.

                                </small>

                            </div>


                            {/* ==================================================
                                PURPOSE
                            =================================================== */}

                            <div className="col-md-6">

                                <label className="form-label">

                                    Purpose

                                </label>


                                <input
                                    type="text"
                                    name="purpose"
                                    className="form-control"
                                    placeholder="e.g. Salary, Daily Expenses"
                                    value={
                                        form.purpose
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loading
                                    }
                                />

                            </div>


                            {/* ==================================================
                                STATUS
                            =================================================== */}

                            <div className="col-12">

                                <div className="form-check form-switch">

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="status"
                                        name="status"
                                        checked={
                                            form.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loading
                                        }
                                    />


                                    <label
                                        className="form-check-label"
                                        htmlFor="status"
                                    >

                                        Active Account

                                    </label>

                                </div>

                            </div>

                        </div>


                        {/* ======================================================
                            BUTTONS
                        ======================================================= */}

                        <div className="d-flex gap-2 mt-4">

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    loading
                                }
                            >

                                {

                                    loading

                                        ?

                                        <>

                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            />

                                            Saving...

                                        </>

                                        :

                                        "Save Account"

                                }

                            </button>


                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate("/accounts")
                                }
                                disabled={
                                    loading
                                }
                            >

                                Cancel

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

};


export default AddAccount;