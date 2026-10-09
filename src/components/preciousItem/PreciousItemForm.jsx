import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDocuments } from "../../api/documentApi";

const PreciousItemForm = ({ initialValues = {}, onSubmit, loading = false }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        type: "GOLD",
        description: "",
        location: "",
        document: ""
    });

    const [documents, setDocuments] = useState([]);
    const [documentsLoading, setDocumentsLoading] = useState(false);

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                setDocumentsLoading(true);
                const response = await getDocuments({ limit: 100, status: "true" });
                const result = response?.data?.rows !== undefined ? response.data : response;
                setDocuments(Array.isArray(result?.rows) ? result.rows : []);
            } catch (error) {
                setDocuments([]);
            } finally {
                setDocumentsLoading(false);
            }
        };

        loadDocuments();
    }, []);
    /*
     * =========================
     * EDIT MODE
     * =========================
     */
    useEffect(() => {

        if (Object.keys(initialValues).length > 0) {
            setForm({
                name: initialValues.name || "",
                type: initialValues.type || "GOLD",
                description: initialValues.description || "",
                location: initialValues.location || "",
                document: initialValues.document?._id || initialValues.document || ""
            });
        }

    }, [initialValues]);


    /*
     * =========================
     * HANDLE CHANGE
     * =========================
     */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    /*
     * =========================
     * SUBMIT
     * =========================
     */

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            alert("PreciousItem name is required.");
            return;
        }

        if (!form.type) {
            alert("PreciousItem type is required.");
            return;
        }


        onSubmit({

            ...form,

            name:
                form.name.trim(),

            type:
                form.type.toUpperCase()

        });

    };


    /*
     * =========================
     * RENDER
     * =========================
     */

    return (

        <div className="card shadow">

            {/* ================= HEADER ================= */}

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">
                    PreciousItem Details
                </h5>


                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                        navigate("/preciousItem")
                    }
                >

                    ← Back

                </button>

            </div>


            {/* ================= BODY ================= */}

            <div className="card-body">

                <form onSubmit={handleSubmit}>


                    {/* ================= NAME ================= */}

                    <div className="mb-3">

                        <label className="form-label">

                            PreciousItem Name

                        </label>


                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter PreciousItem name"
                            required
                        />

                    </div>


                    {/* ================= TYPE ================= */}

                    <div className="mb-3">

                        <label className="form-label">

                            PreciousItem Type

                        </label>


                        <select
                            className="form-select"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            required
                        >

                            <option value="GOLD">GOLD</option>

                            <option value="SILVER">SILVER</option>

                        </select>

                    </div>


                    {/* ================= DESCRIPTION ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Description
                        </label>
                        <textarea
                            className="form-control"
                            rows="4"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                        />

                    </div>
                    {/* ================= location ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Location
                        </label>
                        <textarea
                            className="form-control"
                            rows="4"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Enter location"
                        />

                    </div>


                    {/* ================= DOCUMENT ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Related Document
                        </label>

                        <select
                            className="form-select"
                            name="document"
                            value={form.document}
                            onChange={handleChange}
                            disabled={documentsLoading || loading}
                        >

                            <option value="">
                                {documentsLoading ? "Loading documents..." : "No related document"}
                            </option>

                            {documents.map(document => (
                                <option key={document._id} value={document._id}>
                                    {document.title}{document.documentNumber ? ` - ${document.documentNumber}` : ""}
                                </option>
                            ))}

                        </select>

                    </div>


                    {/* ================= SUBMIT ================= */}
                    <button type="submit" className="btn btn-primary" disabled={loading}> {loading ? "Please wait..." : "Save PreciousItem"}</button>

                </form>

            </div>

        </div>

    );

};

export default PreciousItemForm;
