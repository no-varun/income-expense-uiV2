import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/notifications";
import { createNextMonthPlan, updateNextMonthPlan } from "../../api/nextMonthPlanApi";

const getNextMonthYear = () => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const y = next.getFullYear();
    const m = String(next.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
};

const NextMonthPlanForm = ({
    initialData = null,
    defaultType = "Expense",
    defaultMonthYear = "",
    onSuccess = null,
    onCancel = null
}) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        type: defaultType || "Expense",
        amount: "",
        monthYear: defaultMonthYear || getNextMonthYear(),
        expectedDate: "",
        priority: "Medium",
        notes: "",
        status: "Pending"
    });

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                type: initialData.type || "Expense",
                amount: initialData.amount !== undefined ? String(initialData.amount) : "",
                monthYear: initialData.monthYear || defaultMonthYear || getNextMonthYear(),
                expectedDate: initialData.expectedDate ? initialData.expectedDate.substring(0, 10) : "",
                priority: initialData.priority || "Medium",
                notes: initialData.notes || "",
                status: initialData.status || "Pending"
            });
        } else if (defaultMonthYear) {
            setFormData(prev => ({
                ...prev,
                monthYear: defaultMonthYear,
                type: defaultType || prev.type
            }));
        }
    }, [initialData, defaultMonthYear, defaultType]);

    const validate = () => {
        const errs = {};
        if (!formData.title.trim()) {
            errs.title = "Title is required";
        }
        if (!formData.amount || Number(formData.amount) <= 0) {
            errs.amount = "Enter a valid amount greater than 0";
        }
        if (!formData.monthYear) {
            errs.monthYear = "Target month is required";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setSubmitting(true);
            const isExpense = formData.type === "Expense";
            const payload = {
                title: formData.title.trim(),
                type: formData.type,
                amount: Number(formData.amount),
                monthYear: formData.monthYear,
                expectedDate: formData.expectedDate || null,
                priority: isExpense ? formData.priority : null,
                notes: formData.notes.trim(),
                status: formData.status
            };

            let res;
            if (initialData?._id) {
                res = await updateNextMonthPlan(initialData._id, payload);
            } else {
                res = await createNextMonthPlan(payload);
            }

            if (res.success || res.data) {
                notify(res.message || (initialData ? "Plan updated successfully!" : "Plan created successfully!"));
                if (onSuccess) {
                    onSuccess(res.data);
                } else {
                    navigate("/next-month-plan");
                }
            } else {
                notify(res.message || "Failed to save plan item");
            }
        } catch (error) {
            notify(error.response?.data?.message || error.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/next-month-plan");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Account Isolation Notice */}
            <div className="alert alert-info py-2 px-3 small d-flex align-items-center mb-3">
                <i className="bi bi-info-circle-fill me-2 fs-6"></i>
                <div>
                    <strong>Future Planning Only:</strong> Entries in this module do not deduct or add to your actual account balances.
                </div>
            </div>

            {/* TYPE SELECTOR (INCOME / EXPENSE) */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Planning Type</label>
                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className={`btn flex-fill py-2 fw-semibold ${formData.type === "Expense" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => setFormData(prev => ({ ...prev, type: "Expense" }))}
                    >
                        Planned Expense
                    </button>
                    <button
                        type="button"
                        className={`btn flex-fill py-2 fw-semibold ${formData.type === "Income" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setFormData(prev => ({ ...prev, type: "Income" }))}
                    >
                        Planned Income
                    </button>
                </div>
            </div>

            <div className="row g-3">
                {/* TITLE */}
                <div className="col-12 col-md-7">
                    <label className="form-label fw-semibold">
                        Title / Name <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                        placeholder={formData.type === "Expense" ? "e.g., House Rent, Groceries, Electricity" : "e.g., Salary, Freelance, Dividend"}
                        value={formData.title}
                        onChange={handleChange}
                        autoFocus
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                {/* AMOUNT */}
                <div className="col-12 col-md-5">
                    <label className="form-label fw-semibold">
                        Planned Amount (₹) <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                            type="number"
                            name="amount"
                            step="any"
                            min="0"
                            className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                        {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                    </div>
                </div>

                {/* TARGET MONTH */}
                <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                        Planning Month <span className="text-danger">*</span>
                    </label>
                    <input
                        type="month"
                        name="monthYear"
                        className={`form-control ${errors.monthYear ? "is-invalid" : ""}`}
                        value={formData.monthYear}
                        onChange={handleChange}
                    />
                    {errors.monthYear && <div className="invalid-feedback">{errors.monthYear}</div>}
                    <small className="text-muted">Target month for this budget item</small>
                </div>

                {/* EXPECTED DATE */}
                <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                        Expected Date <span className="text-muted fw-normal">(Optional)</span>
                    </label>
                    <input
                        type="date"
                        name="expectedDate"
                        className="form-control"
                        value={formData.expectedDate}
                        onChange={handleChange}
                    />
                    <small className="text-muted">Expected due or receipt date in the month</small>
                </div>

                {/* PRIORITY (ONLY FOR EXPENSE) */}
                {formData.type === "Expense" && (
                    <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Priority</label>
                        <select
                            name="priority"
                            className="form-select"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="High">High (Essential / Must pay)</option>
                            <option value="Medium">Medium (Regular / Important)</option>
                            <option value="Low">Low (Discretionary / Optional)</option>
                        </select>
                    </div>
                )}

                {/* STATUS */}
                <div className={`col-12 ${formData.type === "Expense" ? "col-md-6" : "col-md-12"}`}>
                    <label className="form-label fw-semibold">Status</label>
                    <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Pending">Pending (Not yet spent/received)</option>
                        <option value="Completed">Completed (Executed)</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* NOTES */}
                <div className="col-12">
                    <label className="form-label fw-semibold">Notes / Description</label>
                    <textarea
                        name="notes"
                        className="form-control"
                        rows="2"
                        placeholder="Add any reminders, breakdown, or budget details..."
                        value={formData.notes}
                        onChange={handleChange}
                    ></textarea>
                </div>
            </div>

            {/* BUTTONS */}
            <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
                <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={handleCancel}
                    disabled={submitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={`btn px-4 ${formData.type === "Income" ? "btn-success" : "btn-primary"}`}
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                        </>
                    ) : (
                        initialData ? "Update Plan Item" : `Save ${formData.type}`
                    )}
                </button>
            </div>
        </form>
    );
};

export default NextMonthPlanForm;
