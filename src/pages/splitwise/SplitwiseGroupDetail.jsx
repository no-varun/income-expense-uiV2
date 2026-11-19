import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCopy, FaPlus, FaTrash, FaUserPlus } from "react-icons/fa";
import { notify } from "../../utils/notifications";
import {
    addSplitGroupMember, createSplitExpense, createSplitSettlement, createSplitTransfer,
    deleteSplitExpense, deleteSplitSettlement, deleteSplitTransfer, getSplitBalances,
    getSplitExpenses, getSplitGroup, getSplitSettlements, getSplitSuggestions,
    getSplitTransfers, getSplitUsers, removeSplitGroupMember
} from "../../api/splitwiseApi";
import "../../styles/splitwise.css";

const money = (amount, currency = "INR") => new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(amount || 0));
const today = () => new Date().toISOString().slice(0, 10);
const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};
const formatDateRange = (start, end) => {
    if (!start && !end) return null;
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    if (startStr && endStr) return startStr === endStr ? startStr : `${startStr} – ${endStr}`;
    return startStr || endStr;
};
const extractId = (value) => (typeof value === "object" && value !== null ? value._id : value) || "";
const buildEqualPercentages = (participantIds = []) => {
    const count = participantIds.length;
    if (!count) return {};
    const baseBasisPoints = Math.floor(10000 / count);
    const remainder = 10000 - baseBasisPoints * count;
    return participantIds.reduce((acc, memberId, index) => {
        const pct = (baseBasisPoints + (index < remainder ? 1 : 0)) / 100;
        acc[memberId] = String(Number(pct.toFixed(2)));
        return acc;
    }, {});
};

