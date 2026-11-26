import { FaEdit, FaTrash } from "react-icons/fa";
import { notify } from "../../utils/notifications";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getCategories,
    deleteCategory
} from "../../api/categoryApi";

import Pagination from "../../components/common/Pagination";

const CATEGORY_TABS = [
    { label: "INCOME", value: "INCOME" },
    { label: "Expense", value: "EXPENSE" },
    { label: "Debt", value: "DEBT" },
    { label: "Loan", value: "LOAN" }
];

const CategoryList = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    /*
     * =========================
     * TYPE FILTER (DEFAULT: EXPENSE)
     * =========================
     */

    const [typeInput, setTypeInput] = useState("EXPENSE");
    const [type, setType] = useState("EXPENSE");


    /*
     * =========================
     * LOAD CATEGORIES
     * =========================
     */

    const loadCategories = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getCategories({

                page,
                limit,

                ...(type && {
                    type
                })

            });


            if (response.success) {

                const rows =
                    response.data?.rows ||
                    response.data?.data ||
                    response.data ||
                    [];

                setCategories(
                    Array.isArray(rows)
                        ? rows
                        : []
                );

                setTotal(
                    response.data?.total ||
                    rows.length ||
                    0
                );

            } else {

                setCategories([]);
                setTotal(0);

            }

        } catch (error) {

            setCategories([]);
            setTotal(0);

            notify(
                error.response?.data?.message ||
                "Unable to fetch categories."
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

        loadCategories();

    }, [loadCategories]);


    /*
     * =========================
     * TYPE FILTER CHANGE
     * =========================
     */

    const handleTypeSelect = (selectedType) => {

        setTypeInput(selectedType);
        setType(selectedType);
        setPage(1);

    };


    /*
     * =========================
     * DELETE
     * =========================
     */

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            const response =
                await deleteCategory(id);


            if (response.success) {

                notify(
                    response.message
                );


                if (
                    categories.length === 1 &&
                    page > 1
                ) {

                    setPage(
                        page - 1
                    );

                } else {

                    loadCategories();

                }

            }

        } catch (error) {

            notify(
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

            <style>{`
                .category-type-btn:not(.active):hover {
                    background-color: #f1f3f5 !important;
                }
            `}</style>


            {/* ================= HEADER ================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3 className="mb-0">
                    Category List
                </h3>


                <Link
                    to="/categories/add"
                    className="btn btn-primary"
                >

                    + Add Category

                </Link>

            </div>


            {/* ================= CARD ================= */}

            <div className="card shadow">


                {/* ================= FILTER (LIKE IMAGE) ================= */}

                <div className="card-body">

                    {/* Segmented Type Bar */}
                    <div className="mb-3">

                        <div
                            className="d-flex w-100"
                            style={{
                                border: "2px solid #000",
                                borderRadius: "4px",
                                overflow: "hidden",
                                backgroundColor: "#fff"
                            }}
                            role="group"
                            aria-label="Category Type Filter"
                        >

                            {CATEGORY_TABS.map((tab, idx) => {

                                const isActive = type === tab.value;

                                return (

                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() => handleTypeSelect(tab.value)}
                                        style={{
                                            flex: 1,
                                            padding: "12px 16px",
                                            fontWeight: "700",
                                            fontSize: "1rem",
                                            textAlign: "center",
                                            border: "none",
                                            borderLeft: idx > 0 ? "2px solid #000" : "none",
                                            backgroundColor: isActive ? "#000" : "#fff",
                                            color: isActive ? "#fff" : "#000",
                                            cursor: "pointer",
                                            transition: "background-color 0.15s ease, color 0.15s ease"
                                        }}
                                        className={`category-type-btn ${isActive ? "active" : ""}`}
                                    >

                                        {tab.label}

                                    </button>

                                );

                            })}

                        </div>

                    </div>


                    {/* Sub-row: Active status & Per page */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                        <div className="small text-muted">

                            Showing <strong>{type || "All"}</strong> categories ({total} records)

                            {type && (

                                <button
                                    type="button"
                                    className="btn btn-link btn-sm p-0 ms-2 text-decoration-none"
                                    onClick={() => handleTypeSelect("")}
                                    title="Show all categories across all types"
                                >

                                    (Show All)

                                </button>

                            )}

                        </div>


                        <div className="d-flex align-items-center gap-2">

                            <label className="form-label mb-0 small text-muted">

                                Per page:

                            </label>


                            <select
                                className="form-select form-select-sm"
                                style={{ width: "auto" }}
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
                                            colSpan="4"
                                            className="text-center"
                                        >

                                            Loading...

                                        </td>

                                    </tr>

                                ) : categories.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="text-center"
                                        >

                                            No Category Found

                                        </td>

                                    </tr>

                                ) : (

                                    categories.map(
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

                                                    <span
                                                        className={`
                                                            badge
                                                            ${
                                                                item.type === "INCOME"
                                                                    ? "bg-success"
                                                                    : item.type === "EXPENSE"
                                                                        ? "bg-danger"
                                                                        : item.type === "SAVING"
                                                                            ? "bg-warning text-dark"
                                                                            : item.type === "DEBT"
                                                                                ? "bg-info"
                                                                                : item.type === "LOAN"
                                                                                    ? "bg-primary"
                                                                                    : "bg-secondary"
                                                            }
                                                        `}
                                                    >

                                                        {
                                                            item.type
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <Link
                                                        to={`/categories/edit/${item._id}`}
                                                        className="btn btn-warning btn-sm me-2"
                                                    >

                                                        <><FaEdit aria-hidden="true" /><span className="visually-hidden">Edit</span></>

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

                                                        <><FaTrash aria-hidden="true" /><span className="visually-hidden">Delete</span></>

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

export default CategoryList;
