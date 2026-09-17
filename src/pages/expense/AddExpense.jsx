import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ExpenseForm from "../../components/expense/ExpenseForm";
import { createExpense } from "../../api/expenseApi";


const AddExpense = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (payload) => {

      

        try {

            setLoading(true);


            /*
            |--------------------------------------------------------------------------
            | API
            |--------------------------------------------------------------------------
            */

            const response =await createExpense(payload);
            /*
            |--------------------------------------------------------------------------
            | SUCCESS
            |--------------------------------------------------------------------------
            */

            if (
                response?.success === true
            ) {

              

                /*
                |--------------------------------------------------------------------------
                | SHOW SUCCESS
                |--------------------------------------------------------------------------
                */

                alert(
                    response.message ||
                    "Expense created successfully."
                );


                /*
                |--------------------------------------------------------------------------
                | NAVIGATE
                |--------------------------------------------------------------------------
                */

                navigate(
                    "/expense",
                    {
                        replace: true
                    }
                );


                return;

            }


            /*
            |--------------------------------------------------------------------------
            | FAILED RESPONSE
            |--------------------------------------------------------------------------
            */

            // console.error(
                // "ADD EXPENSE: API RETURNED FAILURE",
                // response
            // );


            alert(
                response?.message ||
                "Unable to create expense."
            );


        } catch (error) {

            // console.error(
                // "========================================"
            // );

            // console.error(
                // "ADD EXPENSE: EXCEPTION",
                // error
            // );

            // console.error(
                // "ADD EXPENSE: ERROR RESPONSE",
                // error?.response?.data
            // );

            // console.error(
                // "========================================"
            // );


            const errorResponse =
                error?.response?.data;


            alert(

                errorResponse?.message ||

                error?.message ||

                "Unable to create expense."

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

        <div className="container-fluid px-4 py-3">

            <ExpenseForm
                initialValues={{}}
                onSubmit={handleSubmit}
                loading={loading}
            />

        </div>

    );

};


export default AddExpense;