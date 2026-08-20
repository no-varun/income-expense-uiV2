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
    getAccounts
} from "../../api/accountApi";


const DebtForm = ({
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

    const [
        categories,
        setCategories
    ] = useState([]);

    const [
        items,
        setItems
    ] = useState([]);

    const [
        accounts,
        setAccounts
    ] = useState([]);


    const [
        itemsLoading,
        setItemsLoading
    ] = useState(false);

    const [
        accountsLoading,
        setAccountsLoading
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | FORM
    |--------------------------------------------------------------------------
    */

    const [
        form,
        setForm
    ] = useState({

        title: "",

        amount: "",

        pendingAmount: "",

        category: "",

        account: "",

        paymentMode: "Cash",

        date:
            new Date()
                .toISOString()
                .split("T")[0],

        note: ""

    });


    /*
    |--------------------------------------------------------------------------
    | PAYMENT MODES
    |--------------------------------------------------------------------------
    */

    const paymentModes = [

        "Cash",

        "Paytm",

        "PhonePe",

        "GPay",

        "Bhim",

        "AmazonPay",

        "BankTransfer",

        "Other"

    ];


    /*
    |--------------------------------------------------------------------------
    | RESPONSE NORMALIZER
    |--------------------------------------------------------------------------
    */

    const normalizeRows = (
        response
    ) => {

        if (
            Array.isArray(
                response?.data
            )
        ) {

            return response.data;

        }

        if (
            Array.isArray(
                response?.data?.rows
            )
        ) {

            return response.data.rows;

        }

        if (
            Array.isArray(
                response?.data?.data
            )
        ) {

            return response.data.data;

        }

        if (
            Array.isArray(
                response?.data?.data?.rows
            )
        ) {

            return response.data.data.rows;

        }

        if (
            Array.isArray(
                response?.rows
            )
        ) {

            return response.rows;

        }

        return [];

    };


    /*
    |--------------------------------------------------------------------------
    | LOAD CATEGORIES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadCategories =
            async () => {

                try {

                    const response =
                        await getCategories({

                            limit: 100,

                            type: "DEBT"

                        });


                    if (
                        response?.success
                    ) {

                        setCategories(
                            normalizeRows(
                                response
                            )
                        );

                    } else {

                        setCategories([]);

                    }

                } catch (error) {

                    console.error(
                        "Debt Category Error:",
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

        const loadAccounts =
            async () => {

                try {

                    setAccountsLoading(true);


                    const response =
                        await getAccounts({

                            limit: 100,

                            status: true

                        });


                    console.log(
                        "Debt Account Response:",
                        response
                    );


                    if (
                        response?.success
                    ) {

                        const rows =
                            normalizeRows(
                                response
                            );


                        setAccounts(
                            rows
                        );

                    } else {

                        setAccounts([]);

                    }

                } catch (error) {

                    console.error(
                        "Debt Account Error:",
                        error
                    );

                    setAccounts([]);

                } finally {

                    setAccountsLoading(
                        false
                    );

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

                    category: categoryId,

                    type: "DEBT",

                    status: true

                });


            if (
                response?.success
            ) {

                const rows =
                    normalizeRows(
                        response
                    );


                setItems(
                    rows
                );


                return rows;

            }


            setItems([]);

            return [];

        } catch (error) {

            console.error(
                "Debt Item Error:",
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
            Object.keys(
                initialValues
            ).length === 0
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


        const amount =
            initialValues.amount ??
            "";


        const pendingAmount =
            initialValues.pendingAmount ??
            amount;


        setForm({

            title:
                initialValues.title ||
                "",

            amount,

            pendingAmount,

            category:
                categoryId,

            account:
                accountId,

            paymentMode:
                initialValues.paymentMode ||
                "Cash",

            date:
                initialValues.date
                    ? String(
                        initialValues.date
                    ).substring(0, 10)
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
    | CATEGORY CHANGE
    |--------------------------------------------------------------------------
    */

    const handleCategoryChange = async (
        event
    ) => {

        const categoryId =
            event.target.value;


        setForm(
            previous => ({

                ...previous,

                category:
                    categoryId,

                title: ""

            })
        );


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

    const handleItemChange = (
        event
    ) => {

        const itemId =
            event.target.value;


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


        setForm(
            previous => ({

                ...previous,

                title:
                    selectedItem?.name ||
                    ""

            })
        );

    };


    /*
    |--------------------------------------------------------------------------
    | NORMAL CHANGE
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setForm(
            previous => ({

                ...previous,

                [name]: value

            })
        );

    };


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
                "Please select category"
            );

            return;

        }


        if (!form.title.trim()) {

            alert(
                "Please select item"
            );

            return;

        }


        if (
            !form.amount ||
            Number(
                form.amount
            ) <= 0
        ) {

            alert(
                "Amount should be greater than zero"
            );

            return;

        }


        if (!form.account) {

            alert(
                "Please select account"
            );

            return;

        }


        if (
            form.pendingAmount === "" ||
            Number(
                form.pendingAmount
            ) < 0
        ) {

            alert(
                "Please enter valid pending amount"
            );

            return;

        }


        if (
            Number(
                form.pendingAmount
            ) >
            Number(
                form.amount
            )
        ) {

            alert(
                "Pending amount cannot be greater than total amount"
            );

            return;

        }


        onSubmit({

            title:
                form.title.trim(),

            amount:
                Number(
                    form.amount
                ),

            pendingAmount:
                Number(
                    form.pendingAmount
                ),

            category:
                form.category,

            account:
                form.account,

            paymentMode:
                form.paymentMode,

            date:
                form.date,

            note:
                form.note.trim()

        });

    };


    /*
    |--------------------------------------------------------------------------
    | SELECTED ITEM
    |--------------------------------------------------------------------------
    */

    const selectedItemId =
        items.find(
            item =>
                item.name ===
                form.title
        )?._id || "";


    /*
    |--------------------------------------------------------------------------
    | ACCOUNT LABEL
    |--------------------------------------------------------------------------
    */

    const getAccountLabel = (
        account
    ) => {

        if (
            account?.name
        ) {

            return account.name;

        }


        if (
            account?.accountName
        ) {

            return account.accountName;

        }


        if (
            account?.bank
        ) {

            if (
                account?.accountNumber
            ) {

                return `${account.bank} - ${account.accountNumber}`;

            }

            return account.bank;

        }


        return "Account";

    };


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="container-fluid px-0"
        >

            <div
                className="card shadow-sm w-100"
            >


                {/* HEADER */}

                <div
                    className="
                        card-header
                        d-flex
                        justify-content-between
                        align-items-center
                    "
                >

                    <h4 className="mb-0">

                        Debt Details

                    </h4>


                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate(
                                "/debt"
                            )
                        }
                    >

                        Back

                    </button>

                </div>


                {/* BODY */}

                <div className="card-body">

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div className="row g-3">


                            {/* CATEGORY */}

                            <div className="col-12 col-md-6">

                                <label className="form-label">

                                    Category
                                    <span className="text-danger">
                                        *
                                    </span>

                                </label>


                                <select
                                    className="form-select"
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

                                <label className="form-label">

                                    Item
                                    <span className="text-danger">
                                        *
                                    </span>

                                </label>


                                <select
                                    className="form-select"
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
                                                ? "First select category"
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


                            {/* AMOUNT */}

                            <div className="col-12 col-md-6">

                                <label className="form-label">

                                    Total Amount
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


                            {/* PENDING */}

                            <div className="col-12 col-md-6">

                                <label className="form-label">

                                    Pending Amount
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
                                        className="form-control"
                                        name="pendingAmount"
                                        value={
                                            form.pendingAmount
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="0.01"
                                        max={
                                            form.amount ||
                                            undefined
                                        }
                                        placeholder="Enter pending amount"
                                        required
                                    />

                                </div>


                                {form.amount !== "" && (

                                    <small className="text-success">

                                        Recovered Amount: ₹{" "}

                                        {Math.max(
                                            0,
                                            Number(
                                                form.amount || 0
                                            ) -
                                            Number(
                                                form.pendingAmount || 0
                                            )
                                        ).toLocaleString(
                                            "en-IN",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }
                                        )}

                                    </small>

                                )}

                            </div>


                            {/* ACCOUNT */}

                            <div className="col-12 col-md-6">

                                <label className="form-label">

                                    Account
                                    <span className="text-danger">
                                        *
                                    </span>

                                </label>


                                <select
                                    className="form-select"
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
                                                    getAccountLabel(
                                                        account
                                                    )
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* PAYMENT MODE */}

                            <div className="col-12 col-md-6">

                                <label className="form-label">

                                    Payment Mode
                                    <span className="text-danger">
                                        *
                                    </span>

                                </label>


                                <select
                                    className="form-select"
                                    name="paymentMode"
                                    value={
                                        form.paymentMode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    {paymentModes.map(
                                        mode => (

                                            <option
                                                key={mode}
                                                value={mode}
                                            >

                                                {mode}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* DATE */}

                            <div className="col-12 col-md-6">

                                <label className="form-label">

                                    Date
                                    <span className="text-danger">
                                        *
                                    </span>

                                </label>


                                <input
                                    type="date"
                                    className="form-control"
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

                                <label className="form-label">

                                    Note

                                </label>


                                <textarea
                                    rows="4"
                                    className="form-control"
                                    name="note"
                                    value={
                                        form.note
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter note"
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="col-12">

                                <div
                                    className="
                                        d-flex
                                        gap-2
                                        flex-wrap
                                    "
                                >

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
                                            ? "Please wait..."
                                            : "Save Debt"
                                        }

                                    </button>


                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            navigate(
                                                "/debt"
                                            )
                                        }
                                    >

                                        Cancel

                                    </button>

                                </div>

                            </div>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

};


export default DebtForm;