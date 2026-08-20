import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../../api/categoryApi";
import { getItems } from "../../api/itemApi";
import { getAccounts } from "../../api/accountApi";


const IncomeForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {

    const navigate = useNavigate();


    const [categories, setCategories] =
        useState([]);

    const [items, setItems] =
        useState([]);

    const [accounts, setAccounts] =
        useState([]);

    const [itemsLoading, setItemsLoading] =
        useState(false);

    const [accountsLoading, setAccountsLoading] =
        useState(false);


    const [form, setForm] = useState({

        title: "",

        itemId: "",

        amount: "",

        category: "",

        paymentMode: "Cash",

        account: "",

        date:
            new Date()
                .toISOString()
                .split("T")[0],

        note: ""

    });


    /*
    |--------------------------------------------------------------------------
    | HELPER - GET RESPONSE DATA
    |--------------------------------------------------------------------------
    */

    const getResponseRows = (
        response
    ) => {

        /*
         * Supports:
         *
         * response.data
         * response.data.data
         * response.data.rows
         * response.data.data.rows
         */

        const payload =
            response?.data?.success !== undefined
                ? response.data
                : response;


        if (
            payload?.success === false
        ) {

            return [];

        }


        const result =
            payload?.data !== undefined
                ? payload.data
                : payload;


        if (
            Array.isArray(result)
        ) {

            return result;

        }


        if (
            Array.isArray(
                result?.data
            )
        ) {

            return result.data;

        }


        if (
            Array.isArray(
                result?.rows
            )
        ) {

            return result.rows;

        }


        return [];

    };


    /*
    |--------------------------------------------------------------------------
    | LOAD CATEGORIES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response =
                    await getCategories({

                        limit: 100,

                        type: "INCOME"

                    });


                const rows =
                    getResponseRows(
                        response
                    );


                setCategories(
                    rows
                );


            } catch (error) {

                console.error(
                    "Category fetch error:",
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


                const response =
                    await getAccounts({

                        page: 1,

                        limit: 100,

                        status: true

                    });


                console.log(
                    "Accounts API Response:",
                    response
                );


                const rows =
                    getResponseRows(
                        response
                    );


                console.log(
                    "Accounts:",
                    rows
                );


                setAccounts(
                    rows
                );


            } catch (error) {

                console.error(
                    "Account fetch error:",
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

    const loadItems = async (
        categoryId
    ) => {

        if (!categoryId) {

            setItems([]);

            return [];

        }


        try {

            setItemsLoading(true);

            setItems([]);


            const response =
                await getItems({

                    limit: 1000,

                    category:
                        categoryId,

                    type: "INCOME",

                    status: true

                });


            const rows =
                getResponseRows(
                    response
                );


            setItems(
                rows
            );


            return rows;


        } catch (error) {

            console.error(
                "Item fetch error:",
                error
            );

            setItems([]);

            return [];

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
            initialValues.itemId ||
            "";


        const accountId =
            initialValues.account?._id ||
            initialValues.account ||
            "";


        setForm({

            title:
                initialValues.title ||
                "",

            itemId,

            amount:
                initialValues.amount ??
                "",

            category:
                categoryId,

            paymentMode:
                initialValues.paymentMode ||
                "Cash",

            account:
                accountId,

            date:
                initialValues.date
                    ? initialValues.date.substring(
                        0,
                        10
                    )
                    : new Date()
                        .toISOString()
                        .split("T")[0],

            note:
                initialValues.note ||
                ""

        });


        if (categoryId) {

            loadItems(
                categoryId
            );

        } else {

            setItems([]);

        }

    }, [initialValues]);


    /*
    |--------------------------------------------------------------------------
    | HANDLE CHANGE
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    /*
    |--------------------------------------------------------------------------
    | CATEGORY CHANGE
    |--------------------------------------------------------------------------
    */

    const handleCategoryChange =
        async (e) => {

            const categoryId =
                e.target.value;


            setForm(prev => ({

                ...prev,

                category:
                    categoryId,

                title:
                    "",

                itemId:
                    ""

            }));


            setItems([]);


            if (categoryId) {

                await loadItems(
                    categoryId
                );

            }

        };


    /*
    |--------------------------------------------------------------------------
    | ITEM CHANGE
    |--------------------------------------------------------------------------
    */

    const handleItemChange = (e) => {

        const itemId =
            e.target.value;


        const selectedItem =
            items.find(

                item =>
                    String(
                        item._id
                    ) ===
                    String(
                        itemId
                    )

            );


        setForm(prev => ({

            ...prev,

            itemId,

            title:
                selectedItem?.name ||
                ""

        }));

    };


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (e) => {

        e.preventDefault();


        if (!form.category) {

            alert(
                "Please select category"
            );

            return;

        }


        if (!form.itemId) {

            alert(
                "Please select item"
            );

            return;

        }


        if (
            !form.amount ||
            Number(form.amount) <= 0
        ) {

            alert(
                "Amount should be greater than 0"
            );

            return;

        }


        if (!form.account) {

            alert(
                "Please select account"
            );

            return;

        }


        onSubmit({

            ...form,

            amount:
                Number(
                    form.amount
                )

        });

    };


    /*
    |--------------------------------------------------------------------------
    | SELECTED ITEM
    |--------------------------------------------------------------------------
    */

    const selectedItemId =
        form.itemId ||
        items.find(

            item =>
                item.name ===
                form.title

        )?._id ||
        "";


    /*
    |--------------------------------------------------------------------------
    | SELECTED ACCOUNT
    |--------------------------------------------------------------------------
    */

    const selectedAccount =
        accounts.find(

            account =>
                String(
                    account._id
                ) ===
                String(
                    form.account
                )

        );


    /*
    |--------------------------------------------------------------------------
    | FORMAT BALANCE
    |--------------------------------------------------------------------------
    */

    const formatBalance =
        (amount) => {

            return Number(
                amount || 0
            ).toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits:
                        2,
                    maximumFractionDigits:
                        2
                }
            );

        };


    return (

        <div className="card border-0 shadow-sm">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="card-header bg-white border-bottom px-4 py-3">

                <div className="d-flex justify-content-between align-items-center">

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                            navigate("/income")
                        }
                        disabled={loading}
                    >

                        ← Back

                    </button>

                </div>

            </div>


            {/* =====================================================
                BODY
            ====================================================== */}

            <div className="card-body p-4">

                <form
                    onSubmit={
                        handleSubmit
                    }
                >


                    {/* =================================================
                        ROW 1
                    ================================================= */}

                    <div className="row g-4">


                        {/* CATEGORY */}

                        <div className="col-12 col-md-6">

                            <label className="form-label fw-semibold">

                                Category

                                <span className="text-danger ms-1">
                                    *
                                </span>

                            </label>


                            <select
                                className="form-select form-select-lg"
                                name="category"
                                value={
                                    form.category
                                }
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

                        <div className="col-12 col-md-6">

                            <label className="form-label fw-semibold">

                                Item

                                <span className="text-danger ms-1">
                                    *
                                </span>

                            </label>


                            <select
                                className="form-select form-select-lg"
                                value={
                                    selectedItemId
                                }
                                onChange={
                                    handleItemChange
                                }
                                disabled={
                                    !form.category ||
                                    itemsLoading
                                }
                                required
                            >

                                <option value="">

                                    {itemsLoading

                                        ? "Loading items..."

                                        : !form.category

                                            ? "Select category first"

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
                                                item.name
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =================================================
                            AMOUNT
                        ================================================== */}

                        <div className="col-12 col-md-6">

                            <label className="form-label fw-semibold">

                                Amount

                                <span className="text-danger ms-1">
                                    *
                                </span>

                            </label>


                            <div className="input-group input-group-lg">

                                <span className="input-group-text fw-bold">

                                    ₹

                                </span>


                                <input
                                    type="number"
                                    className="form-control"
                                    name="amount"
                                    value={
                                        form.amount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />

                            </div>

                        </div>


                        {/* =================================================
                            PAYMENT MODE
                        ================================================== */}

                        <div className="col-12 col-md-6">

                            <label className="form-label fw-semibold">

                                Payment Mode

                                <span className="text-danger ms-1">
                                    *
                                </span>

                            </label>


                            <select
                                className="form-select form-select-lg"
                                name="paymentMode"
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

                                <option value="Paytm">
                                    Paytm
                                </option>

                                <option value="PhonePe">
                                    PhonePe
                                </option>

                                <option value="GPay">
                                    GPay
                                </option>

                                <option value="Bhim">
                                    Bhim
                                </option>

                                <option value="AmazonPay">
                                    Amazon Pay
                                </option>

                                <option value="BankTransfer">
                                    Bank Transfer
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            ACCOUNT
                        ================================================== */}

                        <div className="col-12">

                            <div className="p-3 rounded border bg-light">

                                <div className="row align-items-center g-3">


                                    <div className="col-12 col-md-8">

                                        <label className="form-label fw-semibold mb-2">

                                            Account

                                            <span className="text-danger ms-1">
                                                *
                                            </span>

                                        </label>


                                        <select
                                            className="form-select form-select-lg bg-white"
                                            name="account"
                                            value={
                                                form.account
                                            }
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

                                                        : "Select account"

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
                                                            account.name
                                                        }

                                                        {" — "}

                                                        {
                                                            account.bank
                                                        }

                                                        {" — ₹"}

                                                        {
                                                            formatBalance(
                                                                account.openingBalance
                                                            )
                                                        }

                                                    </option>

                                                )
                                            )}

                                        </select>


                                        {accounts.length === 0 &&
                                            !accountsLoading && (

                                                <div className="text-danger small mt-2">

                                                    No active accounts available.
                                                    Please create an account first.

                                                </div>

                                            )}

                                    </div>


                                    {/* SELECTED ACCOUNT */}

                                    <div className="col-12 col-md-4">

                                        {selectedAccount ? (

                                            <div className="bg-white border rounded p-3">

                                                <div className="small text-muted">

                                                    Income will be added to

                                                </div>


                                                <div className="fw-bold mt-1">

                                                    {
                                                        selectedAccount.name
                                                    }

                                                </div>


                                                <div className="small text-muted">

                                                    {
                                                        selectedAccount.bank
                                                    }

                                                </div>


                                                <div className="text-success fw-semibold mt-2">

                                                    ₹{" "}

                                                    {
                                                        formatBalance(
                                                            selectedAccount.openingBalance
                                                        )
                                                    }

                                                </div>

                                            </div>

                                        ) : (

                                            <div className="text-muted small">

                                                Select an account to see its
                                                current balance.

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            DATE
                        ================================================== */}

                        <div className="col-12 col-md-5">

                            <label className="form-label fw-semibold">

                                Date

                                <span className="text-danger ms-1">
                                    *
                                </span>

                            </label>


                            <input
                                type="date"
                                className="form-control form-control-lg"
                                name="date"
                                value={
                                    form.date
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* =================================================
                            NOTE
                        ================================================== */}

                        <div className="col-12 col-md-7">

                            <label className="form-label fw-semibold">

                                Note

                            </label>


                            <input
                                type="text"
                                className="form-control form-control-lg"
                                name="note"
                                value={
                                    form.note
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Optional note"
                            />

                        </div>

                    </div>


                    {/* =================================================
                        DIVIDER
                    ================================================== */}

                    <hr className="my-4" />


                    {/* =================================================
                        FOOTER BUTTONS
                    ================================================== */}

                    <div className="d-flex justify-content-end gap-2">

                        <button
                            type="button"
                            className="btn btn-light border px-4"
                            onClick={() =>
                                navigate("/income")
                            }
                            disabled={loading}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                            disabled={

                                loading ||

                                itemsLoading ||

                                accountsLoading ||

                                accounts.length === 0

                            }
                        >

                            {loading ? (

                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                    />

                                    Saving...

                                </>

                            ) : (

                                "Save Income"

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default IncomeForm;