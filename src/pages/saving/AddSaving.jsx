import { notify } from "../../utils/notifications";
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
            const response = await createSaving(formData);
            if (response?.success) {
                notify(
                    response.message ||
                    "Saving created successfully."
                );


                navigate(
                    "/saving"
                );

                return;

            }


            notify(
                response?.message ||
                "Unable to create saving."
            );


        } catch (error) {

            // console.error(
                // "Create Saving Error:",
                // error
            // );


            notify(

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