const SplitwiseGroupDetail = () => {
    const { id, section } = useParams();
    const activeSection = ["overview", "members", "expenses", "funds", "settlements"].includes(section) ? section : "overview";
    const [group, setGroup] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [settlements, setSettlements] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [balances, setBalances] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingExpense, setSavingExpense] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [templateExpenseId, setTemplateExpenseId] = useState("");
    const [memberId, setMemberId] = useState("");
    const [expense, setExpense] = useState({ description: "", amount: "", paidBy: "", splitType: "EQUAL", date: today(), note: "", participants: [], values: {} });
    const [settlement, setSettlement] = useState({ fromMember: "", toMember: "", amount: "", date: today(), note: "" });
    const [transfer, setTransfer] = useState({ fromMember: "", toMember: "", amount: "", date: today(), note: "" });

    const loadData = useCallback(async ({ resetParticipants = false } = {}) => {
        try {
            setLoading(true);
            const [groupRes, usersRes, expenseRes, settlementRes, transferRes, balanceRes, suggestionRes] = await Promise.all([
                getSplitGroup(id), getSplitUsers(), getSplitExpenses(id, { limit: 50 }), getSplitSettlements(id, { limit: 50 }), getSplitTransfers(id, { limit: 50 }), getSplitBalances(id), getSplitSuggestions(id)
            ]);
            if (!groupRes?.success) throw new Error(groupRes?.message || "Unable to load group.");
            const nextGroup = groupRes.data;
            const nextMemberIds = (nextGroup.members || []).map((member) => member._id);
            setGroup(nextGroup);
            setContacts(usersRes?.success && Array.isArray(usersRes.data) ? usersRes.data : []);
            setExpenses(expenseRes?.success && Array.isArray(expenseRes.data?.rows) ? expenseRes.data.rows : []);
            setSettlements(settlementRes?.success && Array.isArray(settlementRes.data?.rows) ? settlementRes.data.rows : []);
            setTransfers(transferRes?.success && Array.isArray(transferRes.data?.rows) ? transferRes.data.rows : []);
            setBalances(balanceRes?.success && Array.isArray(balanceRes.data?.members) ? balanceRes.data.members : []);
            setSuggestions(suggestionRes?.success && Array.isArray(suggestionRes.data?.suggestions) ? suggestionRes.data.suggestions : []);
            setExpense((current) => {
                const validParticipants = resetParticipants
                    ? nextMemberIds
                    : current.participants.filter((participantId) => nextMemberIds.includes(participantId));
                const nextParticipants = validParticipants.length ? validParticipants : nextMemberIds;
                const nextPaidBy = nextMemberIds.includes(current.paidBy) ? current.paidBy : (nextMemberIds[0] || "");
                const equalValues = buildEqualPercentages(nextParticipants);
                const hasAllValues = nextParticipants.every((participantId) => current.values[participantId] !== undefined && current.values[participantId] !== "");
                return {
                    ...current,
                    paidBy: nextPaidBy,
                    participants: nextParticipants,
                    values: resetParticipants || !hasAllValues ? equalValues : current.values
                };
            });
        } catch (error) { notify(error?.response?.data?.message || error?.message || "Unable to load group."); }
        finally { setLoading(false); }
    }, [id]);

    useEffect(() => { loadData(); }, [loadData]);
    useEffect(() => { setShowExpenseForm(false); setTemplateExpenseId(""); }, [id]);
    const members = useMemo(() => group?.members || [], [group?.members]);
    const selectedParticipants = useMemo(() => members.filter((member) => expense.participants.includes(member._id)), [expense.participants, members]);
    const equalPercentages = useMemo(() => buildEqualPercentages(selectedParticipants.map((member) => member._id)), [selectedParticipants]);
    const totalPercentage = useMemo(() => selectedParticipants.reduce((sum, member) => {
        const raw = expense.splitType === "EQUAL" ? equalPercentages[member._id] : (expense.values[member._id] ?? equalPercentages[member._id]);
        const parsed = Number(raw);
        return sum + (Number.isFinite(parsed) ? parsed : 0);
    }, 0), [equalPercentages, expense.splitType, expense.values, selectedParticipants]);
    const equalShareLabel = selectedParticipants.length ? Number((100 / selectedParticipants.length).toFixed(2)) : 0;
    const getMemberName = (value, fallback = "Member") => {
        if (typeof value === "object" && value !== null) {
            if (value.name) return value.name;
            if (value.memberName) return value.memberName;
            if (value.splitUser?.name) return value.splitUser.name;
        }
        const targetId = String(extractId(value) || "");
        if (!targetId) return fallback;
        const matchedMember = members.find((member) => String(member._id) === targetId || String(extractId(member.splitUser)) === targetId);
        if (matchedMember?.name) return matchedMember.name;
        const matchedContact = contacts.find((contact) => String(contact._id) === targetId);
        return matchedContact?.name || fallback;
    };
    const getExpensePayerId = (item) => {
        if (Array.isArray(item?.payments) && item.payments.length > 0) {
            return extractId(item.payments[0]?.member);
        }
        return extractId(item?.paidBy ?? item?.paidByMember);
    };
    const getExpensePayerName = (item) => {
        if (Array.isArray(item?.payments) && item.payments.length > 0) {
            if (item.payments.length === 1) return getMemberName(item.payments[0]?.member);
            return item.payments.map((payment) => `${getMemberName(payment.member)} (${money(payment.amount, group?.currency)})`).join(", ");
        }
        return item?.paidByName || getMemberName(item?.paidBy ?? item?.paidByMember);
    };
    const formatExpenseMembers = (item) => {
        const rawSplits = Array.isArray(item.splits) ? item.splits : [];
        if (!rawSplits.length) return "—";
        return rawSplits
            .map((split) => {
                const name = split.memberName || split.name || getMemberName(split.member ?? split.memberId);
                if (item.splitType === "PERCENTAGE" && split.percentage !== null && split.percentage !== undefined && Number.isFinite(Number(split.percentage))) {
                    return `${name} (${Number(Number(split.percentage).toFixed(2))}%)`;
                }
                return name;
            })
            .join(", ");
    };
    const updateExpense = (field, value) => setExpense((current) => ({ ...current, [field]: value }));
    const handleSplitTypeChange = (nextSplitType) => setExpense((current) => {
        const orderedParticipants = members.filter((member) => current.participants.includes(member._id)).map((member) => member._id);
        return { ...current, splitType: nextSplitType, values: buildEqualPercentages(orderedParticipants) };
    });
    const toggleParticipant = (member) => setExpense((current) => {
        const nextParticipantSet = current.participants.includes(member._id)
            ? current.participants.filter((item) => item !== member._id)
            : [...current.participants, member._id];
        const orderedParticipants = members.filter((item) => nextParticipantSet.includes(item._id)).map((item) => item._id);
        return { ...current, participants: orderedParticipants, values: buildEqualPercentages(orderedParticipants) };
    });
    const fillFromPreviousExpense = (sourceExpenseId) => {
        setTemplateExpenseId(sourceExpenseId);
        const memberIds = members.map((member) => member._id);
        if (!sourceExpenseId) {
            setExpense({
                description: "",
                amount: "",
                paidBy: memberIds[0] || "",
                splitType: "EQUAL",
                date: today(),
                note: "",
                participants: memberIds,
                values: buildEqualPercentages(memberIds)
            });
            return;
        }
        const source = expenses.find((item) => item._id === sourceExpenseId);
        if (!source) return;

        const rawSplits = Array.isArray(source.splits) ? source.splits : [];
        const splitByMember = new Map();
        rawSplits.forEach((split) => {
            const splitMemberId = extractId(split.member ?? split.memberId);
            if (splitMemberId && memberIds.includes(splitMemberId)) {
                splitByMember.set(splitMemberId, split);
            }
        });

        const nextParticipants = splitByMember.size
            ? memberIds.filter((participantId) => splitByMember.has(participantId))
            : memberIds;
        const sourcePaidBy = getExpensePayerId(source);
        const nextPaidBy = memberIds.includes(sourcePaidBy) ? sourcePaidBy : (memberIds[0] || "");
        const sourceAmount = Number(source.amount);

        let nextSplitType = source.splitType === "PERCENTAGE" ? "PERCENTAGE" : "EQUAL";
        let nextValues = buildEqualPercentages(nextParticipants);

        if (source.splitType === "PERCENTAGE" && nextParticipants.length === rawSplits.length) {
            const hasPercentages = nextParticipants.every((participantId) => {
                const rawPct = splitByMember.get(participantId)?.percentage;
                return rawPct !== null && rawPct !== undefined && Number.isFinite(Number(rawPct));
            });
            if (hasPercentages) {
                nextValues = nextParticipants.reduce((acc, participantId) => {
                    const pct = Number(splitByMember.get(participantId)?.percentage);
                    acc[participantId] = String(Number(pct.toFixed(2)));
                    return acc;
                }, {});
            }
        } else if (source.splitType === "EXACT" && nextParticipants.length === rawSplits.length && Number.isFinite(sourceAmount) && sourceAmount > 0) {
            const hasAmounts = nextParticipants.every((participantId) => {
                const rawAmt = splitByMember.get(participantId)?.amount;
                return rawAmt !== null && rawAmt !== undefined && Number.isFinite(Number(rawAmt)) && Number(rawAmt) >= 0;
            });
            if (hasAmounts) {
                nextSplitType = "PERCENTAGE";
                nextValues = nextParticipants.reduce((acc, participantId) => {
                    const splitAmt = Number(splitByMember.get(participantId)?.amount);
                    acc[participantId] = String(Number(((splitAmt / sourceAmount) * 100).toFixed(2)));
                    return acc;
                }, {});
            }
        }

        setExpense({
            description: source.description || "",
            amount: source.amount !== undefined && source.amount !== null ? String(source.amount) : "",
            paidBy: nextPaidBy,
            splitType: nextSplitType,
            date: today(),
            note: source.note || "",
            participants: nextParticipants,
            values: nextValues
        });
        setShowExpenseForm(true);
    };

    const addMember = async () => {
        if (!memberId) return;
        try {
            const response = await addSplitGroupMember(id, { splitUserId: memberId });
            if (!response?.success) throw new Error(response?.message || "Unable to add member.");
            notify(response.message || "Member added successfully.");
            setMemberId("");
            loadData({ resetParticipants: true });
        } catch (error) { notify(error?.response?.data?.message || error?.message || "Unable to add member."); }
    };

    const addExpense = async (event) => {
        event.preventDefault();
        const amount = Number(expense.amount);
        if (!expense.description.trim() || !Number.isFinite(amount) || amount <= 0 || !expense.paidBy || selectedParticipants.length === 0) {
            notify("Enter an expense, payer, amount, and at least one participant.");
            return;
        }
        if (expense.splitType === "PERCENTAGE") {
            const percentages = selectedParticipants.map((member) => Number(expense.values[member._id] ?? equalPercentages[member._id]));
            if (percentages.some((pct) => !Number.isFinite(pct) || pct < 0 || pct > 100)) {
                notify("Enter a valid percentage between 0 and 100 for each included member.");
                return;
            }
            const sum = percentages.reduce((acc, pct) => acc + pct, 0);
            if (Math.abs(sum - 100) > 0.01) {
                notify(`Percentages must add up to 100% (currently ${Number(sum.toFixed(2))}%).`);
                return;
            }
        }
        const splits = selectedParticipants.map((member) => ({
            member: member._id,
            ...(expense.splitType === "PERCENTAGE" ? { percentage: Number(expense.values[member._id] ?? equalPercentages[member._id] ?? 0) } : {})
        }));
        try {
            setSavingExpense(true);
            const response = await createSplitExpense(id, { description: expense.description.trim(), amount, paidBy: expense.paidBy, splitType: expense.splitType, splits, date: expense.date, note: expense.note.trim() });
            if (!response?.success) throw new Error(response?.message || "Unable to add expense.");
            notify(response.message || "Expense added successfully.");
            const memberIds = members.map((member) => member._id);
            setExpense({ description: "", amount: "", paidBy: members[0]?._id || "", splitType: "EQUAL", date: today(), note: "", participants: memberIds, values: buildEqualPercentages(memberIds) });
            setTemplateExpenseId("");
            setShowExpenseForm(false);
            loadData();
        } catch (error) { notify(error?.response?.data?.message || error?.message || "Unable to add expense."); }
        finally { setSavingExpense(false); }
    };

    const saveSettlement = async (event) => {
        event.preventDefault();
        try {
            const response = await createSplitSettlement(id, { ...settlement, amount: Number(settlement.amount) });
            if (!response?.success) throw new Error(response?.message || "Unable to record settlement.");
            notify(response.message || "Settlement recorded successfully.");
            setSettlement({ fromMember: "", toMember: "", amount: "", date: today(), note: "" });
            loadData();
        } catch (error) { notify(error?.response?.data?.message || error?.message || "Unable to record settlement."); }
    };

    const saveTransfer = async (event) => {
        event.preventDefault();
        try {
            const response = await createSplitTransfer(id, { ...transfer, amount: Number(transfer.amount) });
            if (!response?.success) throw new Error(response?.message || "Unable to record tour advance.");
            notify(response.message || "Tour advance recorded successfully.");
            setTransfer({ fromMember: "", toMember: "", amount: "", date: today(), note: "" });
            loadData();
        } catch (error) { notify(error?.response?.data?.message || error?.message || "Unable to record tour advance."); }
    };

    const remove = async (action, message, reloadOptions) => {
        if (!window.confirm(message)) return;
        try { const response = await action(); if (!response?.success) throw new Error(response?.message || "Unable to delete."); notify(response.message || "Deleted successfully."); loadData(reloadOptions); } catch (error) { notify(error?.response?.data?.message || error?.message || "Unable to delete."); }
    };
    const availableContacts = contacts.filter((contact) => !members.some((member) => String(member.splitUser) === contact._id));

    if (loading && !group) return <div className="container-fluid px-4 py-5 text-center"><span className="spinner-border text-primary" /></div>;
    if (!group) return <div className="container-fluid px-4 py-4"><Link to="/splitwise" className="btn btn-outline-secondary"><FaArrowLeft className="me-2" />Back to Groups</Link></div>;

    return <div className="container-fluid px-4 py-4 splitwise-page" data-splitwise-section={activeSection}>
        <div className="splitwise-header d-flex flex-wrap align-items-center justify-content-between gap-3"><div><Link to="/splitwise" className="splitwise-back-link text-decoration-none"><FaArrowLeft className="me-1" />All groups</Link><div className="splitwise-kicker mt-2">Group workspace</div><h3 className="splitwise-title">{group.name}</h3><p className="splitwise-subtitle">{group.description || "Shared expense workspace"}</p>{formatDateRange(group.startDate, group.endDate) && <div className="small text-muted mt-1">📅 {formatDateRange(group.startDate, group.endDate)}</div>}</div><span className="badge bg-light text-dark border fs-6">{group.currency}</span></div>
        <nav className="splitwise-section-nav" aria-label="Group sections">{[["overview", "Overview"], ["members", "Members"], ["expenses", "Expenses"], ["funds", "Tour Fund"], ["settlements", "Settle Up"]].map(([key, label]) => <Link key={key} to={key === "overview" ? `/splitwise/groups/${id}` : `/splitwise/groups/${id}/${key}`} className={activeSection === key ? "is-active" : ""}>{label}</Link>)}</nav>
        <div className="row g-3 mb-4"><div className="col-sm-6"><div className="card splitwise-total-card h-100"><div className="card-body p-3"><div className="small text-muted">Total Tour Fund</div><div className="fs-5 fw-semibold balance-credit">{money(group.totalFund, group.currency)}</div><div className="small text-muted">Money sent to members for tour spending</div></div></div></div><div className="col-sm-6"><div className="card splitwise-total-card h-100"><div className="card-body p-3"><div className="small text-muted">Total Expense Till Date</div><div className="fs-5 fw-semibold">{money(group.totalExpense, group.currency)}</div><div className="small text-muted">All shared expenses recorded in this group</div></div></div></div></div>
        <div className="row g-3 mb-4">{balances.map((member) => <div className="col-sm-6 col-lg-3" key={member._id}><div className={`card splitwise-balance-card h-100 ${member.balance > 0 ? "is-credit" : member.balance < 0 ? "is-debit" : ""}`}><div className="card-body p-3"><div className="fw-semibold text-truncate">{member.name}</div><div className={`mt-1 fw-semibold ${member.balance > 0 ? "balance-credit" : member.balance < 0 ? "balance-debit" : "text-muted"}`}>{member.balance > 0 ? "Gets " : member.balance < 0 ? "Owes " : "Settled "}{money(Math.abs(member.balance), group.currency)}</div><div className="splitwise-balance-breakdown">Expense share {money(member.expenseShare, group.currency)} · Paid {money(member.expensePaid, group.currency)}{Number(member.tourFundSent) > 0 && <><br />Tour contribution {money(member.tourFundSent, group.currency)}</>}{Number(member.tourFundReceived) > 0 && <><br />Tour fund received {money(member.tourFundReceived, group.currency)}</>}</div></div></div></div>)}</div>
        <div className="splitwise-workspace"><div className="splitwise-stack">
            <div className="card"><div className="card-body p-4"><div className="splitwise-section-heading"><span>Members</span><FaUserPlus className="text-primary" /></div><div className="input-group mb-3"><select className="form-select" value={memberId} onChange={(e) => setMemberId(e.target.value)}><option value="">Add contact to group</option>{availableContacts.map((contact) => <option key={contact._id} value={contact._id}>{contact.name}</option>)}</select><button type="button" className="btn btn-outline-primary" disabled={!memberId} onClick={addMember}>Add</button></div>{members.map((member) => <div className="splitwise-member-row" key={member._id}><div><div className="fw-semibold">{member.name}</div><div className="small text-muted">{member.email || member.phone || ""}</div></div><button type="button" className="btn btn-sm btn-outline-danger" title="Remove member" onClick={() => remove(() => removeSplitGroupMember(id, member._id), "Remove this member? Members used in expenses cannot be removed.", { resetParticipants: true })}><FaTrash /></button></div>)}</div></div>
            <div className="card shadow-sm"><div className="card-body"><h5 className="mb-3">Settle Up</h5><form onSubmit={saveSettlement} className="d-grid gap-2"><select className="form-select" required value={settlement.fromMember} onChange={(e) => setSettlement({ ...settlement, fromMember: e.target.value })}><option value="">Who paid?</option>{members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}</select><select className="form-select" required value={settlement.toMember} onChange={(e) => setSettlement({ ...settlement, toMember: e.target.value })}><option value="">Who received?</option>{members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}</select><input type="number" min="0.01" step="0.01" required className="form-control" placeholder="Amount" value={settlement.amount} onChange={(e) => setSettlement({ ...settlement, amount: e.target.value })} /><input type="date" className="form-control" value={settlement.date} onChange={(e) => setSettlement({ ...settlement, date: e.target.value })} /><button className="btn btn-success">Record Settlement</button></form></div></div>
            <div className="card"><div className="card-body p-4"><h5 className="mb-1">Send Tour Money</h5><p className="small text-muted mb-3">Record a member's trip contribution. It is adjusted automatically against their expense share.</p><form onSubmit={saveTransfer} className="d-grid gap-2"><select className="form-select" required value={transfer.fromMember} onChange={(e) => setTransfer({ ...transfer, fromMember: e.target.value })}><option value="">Who is sending?</option>{members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}</select><select className="form-select" required value={transfer.toMember} onChange={(e) => setTransfer({ ...transfer, toMember: e.target.value })}><option value="">Who will spend it?</option>{members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}</select><input type="number" min="0.01" step="0.01" required className="form-control" placeholder="Amount" value={transfer.amount} onChange={(e) => setTransfer({ ...transfer, amount: e.target.value })} /><input type="date" className="form-control" value={transfer.date} onChange={(e) => setTransfer({ ...transfer, date: e.target.value })} /><input className="form-control" placeholder="Note (optional)" value={transfer.note} onChange={(e) => setTransfer({ ...transfer, note: e.target.value })} /><button className="btn btn-outline-primary">Record Tour Contribution</button></form></div></div>
        </div><div className="splitwise-stack">
            <div className="card">
                <div className="card-body p-4">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <div>
                            <h5 className="mb-0">Add Expense</h5>
                            {!showExpenseForm && <div className="small text-muted">Record a shared expense for this group</div>}
                        </div>
                        <button
                            type="button"
                            className={`btn ${showExpenseForm ? "btn-outline-secondary" : "btn-primary"}`}
                            disabled={!members.length && !showExpenseForm}
                            onClick={() => setShowExpenseForm((open) => !open)}
                        >
                            {showExpenseForm ? "Close" : <><FaPlus className="me-2" />Add Expense</>}
                        </button>
                    </div>
                    {showExpenseForm && (
                        <form onSubmit={addExpense} className="mt-3 pt-3 border-top">
                            <div className="row g-3">
                                {expenses.length > 0 && (
                                    <div className="col-12">
                                        <label className="form-label">Fill from previous expense (optional)</label>
                                        <select className="form-select" value={templateExpenseId} onChange={(e) => fillFromPreviousExpense(e.target.value)}>
                                            <option value="">Start blank</option>
                                            {expenses.map((item) => (
                                                <option key={item._id} value={item._id}>
                                                    {item.description} — {money(item.amount, group.currency)} · Paid by {getExpensePayerName(item)} ({new Date(item.date).toLocaleDateString("en-IN")})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="col-md-6"><label className="form-label">Description</label><input className="form-control" required value={expense.description} onChange={(e) => updateExpense("description", e.target.value)} placeholder="e.g. Hotel" /></div>
                                <div className="col-md-3"><label className="form-label">Amount</label><input type="number" min="0.01" step="0.01" className="form-control" required value={expense.amount} onChange={(e) => updateExpense("amount", e.target.value)} /></div>
                                <div className="col-md-3"><label className="form-label">Date</label><input type="date" className="form-control" value={expense.date} onChange={(e) => updateExpense("date", e.target.value)} /></div>
                                <div className="col-md-6"><label className="form-label">Paid by</label><select className="form-select" value={expense.paidBy} onChange={(e) => updateExpense("paidBy", e.target.value)}>{members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}</select></div>
                                <div className="col-md-6">
                                    <label className="form-label">Split method</label>
                                    <select className="form-select" value={expense.splitType} onChange={(e) => handleSplitTypeChange(e.target.value)}>
                                        <option value="EQUAL">Split equally</option>
                                        <option value="PERCENTAGE">Percentages</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Included members</label>
                                    <div className="d-flex flex-wrap gap-3">{members.map((m) => <label className="form-check" key={m._id}><input className="form-check-input" type="checkbox" checked={expense.participants.includes(m._id)} onChange={() => toggleParticipant(m)} /><span className="form-check-label ms-1">{m.name}</span></label>)}</div>
                                </div>
                                {selectedParticipants.length > 0 && (
                                    <div className="col-12">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <span className="small text-muted">
                                                {expense.splitType === "EQUAL" ? `Equal split (${equalShareLabel}% per member)` : "Percentage split"}
                                            </span>
                                            <span className={`small fw-semibold ${Math.abs(totalPercentage - 100) > 0.01 ? "text-danger" : "text-muted"}`}>
                                                Total: {Number(totalPercentage.toFixed(2))}%
                                            </span>
                                        </div>
                                        <div className="row g-2">
                                            {selectedParticipants.map((m) => {
                                                const pctValue = expense.splitType === "EQUAL"
                                                    ? (equalPercentages[m._id] ?? "")
                                                    : (expense.values[m._id] ?? equalPercentages[m._id] ?? "");
                                                return (
                                                    <div className="col-md-4" key={m._id}>
                                                        <label className="form-label">{m.name} (%)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            className="form-control"
                                                            disabled={expense.splitType === "EQUAL"}
                                                            value={pctValue}
                                                            onChange={(e) => updateExpense("values", { ...expense.values, [m._id]: e.target.value })}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className="col-12"><label className="form-label">Note</label><input className="form-control" value={expense.note} onChange={(e) => updateExpense("note", e.target.value)} /></div>
                                <div className="col-12 d-flex gap-2">
                                    <button className="btn btn-primary" disabled={savingExpense || !members.length}><FaPlus className="me-2" />{savingExpense ? "Adding..." : "Add Expense"}</button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowExpenseForm(false)}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <div className="card"><div className="card-body p-4"><h5 className="mb-3">Suggested Settlements</h5>{suggestions.length === 0 ? <div className="text-muted">Everyone is settled up.</div> : suggestions.map((item, index) => <div className="splitwise-suggestion" key={`${item.fromMember._id}-${item.toMember._id}-${index}`}><span><strong>{item.fromMember.name}</strong> pays <strong>{item.toMember.name}</strong></span><button type="button" className="btn btn-sm btn-outline-success" onClick={() => setSettlement({ fromMember: item.fromMember._id, toMember: item.toMember._id, amount: String(item.amount), date: today(), note: "Settlement" })}>{money(item.amount, group.currency)}</button></div>)}</div></div>
            <div className="card"><div className="card-body border-bottom p-4"><h5 className="mb-0">Expenses</h5></div><div className="table-responsive"><table className="table splitwise-activity-table table-hover align-middle mb-0"><thead className="table-light"><tr><th>Expense</th><th>Paid by</th><th>Members</th><th>Date</th><th className="text-end">Amount</th><th className="text-end">Action</th></tr></thead><tbody>{expenses.length === 0 ? <tr><td colSpan="6" className="text-center text-muted py-4">No expenses yet.</td></tr> : expenses.map((item) => <tr key={item._id}><td><div className="fw-semibold">{item.description}</div><div className="small text-muted">{item.splitType} split</div></td><td>{getExpensePayerName(item)}</td><td className="small text-muted">{formatExpenseMembers(item)}</td><td>{new Date(item.date).toLocaleDateString("en-IN")}</td><td className="text-end">{money(item.amount, group.currency)}</td><td className="text-end">{activeSection === "expenses" && <button type="button" className="btn btn-sm btn-outline-primary me-1" title="Use as new expense" onClick={() => fillFromPreviousExpense(item._id)}><FaCopy /></button>}<button type="button" className="btn btn-sm btn-outline-danger" title="Delete expense" onClick={() => remove(() => deleteSplitExpense(item._id), "Delete this expense?")}><FaTrash /></button></td></tr>)}</tbody></table></div>{transfers.length > 0 && <div className="card-body border-top p-4"><h6>Tour money sent</h6>{transfers.map((item) => { const from = getMemberName(item.fromMember); const to = getMemberName(item.toMember); return <div className="d-flex justify-content-between small border-top pt-2 mt-2" key={item._id}><span><strong>{from}</strong> sent <strong>{to}</strong>{item.note ? ` — ${item.note}` : ""}</span><span>{money(item.amount, group.currency)} <button type="button" className="btn btn-link btn-sm p-0 ms-1 text-danger" title="Delete tour advance" onClick={() => remove(() => deleteSplitTransfer(item._id), "Delete this tour advance?")}><FaTrash /></button></span></div>; })}</div>}{settlements.length > 0 && <div className="card-body border-top p-4"><h6>Recorded settlements</h6>{settlements.map((item) => { const from = getMemberName(item.fromMember, ""); const to = getMemberName(item.toMember, ""); return <div className="d-flex justify-content-between small border-top pt-2 mt-2" key={item._id}><span>{from && to ? <><strong>{from}</strong> paid <strong>{to}</strong> — </> : null}{item.note || "Settlement"} on {new Date(item.date).toLocaleDateString("en-IN")}</span><span>{money(item.amount, group.currency)} <button type="button" className="btn btn-link btn-sm p-0 ms-1 text-danger" title="Delete settlement" onClick={() => remove(() => deleteSplitSettlement(item._id), "Delete this settlement?")}><FaTrash /></button></span></div>; })}</div>}</div>
        </div></div>
    </div>;
};

export default SplitwiseGroupDetail;
