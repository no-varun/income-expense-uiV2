import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import ExpenseForm
    from "../../components/expense/ExpenseForm";

import {
    getExpense,
    updateExpense
} from "../../api/expenseApi";


const EditExpense = () => {

    const {
        id
    } = useParams();


    const navigate =
        useNavigate();


    const [expense, setExpense] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | LOAD EXPENSE
    |--------------------------------------------------------------------------
    */

    const loadExpense = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getExpense(
                    id
                );


            console.log(
                "Get Expense Response:",
                response
            );


            let payload =
                response;


            /*
            |--------------------------------------------------------------------------
            | SUPPORT AXIOS RESPONSE
            |--------------------------------------------------------------------------
            */

            if (
                response?.data?.success !==
                undefined
            ) {

                payload =
                    response.data;

            }


            if (
                payload?.success === false
            ) {

                setError(
                    payload.message ||
                    "Expense not found."
                );

                return;

            }


            let expenseData = null;


            if (
                payload?.success &&
                payload?.data
            ) {

                expenseData =
                    payload.data;

            } else if (
                payload?._id
            ) {

                expenseData =
                    payload;

            } else if (
                payload?.data?.data?._id
            ) {

                expenseData =
                    payload.data.data;

            }


            console.log(
                "Expense Data:",
                expenseData
            );


            if (
                expenseData?._id
            ) {

                setExpense(
                    expenseData
                );

            } else {

                setError(
                    "Expense not found."
                );

            }

        } catch (error) {

            console.error(
                "Get Expense Error:",
                error
            );


            setError(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to load expense."

            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!id) {

            setError(
                "Expense ID is missing."
            );

            setLoading(false);

            return;

        }


        loadExpense();

    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | UPDATE EXPENSE
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        formData
    ) => {

        try {

            setSaving(true);


            console.log(
                "Update Expense Payload:",
                formData
            );


            const response =
                await updateExpense(
                    id,
                    formData
                );


            console.log(
                "Update Expense Response:",
                response
            );


            if (
                response?.success
            ) {

                alert(

                    response.message ||
                    "Expense updated successfully."

                );


                navigate(
                    "/expense"
                );

                return;

            }


            alert(

                response?.message ||
                "Unable to update expense."

            );

        } catch (error) {

            console.error(
                "Update Expense Error:",
                error
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to update expense."

            );

        } finally {

            setSaving(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="container-fluid px-4 py-5">

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <div
                            className="spinner-border text-primary"
                        />

                        <div className="mt-3 text-muted">

                            Loading expense...

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div className="container-fluid px-4 py-4">

                <div className="alert alert-danger">

                    <div className="fw-bold">

                        Unable to load expense

                    </div>


                    <div className="mt-1">

                        {error}

                    </div>


                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mt-3"
                        onClick={() =>
                            navigate(
                                "/expense"
                            )
                        }
                    >

                        ← Back to Expense

                    </button>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!expense) {

        return (

            <div className="container-fluid px-4 py-4">

                <div className="alert alert-warning">

                    Expense not found.

                </div>

            </div>

        );

    }


    return (

        <div className="container-fluid px-4 py-3">

            <ExpenseForm

                initialValues={
                    expense
                }

                onSubmit={
                    handleSubmit
                }

                loading={
                    saving
                }

            />

        </div>

    );

};


export default EditExpense;