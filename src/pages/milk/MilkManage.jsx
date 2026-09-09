import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import MilkSummary
    from "../../components/milk/MilkSummary";

import {
    getMilkList,
    deleteMilk
} from "../../api/milkManageApi";


const MilkManage = () => {

    const navigate =
        useNavigate();


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [rows, setRows] =
        useState([]);

    const [summary, setSummary] =
        useState({
            totalQuantity: 0,
            totalAmount: 0,
            averagePrice: 0,
            totalRecords: 0
        });


    const [page, setPage] =
        useState(1);

    const [limit] =
        useState(10);

    const [totalPages, setTotalPages] =
        useState(1);


    /*
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    */

    const [search, setSearch] =
        useState("");

    const [from, setFrom] =
        useState("");

    const [to, setTo] =
        useState("");

    const [paid, setPaid] =
        useState("");

    const [onLeave, setOnLeave] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] =
        useState(false);

    const [deleting, setDeleting] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | FORMAT NUMBER
    |--------------------------------------------------------------------------
    */

    const formatNumber =
        (value) =>
            Number(
                value || 0
            ).toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );


    /*
    |--------------------------------------------------------------------------
    | LOAD MILK
    |--------------------------------------------------------------------------
    */

    const loadMilk =
        async (
            override = {}
        ) => {

            try {

                setLoading(
                    true
                );


                const currentPage =
                    override.page ??
                    page;


                const params = {

                    page:
                        currentPage,

                    limit

                };


                /*
                |--------------------------------------------------------------------------
                | SEARCH
                |--------------------------------------------------------------------------
                */

                if (
                    search.trim() &&
                    !override.clearSearch
                ) {

                    params.search =
                        search.trim();

                }


                /*
                |--------------------------------------------------------------------------
                | DATE FROM
                |--------------------------------------------------------------------------
                */

                if (
                    from &&
                    !override.clearDates
                ) {

                    params.dateFrom =
                        from;

                }


                /*
                |--------------------------------------------------------------------------
                | DATE TO
                |--------------------------------------------------------------------------
                */

                if (
                    to &&
                    !override.clearDates
                ) {

                    params.dateTo =
                        to;

                }


                /*
                |--------------------------------------------------------------------------
                | PAID
                |--------------------------------------------------------------------------
                */

                if (
                    paid !== "" &&
                    !override.clearPaid
                ) {

                    params.paid =
                        paid === "true";

                }
                if (onLeave !== "" &&!override.clearOnLeave) {
                    params.onLeave =onLeave === "true";
                }


                console.log("GET MILK PARAMS:",params
                );


                const response =
                    await getMilkList(
                        params
                    );


                console.log(
                    "GET MILK RESPONSE:",
                    response
                );


                if (
                    !response ||
                    response.success !== true
                ) {

                    setRows([]);

                    setSummary({

                        totalQuantity: 0,

                        totalAmount: 0,

                        averagePrice: 0,

                        totalRecords: 0

                    });


                    setTotalPages(
                        1
                    );


                    alert(
                        response?.message ||
                        "Unable to fetch milk records."
                    );


                    return;

                }


                const result =
                    response.data ||
                    {};


                /*
                |--------------------------------------------------------------------------
                | ROWS
                |--------------------------------------------------------------------------
                */

                const milkRows =
                    Array.isArray(
                        result.rows
                    )
                        ? result.rows
                        : Array.isArray(
                            result.data
                        )
                            ? result.data
                            : [];


                /*
                |--------------------------------------------------------------------------
                | CALCULATE SUMMARY
                |--------------------------------------------------------------------------
                */

                const totalQuantity =
                    milkRows.reduce(
                        (
                            sum,
                            item
                        ) =>
                            sum +
                            Number(
                                item.quantity ||
                                0
                            ),
                        0
                    );


                const totalAmount =
                    milkRows.reduce(
                        (
                            sum,
                            item
                        ) =>
                            sum +
                            Number(
                                item.totalAmount ??
                                (
                                    Number(
                                        item.quantity ||
                                        0
                                    ) *
                                    Number(
                                        item.price ??
                                        80
                                    )
                                )
                            ),
                        0
                    );


                const averagePrice =
                    totalQuantity > 0
                        ? totalAmount /
                        totalQuantity
                        : 0;


                setRows(
                    milkRows
                );


                setSummary({

                    totalQuantity:
                        Number(
                            result.totalQuantity ??
                            totalQuantity
                        ),

                    totalAmount:
                        Number(
                            result.totalAmount ??
                            totalAmount
                        ),

                    averagePrice:
                        Number(
                            result.averagePrice ??
                            averagePrice
                        ),

                    totalRecords:
                        Number(
                            result.total ??
                            milkRows.length
                        )

                });


                const pages =
                    Number(
                        result.totalPages
                    );


                setTotalPages(
                    Number.isFinite(
                        pages
                    ) &&
                    pages > 0
                        ? pages
                        : 1
                );


            } catch (
                error
            ) {

                console.error(
                    "GET MILK ERROR:",
                    error
                );


                setRows([]);

                setSummary({

                    totalQuantity: 0,

                    totalAmount: 0,

                    averagePrice: 0,

                    totalRecords: 0

                });


                setTotalPages(
                    1
                );


                alert(

                    error?.response?.data?.message ||

                    error?.message ||

                    "Unable to fetch milk records."

                );


            } finally {

                setLoading(
                    false
                );

            }

        };


    /*
    |--------------------------------------------------------------------------
    | INITIAL / PAGE LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            loadMilk();

        },
        [page]
    );


    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    const handleSearch =
        async () => {

            if (
                page !== 1
            ) {

                setPage(
                    1
                );

                return;

            }


            await loadMilk({
                page: 1
            });

        };


    /*
    |--------------------------------------------------------------------------
    | RESET
    |--------------------------------------------------------------------------
    */

    const handleReset =
        async () => {

            setSearch("");

            setFrom("");

            setTo("");

            setPaid("");

            setOnLeave("");


            if (
                page !== 1
            ) {

                setPage(
                    1
                );

                return;

            }


            await loadMilk({

                page: 1,

                clearSearch:
                    true,

                clearDates:
                    true,

                clearPaid:
                    true,

                clearOnLeave:
                    true

            });

        };


    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    const handleDelete =
        async (
            id
        ) => {

            if (
                !window.confirm(
                    "Delete this milk record?"
                )
            ) {

                return;

            }


            try {

                setDeleting(
                    id
                );


                const response =
                    await deleteMilk(
                        id
                    );


                if (
                    !response ||
                    response.success !== true
                ) {

                    alert(
                        response?.message ||
                        "Unable to delete milk record."
                    );

                    return;

                }


                alert(
                    response.message ||
                    "Milk record deleted."
                );


                await loadMilk();


            } catch (
                error
            ) {

                console.error(
                    "DELETE MILK ERROR:",
                    error
                );


                alert(

                    error?.response?.data?.message ||

                    error?.message ||

                    "Unable to delete milk record."

                );


            } finally {

                setDeleting(
                    null
                );

            }

        };


    /*
    |--------------------------------------------------------------------------
    | RETURN
    |--------------------------------------------------------------------------
    */

    return (

        <div className="container-fluid px-4 py-3">


            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h3 className="fw-bold mb-1">

                        Milk Management

                    </h3>


                    <div className="text-muted">

                        Track milk quantity, price and daily records.

                    </div>

                </div>


                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate(
                            "/milk/add"
                        )
                    }
                >

                    + Add Milk

                </button>

            </div>


            {/* SUMMARY */}

            <MilkSummary
                {...summary}
            />


            {/* FILTER */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <div className="row g-3 align-items-end">


                        {/* SEARCH */}

                        <div className="col-12 col-md-3">

                            <label className="form-label fw-semibold">

                                Search

                            </label>


                            <input
                                className="form-control"
                                placeholder="Search milk..."
                                value={
                                    search
                                }
                                onChange={
                                    (e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                }
                            />

                        </div>


                        {/* FROM */}

                        <div className="col-12 col-md-2">

                            <label className="form-label fw-semibold">

                                From

                            </label>


                            <input
                                type="date"
                                className="form-control"
                                value={
                                    from
                                }
                                onChange={
                                    (e) =>
                                        setFrom(
                                            e.target.value
                                        )
                                }
                            />

                        </div>


                        {/* TO */}

                        <div className="col-12 col-md-2">

                            <label className="form-label fw-semibold">

                                To

                            </label>


                            <input
                                type="date"
                                className="form-control"
                                value={
                                    to
                                }
                                onChange={
                                    (e) =>
                                        setTo(
                                            e.target.value
                                        )
                                }
                            />

                        </div>


                        {/* PAID */}

                        <div className="col-12 col-md-2">

                            <label className="form-label fw-semibold">

                                Payment

                            </label>


                            <select
                                className="form-select"
                                value={
                                    paid
                                }
                                onChange={
                                    (e) =>
                                        setPaid(
                                            e.target.value
                                        )
                                }
                            >

                                <option value="">
                                    All
                                </option>

                                <option value="true">
                                    Paid
                                </option>

                                <option value="false">
                                    Unpaid
                                </option>

                            </select>

                        </div>


                        {/* ON LEAVE */}

                        <div className="col-12 col-md-2">

                            <label className="form-label fw-semibold">

                                Leave

                            </label>


                            <select
                                className="form-select"
                                value={
                                    onLeave
                                }
                                onChange={
                                    (e) =>
                                        setOnLeave(
                                            e.target.value
                                        )
                                }
                            >

                                <option value="">
                                    All
                                </option>

                                <option value="true">
                                    On Leave
                                </option>

                                <option value="false">
                                    Not on Leave
                                </option>

                            </select>

                        </div>


                        {/* BUTTONS */}

                        <div className="col-12 d-flex justify-content-end gap-2">

                            <button
                                type="button"
                                className="btn btn-primary px-4"
                                onClick={
                                    handleSearch
                                }
                                disabled={
                                    loading
                                }
                            >

                                Search

                            </button>


                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4"
                                onClick={
                                    handleReset
                                }
                                disabled={
                                    loading
                                }
                            >

                                Reset

                            </button>

                        </div>


                    </div>

                </div>

            </div>


            {/* TABLE */}

            <div className="card shadow-sm border-0">

                <div className="card-header bg-white">

                    <h5 className="mb-0">

                        Milk Records

                    </h5>

                </div>


                <div className="table-responsive">

                    <table className="table table-hover align-middle mb-0">


                        <thead className="table-light">

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Title
                                </th>

                                <th className="text-end">
                                    Quantity
                                </th>

                                <th className="text-end">
                                    Price/L
                                </th>

                                <th className="text-end">
                                    Total
                                </th>

                                <th className="text-center">
                                    Paid
                                </th>

                                <th className="text-center">
                                    Leave
                                </th>

                                <th className="text-end">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="text-center py-5"
                                    >

                                        <div className="spinner-border spinner-border-sm me-2" />

                                        Loading...

                                    </td>

                                </tr>

                            ) : rows.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="text-center py-5 text-muted"
                                    >

                                        No milk records found.

                                    </td>

                                </tr>

                            ) : (

                                rows.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item._id
                                            }
                                        >


                                            {/* NUMBER */}

                                            <td>

                                                {
                                                    (
                                                        page -
                                                        1
                                                    ) *
                                                    limit +
                                                    index +
                                                    1
                                                }

                                            </td>


                                            {/* DATE */}

                                            <td>

                                                {
                                                    item.date

                                                        ? new Date(
                                                            item.date
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )

                                                        : "-"
                                                }

                                            </td>


                                            {/* TITLE */}

                                            <td className="fw-semibold">

                                                {
                                                    item.title ||
                                                    "Milk"
                                                }

                                            </td>


                                            {/* QUANTITY */}

                                            <td className="text-end">

                                                {
                                                    formatNumber(
                                                        item.quantity
                                                    )
                                                }

                                                {" "}L

                                            </td>


                                            {/* PRICE */}

                                            <td className="text-end">

                                                ₹
                                                {
                                                    formatNumber(
                                                        item.price
                                                    )
                                                }

                                            </td>


                                            {/* TOTAL */}

                                            <td className="text-end fw-semibold">

                                                ₹
                                                {
                                                    formatNumber(
                                                        item.totalAmount
                                                    )
                                                }

                                            </td>


                                            {/* PAID */}

                                            <td className="text-center">

                                                {
                                                    item.paid === true ? (

                                                        <span className="badge text-bg-success">

                                                            Paid

                                                        </span>

                                                    ) : (

                                                        <span className="badge text-bg-warning">

                                                            Unpaid

                                                        </span>

                                                    )
                                                }

                                            </td>


                                            {/* ON LEAVE */}

                                            <td className="text-center">

                                                {
                                                    item.onLeave === true ? (

                                                        <span className="badge text-bg-info">

                                                            On Leave

                                                        </span>

                                                    ) : (

                                                        <span className="badge text-bg-secondary">

                                                            No

                                                        </span>

                                                    )
                                                }

                                            </td>


                                            {/* ACTION */}

                                            <td className="text-end">

                                                <div className="d-flex justify-content-end gap-2">


                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() =>
                                                            navigate(
                                                                `/milk/edit/${item._id}`
                                                            )
                                                        }
                                                    >

                                                        Edit

                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item._id
                                                            )
                                                        }
                                                        disabled={
                                                            deleting ===
                                                            item._id
                                                        }
                                                    >

                                                        {
                                                            deleting ===
                                                            item._id

                                                                ? "Deleting..."

                                                                : "Delete"
                                                        }

                                                    </button>


                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>


                        {/* FOOTER */}

                        {
                            !loading &&
                            rows.length > 0 && (

                                <tfoot className="table-light">

                                    <tr>

                                        <th
                                            colSpan="3"
                                            className="text-end"
                                        >

                                            Page Total

                                        </th>


                                        <th className="text-end">

                                            {
                                                formatNumber(
                                                    rows.reduce(
                                                        (
                                                            sum,
                                                            item
                                                        ) =>
                                                            sum +
                                                            Number(
                                                                item.quantity ||
                                                                0
                                                            ),
                                                        0
                                                    )
                                                )
                                            }

                                            {" "}L

                                        </th>


                                        <th></th>


                                        <th className="text-end">

                                            ₹
                                            {
                                                formatNumber(
                                                    rows.reduce(
                                                        (
                                                            sum,
                                                            item
                                                        ) =>
                                                            sum +
                                                            Number(
                                                                item.totalAmount ??
                                                                (
                                                                    Number(
                                                                        item.quantity ||
                                                                        0
                                                                    ) *
                                                                    Number(
                                                                        item.price ??
                                                                        80
                                                                    )
                                                                )
                                                            ),
                                                        0
                                                    )
                                                )
                                            }

                                        </th>


                                        <th></th>

                                        <th></th>

                                        <th></th>

                                    </tr>

                                </tfoot>

                            )
                        }


                    </table>

                </div>


                {/* PAGINATION */}

                {
                    totalPages > 1 && (

                        <div className="card-footer bg-white d-flex justify-content-between align-items-center">


                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                disabled={
                                    page === 1 ||
                                    loading
                                }
                                onClick={() =>
                                    setPage(
                                        (p) =>
                                            p - 1
                                    )
                                }
                            >

                                Previous

                            </button>


                            <span>

                                Page{" "}
                                {page}
                                {" "}of{" "}
                                {totalPages}

                            </span>


                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                disabled={
                                    page ===
                                    totalPages ||
                                    loading
                                }
                                onClick={() =>
                                    setPage(
                                        (p) =>
                                            p + 1
                                    )
                                }
                            >

                                Next

                            </button>


                        </div>

                    )

                }


            </div>


        </div>

    );

};


export default MilkManage;