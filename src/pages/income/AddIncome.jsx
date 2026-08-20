import { useState } from "react";
import { useNavigate } from "react-router-dom";

import IncomeForm from "../../components/income/IncomeForm";
import { createIncome } from "../../api/incomeApi";


const AddIncome = () => {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (formData) => {

        try {

            setLoading(true);


            const response =
                await createIncome(
                    formData
                );


            if (response?.success) {

                alert(
                    response.message ||
                    "Income created successfully."
                );


                navigate("/income");

                return;

            }


            alert(
                response?.message ||
                "Unable to create income."
            );

        } catch (error) {

            console.error(
                "Create Income Error:",
                error
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to create income."

            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="container-fluid px-4">

            <div className="row">

                <div className="col-12">

                    <IncomeForm
                        onSubmit={
                            handleSubmit
                        }
                        loading={
                            loading
                        }
                    />

                </div>

            </div>

        </div>

    );

};


export default AddIncome;