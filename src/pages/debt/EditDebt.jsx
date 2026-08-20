import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import DebtForm
    from "../../components/debt/DebtForm";

import {
    getDebt,
    updateDebt
} from "../../api/debtApi";


const EditDebt = () => {

    const {
        id
    } = useParams();


    const navigate =
        useNavigate();


    const [
        debt,
        setDebt
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        saving,
        setSaving
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | LOAD DEBT
    |--------------------------------------------------------------------------
    */

    const loadDebt = async () => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "Loading Debt ID:",
                id
            );


            const response =
                await getDebt(
                    id
                );


            console.log(
                "Debt API Response:",
                response
            );


            let debtData = null;


            /*
            |--------------------------------------------------------------------------
            | SUCCESS RESPONSE
            |--------------------------------------------------------------------------
            */

            if (
                response?.success === true
            ) {

                debtData =
                    response?.data?.data ||
                    response?.data;

            }


            /*
            |--------------------------------------------------------------------------
            | DIRECT OBJECT RESPONSE
            |--------------------------------------------------------------------------
            */

            else if (
                response?._id
            ) {

                debtData =
                    response;

            }


            /*
            |--------------------------------------------------------------------------
            | AXIOS STYLE RESPONSE
            |--------------------------------------------------------------------------
            */

            else if (
                response?.data?._id
            ) {

                debtData =
                    response.data;

            }


            console.log(
                "Debt Data:",
                debtData
            );


            if (
                debtData?._id
            ) {

                setDebt(
                    debtData
                );

                return;

            }


            setError(
                response?.message ||
                "Debt not found."
            );


        } catch (error) {

            console.error(
                "Get Debt Error:",
                error
            );


            setError(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to load debt."

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

        if (id) {

            loadDebt();

        }

    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | UPDATE DEBT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        formData
    ) => {

        try {

            setSaving(true);


            console.log(
                "Update Debt Payload:",
                formData
            );


            const response =
                await updateDebt(
                    id,
                    formData
                );


            console.log(
                "Update Debt Response:",
                response
            );


            if (
                response?.success === true
            ) {

                alert(
                    response.message ||
                    "Debt updated successfully."
                );


                navigate(
                    "/debt"
                );

                return;

            }


            alert(
                response?.message ||
                "Unable to update debt."
            );


        } catch (error) {

            console.error(
                "Update Debt Error:",
                error
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to update debt."

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

            <div
                className="
                    container-fluid
                    px-0
                    py-4
                "
            >

                <div
                    className="
                        d-flex
                        justify-content-center
                        align-items-center
                        py-5
                    "
                >

                    <div
                        className="
                            spinner-border
                            text-primary
                        "
                        role="status"
                    />

                    <span className="ms-3">

                        Loading debt...

                    </span>

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

            <div
                className="
                    container-fluid
                    px-0
                    py-4
                "
            >

                <div className="alert alert-danger">

                    <div className="fw-bold">

                        Unable to load debt

                    </div>


                    <div className="mt-1">

                        {error}

                    </div>


                    <button
                        type="button"
                        className="
                            btn
                            btn-outline-danger
                            btn-sm
                            mt-3
                        "
                        onClick={() =>
                            navigate(
                                "/debt"
                            )
                        }
                    >

                        Back to Debt

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

    if (!debt) {

        return (

            <div
                className="
                    container-fluid
                    px-0
                    py-4
                "
            >

                <div className="alert alert-warning">

                    Debt not found.

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

        <div
            className="
                container-fluid
                px-0
                w-100
            "
        >

            <DebtForm

                initialValues={
                    debt
                }

                loading={
                    saving
                }

                onSubmit={
                    handleSubmit
                }

            />

        </div>

    );

};


export default EditDebt;