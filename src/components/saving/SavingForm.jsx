import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../../api/categoryApi";
import { getItems } from "../../api/itemApi";
import { getAccounts } from "../../api/accountApi";


const SavingForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const [itemsLoading, setItemsLoading] = useState(false);
    const [accountsLoading, setAccountsLoading] = useState(false);

    const [form, setForm] = useState({
        category: "",
        item: "",
        title: "",
        amount: "",
        account: "",
        paymentMode: "Cash",
        date: new Date().toISOString().split("T")[0],
        note: ""
    });


    /*
    |--------------------------------------------------------------------------
    | LOAD CATEGORIES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response = await getCategories({
                    page: 1,
                    limit: 100
                });

                console.log(
                    "Saving Category Response:",
                    response
                );

                const payload =
                    response?.data || response;

                let rows = [];

                if (Array.isArray(payload)) {
                    rows = payload;
                } else if (Array.isArray(payload?.rows)) {
                    rows = payload.rows;
                } else if (Array.isArray(payload?.data)) {
                    rows = payload.data;
                } else if (Array.isArray(payload?.data?.rows)) {
                    rows = payload.data.rows;
                }

                /*
                 * Only Saving categories
                 */
                rows = rows.filter(
                    category =>
                        !category.type ||
                        String(category.type).toUpperCase() === "SAVING"
                );

                setCategories(rows);

            } catch (error) {

                console.error(
                    "Saving Category Error:",
                    error
                );

                setCategories([]);

            }

        };

        loadCategories();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | LOAD ACCOUNTS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadAccounts = async () => {

            try {

                setAccountsLoading(true);

                const response = await getAccounts({
                    page: 1,
                    limit: 100
                });

                console.log(
                    "Saving Account Response:",
                    response
                );

                const payload =
                    response?.data || response;

                let rows = [];

                /*
                 * Supported account response formats
                 *
                 * {
                 *   total,
                 *   rows: []
                 * }
                 *
                 * or
                 *
                 * {
                 *   data: []
                 * }
                 */

                if (Array.isArray(payload)) {

                    rows = payload;

                } else if (
                    Array.isArray(payload?.rows)
                ) {

                    rows = payload.rows;

                } else if (
                    Array.isArray(payload?.data)
                ) {

                    rows = payload.data;

                } else if (
                    Array.isArray(payload?.data?.rows)
                ) {

                    rows = payload.data.rows;

                }

                console.log(
                    "Saving Accounts:",
                    rows
                );

                setAccounts(rows);

            } catch (error) {

                console.error(
                    "Saving Account Error:",
                    error
                );

                setAccounts([]);

            } finally {

                setAccountsLoading(false);

            }

        };

        loadAccounts();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | LOAD ITEMS
    |--------------------------------------------------------------------------
    */

    const loadItems = async (categoryId) => {

        if (!categoryId) {

            setItems([]);

            return;

        }

        try {

            setItemsLoading(true);

            const response = await getItems({
                page: 1,
                limit: 1000,
                category: categoryId
            });

            console.log(
                "Saving Item Response:",
                response
            );

            const payload =
                response?.data || response;

            let rows = [];

            if (Array.isArray(payload)) {

                rows = payload;

            } else if (
                Array.isArray(payload?.rows)
            ) {

                rows = payload.rows;

            } else if (
                Array.isArray(payload?.data)
            ) {

                rows = payload.data;

            } else if (
                Array.isArray(payload?.data?.rows)
            ) {

                rows = payload.data.rows;

            }

            setItems(rows);

        } catch (error) {

            console.error(
                "Saving Item Error:",
                error
            );

            setItems([]);

        } finally {

            setItemsLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | EDIT MODE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            !initialValues ||
            Object.keys(initialValues).length === 0
        ) {
            return;
        }

        const categoryId =
            initialValues.category?._id ||
            initialValues.category ||
            "";

        const itemId =
            initialValues.item?._id ||
            initialValues.item ||
            "";

        const accountId =
            initialValues.account?._id ||
            initialValues.account ||
            "";

        setForm({

            category: categoryId,

            item: itemId,

            title:
                initialValues.title || "",

            amount:
                initialValues.amount ?? "",

            account: accountId,

            paymentMode:
                initialValues.paymentMode ||
                "Cash",

            date:
                initialValues.date
                    ? initialValues.date.substring(0, 10)
                    : new Date()
                        .toISOString()
                        .split("T")[0],

            note:
                initialValues.note || ""

        });

        if (categoryId) {

            loadItems(categoryId);

        }

    }, [initialValues]);


    /*
    |--------------------------------------------------------------------------
    | CATEGORY CHANGE
    |--------------------------------------------------------------------------
    */

    const handleCategoryChange = async (event) => {

        const categoryId =
            event.target.value;

        setForm(previous => ({
            ...previous,
            category: categoryId,
            item: "",
            title: ""
        }));

        setItems([]);

        if (categoryId) {

            await loadItems(categoryId);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | ITEM CHANGE
    |--------------------------------------------------------------------------
    */

    const handleItemChange = (event) => {

        const itemId =
            event.target.value;

        const selectedItem =
            items.find(
                item =>
                    String(item._id) ===
                    String(itemId)
            );

        setForm(previous => ({
            ...previous,

            item: itemId,

            title:
                selectedItem?.name ||
                selectedItem?.title ||
                ""
        }));

    };


    /*
    |--------------------------------------------------------------------------
    | INPUT CHANGE
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));

    };


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {

        event.preventDefault();

        if (!form.category) {

            alert("Please select category.");

            return;

        }

        if (!form.item && !form.title) {

            alert("Please select item.");

            return;

        }

        if (
            !form.amount ||
            Number(form.amount) <= 0
        ) {

            alert(
                "Amount must be greater than 0."
            );

            return;

        }

        if (!form.account) {

            alert("Please select account.");

            return;

        }

        if (!form.date) {

            alert("Please select date.");

            return;

        }

        const data = {

            category: form.category,

            item:
                form.item || undefined,

            title: form.title,

            amount:
                Number(form.amount),

            account: form.account,

            paymentMode:
                form.paymentMode,

            date:
                form.date,

            note:
                form.note

        };

        console.log(
            "Saving Payload:",
            data
        );

        onSubmit(data);

    };


    /*
    |--------------------------------------------------------------------------
    | ACCOUNT NAME
    |--------------------------------------------------------------------------
    */

    const getAccountName = (account) => {

        return (
            account.name ||
            account.accountName ||
            account.title ||
            account.bankName ||
            account.account_title ||
            "Unnamed Account"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="container-fluid px-4 py-4">

            <div className="card shadow-sm border-0 w-100">

                {/* HEADER */}

                <div
                    className="
                        card-header
                        bg-white
                        d-flex
                        justify-content-between
                        align-items-center
                    "
                >

                    <h4 className="mb-0">
                        Saving Details
                    </h4>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/saving")
                        }
                    >
                        Back
                    </button>

                </div>


                {/* BODY */}

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        {/* CATEGORY */}

                        <div className="mb-3">

                            <label className="form-label">

                                Category
                                <span className="text-danger">
                                    *
                                </span>

                            </label>

                            <select
                                className="form-select"
                                value={form.category}
                                onChange={
                                    handleCategoryChange
                                }
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories.map(
                                    category => (

                                        <option
                                            key={
                                                category._id
                                            }
                                            value={
                                                category._id
                                            }
                                        >

                                            {
                                                category.name
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ITEM */}

                        <div className="mb-3">

                            <label className="form-label">

                                Item
                                <span className="text-danger">
                                    *
                                </span>

                            </label>

                            <select
                                className="form-select"
                                value={form.item}
                                onChange={
                                    handleItemChange
                                }
                                disabled={
                                    !form.category ||
                                    itemsLoading
                                }
                            >

                                <option value="">

                                    {!form.category
                                        ? "First select category"
                                        : itemsLoading
                                            ? "Loading items..."
                                            : items.length === 0
                                                ? "No items found"
                                                : "Select Item"
                                    }

                                </option>

                                {items.map(
                                    item => (

                                        <option
                                            key={
                                                item._id
                                            }
                                            value={
                                                item._id
                                            }
                                        >

                                            {
                                                item.name ||
                                                item.title
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* AMOUNT */}

                        <div className="mb-3">

                            <label className="form-label">

                                Amount
                                <span className="text-danger">
                                    *
                                </span>

                            </label>

                            <div className="input-group">

                                <span className="input-group-text">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="amount"
                                    className="form-control"
                                    placeholder="Enter amount"
                                    value={form.amount}
                                    onChange={
                                        handleChange
                                    }
                                    min="-1000000"
                                    step="0.01"
                                    required
                                />

                            </div>

                        </div>


                        {/* ACCOUNT */}

                        <div className="mb-3">

                            <label className="form-label">

                                Account
                                <span className="text-danger">
                                    *
                                </span>

                            </label>

                            <select
                                name="account"
                                className="form-select"
                                value={form.account}
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    accountsLoading
                                }
                                required
                            >

                                <option value="">

                                    {accountsLoading
                                        ? "Loading accounts..."
                                        : accounts.length === 0
                                            ? "No accounts found"
                                            : "Select Account"
                                    }

                                </option>

                                {accounts.map(
                                    account => (

                                        <option
                                            key={
                                                account._id
                                            }
                                            value={
                                                account._id
                                            }
                                        >

                                            {
                                                getAccountName(
                                                    account
                                                )
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* PAYMENT MODE */}

                        <div className="mb-3">

                            <label className="form-label">

                                Payment Mode
                                <span className="text-danger">
                                    *
                                </span>

                            </label>

                            <select
                                name="paymentMode"
                                className="form-select"
                                value={
                                    form.paymentMode
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="Cash">
                                    Cash
                                </option>

                                <option value="BankTransfer">
                                    Bank Transfer
                                </option>

                                <option value="AmazonPay">
                                    Amazon Pay
                                </option>

                                <option value="Bhim">
                                    Bhim
                                </option>

                                <option value="GPay">
                                    GPay
                                </option>

                                <option value="Paytm">
                                    Paytm
                                </option>

                                <option value="PhonePe">
                                    PhonePe
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* DATE */}

                        <div className="mb-3">

                            <label className="form-label">

                                Date
                                <span className="text-danger">
                                    *
                                </span>

                            </label>

                            <input
                                type="date"
                                name="date"
                                className="form-control"
                                value={
                                    form.date
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* NOTE */}

                        <div className="mb-3">

                            <label className="form-label">
                                Note
                            </label>

                            <textarea
                                name="note"
                                className="form-control"
                                rows="4"
                                placeholder="Enter note"
                                value={
                                    form.note
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        {/* BUTTONS */}

                        <div className="d-flex gap-2">

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    loading ||
                                    itemsLoading ||
                                    accountsLoading
                                }
                            >

                                {loading
                                    ? "Saving..."
                                    : "Save Saving"
                                }

                            </button>


                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate(
                                        "/saving"
                                    )
                                }
                                disabled={
                                    loading
                                }
                            >

                                Cancel

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

};


export default SavingForm;