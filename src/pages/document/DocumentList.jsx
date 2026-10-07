import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaDownload, FaEdit, FaEye, FaFileAlt, FaPlus, FaSearch, FaSync, FaTimes, FaTrash } from "react-icons/fa";
import { deleteDocument, downloadDocument, getDocuments } from "../../api/documentApi";
import Pagination from "../../components/common/Pagination";

const types = ["AADHAAR", "PAN", "PASSPORT", "DRIVING_LICENSE", "VOTER_ID", "INSURANCE", "BANK", "TAX", "PROPERTY", "MEDICAL", "OTHER"];
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-IN") : "-";
const label = (value) => value?.replaceAll("_", " ") || "OTHER";
const getPublicUrl = (item) => {
    if (item.storageType === "vercel-blob" && item.blobAccess === "public") {
        return item.blobUrl;
    }

    return item.fileUrl && !item.filePath ? item.fileUrl : "";
};

const getBlobUrl = (item) =>
    item.storageType === "vercel-blob" ? item.blobUrl || "" : "";

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [viewer, setViewer] = useState(null);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const params = { page, limit };
            if (search.trim()) params.search = search.trim();
            if (type) params.documentType = type;
            if (status !== "") params.status = status;
            const response = await getDocuments(params);
            const result = response?.data?.rows !== undefined ? response.data : response;
            setDocuments(Array.isArray(result?.rows) ? result.rows : []);
            setTotal(Number(result?.total || 0));
        } catch (error) {
            setDocuments([]);
            setTotal(0);
            alert(error?.response?.data?.message || error?.message || "Unable to load documents.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDocuments(); }, [page, search, type, status]);

    useEffect(() => () => {
        if (viewer?.isObjectUrl) window.URL.revokeObjectURL(viewer.url);
    }, [viewer]);

    const handleView = async (item) => {
        const publicUrl = getPublicUrl(item);
        if (publicUrl) {
            setViewer({
                url: publicUrl,
                name: item.originalName || item.title,
                mimeType: item.mimeType || "",
                isObjectUrl: false
            });
            return;
        }
        try {
            setDownloading(item._id);
            const blob = await downloadDocument(item._id);
            setViewer({
                url: window.URL.createObjectURL(blob),
                name: item.originalName || item.fileName || item.title,
                mimeType: blob.type || item.mimeType || "",
                isObjectUrl: true
            });
        } catch (error) {
            const blobUrl = getBlobUrl(item);
            if (blobUrl) {
                setViewer({
                    url: blobUrl,
                    name: item.originalName || item.fileName || item.title,
                    mimeType: item.mimeType || "",
                    isObjectUrl: false
                });
                return;
            }
            alert(error?.response?.data?.message || error?.message || "Unable to open document.");
        } finally {
            setDownloading(null);
        }
    };

    const handleDownload = async (item) => {
        const publicUrl = getPublicUrl(item);
        if (publicUrl) {
            window.open(publicUrl, "_blank", "noopener,noreferrer");
            return;
        }
        try {
            setDownloading(item._id);
            const blob = await downloadDocument(item._id);
            const url = window.URL.createObjectURL(blob);
            const anchor = window.document.createElement("a");
            anchor.href = url;
            anchor.download = item.originalName || item.fileName || "document";
            anchor.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            const blobUrl = getBlobUrl(item);
            if (blobUrl) {
                window.open(blobUrl, "_blank", "noopener,noreferrer");
                return;
            }
            alert(error?.response?.data?.message || error?.message || "Unable to download document.");
        } finally {
            setDownloading(null);
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Delete ${item.title}? This also removes its local file.`)) return;
        try {
            setDeleting(item._id);
            const response = await deleteDocument(item._id);
            if (!response?.success) throw new Error(response?.message || "Unable to delete document.");
            if (documents.length === 1 && page > 1) setPage(page - 1);
            else await loadDocuments();
        } catch (error) {
            alert(error?.response?.data?.message || error?.message || "Unable to delete document.");
        } finally {
            setDeleting(null);
        }
    };

    const clearFilters = () => { setSearch(""); setType(""); setStatus(""); setPage(1); };
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const canPreview = viewer?.mimeType === "application/pdf" || /\.pdf$/i.test(viewer?.name || "") || viewer?.mimeType?.startsWith("image/");
    const isImage = viewer?.mimeType?.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(viewer?.name || "");

    return <div className="container-fluid px-4 py-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
            <div><h2 className="mb-1">Documents</h2><div className="text-muted">Your stored important documents</div></div>
            <Link className="btn btn-primary" to="/documents/add"><FaPlus className="me-2" />Upload Document</Link>
        </div>
        <div className="card shadow-sm mb-4"><div className="card-body"><div className="row g-3 align-items-end">
            <div className="col-md-5"><label className="form-label">Search</label><div className="input-group"><span className="input-group-text"><FaSearch /></span><input className="form-control" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Title, number, or note" /></div></div>
            <div className="col-md-3"><label className="form-label">Type</label><select className="form-select" value={type} onChange={(event) => { setType(event.target.value); setPage(1); }}><option value="">All types</option>{types.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select></div>
            <div className="col-md-2"><label className="form-label">Status</label><select className="form-select" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="">All</option><option value="true">Active</option><option value="false">Inactive</option></select></div>
            <div className="col-md-2 d-flex gap-2"><button className="btn btn-outline-primary" type="button" title="Refresh" onClick={loadDocuments}><FaSync /></button><button className="btn btn-outline-secondary" type="button" onClick={clearFilters}>Clear</button></div>
        </div></div></div>
        <div className="card shadow-sm"><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr>
            <th>#</th>
            <th>Document</th>
            <th>Type</th>
            <th>Note</th>
            <th>Number</th>
            <th>Expiry</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
        </tr>
        </thead><tbody>
                {loading ? <tr><td colSpan="7" className="text-center py-5"><span className="spinner-border spinner-border-sm me-2" />Loading...</td></tr> : documents.length === 0 ? <tr>
                    <td colSpan="7" className="text-center text-muted py-5"><FaFileAlt className="me-2" />No documents found</td></tr> : documents.map((item, index) => <tr key={item._id}>
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td><div className="fw-semibold">{item.title}</div><small className="text-muted">{item.originalName || (item.fileUrl ? "External link" : "No file")}</small></td>
                        <td><span className="badge text-bg-light border">{label(item.documentType)}</span></td>
                        <td><span className="badge text-bg-light border">{label(item.note)}</span></td>
                        <td>{item.documentNumber || "-"}</td>
                        <td>{formatDate(item.expiryDate)}</td>
                        <td><span className={`badge ${item.status ? "text-bg-success" : "text-bg-secondary"}`}>{item.status ? "Active" : "Inactive"}</span></td>
                        <td><div className="d-flex justify-content-end gap-1"><button className="btn btn-outline-secondary btn-sm" title="View" onClick={() => handleView(item)} disabled={downloading === item._id || (!item.filePath && !item.fileUrl && !item.blobUrl)}><FaEye /></button><button className="btn btn-outline-primary btn-sm" title="Download" onClick={() => handleDownload(item)} disabled={downloading === item._id || (!item.filePath && !item.fileUrl && !item.blobUrl)}><FaDownload /></button><Link className="btn btn-outline-warning btn-sm" title="Edit" to={`/documents/edit/${item._id}`}><FaEdit /></Link><button className="btn btn-outline-danger btn-sm" title="Delete" onClick={() => handleDelete(item)} disabled={deleting === item._id}><FaTrash /></button></div></td></tr>)}
            </tbody></table></div><div className="card-footer bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
                <small className="text-muted">Showing {total ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of {total} documents</small>{total > limit && <Pagination page={page} limit={limit} total={total} onPageChange={(next) => next >= 1 && next <= totalPages && setPage(next)} />}</div></div>
        {viewer && <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 1060 }} onClick={() => setViewer(null)}><div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" onClick={(event) => event.stopPropagation()}><div className="modal-content"><div className="modal-header"><h5 className="modal-title text-truncate">{viewer.name}</h5><button className="btn-close" type="button" aria-label="Close" onClick={() => setViewer(null)} /></div><div className="modal-body bg-light p-0 d-flex justify-content-center align-items-center" style={{ minHeight: "65vh" }}>{canPreview ? isImage ? <img src={viewer.url} alt={viewer.name} className="img-fluid" style={{ maxHeight: "70vh" }} /> : <iframe title={viewer.name} src={viewer.url} className="w-100 border-0" style={{ height: "70vh" }} /> : <div className="text-center p-5"><FaFileAlt className="fs-1 text-muted mb-3" /><p className="mb-3">This file type cannot be previewed in the browser.</p><a className="btn btn-primary" href={viewer.url} download={viewer.name}>Download File</a></div>}</div><div className="modal-footer"><button className="btn btn-secondary" type="button" onClick={() => setViewer(null)}><FaTimes className="me-2" />Close</button></div></div></div></div>}
    </div>;
};

export default DocumentList;
