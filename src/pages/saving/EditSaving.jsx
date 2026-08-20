import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import SavingForm from "../../components/saving/SavingForm";

import {
    getSaving,
    updateSaving
} from "../../api/savingApi";


const EditSaving = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    const [saving, setSaving] = useState(null);

    const [loading, setLoading] = useState(true);

    const [savingLoading, setSavingLoading] =
        useState(false);

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | LOAD SAVING
    |--------------------------------------------------------------------------
    */

    const loadSaving = async () => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "Loading Saving ID:",
                id
            );


            const response =
                await getSaving(id);


            console.log(
                "Saving API Response:",
                response
            );


            /*
            |--------------------------------------------------------------------------
            | SUPPORT BOTH RESPONSE FORMATS
            |--------------------------------------------------------------------------
            |
            | FORMAT 1:
            |
            | {
            |     success: true,
            |     data: {...}
            | }
            |
            |
            | FORMAT 2:
            |
            | {
            |     _id: "...",
            |     title: "...",
            |     amount: 100
            | }
            |
            |--------------------------------------------------------------------------
            */


            let savingData = null;


            /*
            |--------------------------------------------------------------
            | API RESPONSE WITH success + data
            |--------------------------------------------------------------
            */

            if (
                response?.success === true
            ) {

                savingData =
                    response?.data?.data ||
                    response?.data;

            }


            /*
            |--------------------------------------------------------------
            | API RESPONSE DIRECT OBJECT
            |--------------------------------------------------------------
            */

            else if (
                response?._id
            ) {

                savingData =
                    response;

            }


            /*
            |--------------------------------------------------------------
            | AXIOS RESPONSE FORMAT
            |--------------------------------------------------------------
            */

            else if (
                response?.data?._id
            ) {

                savingData =
                    response.data;

            }


            console.log(
                "Saving Data:",
                savingData
            );


            if (
                savingData?._id
            ) {

                setSaving(
                    savingData
                );

                return;

            }


            setError(
                response?.message ||
                "Saving not found."
            );


        } catch (error) {

            console.error(
                "Get Saving Error:",
                error
            );


            setError(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to load saving."

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

            loadSaving();

        }

    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | UPDATE SAVING
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        formData
    ) => {

        try {

            setSavingLoading(true);


            console.log(
                "Update Saving Payload:",
                formData
            );


            const response =
                await updateSaving(
                    id,
                    formData
                );


            console.log(
                "Update Saving Response:",
                response
            );


            /*
            |--------------------------------------------------------------------------
            | SUPPORT BOTH RESPONSE FORMATS
            |--------------------------------------------------------------------------
            */

            const isSuccess =
                response?.success === true ||
                response?._id ||
                response?.data?._id;


            if (isSuccess) {

                alert(
                    response?.message ||
                    "Saving updated successfully."
                );


                navigate(
                    "/saving"
                );

                return;

            }


            alert(

                response?.message ||

                "Unable to update saving."

            );


        } catch (error) {

            console.error(
                "Update Saving Error:",
                error
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to update saving."

            );

        } finally {

            setSavingLoading(false);

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

                <div className="text-center">

                    <div
                        className="
                            spinner-border
                            text-primary
                        "
                        role="status"
                    />

                    <div className="mt-3 text-muted">

                        Loading saving...

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

                        Unable to load saving

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
                                "/saving"
                            )
                        }
                    >

                        Back to Saving

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

    if (!saving) {

        return (

            <div className="container-fluid px-4 py-4">

                <div className="alert alert-warning">

                    Saving not found.

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | FORM
    |--------------------------------------------------------------------------
    */

    return (

        <SavingForm

            initialValues={
                saving
            }

            onSubmit={
                handleSubmit
            }

            loading={
                savingLoading
            }

        />

    );

};


export default EditSaving;