import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getCategories
} from "../../api/categoryApi";

import {
    getItems
} from "../../api/itemApi";

import {
    getShops
} from "../../api/shopApi";

import {
    getAccounts
} from "../../api/accountApi";


const ExpenseForm = ({
    initialValues = {},
    onSubmit,
    loading = false
}) => {

    const navigate = useNavigate();


    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    const [categories, setCategories] =
        useState([]);

    const [items, setItems] =
        useState([]);

    const [shops, setShops] =
        useState([]);

    const [accounts, setAccounts] =
        useState([]);


    const [categoriesLoading, setCategoriesLoading] =
        useState(false);

    const [itemsLoading, setItemsLoading] =
        useState(false);

    const [shopsLoading, setShopsLoading] =
        useState(false);

    const [accountsLoading, setAccountsLoading] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | FORM
    |--------------------------------------------------------------------------
    */

    const [form, setForm] = useState({

        title: "",

        amount: "",

        category: "",

        account: "",

        shopType: "",

        shop: "",

        paymentMode: "Cash",

        date:
            new Date()
                .toISOString()
                .split("T")[0],

        note: ""

    });


    /*
    |--------------------------------------------------------------------------
    | GET ROWS
    |--------------------------------------------------------------------------
    */

    const getRows = (
        response
    ) => {

        const payload =
            response?.data?.success !== undefined
                ? response.data
                : response;


        if (
            payload?.success === false
        ) {

            return [];

        }


        if (
            Array.isArray(
                payload?.data
            )
        ) {

            return payload.data;

        }


        if (
            Array.isArray(
                payload?.data?.data
            )
        ) {

            return payload.data.data;

        }


        if (
            Array.isArray(
                payload?.data?.rows
            )
        ) {

            return payload.data.rows;

        }


        if (
            Array.isArray(
                payload?.rows
            )
        ) {

            return payload.rows;

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

                setCategoriesLoading(true);


                const response =
                    await getCategories({
                        limit: 100,
                        type: "EXPENSE"
                    });


                setCategories(
                    getRows(response)
                );

            } catch (error) {

                console.error(
                    "Category load error:",
                    error
                );

                setCategories([]);

            } finally {

                setCategoriesLoading(false);

            }

        };


        loadCategories();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | LOAD SHOPS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadShops = async () => {

            try {

                setShopsLoading(true);


                const response =
                    await getShops({
                        limit: 100,
                        status: true
                    });


                setShops(
                    getRows(response)
                );

            } catch (error) {

                console.error(
                    "Shop load error:",
                    error
                );

                setShops([]);

            } finally {

                setShopsLoading(false);

            }

        };


        loadShops();

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
                        limit: 100,
                        status: true
                    });


                console.log(
                    "Account Response:",
                    response
                );


                setAccounts(
                    getRows(response)
                );

            } catch (error) {

                console.error(
                    "Account load error:",
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

            return;

        }


        try {

            setItemsLoading(true);


            const response =
                await getItems({
                    limit: 100,
                    status: true,
                    category: categoryId,
                    type: "EXPENSE"
                });


            setItems(
                getRows(response)
            );

        } catch (error) {

            console.error(
                "Item load error:",
                error
            );

            setItems([]);

        } finally {

            setItemsLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | EDIT DATA
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


        const accountId =
            initialValues.account?._id ||
            initialValues.account ||
            "";


        const shopId =
            initialValues.shop?._id ||
            initialValues.shop ||
            "";


        setForm({

            title:
                initialValues.title ||
                "",

            amount:
                initialValues.amount ??
                "",

            category:
                categoryId,

            account:
                accountId,

            shopType:
                initialValues.shopType ||
                "",

            shop:
                shopId,

            paymentMode:
                initialValues.paymentMode ||
                "Cash",

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

    const handleChange = async (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        if (
            name === "category"
        ) {

            setForm(prev => ({

                ...prev,

                category: value,

                title: ""

            }));


            await loadItems(
                value
            );

            return;

        }


        if (
            name === "shopType"
        ) {

            setForm(prev => ({

                ...prev,

                shopType: value,

                shop: ""

            }));

            return;

        }


        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    /*
    |--------------------------------------------------------------------------
    | FILTER SHOPS
    |--------------------------------------------------------------------------
    */

    const filteredShops =
        shops.filter(
            shop => {

                if (
                    !form.shopType
                ) {

                    return false;

                }


                return (

                    String(
                        shop.type || ""
                    ).toUpperCase() ===

                    String(
                        form.shopType
                    ).toUpperCase()

                );

            }
        );


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (
        event
    ) => {

        event.preventDefault();


        if (!form.category) {

            alert(
                "Please select Category"
            );

            return;

        }


        if (!form.account) {

            alert(
                "Please select Account"
            );

            return;

        }


        if (!form.shopType) {

            alert(
                "Please select Shop Type"
            );

            return;

        }


        if (!form.shop) {

            alert(
                "Please select Shop"
            );

            return;

        }


        if (!form.title) {

            alert(
                "Please select Item"
            );

            return;

        }


        if (
            !form.amount ||
            Number(form.amount) <= 0
        ) {

            alert(
                "Amount must be greater than 0"
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | ACCOUNT BASED PAYLOAD
        |--------------------------------------------------------------------------
        */

        const payload = {

            title:
                form.title,

            amount:
                Number(
                    form.amount
                ),

            category:
                form.category,

            account:
                form.account,

            shopType:
                form.shopType,

            shop:
                form.shop,

            paymentMode:
                form.paymentMode,

            date:
                form.date,

            note:
                form.note

        };


        console.log(
            "Expense Payload:",
            payload
        );


        onSubmit(
            payload
        );

    };


    return (

        <div className="container-fluid px-0">

            <div className="card border-0 shadow-sm">

                {/* HEADER */}

                <div className="card-header bg-white border-bottom px-4 py-3">

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <h4 className="mb-1 fw-bold">

                                {initialValues?._id
                                    ? "Edit Expense"
                                    : "Add Expense"
                                }

                            </h4>

                            <div className="text-muted small">

                                Manage your expense details.

                            </div>

                        </div>


                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                                navigate(
                                    "/expense"
                                )
                            }
                            disabled={loading}
                        >

                            ← Back

                        </button>

                    </div>

                </div>


                {/* BODY */}

                <div className="card-body p-4">

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

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
                                        handleChange
                                    }
                                    disabled={
                                        categoriesLoading
                                    }
                                    required
                                >

                                    <option value="">

                                        {categoriesLoading
                                            ? "Loading categories..."
                                            : "Select Category"
                                        }

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
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleChange
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
                                                    item.name
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


                            {/* ACCOUNT */}

                            <div className="col-12 col-md-6">

                                <label className="form-label fw-semibold">

                                    Account

                                    <span className="text-danger ms-1">
                                        *
                                    </span>

                                </label>


                                <select
                                    className="form-select form-select-lg"
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
                                                    account.name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>


                                {!accountsLoading &&
                                    accounts.length === 0 && (

                                        <div className="text-danger small mt-1">

                                            No accounts found.

                                        </div>

                                    )}

                            </div>


                            {/* AMOUNT */}

                            <div className="col-12 col-md-6">

                                <label className="form-label fw-semibold">

                                    Amount

                                    <span className="text-danger ms-1">
                                        *
                                    </span>

                                </label>


                                <div className="input-group input-group-lg">

                                    <span className="input-group-text">
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
                                        placeholder="Enter amount"
                                        required
                                    />

                                </div>

                            </div>


                            {/* SHOP TYPE */}

                            <div className="col-12 col-md-6">

                                <label className="form-label fw-semibold">

                                    Shop Type

                                    <span className="text-danger ms-1">
                                        *
                                    </span>

                                </label>


                                <select
                                    className="form-select form-select-lg"
                                    name="shopType"
                                    value={
                                        form.shopType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Shop Type
                                    </option>

                                    <option value="ONLINE">
                                        ONLINE
                                    </option>

                                    <option value="OFFLINE">
                                        OFFLINE
                                    </option>

                                </select>

                            </div>


                            {/* SHOP */}

                            <div className="col-12 col-md-6">

                                <label className="form-label fw-semibold">

                                    Shop

                                    <span className="text-danger ms-1">
                                        *
                                    </span>

                                </label>


                                <select
                                    className="form-select form-select-lg"
                                    name="shop"
                                    value={
                                        form.shop
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        !form.shopType ||
                                        shopsLoading
                                    }
                                    required
                                >

                                    <option value="">

                                        {shopsLoading
                                            ? "Loading shops..."
                                            : !form.shopType
                                                ? "Select shop type first"
                                                : "Select Shop"
                                        }

                                    </option>


                                    {filteredShops.map(
                                        shop => (

                                            <option
                                                key={
                                                    shop._id
                                                }
                                                value={
                                                    shop._id
                                                }
                                            >

                                                {
                                                    shop.name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* PAYMENT MODE */}

                            <div className="col-12 col-md-6">

                                <label className="form-label fw-semibold">

                                    Payment Mode

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
                                >

                                    <option value="Cash">
                                        Cash
                                    </option>

                                    <option value="AmazonPay">
                                        Amazon Pay
                                    </option>

                                    <option value="BankTransfer">
                                        Bank Transfer
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

                            <div className="col-12 col-md-6">

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


                            {/* NOTE */}

                            <div className="col-12">

                                <label className="form-label fw-semibold">

                                    Note

                                </label>


                                <textarea
                                    className="form-control"
                                    name="note"
                                    value={
                                        form.note
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="3"
                                    placeholder="Optional note"
                                />

                            </div>

                        </div>


                        <hr className="my-4" />


                        <div className="d-flex justify-content-end gap-2">

                            <button
                                type="button"
                                className="btn btn-light border px-4"
                                onClick={() =>
                                    navigate(
                                        "/expense"
                                    )
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
                                    accountsLoading
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

                                    initialValues?._id
                                        ? "Update Expense"
                                        : "Save Expense"

                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

};


export default ExpenseForm;