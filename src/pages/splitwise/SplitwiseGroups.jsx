import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaTrash, FaUsers } from "react-icons/fa";
import { notify } from "../../utils/notifications";
import { createSplitGroup, deleteSplitGroup, getSplitGroups, getSplitUsers, updateSplitGroup } from "../../api/splitwiseApi";
import "../../styles/splitwise.css";

const emptyForm = { name: "", description: "", currency: "INR", selectedUsers: [] };
const money = (amount, currency = "INR") => new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(amount || 0));

const SplitwiseGroups = () => {
    const [groups, setGroups] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
    const reset = () => { setForm(emptyForm); setEditingId(null); };
    const toggleContact = (id) => setForm((current) => ({ ...current, selectedUsers: current.selectedUsers.includes(id) ? current.selectedUsers.filter((item) => item !== id) : [...current.selectedUsers, id] }));

    const saveGroup = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            const base = { name: form.name.trim(), description: form.description.trim(), currency: form.currency };
            const response = editingId ? await updateSplitGroup(editingId, base) : await createSplitGroup({ ...base, members: form.selectedUsers.map((splitUserId) => ({ splitUserId })) });
            if (!response?.success) throw new Error(response?.message || "Unable to save group.");
            notify(response.message || "Group saved successfully.");
            reset();
            loadData();
        } catch (error) { notify(error?.response?.data?.message || error?.message || "Unable to save group."); }
        finally { setSaving(false); }
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

    return <div className="container-fluid px-4 py-4 splitwise-page">
        <div className="splitwise-header d-flex flex-wrap align-items-center justify-content-between gap-3"><div><div className="splitwise-kicker">Shared money</div><h3 className="splitwise-title">Shared Expenses</h3><p className="splitwise-subtitle">Track group spending and settle each balance with confidence.</p></div><Link className="btn btn-outline-primary splitwise-page-action" to="/splitwise/users"><FaUsers />Manage Contacts</Link></div>
        <div className="row g-4">
            <div className="col-xl-4"><div className="card splitwise-form-panel"><div className="card-body p-4"><h5 className="mb-3">{editingId ? "Edit Group" : "Create Group"}</h5>
                <form onSubmit={saveGroup} className="d-grid gap-3"><div><label className="form-label">Group Name</label><input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mathura Trip" /></div><div><label className="form-label">Description</label><textarea className="form-control" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div><div><label className="form-label">Currency</label><select className="form-select" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}><option value="INR">INR</option><option value="USD">USD</option></select></div>
                    {!editingId && <div><label className="form-label">Members</label><div className="splitwise-member-picker">{contacts.length === 0 ? <div className="small text-muted p-3">Create contacts first to add members.</div> : contacts.map((contact) => <label className="form-check d-flex gap-2" key={contact._id}><input className="form-check-input" type="checkbox" checked={form.selectedUsers.includes(contact._id)} onChange={() => toggleContact(contact._id)} /><span>{contact.name}<span className="text-muted ms-1">{contact.email || contact.phone ? `(${contact.email || contact.phone})` : ""}</span></span></label>)}</div></div>}
                    <div className="d-flex gap-2"><button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Group" : "Create Group"}</button>{editingId && <button type="button" className="btn btn-outline-secondary" onClick={reset}>Cancel</button>}</div>
                </form>
            </div></div></div>
            <div className="col-xl-8"><div className="row g-3">{loading ? <div className="col-12 text-center py-5"><span className="spinner-border text-primary" /></div> : groups.length === 0 ? <div className="col-12"><div className="border rounded p-5 text-center text-muted">No groups yet. Create your first shared-expense group.</div></div> : groups.map((group) => <div className="col-md-6" key={group._id}><div className="card splitwise-group-card h-100"><div className="card-body d-flex flex-column p-4"><div className="d-flex justify-content-between gap-2"><div><h5 className="mb-1">{group.name}</h5><div className="text-muted small">{group.description || "No description"}</div></div><span className="badge border align-self-start">{group.currency}</span></div><div className="mt-3 small"><FaUsers className="me-2 text-primary" />{group.members?.length || 0} members</div><div className="row g-2 mt-2"><div className="col-6"><div className="splitwise-total-box"><span>Total Fund</span><strong>{money(group.totalFund, group.currency)}</strong></div></div><div className="col-6"><div className="splitwise-total-box"><span>Total Expense</span><strong>{money(group.totalExpense, group.currency)}</strong></div></div></div><div className="d-flex gap-2 mt-auto pt-4"><Link className="btn btn-primary flex-grow-1" to={`/splitwise/groups/${group._id}`}>Open Group</Link><button type="button" className="btn btn-outline-primary" title="Edit group" onClick={() => { setEditingId(group._id); setForm({ name: group.name || "", description: group.description || "", currency: group.currency || "INR", selectedUsers: [] }); }}><FaEdit /></button><button type="button" className="btn btn-outline-danger" title="Delete group" onClick={() => removeGroup(group._id)}><FaTrash /></button></div></div></div></div>)}</div></div>
        </div>
    </div>;
};

export default SplitwiseGroups;
