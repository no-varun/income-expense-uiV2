import { useCallback, useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash, FaUsers } from "react-icons/fa";
import { notify } from "../../utils/notifications";
import { createSplitUser, deleteSplitUser, getSplitUsers, updateSplitUser } from "../../api/splitwiseApi";
import "../../styles/splitwise.css";

const emptyForm = { name: "", email: "", phone: "" };

const SplitwiseUsers = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");

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

    const resetForm = () => { setForm(emptyForm); setEditingId(null); };
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

    return <div className="container-fluid px-4 py-4 splitwise-page">
        <div className="splitwise-header d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div><div className="splitwise-kicker">People</div><h3 className="splitwise-title">Splitwise Contacts</h3><p className="splitwise-subtitle">Maintain the people you share expenses with.</p></div>
            <button type="button" className="btn btn-primary splitwise-page-action" onClick={resetForm}><FaPlus />New Contact</button>
        </div>
        <div className="row g-4">
            <div className="col-lg-4"><div className="card splitwise-form-panel"><div className="card-body p-4">
                <h5 className="mb-3">{editingId ? "Edit Contact" : "Add Contact"}</h5>
                <form onSubmit={saveUser} className="d-grid gap-3">
                    <div><label className="form-label">Name</label><input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                    <div><label className="form-label">Email</label><input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                    <div><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                    <div className="d-flex gap-2"><button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : editingId ? "Update" : "Add Contact"}</button>{editingId && <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>}</div>
                </form>
            </div></div></div>
            <div className="col-lg-8"><div className="card shadow-sm"><div className="card-body border-bottom"><input className="form-control" placeholder="Search name, email, or phone" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                <div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th>Name</th><th>Email</th><th>Phone</th><th className="text-end">Action</th></tr></thead><tbody>
                    {loading ? <tr><td colSpan="4" className="text-center py-5"><span className="spinner-border text-primary" /></td></tr> : users.length === 0 ? <tr><td colSpan="4" className="text-center text-muted py-5"><FaUsers className="me-2" />No contacts found.</td></tr> : users.map((user) => <tr className="splitwise-contact-row" key={user._id}><td className="fw-semibold">{user.name}</td><td>{user.email || "-"}</td><td>{user.phone || "-"}</td><td className="text-end"><button type="button" className="btn btn-sm btn-outline-primary me-2" title="Edit contact" onClick={() => { setEditingId(user._id); setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" }); }}><FaEdit /></button><button type="button" className="btn btn-sm btn-outline-danger" title="Delete contact" onClick={() => removeUser(user._id)}><FaTrash /></button></td></tr>)}
                </tbody></table></div>
            </div></div>
        </div>
    </div>;
};

export default SplitwiseUsers;
