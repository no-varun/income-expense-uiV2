import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import MilkForm
    from "../../components/milk/MilkForm";

import {
    createMilk
} from "../../api/milkManageApi";


const AddMilk = () => {

    const navigate =
        useNavigate();


    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (
        payload
    ) => {

        try {

            setLoading(true);
            const response =
                await createMilk(
                    payload
                );

            if (
                response?.success === true
            ) {

                alert(
                    response.message ||
                    "Milk record created successfully."
                );


                navigate(
                    "/milk",
                    {
                        replace: true
                    }
                );


                return;

            }


            alert(
                response?.message ||
                "Unable to create milk record."
            );

        } catch (error) {

            console.error(
                "CREATE MILK ERROR:",
                error
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to create milk record."

            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="container-fluid px-4 py-3">

            <MilkForm
                initialValues={{}}
                onSubmit={
                    handleSubmit
                }
                loading={
                    loading
                }
            />

        </div>

    );

};


export default AddMilk;