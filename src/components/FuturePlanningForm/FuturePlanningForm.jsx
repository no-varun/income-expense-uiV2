import React, {
    useEffect,
    useState
} from "react";

import {
    createFuturePlanning,
    getFuturePlanning,
    updateFuturePlanning
} from "../../api/futurePlanningApi";


const FuturePlanningForm = ({
    id,
    onSuccess,
    onCancel
}) => {

    const isEdit =
        Boolean(id);


    const [form, setForm] =
        useState({
            month: "",
            fd1: "",
            fd2: "",
            rd1: "",
            rd2: "",
            balance1: "",
            balance2: "",
            note: ""
        });


    const [loading, setLoading] =
        useState(false);


    const [fetching, setFetching] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | LOAD EDIT DATA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!id) {

            setForm({
                month: "",
                fd1: "",
                fd2: "",
                rd1: "",
                rd2: "",
                balance1: "",
                balance2: "",
                note: ""
            });

            return;
        }


        const loadData = async () => {

            try {

                setFetching(true);

                const response =
                    await getFuturePlanning(
                        id
                    );

                console.log(
                    "Future Planning Detail Response:",
                    response
                );

                if (
                    response &&
                    response.success === true
                ) {

                    const data =
                        response.data || {};

                    setForm({

                        month:
                            data.month
                                ? new Date(
                                      data.month
                                  )
                                      .toISOString()
                                      .slice(
                                          0,
                                          7
                                      )
                                : "",

                        fd1:
                            data.fd1 ?? "",

                        fd2:
                            data.fd2 ?? "",

                        rd1:
                            data.rd1 ?? "",

                        rd2:
                            data.rd2 ?? "",

                        balance1:
                            data.balance1 ?? "",

                        balance2:
                            data.balance2 ?? "",

                        note:
                            data.note || ""

                    });

                } else {

                    alert(
                        response?.message ||
                        "Unable to fetch future planning."
                    );

                }

            } catch (error) {

                console.error(
                    "Future Planning Detail Error:",
                    error
                );

                alert(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to fetch future planning."
                );

            } finally {

                setFetching(false);

            }

        };


        loadData();

    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | CHANGE
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm(
            (current) => ({
                ...current,
                [name]: value
            })
        );

    };


    /*
    |--------------------------------------------------------------------------
    | NUMBER
    |--------------------------------------------------------------------------
    */

    const number = (value) => {

        const result =
            Number(value);

        return Number.isFinite(result)
            ? result
            : 0;

    };


    /*
    |--------------------------------------------------------------------------
    | TOTAL
    |--------------------------------------------------------------------------
    */

    const total =
        number(form.fd1) +
        number(form.fd2) +
        number(form.rd1) +
        number(form.rd2) +
        number(form.balance1) +
        number(form.balance2);


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        if (!form.month) {

            alert(
                "Please select month."
            );

            return;
        }


        const payload = {

            month:
                `${form.month}-01`,

            fd1:
                number(form.fd1),

            fd2:
                number(form.fd2),

            rd1:
                number(form.rd1),

            rd2:
                number(form.rd2),

            balance1:
                number(form.balance1),

            balance2:
                number(form.balance2),

            note:
                form.note.trim()

        };


        console.log(
            "Future Planning Payload:",
            payload
        );


        try {

            setLoading(true);


            let response;


            if (isEdit) {

                response =
                    await updateFuturePlanning(
                        id,
                        payload
                    );

            } else {

                response =
                    await createFuturePlanning(
                        payload
                    );

            }


            console.log(
                "Future Planning Save Response:",
                response
            );


            /*
            |--------------------------------------------------------------------------
            | IMPORTANT SUCCESS CHECK
            |--------------------------------------------------------------------------
            */

            if (
                response &&
                response.success === true
            ) {

                alert(
                    response.message ||
                    (
                        isEdit
                            ? "Future planning updated successfully."
                            : "Future planning created successfully."
                    )
                );

                if (onSuccess) {
                    onSuccess(
                        response
                    );
                }

                return;

            }


            alert(
                response?.message ||
                (
                    isEdit
                        ? "Unable to update future planning."
                        : "Unable to create future planning."
                )
            );

        } catch (error) {

            console.error(
                "Future Planning Save Error:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.message ||
                (
                    isEdit
                        ? "Unable to update future planning."
                        : "Unable to create future planning."
                )
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | FORMAT
    |--------------------------------------------------------------------------
    */

    const formatMoney = (
        value
    ) => {

        return Number(
            value || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    return (

        <div className="card shadow-sm">

            <div className="card-header">

                <strong>

                    {isEdit
                        ? "Edit Future Planning"
                        : "Add Future Planning"}

                </strong>

            </div>


            <div className="card-body">

                {fetching ? (

                    <div
                        className="
                            text-center
                            py-4
                        "
                    >
                        Loading...
                    </div>

                ) : (

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div
                            className="
                                row
                                g-3
                            "
                        >

                            <div
                                className="
                                    col-12
                                    col-md-4
                                "
                            >

                                <label
                                    className="form-label"
                                >
                                    Month
                                </label>

                                <input
                                    type="month"
                                    name="month"
                                    className="form-control"
                                    value={
                                        form.month
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div
                                className="
                                    col-12
                                    col-md-4
                                "
                            >

                                <label
                                    className="form-label"
                                >
                                    FD1
                                </label>

                                <input
                                    type="number"
                                    name="fd1"
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.fd1
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0.00"
                                />

                            </div>


                            <div
                                className="
                                    col-12
                                    col-md-4
                                "
                            >

                                <label
                                    className="form-label"
                                >
                                    FD2
                                </label>

                                <input
                                    type="number"
                                    name="fd2"
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.fd2
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0.00"
                                />

                            </div>


                            <div
                                className="
                                    col-12
                                    col-md-4
                                "
                            >

                                <label
                                    className="form-label"
                                >
                                    RD1
                                </label>

                                <input
                                    type="number"
                                    name="rd1"
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.rd1
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0.00"
                                />

                            </div>


                            <div
                                className="
                                    col-12
                                    col-md-4
                                "
                            >

                                <label
                                    className="form-label"
                                >
                                    RD2
                                </label>

                                <input
                                    type="number"
                                    name="rd2"
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.rd2
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0.00"
                                />

                            </div>


                            <div
                                className="
                                    col-12
                                    col-md-4
                                "
                            >

                                <label
                                    className="form-label"
                                >
                                    Balance 1
                                </label>

                                <input
                                    type="number"
                                    name="balance1"
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.balance1
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0.00"
                                />

                            </div>


                            <div
                                className="
                                    col-12
                                    col-md-4
                                "
                            >

                                <label
                                    className="form-label"
                                >
                                    Balance 2
                                </label>

                                <input
                                    type="number"
                                    name="balance2"
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.balance2
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0.00"
                                />

                            </div>


                            <div
                                className="
                                    col-12
                                    col-md-4
                                "
                            >

                                <label
                                    className="form-label"
                                >
                                    Total
                                </label>

                                <input
                                    type="text"
                                    className="form-control fw-bold"
                                    value={
                                        `₹${formatMoney(total)}`
                                    }
                                    readOnly
                                />

                            </div>


                            <div className="col-12">

                                <label
                                    className="form-label"
                                >
                                    Note
                                </label>

                                <textarea
                                    name="note"
                                    className="form-control"
                                    rows="2"
                                    value={
                                        form.note
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Optional note"
                                />

                            </div>


                            <div
                                className="
                                    col-12
                                    d-flex
                                    justify-content-end
                                    gap-2
                                "
                            >

                                <button
                                    type="button"
                                    className="
                                        btn
                                        btn-secondary
                                    "
                                    onClick={
                                        onCancel
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="
                                        btn
                                        btn-primary
                                    "
                                    disabled={
                                        loading
                                    }
                                >

                                    {loading
                                        ? "Saving..."
                                        : (
                                            isEdit
                                                ? "Update"
                                                : "Save"
                                        )}

                                </button>

                            </div>

                        </div>

                    </form>

                )}

            </div>

        </div>

    );

};


export default FuturePlanningForm;