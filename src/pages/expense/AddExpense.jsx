import { notify } from "../../utils/notifications";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaHistory, FaUndo } from "react-icons/fa";

import ExpenseForm from "../../components/expense/ExpenseForm";
import { createExpense, getExpense, getExpenses } from "../../api/expenseApi";

/*
|--------------------------------------------------------------------------
| HELPER: EXTRACT LIST ROWS FROM GET EXPENSES
|--------------------------------------------------------------------------
*/
const extractRows = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response?.rows)) return response.rows;
    if (Array.isArray(response?.data?.rows)) return response.data.rows;
    return [];
};

/*
|--------------------------------------------------------------------------
| HELPER: EXTRACT EXPENSE DETAIL OBJECT FROM GET EXPENSE BY ID
|--------------------------------------------------------------------------
*/
const extractExpenseData = (response) => {
    if (!response) return null;
    let payload = response;
    if (response?.data && (response.data.success !== undefined || response.data._id)) {
        payload = response.data;
    }
    if (payload?._id) return payload;
    if (payload?.data?._id) return payload.data;
    if (payload?.data?.data?._id) return payload.data.data;
    return payload?.data || payload;
};

const AddExpense = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const copyFromId = searchParams.get("copyFrom");

    const [loading, setLoading] = useState(false);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loadingRecent, setLoadingRecent] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [templateExpense, setTemplateExpense] = useState({});
    const [loadingTemplate, setLoadingTemplate] = useState(false);
    const [formKey, setFormKey] = useState(0);

    /*
    |--------------------------------------------------------------------------
    | LOAD RECENT EXPENSES FOR PREFILL OPTIONS
    |--------------------------------------------------------------------------
    */
    const loadRecentExpenses = useCallback(async () => {
        try {
            setLoadingRecent(true);
            const response = await getExpenses({ limit: 50, page: 1 });
            const rows = extractRows(response);
            setRecentExpenses(rows);
        } catch {
            setRecentExpenses([]);
        } finally {
            setLoadingRecent(false);
        }
    }, []);

    useEffect(() => {
        loadRecentExpenses();
    }, [loadRecentExpenses]);

    /*
    |--------------------------------------------------------------------------
    | SELECT & AUTO-FILL FROM PREVIOUS EXPENSE
    |--------------------------------------------------------------------------
    */
    const handleSelectTemplate = useCallback(async (expenseId) => {
        if (!expenseId) {
            setSelectedTemplateId("");
            setTemplateExpense({});
            setFormKey((prev) => prev + 1);
            return;
        }

        try {
            setSelectedTemplateId(expenseId);
            setLoadingTemplate(true);

            let expenseData = null;
            try {
                const response = await getExpense(expenseId);
                expenseData = extractExpenseData(response);
            } catch {
                expenseData = recentExpenses.find((item) => String(item._id) === String(expenseId));
            }

            if (!expenseData) {
                notify("Unable to load expense details.");
                return;
            }

            const todayStr = new Date().toISOString().slice(0, 10);

            // Strip ID and timestamps so it acts strictly as a brand new expense
            const { _id, id, createdAt, updatedAt, __v, document, ...rest } = expenseData;

            const sanitized = {
                ...rest,
                // Default date to today's date for a new expense (user can change freely)
                date: todayStr,
            };

            delete sanitized._id;
            delete sanitized.id;
            delete sanitized.createdAt;
            delete sanitized.updatedAt;
            delete sanitized.__v;
            delete sanitized.document;

            setTemplateExpense(sanitized);
            setFormKey((prev) => prev + 1);
            notify("Expense details auto-filled. You can edit any field before submitting.");
        } catch (error) {
            notify(error?.response?.data?.message || error?.message || "Failed to load previous expense.");
        } finally {
            setLoadingTemplate(false);
        }
    }, [recentExpenses]);

    /*
    |--------------------------------------------------------------------------
    | AUTOFILL IF copyFrom QUERY PARAM PRESENT
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        if (copyFromId && copyFromId !== selectedTemplateId) {
            handleSelectTemplate(copyFromId);
        }
    }, [copyFromId, handleSelectTemplate, selectedTemplateId]);

    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */
    const handleSubmit = async (payload) => {
        try {
            setLoading(true);

            const response = await createExpense(payload);

            if (response?.success === true) {
                notify(
                    response.message ||
                    "Expense created successfully."
                );

                navigate(
                    "/expense",
                    {
                        replace: true
                    }
                );
                return;
            }

            notify(
                response?.message ||
                "Unable to create expense."
            );
        } catch (error) {
            const errorResponse = error?.response?.data;
            notify(
                errorResponse?.message ||
                error?.message ||
                "Unable to create expense."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */
    return (
        <div className="container-fluid px-4 py-3">
            {/* Auto-fill from Previous Expense Card */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                        <div className="d-flex align-items-center gap-2">
                            <FaHistory className="text-primary" />
                            <span className="fw-semibold">Autofill from Previous Expense</span>
                            <span className="badge bg-light text-muted border">Optional</span>
                        </div>
                        {selectedTemplateId && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                                onClick={() => handleSelectTemplate("")}
                                title="Reset to empty form"
                            >
                                <FaUndo className="small" /> Clear &amp; Start Blank
                            </button>
                        )}
                    </div>

                    <div className="row g-2 align-items-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <select
                                className="form-select form-select-sm"
                                value={selectedTemplateId}
                                onChange={(e) => handleSelectTemplate(e.target.value)}
                                disabled={loadingRecent || loadingTemplate}
                            >
                                <option value="">
                                    {loadingRecent ? "Loading previous expenses..." : "-- Select previous expense to auto-fill --"}
                                </option>
                                {recentExpenses.map((item) => {
                                    const dateStr = item.date ? new Date(item.date).toLocaleDateString("en-IN") : "";
                                    const amountStr = Number(item.amount || 0).toLocaleString("en-IN", {
                                        style: "currency",
                                        currency: "INR",
                                        maximumFractionDigits: 2
                                    });
                                    const catName = typeof item.category === "object" ? item.category?.name : (item.categoryName || "");
                                    const shopName = typeof item.shop === "object" ? item.shop?.name : (item.shopName || "");

                                    const labels = [
                                        dateStr,
                                        item.title || "Expense",
                                        amountStr,
                                        catName ? `(${catName})` : null,
                                        shopName ? `@ ${shopName}` : null
                                    ].filter(Boolean).join(" · ");

                                    return (
                                        <option key={item._id} value={item._id}>
                                            {labels}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        {loadingTemplate && (
                            <div className="col-auto">
                                <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true" />
                                <span className="small text-muted ms-2">Loading details...</span>
                            </div>
                        )}
                    </div>

                    {selectedTemplateId && (
                        <div className="mt-2 small text-muted">
                            <span className="text-success fw-medium">✓ Details populated from previous entry.</span> You can modify the amount, date, title, or any other detail below before saving as a new expense.
                        </div>
                    )}
                </div>
            </div>

            {loadingTemplate ? (
                <div className="card border-0 shadow-sm py-5 text-center">
                    <div className="spinner-border text-primary" role="status" />
                    <div className="mt-3 text-muted small">Loading expense details into form...</div>
                </div>
            ) : (
                <ExpenseForm
                    key={`add-expense-${selectedTemplateId || "blank"}-${formKey}`}
                    initialValues={templateExpense}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default AddExpense;
