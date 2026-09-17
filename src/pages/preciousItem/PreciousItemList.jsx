import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPreciousItems, deletePreciousItem } from "../../api/preciousItemApi";
import Pagination from "../../components/common/Pagination";
import { aesDecrypt } from "../../utils/helpers";

let secretKey = "n63expe6oc4dahmi";
const PreciousItemList = () => {

    const [preciousItem, setpreciousItem] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    /*
     * =========================
     * TYPE FILTER
     * =========================
     */

    const [typeInput, setTypeInput] = useState("");
    const [type, setType] = useState("");


    /*
     * =========================
     * LOAD preciousItem
     * =========================
     */

    const loadpreciousItem = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getPreciousItems({

                page,
                limit,

                ...(type && {
                    type
                })

            });
            if (response.success) {
                let rows = [];
                const rawData = response.data?.rows ?? response.data?.data ?? response.data;
                if (Array.isArray(rawData)) {
                    rows = rawData;
                } else if (typeof rawData === "string") {
                    try {
                        const decrypted = aesDecrypt(secretKey, rawData);
                        if (decrypted) {
                            const parsed = JSON.parse(decrypted);
                            rows = Array.isArray(parsed) ? parsed : [];
                        } else {
                            const parsed = JSON.parse(rawData);
                            rows = Array.isArray(parsed) ? parsed : [];
                        }
                    } catch (e) {
                        rows = [];
                    }
                }
                setpreciousItem(Array.isArray(rows)? rows: []);

                setTotal(
                    response.data?.total ||
                    rows.length ||
                    0
                );

            } else {

                setpreciousItem([]);
                setTotal(0);

            }

        } catch (error) {
            setpreciousItem([]);
            setTotal(0);

            alert(
                error.response?.data?.message ||
                "Unable to fetch preciousItem."
            );

        } finally {

            setLoading(false);

        }

    }, [
        limit,
        page,
        type
    ]);


    /*
     * =========================
     * INITIAL / DATA LOAD
     * =========================
     */

    useEffect(() => {

        loadpreciousItem();

    }, [loadpreciousItem]);


    /*
     * =========================
     * TYPE FILTER
     * =========================
     */

    const handleTypeChange = (event) => {

        setTypeInput(
            event.target.value
        );

        setType(
            event.target.value
        );

        setPage(1);

    };


    /*
     * =========================
     * CLEAR FILTER
     * =========================
     */

    const handleClearFilter = () => {

        setTypeInput("");
        setType("");

        setPage(1);

    };


    /*
     * =========================
     * DELETE
     * =========================
     */

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this preciousItem?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            const response =
                await deletePreciousItem(id);


            if (response.success) {

                alert(
                    response.message
                );


                if (
                    preciousItem.length === 1 &&
                    page > 1
                ) {

                    setPage(
                        page - 1
                    );

                } else {

                    loadpreciousItem();

                }

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Delete failed."
            );

        }

    };


    /*
     * =========================
     * PAGINATION
     * =========================
     */

    const totalPages =
        Math.ceil(
            total / limit
        ) || 1;


    const startRecord =
        total === 0
            ? 0
            : ((page - 1) * limit) + 1;


    const endRecord =
        Math.min(
            page * limit,
            total
        );


    /*
     * =========================
     * RENDER
     * =========================
     */

    return (

        <div className="container-fluid">


            {/* ================= HEADER ================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3 className="mb-0">
                    PreciousItem List
                </h3>


                <Link
                    to="/preciousItem/add"
                    className="btn btn-primary"
                >

                    + Add PreciousItem

                </Link>

            </div>


            {/* ================= CARD ================= */}

            <div className="card shadow">


                {/* ================= FILTER ================= */}

                <div className="card-body">

                    <div className="row g-2 align-items-end">


                        {/* TYPE */}

                        <div className="col-12 col-md-4">

                            <label className="form-label">

                                Type

                            </label>


                            <select
                                className="form-select"
                                value={typeInput}
                                onChange={
                                    handleTypeChange
                                }
                            >

                                <option value="">

                                    All Types

                                </option>

                                <option value="GOLD">GOLD</option>

                                <option value="SILVER">SILVER</option>

                            </select>

                        </div>


                        {/* PER PAGE */}

                        <div className="col-6 col-md-2">

                            <label className="form-label">

                                Per page

                            </label>


                            <select
                                className="form-select"
                                value={limit}
                                onChange={event => {

                                    setLimit(
                                        Number(
                                            event.target.value
                                        )
                                    );

                                    setPage(1);

                                }}
                            >

                                <option value="10">
                                    10
                                </option>

                                <option value="25">
                                    25
                                </option>

                                <option value="50">
                                    50
                                </option>

                            </select>

                        </div>


                        {/* CLEAR */}

                        <div className="col-6 col-md-2">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={
                                    handleClearFilter
                                }
                                disabled={
                                    !typeInput
                                }
                            >

                                Clear

                            </button>

                        </div>

                    </div>

                </div>


                {/* ================= TABLE ================= */}

                <div className="card-body p-0 table-responsive">

                    <table className="table table-bordered table-hover mb-0">


                        <thead className="table-dark">

                            <tr>

                                <th width="80">
                                    #
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Type
                                </th>
                                <th>
                                    Description
                                </th>

                                <th>
                                    Location
                                </th>
                                <th width="180">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {

                                loading ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center"
                                        >

                                            Loading...

                                        </td>

                                    </tr>

                                ) : preciousItem.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center"
                                        >

                                            No preciousItem Found

                                        </td>

                                    </tr>

                                ) : (

                                    preciousItem.map(
                                        (item, index) => (

                                            <tr
                                                key={
                                                    item._id
                                                }
                                            >

                                                <td>

                                                    {
                                                        ((page - 1) * limit) +
                                                        index +
                                                        1
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        item.name
                                                    }

                                                </td>


                                                <td>

                                                    <span className={`badge ${item.type === "GOLD" ? "bg-success" : "bg-secondary"}`}>

                                                        {
                                                            item.type
                                                        }

                                                    </span>

                                                </td>
                                                <td>

                                                    {
                                                        item.description
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        item.location
                                                    }

                                                </td>


                                                <td>

                                                    <Link
                                                        to={`/preciousItem/edit/${item._id}`}
                                                        className="btn btn-warning btn-sm me-2"
                                                    >

                                                        Edit

                                                    </Link>


                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item._id
                                                            )
                                                        }
                                                    >

                                                        Delete

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )

                            }

                        </tbody>

                    </table>

                </div>


                {/* ================= FOOTER ================= */}

                <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2 bg-white">

                    <small className="text-muted">

                        Showing{" "}
                        {startRecord}
                        {" "}to{" "}
                        {endRecord}
                        {" "}of{" "}
                        {total}
                        {" "}records

                    </small>


                    <Pagination
                        page={page}
                        limit={limit}
                        total={total}
                        onPageChange={nextPage => {

                            if (
                                nextPage >= 1 &&
                                nextPage <= totalPages
                            ) {

                                setPage(
                                    nextPage
                                );

                            }

                        }}
                    />

                </div>

            </div>

        </div>

    );

};

export default PreciousItemList;