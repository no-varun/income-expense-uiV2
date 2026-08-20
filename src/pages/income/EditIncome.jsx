import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import IncomeForm from "../../components/income/IncomeForm";

import {
    getIncomeById,
    updateIncome
} from "../../api/incomeApi";


const EditIncome = () => {

    const {
        id
    } = useParams();


    const navigate =
        useNavigate();


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [income, setIncome] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | LOAD INCOME
    |--------------------------------------------------------------------------
    */

    const loadIncome = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getIncomeById(
                    id
                );


            console.log(
                "Edit Income API Response:",
                response
            );


            /*
            |--------------------------------------------------------------------------
            | HANDLE DIFFERENT API RESPONSE FORMATS
            |--------------------------------------------------------------------------
            |
            | Format 1:
            |
            | {
            |     success: true,
            |     data: {
            |         _id: "...",
            |         title: "Cash Back"
            |     }
            | }
            |
            |
            | Format 2:
            |
            | {
            |     data: {
            |         success: true,
            |         data: {
            |             _id: "...",
            |             title: "Cash Back"
            |         }
            |     }
            | }
            |
            |
            | Format 3:
            |
            | {
            |     _id: "...",
            |     title: "Cash Back"
            | }
            |--------------------------------------------------------------------------
            */


            let payload =
                response;


            /*
            |--------------------------------------------------------------------------
            | Axios response wrapper
            |--------------------------------------------------------------------------
            */

            if (
                response?.data?.success !==
                undefined
            ) {

                payload =
                    response.data;

            }


            console.log(
                "Edit Income Payload:",
                payload
            );


            /*
            |--------------------------------------------------------------------------
            | Check success
            |--------------------------------------------------------------------------
            */

            if (
                payload?.success === false
            ) {

                setError(

                    payload?.message ||
                    "Income not found."

                );

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | Extract Income
            |--------------------------------------------------------------------------
            */

            let incomeData =
                null;


            /*
            |--------------------------------------------------------------------------
            | Normal ApiResponse:
            |
            | {
            |     success: true,
            |     data: {...}
            | }
            |--------------------------------------------------------------------------
            */

            if (
                payload?.success === true &&
                payload?.data
            ) {

                incomeData =
                    payload.data;

            }


            /*
            |--------------------------------------------------------------------------
            | If API already returned the income object
            |--------------------------------------------------------------------------
            */

            else if (
                payload?._id
            ) {

                incomeData =
                    payload;

            }


            /*
            |--------------------------------------------------------------------------
            | Additional nested response support
            |--------------------------------------------------------------------------
            */

            else if (
                payload?.data?.data?._id
            ) {

                incomeData =
                    payload.data.data;

            }


            console.log(
                "Edit Income Data:",
                incomeData
            );


            /*
            |--------------------------------------------------------------------------
            | SET DATA
            |--------------------------------------------------------------------------
            */

            if (
                incomeData?._id
            ) {

                setIncome(
                    incomeData
                );

            } else {

                setError(
                    "Income not found."
                );

            }

        } catch (error) {

            console.error(
                "Get Income Error:",
                error
            );


            console.error(
                "Get Income API Error:",
                error?.response?.data
            );


            setError(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to load income."

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
                "Income ID is missing."
            );

            setLoading(false);

            return;

        }


        loadIncome();

    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | UPDATE INCOME
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        formData
    ) => {

        try {

            setSaving(true);


            console.log(
                "Update Income Data:",
                formData
            );


            const response =
                await updateIncome(

                    id,

                    formData

                );


            console.log(
                "Update Income Response:",
                response
            );


            /*
            |--------------------------------------------------------------------------
            | Handle response
            |--------------------------------------------------------------------------
            */

            const payload =
                response?.data?.success !==
                undefined

                    ? response.data

                    : response;


            if (
                payload?.success
            ) {

                alert(

                    payload.message ||
                    "Income updated successfully."

                );


                /*
                |--------------------------------------------------------------------------
                | Go back to income list
                |--------------------------------------------------------------------------
                */

                navigate(
                    "/income"
                );

                return;

            }


            alert(

                payload?.message ||
                "Unable to update income."

            );

        } catch (error) {

            console.error(
                "Update Income Error:",
                error
            );


            console.error(
                "Update Income API Error:",
                error?.response?.data
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to update income."

            );

        } finally {

            setSaving(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | LOADING SCREEN
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="container-fluid px-4 py-4">

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <div className="mt-3 text-muted">

                            Loading income...

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | ERROR SCREEN
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div className="container-fluid px-4 py-4">

                <div className="alert alert-danger">

                    <div className="fw-bold mb-1">

                        Unable to load income

                    </div>


                    <div>

                        {error}

                    </div>


                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mt-3"
                        onClick={() =>
                            navigate(
                                "/income"
                            )
                        }
                    >

                        ← Back to Income

                    </button>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | NO INCOME
    |--------------------------------------------------------------------------
    */

    if (!income) {

        return (

            <div className="container-fluid px-4 py-4">

                <div className="alert alert-warning">

                    Income not found.

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="container-fluid px-4 py-3">

            <div className="row">

                <div className="col-12">

                    <IncomeForm

                        initialValues={
                            income
                        }

                        onSubmit={
                            handleSubmit
                        }

                        loading={
                            saving
                        }

                    />

                </div>

            </div>

        </div>

    );

};


export default EditIncome;