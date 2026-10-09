import { useState } from "react";
import { Link } from "react-router-dom";

const documentTypes = [
    "AADHAAR", "PAN", "PASSPORT", "DRIVING_LICENSE", "VOTER_ID",
    "INSURANCE", "BANK", "TAX", "PROPERTY", "MEDICAL", "OTHER", "PRECIOUS"
];

const DocumentForm = ({ initialValues, onSubmit, submitLabel, saving }) => {
    const [form, setForm] = useState(initialValues);
    const [file, setFile] = useState(null);

    const change = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const submit = async (event) => {
        event.preventDefault();
        if (!form.title.trim()) {
            alert("Document title is required.");
            return;
        }
        if (!file && !form.fileUrl.trim() && !initialValues._id) {
            alert("Please select a document file or provide a file URL.");
            return;
        }
        await onSubmit(form, file);
    };

    return (
        <form onSubmit={submit}>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Title <span className="text-danger">*</span></label>
                    <input className="form-control" name="title" value={form.title} onChange={change} disabled={saving} placeholder="e.g. PAN Card" />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Document Type</label>
                    <select className="form-select" name="documentType" value={form.documentType} onChange={change} disabled={saving}>
                        {documentTypes.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Document Number</label>
                    <input className="form-control" name="documentNumber" value={form.documentNumber} onChange={change} disabled={saving} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Document File</label>
                    <input className="form-control" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} disabled={saving} />
                    <div className="form-text">PDF, Word, Excel, JPG, PNG, or WebP. Maximum 10 MB.</div>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Issue Date</label>
                    <input className="form-control" type="date" name="issueDate" value={form.issueDate} onChange={change} disabled={saving} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Expiry Date</label>
                    <input className="form-control" type="date" name="expiryDate" value={form.expiryDate} onChange={change} disabled={saving} />
                </div>
                <div className="col-12">
                    <label className="form-label">External File URL</label>
                    <input className="form-control" type="text" name="fileUrl" value={form.fileUrl} onChange={change} disabled={saving} placeholder="Optional link when no local file is needed" />
                </div>
                <div className="col-12">
                    <label className="form-label">Note</label>
                    <textarea className="form-control" name="note" rows="3" value={form.note} onChange={change} disabled={saving} />
                </div>
                <div className="col-12">
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="documentStatus" name="status" checked={form.status} onChange={change} disabled={saving} />
                        <label className="form-check-label" htmlFor="documentStatus">Active document</label>
                    </div>
                </div>
            </div>
            <div className="d-flex gap-2 mt-4">
                <button className="btn btn-success" type="submit" disabled={saving}>
                    {saving ? "Saving..." : submitLabel}
                </button>
                <Link className="btn btn-secondary" to="/documents">Cancel</Link>
            </div>
        </form>
    );
};

export default DocumentForm;
