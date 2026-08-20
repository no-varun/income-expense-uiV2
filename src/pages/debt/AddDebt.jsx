import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import DebtForm
    from "../../components/debt/DebtForm";

import {
    createDebt
} from "../../api/debtApi";


const AddDebt = () => {

    const navigate =
        useNavigate();


    const [
        loading,
        setLoading
    ] = useState(false);


    const handleSubmit = async (
        data
    ) => {

        try {

            setLoading(true);


            console.log(
                "Create Debt Payload:",
                data
            );


            const response =
                await createDebt(
                    data
                );


            console.log(
                "Create Debt Response:",
                response
            );


            if (
                response?.success
            ) {

                alert(
                    response.message ||
                    "Debt created successfully."
                );


                navigate(
                    "/debt"
                );

                return;

            }


            alert(
                response?.message ||
                "Unable to create debt."
            );


        } catch (error) {

            console.error(
                "Create Debt Error:",
                error
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to create debt."

            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="container-fluid px-0">

            <DebtForm

                loading={
                    loading
                }

                onSubmit={
                    handleSubmit
                }

            />

        </div>

    );

};


export default AddDebt;