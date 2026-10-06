import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DocumentForm from "../../components/document/DocumentForm";
import { getDocumentById, updateDocument } from "../../api/documentApi";

const dateValue = (value) => value ? new Date(value).toISOString().slice(0, 10) : "";

const EditDocument = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getDocumentById(id);
                const value = response?.data?.data ?? response?.data;
                if (!response?.success || !value) throw new Error(response?.message || "Document not found.");
                setDocument({ ...value, issueDate: dateValue(value.issueDate), expiryDate: dateValue(value.expiryDate), fileUrl: value.fileUrl || "", note: value.note || "", documentNumber: value.documentNumber || "", status: value.status !== false });
            } catch (error) {
                alert(error?.response?.data?.message || error?.message || "Unable to load document.");
                navigate("/documents");
            }
        };
        load();
    }, [id, navigate]);

    const handleSubmit = async (form, file) => {
        const payload = new FormData();
        Object.entries(form).forEach(([key, value]) => { if (key !== "_id") payload.append(key, value); });
        if (file) payload.append("document", file);
        try {
            setSaving(true);
            const response = await updateDocument(id, payload);
            if (!response?.success) throw new Error(response?.message || "Unable to update document.");
            alert(response.message || "Document updated successfully.");
            navigate("/documents");
        } catch (error) {
            alert(error?.response?.data?.message || error?.message || "Unable to update document.");
        } finally {
            setSaving(false);
        }
    };

    if (!document) return <div className="container-fluid px-4 py-5 text-center"><div className="spinner-border text-primary" /><div className="text-muted mt-2">Loading document...</div></div>;
    return <div className="container-fluid px-4 py-4"><div className="d-flex justify-content-between align-items-center mb-4"><div><h2 className="mb-1">Edit Document</h2><div className="text-muted">{document.originalName || "Update document details"}</div></div><Link className="btn btn-secondary" to="/documents">Back</Link></div><div className="card shadow-sm"><div className="card-body"><DocumentForm initialValues={document} onSubmit={handleSubmit} submitLabel="Update Document" saving={saving} /></div></div></div>;
};

export default EditDocument;
