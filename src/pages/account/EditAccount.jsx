import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    getAccountById,
    updateAccount
} from "../../api/accountApi";

const EditAccount = () => {

    const { id } = useParams();

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

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);


    const loadAccount = async () => {

        try {

            setLoading(true);

            const response =
                await getAccountById(id);

            if (!response.success) {

                alert(
                    response.message ||
                    "Account not found."
                );

                navigate("/accounts");

                return;

            }

            const account = response.data;

            setForm({

                name: account.name || "",

                bank: account.bank || "Rbl",

                accountType:
                    account.accountType ||
                    "Savings",

                openingBalance:
                    account.openingBalance ?? "",

                minimumBalance:
                    account.minimumBalance ?? "",

                purpose:
                    account.purpose || "",

                status:
                    account.status !== undefined
                        ? account.status
                        : true

            });

        } catch (error) {

            console.error(
                "Get Account Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to load account."
            );

            navigate("/accounts");

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        if (id) {

            loadAccount();

        }

    }, [id]);


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

            setSaving(true);


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

                purpose:
                    form.purpose.trim(),

                status: form.status

            };


            const response =
                await updateAccount(
                    id,
                    payload
                );


            if (response.success) {

                alert(
                    "Account updated successfully."
                );

                navigate("/accounts");

            } else {

                alert(
                    response.message ||
                    "Unable to update account."
                );

            }

        } catch (error) {

            console.error(
                "Update Account Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update account."
            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (

            <div className="container-fluid">

                <div className="d-flex justify-content-center align-items-center py-5">

                    <div className="text-center">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <div className="text-muted mt-2">

                            Loading account...

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="container-fluid">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h3 className="mb-1">

                        Edit Account

                    </h3>

                    <small className="text-muted">

                        Update account information

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
                                                saving
                                            }
                                        />

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
                                                saving
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
                                                saving
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
                                                min="0"
                                                step="0.01"
                                                value={
                                                    form.openingBalance
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
                                                min="0"
                                                step="0.01"
                                                value={
                                                    form.minimumBalance
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
                                                saving
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
                                                    saving
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
                                        className="btn btn-success"
                                        disabled={
                                            saving
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

                                                        Updating...

                                                    </>
                                                )

                                                :

                                                "Update Account"

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

export default EditAccount;