import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaSync, FaTimes, FaTrash, FaUsers } from "react-icons/fa";
import { notify } from "../../utils/notifications";
import { createSplitUser, deleteSplitUser, getSplitUsers, updateSplitUser } from "../../api/splitwiseApi";
import Pagination from "../../components/common/Pagination";
import "../../styles/splitwise.css";

const emptyForm = { name: "", email: "", phone: "" };

const SplitwiseUsers = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const formRef = useRef(null);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getSplitUsers(search ? { search } : undefined);
            if (!response?.success) throw new Error(response?.message || "Unable to load contacts.");
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setUsers([]);
            notify(error?.response?.data?.message || error?.message || "Unable to load contacts.");
        } finally { setLoading(false); }
    }, [search]);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    const handleOpenCreateForm = () => {
        if (showForm && !editingId) {
            resetForm();
        } else {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
        }
    };

    const handleEdit = (user) => {
        setEditingId(user._id);
        setForm({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || ""
        });
        setShowForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    const saveUser = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            const payload = { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() };
            const response = editingId ? await updateSplitUser(editingId, payload) : await createSplitUser(payload);
            if (!response?.success) throw new Error(response?.message || "Unable to save contact.");
            notify(response.message || "Contact saved successfully.");
            resetForm();
            loadUsers();
        } catch (error) {
            notify(error?.response?.data?.message || error?.message || "Unable to save contact.");
        } finally { setSaving(false); }
    };

    const removeUser = async (id) => {
        if (!window.confirm("Delete this Splitwise contact?")) return;
        try {
            const response = await deleteSplitUser(id);
            if (!response?.success) throw new Error(response?.message || "Unable to delete contact.");
            notify(response.message || "Contact deleted successfully.");
            loadUsers();
        } catch (error) { notify(error?.response?.data?.message || error?.message || "Unable to delete contact."); }
    };

    const total = users.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * limit;
        return users.slice(start, start + limit);
    }, [users, page, limit]);

    return (
        <div className="container-fluid px-4 py-4 splitwise-page">
            <div className="splitwise-header d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                    <div className="splitwise-kicker">People</div>
                    <h3 className="splitwise-title">Splitwise Contacts</h3>
                    <p className="splitwise-subtitle">Maintain the people you share expenses with.</p>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary splitwise-page-action"
                        onClick={handleOpenCreateForm}
                    >
                        <FaPlus className="me-1" />
                        {showForm && !editingId ? "Close Form" : "New Contact"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card splitwise-form-panel shadow-sm mb-4" ref={formRef}>
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">{editingId ? "Edit Contact" : "Add Contact"}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={resetForm}
                            />
                        </div>
                        <form onSubmit={saveUser}>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">Name</label>
                                    <input
                                        className="form-control"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="e.g. john@example.com"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Phone</label>
                                    <input
                                        className="form-control"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="e.g. +91 9876543210"
                                    />
                                </div>
                                <div className="col-12 d-flex gap-2 pt-2">
                                    <button className="btn btn-primary" disabled={saving}>
                                        {saving ? "Saving..." : editingId ? "Update Contact" : "Add Contact"}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-body border-bottom p-3">
                    <div className="row g-2 align-items-center justify-content-between">
                        <div className="col-12 col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <FaSearch className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search name, email, or phone..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            setSearch("");
                                            setPage(1);
                                        }}
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-auto d-flex align-items-center gap-2">
                            <span className="small text-muted text-nowrap">
                                Total: <strong>{users.length}</strong> {users.length === 1 ? "contact" : "contacts"}
                            </span>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                title="Refresh contacts"
                                onClick={loadUsers}
                                disabled={loading}
                            >
                                <FaSync />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th width="60">#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th className="text-end" width="140">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <span className="spinner-border text-primary" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-5">
                                        <FaUsers className="me-2" />
                                        {search ? "No contacts match your search." : "No contacts found."}
                                        {!search && (
                                            <div className="mt-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => {
                                                        resetForm();
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    <FaPlus className="me-1" />Add First Contact
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user, index) => (
                                    <tr className="splitwise-contact-row" key={user._id}>
                                        <td className="text-muted small">
                                            {(page - 1) * limit + index + 1}
                                        </td>
                                        <td className="fw-semibold">{user.name}</td>
                                        <td>{user.email || "-"}</td>
                                        <td>{user.phone || "-"}</td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="Edit contact"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Delete contact"
                                                    onClick={() => removeUser(user._id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="card-footer d-flex justify-content-between align-items-center bg-white border-top py-3">
                        <small className="text-muted">
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} contacts
                        </small>
                        <Pagination
                            page={page}
                            limit={limit}
                            total={total}
                            onPageChange={(nextPage) => setPage(nextPage)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SplitwiseUsers;
