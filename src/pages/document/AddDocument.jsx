import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentForm from "../../components/document/DocumentForm";
import { createDocument } from "../../api/documentApi";

const emptyDocument = {
    title: "", documentType: "OTHER", documentNumber: "", issueDate: "",
    expiryDate: "", fileUrl: "", note: "", status: true
};

const AddDocument = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (form, file) => {
        const payload = new FormData();
        Object.entries(form).forEach(([key, value]) => payload.append(key, value));
        if (file) payload.append("document", file);
        try {
            setSaving(true);
            const response = await createDocument(payload);
            if (!response?.success) throw new Error(response?.message || "Unable to upload document.");
            alert(response.message || "Document uploaded successfully.");
            navigate("/documents");
        } catch (error) {
            alert(error?.response?.data?.message || error?.message || "Unable to upload document.");
        } finally {
            setSaving(false);
        }
    };

    return <div className="container-fluid px-4 py-4"><div className="d-flex justify-content-between align-items-center mb-4"><div><h2 className="mb-1">Upload Document</h2><div className="text-muted">Keep a secure local record of your important files</div></div></div><div className="card shadow-sm"><div className="card-body"><DocumentForm initialValues={emptyDocument} onSubmit={handleSubmit} submitLabel="Upload Document" saving={saving} /></div></div></div>;
};

export default AddDocument;
