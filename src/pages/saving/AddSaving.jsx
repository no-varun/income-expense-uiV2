import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SavingForm from "../../components/saving/SavingForm";

import {
    createSaving,
} from "../../api/savingApi";


const AddSaving = () => {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | CREATE SAVING
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        formData
    ) => {

        try {

            setLoading(true);

            console.log(
                "Create Saving Payload:",
                formData
            );


            const response =
                await createSaving(
                    formData
                );


            console.log(
                "Create Saving Response:",
                response
            );


            if (
                response?.success
            ) {

                alert(
                    response.message ||
                    "Saving created successfully."
                );


                navigate(
                    "/saving"
                );

                return;

            }


            alert(
                response?.message ||
                "Unable to create saving."
            );


        } catch (error) {

            console.error(
                "Create Saving Error:",
                error
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to create saving."

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

        <SavingForm

            onSubmit={
                handleSubmit
            }

            loading={
                loading
            }

        />

    );

};


export default AddSaving;