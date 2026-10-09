import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPreciousItems, deletePreciousItem } from "../../api/preciousItemApi";
import { downloadDocument } from "../../api/documentApi";
import Pagination from "../../components/common/Pagination";
import { aesDecrypt } from "../../utils/helpers";
import { FaFileAlt, FaTimes } from "react-icons/fa";

let secretKey = "n63expe6oc4dahmi";
const PreciousItemList = () => {

    const [preciousItem, setpreciousItem] = useState([]);
    const [loading, setLoading] = useState(true);
    const [documentViewer, setDocumentViewer] = useState(null);
    const [viewingDocumentId, setViewingDocumentId] = useState(null);

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


    useEffect(() => () => {
        if (documentViewer?.url) {
            window.URL.revokeObjectURL(documentViewer.url);
        }
    }, [documentViewer]);


    const closeDocumentViewer = () => {
        setDocumentViewer(null);
    };


    const handleViewDocument = async (item) => {
        const documentId = item.document?._id || item.document;

        if (!documentId) {
            return;
        }

        try {
            setViewingDocumentId(documentId);
            const blob = await downloadDocument(documentId);
            setDocumentViewer({
                url: window.URL.createObjectURL(blob),
                name: item.document?.originalName || item.document?.title || "Attached document",
                mimeType: blob.type || item.document?.mimeType || ""
            });
        } catch (error) {
            alert(error?.response?.data?.message || error?.message || "Unable to open attached document.");
        } finally {
            setViewingDocumentId(null);
        }
    };


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

                                                    {item.document && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm me-2"
                                                            title={item.document?.title || "View attached document"}
                                                            onClick={() => handleViewDocument(item)}
                                                            disabled={viewingDocumentId === (item.document?._id || item.document)}
                                                        >
                                                            {viewingDocumentId === (item.document?._id || item.document)
                                                                ? <span className="spinner-border spinner-border-sm" />
                                                                : <FaFileAlt />}
                                                        </button>
                                                    )}

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


            {documentViewer && (
                <div
                    className="modal d-block"
                    role="dialog"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 1060 }}
                    onClick={closeDocumentViewer}
                >
                    <div
                        className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
                        onClick={event => event.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-truncate">{documentViewer.name}</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={closeDocumentViewer} />
                            </div>
                            <div
                                className="modal-body bg-light p-0 d-flex justify-content-center align-items-center"
                                style={{ minHeight: "65vh" }}
                            >
                                {documentViewer.mimeType.startsWith("image/") ? (
                                    <img src={documentViewer.url} alt={documentViewer.name} className="img-fluid" style={{ maxHeight: "70vh" }} />
                                ) : documentViewer.mimeType === "application/pdf" || /\.pdf$/i.test(documentViewer.name) ? (
                                    <iframe title={documentViewer.name} src={documentViewer.url} className="w-100 border-0" style={{ height: "70vh" }} />
                                ) : (
                                    <div className="text-center p-5 text-muted">This document type cannot be previewed in the browser.</div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeDocumentViewer}>
                                    <FaTimes className="me-2" />Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );

};

export default PreciousItemList;
