import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const toMonthInput = (value = new Date()) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const toDateInput = (value = new Date()) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const calculateContributions = (epfWages) => {
    if (epfWages === "") {
        return {
            epsWages: "",
            employeeShare: "",
            employerShare: "",
            pensionShare: ""
        };
    }

    const wages = Number(epfWages);
    if (!Number.isFinite(wages) || wages < 0) {
        return {};
    }

    const employeeShare = Math.round(wages * 0.12);
    const pensionShare = Math.round(wages * 0.0833);

    return {
        epsWages: wages.toFixed(2),
        employeeShare: String(employeeShare),
        // Employer share is the balance of its 12% contribution after EPS.
        employerShare: String(employeeShare - pensionShare),
        pensionShare: String(pensionShare)
    };
};

const PFAccountStatementForm = ({ initialValues = {}, onSubmit, saving }) => {
    const [form, setForm] = useState({
        pfAccountNumber: "",
        wageMonth: toMonthInput(),
        transactionDate: toDateInput(),
        transactionType: "CREDIT",
        particulars: "",
        referenceNumber: "",
        epfWages: "",
        epsWages: "",
        employeeShare: "",
        employerShare: "",
        pensionShare: "",
        note: ""
    });

    useEffect(() => {
        if (!initialValues?._id) return;
        setForm({
            pfAccountNumber: initialValues.pfAccountNumber || "",
            wageMonth: toMonthInput(initialValues.wageMonth),
            transactionDate: toDateInput(initialValues.transactionDate),
            transactionType: initialValues.transactionType || "CREDIT",
            particulars: initialValues.particulars || "",
            referenceNumber: initialValues.referenceNumber || "",
            epfWages: initialValues.epfWages ?? "",
            epsWages: initialValues.epsWages ?? "",
            employeeShare: initialValues.employeeShare ?? "",
            employerShare: initialValues.employerShare ?? "",
            pensionShare: initialValues.pensionShare ?? "",
            note: initialValues.note || ""
        });
    }, [initialValues]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => name === "epfWages"
            ? { ...current, epfWages: value, ...calculateContributions(value) }
            : { ...current, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!form.wageMonth || !form.transactionDate || !form.particulars.trim()) {
            alert("Wage month, transaction date, and particulars are required.");
            return;
        }

        const numberFields = ["epfWages", "epsWages", "employeeShare", "employerShare", "pensionShare"];
        const payload = {
            ...form,
            wageMonth: `${form.wageMonth}-01`,
            transactionDate: new Date(`${form.transactionDate}T00:00:00`).toISOString(),
            particulars: form.particulars.trim(),
            pfAccountNumber: form.pfAccountNumber.trim(),
            referenceNumber: form.referenceNumber.trim(),
            note: form.note.trim()
        };

        for (const field of numberFields) {
            const number = Number(form[field] || 0);
            if (!Number.isFinite(number) || number < 0) {
                alert("Wages and share amounts must be zero or greater.");
                return;
            }
            payload[field] = number;
        }

        onSubmit(payload);
    };

    const amountFields = [
        ["epfWages", "EPF Wages", false],
        ["epsWages", "EPS Wages", true],
        ["employeeShare", "Employee Share (12%)", true],
        ["employerShare", "Employer Share (3.67%)", true],
        ["pensionShare", "Pension Share (8.33%)", true]
    ];

    return <div className="card shadow-sm"><div className="card-body p-4"><form onSubmit={handleSubmit}>
        <div className="row g-3">
            <div className="col-md-4"><label className="form-label">PF Account Number</label><input className="form-control" name="pfAccountNumber" value={form.pfAccountNumber} onChange={handleChange} disabled={saving} /></div>
            <div className="col-md-4"><label className="form-label">Wage Month <span className="text-danger">*</span></label><input type="month" className="form-control" name="wageMonth" value={form.wageMonth} onChange={handleChange} disabled={saving} required /></div>
            <div className="col-md-4"><label className="form-label">Transaction Date <span className="text-danger">*</span></label><input type="date" className="form-control" name="transactionDate" value={form.transactionDate} onChange={handleChange} disabled={saving} required /></div>
            <div className="col-md-4"><label className="form-label">Transaction Type</label><select className="form-select" name="transactionType" value={form.transactionType} onChange={handleChange} disabled={saving}><option value="CREDIT">Credit</option><option value="DEBIT">Debit</option></select></div>
            <div className="col-md-8"><label className="form-label">Particulars <span className="text-danger">*</span></label><input className="form-control" name="particulars" value={form.particulars} onChange={handleChange} placeholder="e.g. Cont. for the Due-Month 202605" disabled={saving} required /></div>
            <div className="col-md-4"><label className="form-label">Reference Number</label><input className="form-control" name="referenceNumber" value={form.referenceNumber} onChange={handleChange} disabled={saving} /></div>
            {amountFields.map(([name, label, calculated]) => <div className="col-md-4" key={name}><label className="form-label">{label}</label><div className="input-group"><span className="input-group-text">INR</span><input type="number" min="0" step="0.01" className="form-control" name={name} value={form[name]} onChange={handleChange} disabled={saving} readOnly={calculated} /></div></div>)}
            <div className="col-12"><label className="form-label">Note</label><textarea rows="3" className="form-control" name="note" value={form.note} onChange={handleChange} disabled={saving} /></div>
        </div>
        <div className="d-flex gap-2 mt-4"><button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving..." : initialValues?._id ? "Update PF Statement" : "Save PF Statement"}</button><Link className="btn btn-secondary" to="/pf-statements">Cancel</Link></div>
    </form></div></div>;
};

export default PFAccountStatementForm;
