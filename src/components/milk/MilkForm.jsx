import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import MilkForm
    from "../../components/milk/MilkForm";


const MilkForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {

    const navigate =
        useNavigate();


    /*
    |--------------------------------------------------------------------------
    | FORM
    |--------------------------------------------------------------------------
    */

    const [form, setForm] =
        useState({

            title:
                "Milk",

            quantity:
                "",

            price:
                80,

            date:
                new Date()
                    .toISOString()
                    .split("T")[0],

            paid:
                false,

            onLeave:
                false

        });


    /*
    |--------------------------------------------------------------------------
    | EDIT DATA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            !initialValues ||
            Object.keys(
                initialValues
            ).length === 0
        ) {

            return;

        }


        setForm({

            title:
                initialValues.title ||
                "Milk",

            quantity:
                initialValues.quantity ??
                "",

            price:
                initialValues.price ??
                80,

            date:
                initialValues.date
                    ? String(
                        initialValues.date
                    ).substring(
                        0,
                        10
                    )
                    : new Date()
                        .toISOString()
                        .split("T")[0],

            paid:
                initialValues.paid === true,

            onLeave:
                initialValues.onLeave === true

        });

    }, [
        initialValues
    ]);


    /*
    |--------------------------------------------------------------------------
    | CHANGE
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        setForm(
            prev => ({

                ...prev,

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

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        const quantity =
            Number(
                form.quantity
            );


        const price =
            Number(
                form.price
            );


        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */

        if (
            !Number.isFinite(
                quantity
            ) ||
            quantity <= 0
        ) {

            alert(
                "Quantity must be greater than 0."
            );

            return;

        }


        if (
            !Number.isFinite(
                price
            ) ||
            price < 0
        ) {

            alert(
                "Price must be a valid number."
            );

            return;

        }


        if (
            !form.date
        ) {

            alert(
                "Please select date."
            );

            return;

        }


        if (
            typeof onSubmit !==
            "function"
        ) {

            alert(
                "Submit handler is missing."
            );

            return;

        }


        const payload = {

            title:
                String(
                    form.title ||
                    "Milk"
                ).trim(),

            quantity,

            price,

            date:
                form.date,

            paid:
                form.paid === true,

            onLeave:
                form.onLeave === true

        };


        console.log(
            "MILK PAYLOAD:",
            payload
        );


        await onSubmit(
            payload
        );

    };


    /*
    |--------------------------------------------------------------------------
    | CALCULATED TOTAL
    |--------------------------------------------------------------------------
    */

    const totalAmount =
        (
            Number(
                form.quantity
            ) || 0
        ) *
        (
            Number(
                form.price
            ) || 0
        );


    /*
    |--------------------------------------------------------------------------
    | RETURN
    |--------------------------------------------------------------------------
    */

    return (

        <div className="card border-0 shadow-sm">

            <div className="card-header bg-white">

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <h4 className="mb-1 fw-bold">

                            {
                                initialValues?._id
                                    ? "Edit Milk"
                                    : "Add Milk"
                            }

                        </h4>


                        <div className="text-muted small">

                            Record daily milk quantity and price.

                        </div>

                    </div>


                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                            navigate(
                                "/milk"
                            )
                        }
                        disabled={
                            loading
                        }
                    >

                        ← Back

                    </button>

                </div>

            </div>


            <div className="card-body p-4">

                <form
                    onSubmit={
                        handleSubmit
                    }
                    noValidate
                >

                    <div className="row g-4">


                        {/* TITLE */}

                        <div className="col-12 col-md-6">

                            <label className="form-label fw-semibold">

                                Title

                            </label>


                            <input
                                type="text"
                                className="form-control form-control-lg"
                                name="title"
                                value={
                                    form.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Milk"
                                disabled={
                                    loading
                                }
                            />

                        </div>


                        {/* QUANTITY */}

                        <div className="col-12 col-md-6">

                            <label className="form-label fw-semibold">

                                Quantity

                                <span className="text-danger ms-1">
                                    *
                                </span>

                            </label>


                            <div className="input-group input-group-lg">

                                <input
                                    type="number"
                                    className="form-control"
                                    name="quantity"
                                    value={
                                        form.quantity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0.01"
                                    step="0.01"
                                    placeholder="Enter quantity"
                                    disabled={
                                        loading
                                    }
                                />


                                <span className="input-group-text">

                                    L

                                </span>

                            </div>

                        </div>


                        {/* PRICE */}

                        <div className="col-12 col-md-6">

                            <label className="form-label fw-semibold">

                                Price / Litre

                                <span className="text-danger ms-1">
                                    *
                                </span>

                            </label>


                            <div className="input-group input-group-lg">

                                <span className="input-group-text">

                                    ₹

                                </span>


                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={
                                        form.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    disabled={
                                        loading
                                    }
                                />

                            </div>

                        </div>


                        {/* DATE */}

                        <div className="col-12 col-md-6">

                            <label className="form-label fw-semibold">

                                Date

                                <span className="text-danger ms-1">
                                    *
                                </span>

                            </label>


                            <input
                                type="date"
                                className="form-control form-control-lg"
                                name="date"
                                value={
                                    form.date
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    loading
                                }
                            />

                        </div>


                        {/* PAID */}

                        <div className="col-12 col-md-6">

                            <div className="form-check form-switch">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="paid"
                                    name="paid"
                                    checked={
                                        form.paid === true
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loading
                                    }
                                />


                                <label
                                    className="form-check-label fw-semibold"
                                    htmlFor="paid"
                                >

                                    Paid

                                </label>

                            </div>


                            <div className="text-muted small mt-1">

                                Mark this milk record as paid.

                            </div>

                        </div>


                        {/* ON LEAVE */}

                        <div className="col-12 col-md-6">

                            <div className="form-check form-switch">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="onLeave"
                                    name="onLeave"
                                    checked={
                                        form.onLeave === true
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loading
                                    }
                                />


                                <label
                                    className="form-check-label fw-semibold"
                                    htmlFor="onLeave"
                                >

                                    On Leave

                                </label>

                            </div>


                            <div className="text-muted small mt-1">

                                Mark this day as a milk leave.

                            </div>

                        </div>


                        {/* PREVIEW */}

                        <div className="col-12">

                            <div className="alert alert-light border mb-0">

                                <div className="d-flex justify-content-between align-items-center">

                                    <span className="fw-semibold">

                                        Total Amount

                                    </span>


                                    <span className="fs-4 fw-bold">

                                        ₹
                                        {totalAmount.toLocaleString(
                                            "en-IN",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }
                                        )}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    <hr className="my-4" />


                    <div className="d-flex justify-content-end gap-2">

                        <button
                            type="button"
                            className="btn btn-light border px-4"
                            onClick={() =>
                                navigate(
                                    "/milk"
                                )
                            }
                            disabled={
                                loading
                            }
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                            disabled={
                                loading
                            }
                        >

                            {
                                loading ? (

                                    <>

                                        <span className="spinner-border spinner-border-sm me-2" />

                                        Saving...

                                    </>

                                ) : (

                                    initialValues?._id
                                        ? "Update Milk"
                                        : "Save Milk"

                                )
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default MilkForm;