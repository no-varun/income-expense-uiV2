import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    createAccount
} from "../../api/accountApi";

const AddAccount = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        name: "",

        bank: "Rbl",

        accountType: "Savings",

        openingBalance: "",

        minimumBalance: "",

        purpose: "",

        status: true

    });

    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        setForm({

            ...form,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!form.name.trim()) {

            alert(
                "Account name is required."
            );

            return;

        }


        if (!form.bank) {

            alert(
                "Please select a bank."
            );

            return;

        }


        try {

            setLoading(true);


            const payload = {

                name: form.name.trim(),

                bank: form.bank,

                accountType: form.accountType,

                openingBalance:
                    form.openingBalance === ""
                        ? 0
                        : Number(
                            form.openingBalance
                        ),

                minimumBalance:
                    form.minimumBalance === ""
                        ? 0
                        : Number(
                            form.minimumBalance
                        ),

                purpose: form.purpose.trim(),

                status: form.status

            };


            const response =
                await createAccount(payload);


            if (response.success) {

                alert(
                    "Account created successfully."
                );

                navigate(
                    "/accounts"
                );

            } else {

                alert(
                    response.message ||
                    "Unable to create account."
                );

            }

        } catch (error) {

            console.error(
                "Create Account Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to create account."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="container-fluid">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h3 className="mb-1">

                        Add Account

                    </h3>

                    <small className="text-muted">

                        Create a new bank or cash account

                    </small>

                </div>


                <Link
                    to="/accounts"
                    className="btn btn-outline-secondary"
                >

                    Back

                </Link>

            </div>


            {/* Form */}

            <div className="row justify-content-center">

                <div className="col-xl-8 col-lg-10">

                    <div className="card shadow-sm">

                        <div className="card-header bg-white">

                            <h5 className="mb-0">

                                Account Information

                            </h5>

                        </div>


                        <div className="card-body">

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <div className="row">


                                    {/* Account Name */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Account Name

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
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

                                            Give your account a
                                            meaningful name.

                                        </small>

                                    </div>


                                    {/* Bank */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Bank

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>

                                        <select
                                            className="form-select"
                                            name="bank"
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

                                            <option value="Rbl">

                                                RBL

                                            </option>

                                            <option value="Pnb">

                                                PNB

                                            </option>

                                            <option value="Icici">

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


                                    {/* Account Type */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Account Type

                                        </label>

                                        <select
                                            className="form-select"
                                            name="accountType"
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


                                    {/* Opening Balance */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Opening Balance

                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text">

                                                ₹

                                            </span>

                                            <input
                                                type="number"
                                                className="form-control"
                                                name="openingBalance"
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


                                    {/* Minimum Balance */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Minimum Balance

                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text">

                                                ₹

                                            </span>

                                            <input
                                                type="number"
                                                className="form-control"
                                                name="minimumBalance"
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

                                            Minimum amount you
                                            want to maintain.

                                        </small>

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


                                    {/* Status */}

                                    <div className="col-12 mb-4">

                                        <div className="form-check form-switch">

                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                id="accountStatus"
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
                                                htmlFor="accountStatus"
                                            >

                                                Active Account

                                            </label>

                                        </div>

                                    </div>


                                </div>


                                {/* Buttons */}

                                <div className="d-flex gap-2">

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

                                                (

                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                        />

                                                        Saving...

                                                    </>

                                                )

                                                :

                                                "Save Account"

                                        }

                                    </button>


                                    <Link
                                        to="/accounts"
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

export default AddAccount;