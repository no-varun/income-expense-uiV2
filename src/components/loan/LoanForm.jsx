import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/categoryApi";
import { getItems } from "../../api/itemApi";
import { getAccounts } from "../../api/accountApi";
import BrandImage from "../common/BrandImage";
import { notify } from "../../utils/notifications";

const LoanForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {
    const navigate = useNavigate();
    const isEditMode = Boolean(initialValues?._id);

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [accountsLoading, setAccountsLoading] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState("");

    const [form, setForm] = useState({
        title: "",
        amount: "",
        pendingAmount: "",
        category: "",
        account: "",
        paymentMode: "BankTransfer",
        bank: "",
        date: new Date().toISOString().split("T")[0],
        note: ""
    });

    const paymentModes = [
        "BankTransfer",
        "Cash",
        "Paytm",
        "PhonePe",
        "GPay",
        "Bhim",
        "AmazonPay",
        "Other"
    ];

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setCategoriesLoading(true);
                const response = await getCategories({ limit: 100, type: "LOAN" });
                const rows = response?.data?.rows || response?.data || response?.rows || [];
                // Sort or filter if needed, keep all active categories
                const activeCategories = Array.isArray(rows)
                    ? rows.filter(cat => cat.status !== false)
                    : [];
                setCategories(activeCategories);

                // Auto-select category if LOAN category exists and creating new loan
                if (!isEditMode && !initialValues.category) {
                    const loanCat = activeCategories.find(c => c.type === "LOAN" || c.name?.toLowerCase() === "loan");
                    if (loanCat) {
                        setForm(prev => ({ ...prev, category: loanCat._id }));
                        loadItems(loanCat._id);
                    }
                }
            } catch {
                setCategories([]);
            } finally {
                setCategoriesLoading(false);
            }
        };
        loadCategories();
    }, [isEditMode]);

    // Load accounts
    useEffect(() => {
        const loadAccounts = async () => {
            try {
                setAccountsLoading(true);
                const response = await getAccounts({ limit: 100 });
                const rows = response?.data?.rows || response?.data || response?.rows || [];
                const activeAccounts = Array.isArray(rows)
                    ? rows.filter(acc => acc.status !== false)
                    : [];
                setAccounts(activeAccounts);
            } catch {
                setAccounts([]);
            } finally {
                setAccountsLoading(false);
            }
        };
        loadAccounts();
    }, []);

    // Load items for selected category
    const loadItems = async (categoryId) => {
        if (!categoryId) {
            setItems([]);
            return;
        }
        try {
            setItemsLoading(true);
            const response = await getItems({
                limit: 1000,
                category: categoryId,
                status: true
            });
            const rows = response?.data?.rows || response?.data || response?.rows || [];
            setItems(Array.isArray(rows) ? rows : []);
        } catch {
            setItems([]);
        } finally {
            setItemsLoading(false);
        }
    };

    // Populate initial values
    useEffect(() => {
        if (!initialValues || Object.keys(initialValues).length === 0) return;

        const categoryId = initialValues.category?._id || initialValues.category || "";
        const accountId = initialValues.account?._id || initialValues.account || "";

        let formattedDate = new Date().toISOString().split("T")[0];
        if (initialValues.date) {
            const parsed = new Date(initialValues.date);
            if (!isNaN(parsed.getTime())) {
                formattedDate = parsed.toISOString().split("T")[0];
            }
        }

        setForm({
            title: initialValues.title || "",
            amount: initialValues.amount !== undefined ? String(initialValues.amount) : "",
            pendingAmount: initialValues.pendingAmount !== undefined ? String(initialValues.pendingAmount) : (initialValues.amount ? String(initialValues.amount) : ""),
            category: categoryId,
            account: accountId,
            paymentMode: initialValues.paymentMode || "BankTransfer",
            bank: initialValues.bank || "",
            date: formattedDate,
            note: initialValues.note || ""
        });

        if (categoryId) {
            loadItems(categoryId);
        }
    }, [initialValues]);

    const handleCategoryChange = (e) => {
        const catId = e.target.value;
        setForm(prev => ({ ...prev, category: catId }));
        setSelectedItemId("");
        loadItems(catId);
    };

    const handleItemChange = (e) => {
        const itemId = e.target.value;
        setSelectedItemId(itemId);
        const selectedItem = items.find(i => i._id === itemId);
        if (selectedItem) {
            setForm(prev => ({ ...prev, title: selectedItem.name }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => {
            const next = { ...prev, [name]: value };
            // When setting amount in create mode, default pendingAmount to amount
            if (name === "amount" && !isEditMode) {
                next.pendingAmount = value;
            }
            return next;
        });
    };

    const getAccountLabel = (acc) => {
        const bank = acc.bank ? `(${acc.bank})` : "";
        const bal = acc.openingBalance !== undefined ? ` - ₹${Number(acc.openingBalance).toLocaleString("en-IN")}` : "";
        return `${acc.name} ${bank}${bal}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.title.trim()) {
            notify("Please enter a loan title.");
            return;
        }

        const parsedAmount = Number(form.amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            notify("Please enter a valid loan amount greater than 0.");
            return;
        }

        const parsedPending = form.pendingAmount !== "" ? Number(form.pendingAmount) : parsedAmount;
        if (!Number.isFinite(parsedPending) || parsedPending < 0) {
            notify("Pending amount must be 0 or greater.");
            return;
        }

        if (parsedPending > parsedAmount) {
            notify("Pending amount cannot be greater than total loan amount.");
            return;
        }

        if (!form.account) {
            notify("Please select an account.");
            return;
        }

        const selectedAcc = accounts.find(a => a._id === form.account);
        const bank = form.bank || selectedAcc?.bank || "Other";

        onSubmit({
            title: form.title.trim(),
            amount: parsedAmount,
            pendingAmount: parsedPending,
            category: form.category || undefined,
            account: form.account,
            paymentMode: form.paymentMode,
            bank,
            date: form.date,
            note: form.note.trim()
        });
    };

    const selectedAccount = accounts.find(a => a._id === form.account);
    const repaidAmount = Math.max(0, Number(form.amount || 0) - Number(form.pendingAmount || 0));

    return (
        <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-0 fw-bold text-dark">
                        {isEditMode ? "Edit Loan" : "Take Loan"}
                    </h5>
                    <small className="text-muted">
                        {isEditMode
                            ? "Update loan details and track remaining pending balance"
                            : "Record a borrowed loan. Funds will be credited to the receiving account."}
                    </small>
                </div>
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                    onClick={() => navigate("/loans")}
                >
                    Cancel
                </button>
            </div>

            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* CATEGORY */}
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">
                                Category <span className="text-muted small">(Optional)</span>
                            </label>
                            <select
                                className="form-select"
                                name="category"
                                value={form.category}
                                onChange={handleCategoryChange}
                                disabled={categoriesLoading}
                            >
                                <option value="">
                                    {categoriesLoading ? "Loading categories..." : "Select Category (or leave default)"}
                                </option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name} {cat.type ? `(${cat.type})` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SELECT ITEM (OPTIONAL) */}
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">
                                Item Preset <span className="text-muted small">(Optional)</span>
                            </label>
                            <select
                                className="form-select"
                                value={selectedItemId}
                                onChange={handleItemChange}
                                disabled={!form.category || itemsLoading}
                            >
                                <option value="">
                                    {itemsLoading
                                        ? "Loading items..."
                                        : !form.category
                                            ? "Select category first"
                                            : items.length === 0
                                                ? "No preset items (enter title below)"
                                                : "Choose from saved items"}
                                </option>
                                {items.map(item => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* LOAN TITLE */}
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">
                                Loan Title / Lender <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. HDFC Personal Loan, Car Loan, Loan from Amit"
                                required
                            />
                        </div>

                        {/* AMOUNT */}
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">
                                Total Loan Amount <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">₹</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        {/* PENDING AMOUNT (SHOWN IN EDIT MODE OR OPTIONALLY IN CREATE) */}
                        {(isEditMode || form.pendingAmount !== form.amount) && (
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">
                                    Pending Balance to Repay <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">₹</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="pendingAmount"
                                        value={form.pendingAmount}
                                        onChange={handleChange}
                                        min="0"
                                        max={form.amount || undefined}
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                    <small className="text-success fw-medium">
                                        Repaid So Far: ₹{repaidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </small>
                                    {Number(form.pendingAmount) === 0 && (
                                        <span className="badge bg-success">Fully Repaid</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* RECEIVING ACCOUNT */}
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">
                                Receiving Account <span className="text-danger">*</span>
                            </label>
                            <select
                                className="form-select"
                                name="account"
                                value={form.account}
                                onChange={handleChange}
                                disabled={accountsLoading}
                                required
                            >
                                <option value="">
                                    {accountsLoading ? "Loading accounts..." : "Select Account to Receive Funds"}
                                </option>
                                {accounts.map(acc => (
                                    <option key={acc._id} value={acc._id}>
                                        {getAccountLabel(acc)}
                                    </option>
                                ))}
                            </select>
                            {selectedAccount && (
                                <div className="alert alert-info py-1 px-2 mt-2 mb-0 small d-flex align-items-center gap-2">
                                    <BrandImage type="bank" value={selectedAccount.bank} size="1.25rem" />
                                    <span>
                                        {!isEditMode
                                            ? `Funds (₹${Number(form.amount || 0).toLocaleString("en-IN")}) will be credited to this account.`
                                            : `Current available balance: ₹${Number(selectedAccount.openingBalance || 0).toLocaleString("en-IN")}`}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* PAYMENT MODE */}
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">Payment / Disbursement Mode</label>
                            <select
                                className="form-select"
                                name="paymentMode"
                                value={form.paymentMode}
                                onChange={handleChange}
                            >
                                {paymentModes.map(mode => (
                                    <option key={mode} value={mode}>
                                        {mode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* DATE */}
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">Date Borrowed</label>
                            <input
                                type="date"
                                className="form-control"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* NOTE */}
                        <div className="col-12">
                            <label className="form-label fw-semibold">Notes / Terms / EMI Info</label>
                            <textarea
                                className="form-control"
                                name="note"
                                rows="3"
                                value={form.note}
                                onChange={handleChange}
                                placeholder="Add loan tenure, interest rate, monthly EMI, or lender contact details..."
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4 rounded-pill"
                            onClick={() => navigate("/loans")}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary px-4 rounded-pill fw-medium"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                    {isEditMode ? "Saving..." : "Recording Loan..."}
                                </>
                            ) : (
                                isEditMode ? "Update Loan" : "Take Loan"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanForm;
