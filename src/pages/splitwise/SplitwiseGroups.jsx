import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaSearch, FaSync, FaTimes, FaTrash, FaUsers } from "react-icons/fa";
import { notify } from "../../utils/notifications";
import { createSplitGroup, deleteSplitGroup, getSplitGroups, getSplitUsers, updateSplitGroup } from "../../api/splitwiseApi";
import Pagination from "../../components/common/Pagination";
import "../../styles/splitwise.css";

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = {
    name: "",
    description: "",
    currency: "INR",
    startDate: today(),
    endDate: today(),
    selectedUsers: []
};
const money = (amount, currency = "INR") => new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(amount || 0));

const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatDateRange = (start, end) => {
    if (!start && !end) return "-";
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    if (startStr && endStr) return startStr === endStr ? startStr : `${startStr} – ${endStr}`;
    return startStr || endStr;
};

const SplitwiseGroups = () => {
    const [groups, setGroups] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const formRef = useRef(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [groupResponse, userResponse] = await Promise.all([getSplitGroups(), getSplitUsers()]);
            if (!groupResponse?.success) throw new Error(groupResponse?.message || "Unable to load groups.");
            setGroups(Array.isArray(groupResponse.data) ? groupResponse.data : []);
            setContacts(userResponse?.success && Array.isArray(userResponse.data) ? userResponse.data : []);
        } catch (error) {
            notify(error?.response?.data?.message || error?.message || "Unable to load groups.");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const reset = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    const handleOpenCreateForm = () => {
        if (showForm && !editingId) {
            reset();
        } else {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
        }
    };

    const handleEdit = (group) => {
        setEditingId(group._id);
        setForm({
            name: group.name || "",
            description: group.description || "",
            currency: group.currency || "INR",
            startDate: group.startDate ? new Date(group.startDate).toISOString().slice(0, 10) : today(),
            endDate: group.endDate ? new Date(group.endDate).toISOString().slice(0, 10) : today(),
            selectedUsers: []
        });
        setShowForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    const toggleContact = (id) => setForm((current) => ({
        ...current,
        selectedUsers: current.selectedUsers.includes(id)
            ? current.selectedUsers.filter((item) => item !== id)
            : [...current.selectedUsers, id]
    }));

    const saveGroup = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            const base = {
                name: form.name.trim(),
                description: form.description.trim(),
                currency: form.currency,
                startDate: form.startDate || null,
                endDate: form.endDate || null
            };
            const response = editingId
                ? await updateSplitGroup(editingId, base)
                : await createSplitGroup({ ...base, members: form.selectedUsers.map((splitUserId) => ({ splitUserId })) });
            if (!response?.success) throw new Error(response?.message || "Unable to save group.");
            notify(response.message || "Group saved successfully.");
            reset();
            loadData();
        } catch (error) {
            notify(error?.response?.data?.message || error?.message || "Unable to save group.");
        } finally { setSaving(false); }
    };

    const removeGroup = async (id) => {
        if (!window.confirm("Delete this group and all its expenses and settlements?")) return;
        try {
            const response = await deleteSplitGroup(id);
            if (!response?.success) throw new Error(response?.message || "Unable to delete group.");
            notify(response.message || "Group deleted successfully.");
            loadData();
        } catch (error) { notify(error?.response?.data?.message || error?.message || "Unable to delete group."); }
    };

    const filteredGroups = useMemo(() => {
        if (!search.trim()) return groups;
        const q = search.toLowerCase();
        return groups.filter((g) =>
            (g.name && g.name.toLowerCase().includes(q)) ||
            (g.description && g.description.toLowerCase().includes(q))
        );
    }, [groups, search]);

    const total = filteredGroups.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginatedGroups = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredGroups.slice(start, start + limit);
    }, [filteredGroups, page, limit]);

    return (
        <div className="container-fluid px-4 py-4 splitwise-page">
            <div className="splitwise-header d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                    <div className="splitwise-kicker">Shared money</div>
                    <h3 className="splitwise-title">Shared Expenses</h3>
                    <p className="splitwise-subtitle">Track group spending and settle each balance with confidence.</p>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary splitwise-page-action"
                        onClick={handleOpenCreateForm}
                    >
                        <FaPlus className="me-1" />
                        {showForm && !editingId ? "Close Form" : "Create Group"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card splitwise-form-panel shadow-sm mb-4" ref={formRef}>
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">{editingId ? "Edit Group" : "Create Group"}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={reset}
                            />
                        </div>
                        <form onSubmit={saveGroup}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Group Name</label>
                                    <input
                                        className="form-control"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Mathura Trip"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.startDate}
                                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.endDate}
                                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <label className="form-label">Description</label>
                                    <input
                                        className="form-control"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="e.g. Weekend getaway expenses"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Currency</label>
                                    <select
                                        className="form-select"
                                        value={form.currency}
                                        onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                    >
                                        <option value="INR">INR</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                    </select>
                                </div>

                                {!editingId && (
                                    <div className="col-12">
                                        <label className="form-label">Members</label>
                                        <div className="splitwise-member-picker">
                                            {contacts.length === 0 ? (
                                                <div className="small text-muted p-3">
                                                    Create contacts first to add members, or add them later inside the group.
                                                </div>
                                            ) : (
                                                contacts.map((contact) => (
                                                    <label className="form-check d-flex gap-2" key={contact._id}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={form.selectedUsers.includes(contact._id)}
                                                            onChange={() => toggleContact(contact._id)}
                                                        />
                                                        <span>
                                                            {contact.name}
                                                            <span className="text-muted ms-1">
                                                                {contact.email || contact.phone ? `(${contact.email || contact.phone})` : ""}
                                                            </span>
                                                        </span>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="col-12 d-flex gap-2 pt-2">
                                    <button className="btn btn-primary" disabled={saving}>
                                        {saving ? "Saving..." : editingId ? "Update Group" : "Create Group"}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={reset}>
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
                                    placeholder="Search by group name or description..."
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
                                Total: <strong>{filteredGroups.length}</strong> {filteredGroups.length === 1 ? "group" : "groups"}
                            </span>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                title="Refresh groups"
                                onClick={loadData}
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
                                <th>Group Name</th>
                                <th>Dates</th>
                                <th>Description</th>
                                <th>Members</th>
                                <th>Currency</th>
                                <th className="text-end">Total Fund</th>
                                <th className="text-end">Total Expense</th>
                                <th className="text-end" width="180">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-5">
                                        <span className="spinner-border text-primary" />
                                    </td>
                                </tr>
                            ) : filteredGroups.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center text-muted py-5">
                                        <FaUsers className="me-2" />
                                        {search ? "No groups match your search." : "No groups yet. Create your first shared-expense group."}
                                        {!search && (
                                            <div className="mt-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => {
                                                        reset();
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    <FaPlus className="me-1" />Create Group
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                paginatedGroups.map((group, index) => (
                                    <tr key={group._id}>
                                        <td className="text-muted small">
                                            {(page - 1) * limit + index + 1}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/splitwise/groups/${group._id}`}
                                                className="fw-semibold text-decoration-none text-dark"
                                            >
                                                {group.name}
                                            </Link>
                                        </td>
                                        <td className="text-muted small text-nowrap">
                                            {formatDateRange(group.startDate, group.endDate)}
                                        </td>
                                        <td className="text-muted small">
                                            {group.description || "-"}
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                <FaUsers className="me-1 text-primary" />
                                                {group.members?.length || 0}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                {group.currency}
                                            </span>
                                        </td>
                                        <td className="text-end fw-semibold balance-credit">
                                            {money(group.totalFund, group.currency)}
                                        </td>
                                        <td className="text-end fw-semibold">
                                            {money(group.totalExpense, group.currency)}
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-1">
                                                <Link
                                                    to={`/splitwise/groups/${group._id}`}
                                                    className="btn btn-sm btn-primary"
                                                    title="Open Group"
                                                >
                                                    Open
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="Edit group"
                                                    onClick={() => handleEdit(group)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Delete group"
                                                    onClick={() => removeGroup(group._id)}
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
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} groups
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

export default SplitwiseGroups;
