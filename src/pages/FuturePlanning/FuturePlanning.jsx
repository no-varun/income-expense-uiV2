import React, {
    useEffect,
    useState
} from "react";

import {
    getFuturePlannings,
    deleteFuturePlanning
} from "../../api/futurePlanningApi";

import FuturePlanningForm from "../../components/FuturePlanningForm/FuturePlanningForm";


const FuturePlanning = () => {

    const [rows, setRows] = useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [page, setPage] =
        useState(1);

    const [limit] =
        useState(10);

    const [total, setTotal] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totals, setTotals] =
        useState({
            fd1: 0,
            fd2: 0,
            rd1: 0,
            rd2: 0,
            balance1: 0,
            balance2: 0,
            total: 0
        });


    /*
    |--------------------------------------------------------------------------
    | LOAD LIST
    |--------------------------------------------------------------------------
    */

    const loadFuturePlannings = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getFuturePlannings({
                    page,
                    limit
                });

            // console.log(
            //     "Future Planning Response:",
            //     response
            // );

            if (
                response &&
                response.success === true
            ) {

                const data =
                    response.data || {};

                setRows(
                    Array.isArray(data.rows)
                        ? data.rows
                        : []
                );

                setTotal(
                    Number(
                        data.total || 0
                    )
                );

                setTotalPages(
                    Number(
                        data.totalPages || 1
                    )
                );

                setTotals({

                    fd1:
                        Number(
                            data.totals?.fd1 || 0
                        ),

                    fd2:
                        Number(
                            data.totals?.fd2 || 0
                        ),

                    rd1:
                        Number(
                            data.totals?.rd1 || 0
                        ),

                    rd2:
                        Number(
                            data.totals?.rd2 || 0
                        ),

                    balance1:
                        Number(
                            data.totals?.balance1 || 0
                        ),

                    balance2:
                        Number(
                            data.totals?.balance2 || 0
                        ),

                    total:
                        Number(
                            data.totals?.total || 0
                        )

                });

            } else {

                setRows([]);

                setError(
                    response?.message ||
                    "Unable to fetch future planning."
                );

            }

        } catch (err) {

            console.error(
                "Future Planning Error:",
                err
            );

            setRows([]);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to fetch future planning."
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadFuturePlannings();

    }, [page]);


    /*
    |--------------------------------------------------------------------------
    | ADD
    |--------------------------------------------------------------------------
    */

    const handleAdd = () => {

        setEditingId(null);
        setShowForm(true);

    };


    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */

    const handleEdit = (id) => {

        setEditingId(id);
        setShowForm(true);

    };


    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this future planning?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const response =
                await deleteFuturePlanning(id);

            // console.log(
            //     "Delete Future Planning Response:",
            //     response
            // );

            if (
                response &&
                response.success === true
            ) {

                alert(
                    response.message ||
                    "Future planning deleted successfully."
                );

                loadFuturePlannings();

            } else {

                alert(
                    response?.message ||
                    "Unable to delete future planning."
                );

            }

        } catch (err) {

            console.error(
                "Delete Future Planning Error:",
                err
            );

            alert(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to delete future planning."
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | FORM SUCCESS
    |--------------------------------------------------------------------------
    */

    const handleFormSuccess = () => {

        setShowForm(false);
        setEditingId(null);

        loadFuturePlannings();

    };


    /*
    |--------------------------------------------------------------------------
    | FORMAT MONEY
    |--------------------------------------------------------------------------
    */

    const formatMoney = (value) => {

        const number =
            Number(value || 0);

        return number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | FORMAT MONTH
    |--------------------------------------------------------------------------
    */

    const formatMonth = (value) => {

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                month: "short",
                year: "numeric"
            }
        );

    };


    return (

        <div className="container-fluid">

            <div
                className="
                    d-flex
                    justify-content-between
                    align-items-center
                    mb-3
                "
            >

                <div>

                    <h4 className="mb-1">
                        Future Planning
                    </h4>

                    <div className="text-muted small">
                        Plan your FD, RD and balance month-wise
                    </div>

                </div>


                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAdd}
                >
                    + Add Future Planning
                </button>

            </div>


            {error && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {showForm && (

                <div className="mb-4">

                    <FuturePlanningForm
                        id={editingId}
                        onSuccess={
                            handleFormSuccess
                        }
                        onCancel={() => {

                            setShowForm(false);
                            setEditingId(null);

                        }}
                    />

                </div>

            )}


            <div className="card shadow-sm">

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table
                            className="
                                table
                                table-bordered
                                table-hover
                                align-middle
                                mb-0
                            "
                        >

                            <thead
                                className="table-light"
                            >

                                <tr>

                                    <th>
                                        Month
                                    </th>


                                    <th className="text-end">
                                        FD1
                                    </th>

                                    <th className="text-end">
                                        FD2
                                    </th>

                                    <th className="text-end">
                                        RD1
                                    </th>

                                    <th className="text-end">
                                        RD2
                                    </th>

                                    <th className="text-end">
                                        Balance 1
                                    </th>

                                    <th className="text-end">
                                        Balance 2
                                    </th>

                                    <th className="text-end">
                                        Total
                                    </th>

                                    <th className="text-end">
                                        Note
                                    </th>
                                    <th className="text-center">
                                        Milestone
                                    </th>
                                    <th
                                        className="text-center"
                                        style={{
                                            width: "150px"
                                        }}
                                    >
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="11"
                                            className="
                                                text-center
                                                py-5
                                            "
                                        >
                                            Loading...
                                        </td>

                                    </tr>

                                ) : rows.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="11"
                                            className="
                                                text-center
                                                py-5
                                                text-muted
                                            "
                                        >
                                            No future planning found.
                                        </td>

                                    </tr>

                                ) : (

                                    rows.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item._id
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {
                                                            formatMonth(
                                                                item.month
                                                            )
                                                        }
                                                    </strong>
                                                </td>

                                                <td className="text-end">
                                                    ₹
                                                    {
                                                        formatMoney(
                                                            item.fd1
                                                        )
                                                    }
                                                </td>


                                                <td className="text-end">
                                                    ₹
                                                    {
                                                        formatMoney(
                                                            item.fd2
                                                        )
                                                    }
                                                </td>


                                                <td className="text-end">
                                                    ₹
                                                    {
                                                        formatMoney(
                                                            item.rd1
                                                        )
                                                    }
                                                </td>


                                                <td className="text-end">
                                                    ₹
                                                    {
                                                        formatMoney(
                                                            item.rd2
                                                        )
                                                    }
                                                </td>


                                                <td className="text-end">
                                                    ₹
                                                    {
                                                        formatMoney(
                                                            item.balance1
                                                        )
                                                    }
                                                </td>


                                                <td className="text-end">
                                                    ₹
                                                    {
                                                        formatMoney(
                                                            item.balance2
                                                        )
                                                    }
                                                </td>


                                                <td className="text-end fw-bold">
                                                    ₹
                                                    {
                                                        formatMoney(
                                                            item.total
                                                        )
                                                    }
                                                </td>


                                                <td className="text-end fw-bold">
                                                    {
                                                        item.note || "-"
                                                    }
                                                </td>
                                                <td className="text-center">

                                                    {item.isMileStone ? (

                                                        <span className="badge bg-success">
                                                            Yes
                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-secondary">
                                                            No
                                                        </span>

                                                    )}

                                                </td>

                                                <td>

                                                    <div
                                                        className="
                                                            d-flex
                                                            justify-content-center
                                                            gap-2
                                                        "
                                                    >

                                                        <button
                                                            type="button"
                                                            className="
                                                                btn
                                                                btn-sm
                                                                btn-outline-primary
                                                            "
                                                            onClick={() =>
                                                                handleEdit(
                                                                    item._id
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="
                                                                btn
                                                                btn-sm
                                                                btn-outline-danger
                                                            "
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                            {/*
                            {rows.length > 0 && (

                                <tfoot
                                    className="table-light"
                                >

                                    <tr>

                                        <th>
                                            Total
                                        </th>

                                        <th></th>

                                        <th className="text-end">
                                            ₹
                                            {
                                                formatMoney(
                                                    totals.fd1
                                                )
                                            }
                                        </th>

                                        <th className="text-end">
                                            ₹
                                            {
                                                formatMoney(
                                                    totals.fd2
                                                )
                                            }
                                        </th>

                                        <th className="text-end">
                                            ₹
                                            {
                                                formatMoney(
                                                    totals.rd1
                                                )
                                            }
                                        </th>

                                        <th className="text-end">
                                            ₹
                                            {
                                                formatMoney(
                                                    totals.rd2
                                                )
                                            }
                                        </th>

                                        <th className="text-end">
                                            ₹
                                            {
                                                formatMoney(
                                                    totals.balance1
                                                )
                                            }
                                        </th>

                                        <th className="text-end">
                                            ₹
                                            {
                                                formatMoney(
                                                    totals.balance2
                                                )
                                            }
                                        </th>

                                        <th className="text-end fw-bold">
                                            ₹
                                            {
                                                formatMoney(
                                                    totals.total
                                                )
                                            }
                                        </th>

                                        <th></th>

                                        <th></th>

                                    </tr>

                                </tfoot>

                            )}
                            */}

                        </table>

                    </div>

                </div>


                <div
                    className="
                        card-footer
                        d-flex
                        justify-content-between
                        align-items-center
                    "
                >

                    <small className="text-muted">

                        Total Records: {total}

                    </small>


                    <div className="d-flex gap-2">

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            disabled={
                                page <= 1 ||
                                loading
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        current - 1
                                )
                            }
                        >
                            Previous
                        </button>


                        <span
                            className="
                                btn
                                btn-sm
                                btn-light
                            "
                        >
                            {page} / {totalPages}
                        </span>


                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            disabled={
                                page >= totalPages ||
                                loading
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        current + 1
                                )
                            }
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};


export default FuturePlanning;