import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import MilkForm
    from "../../components/milk/MilkForm";

import {
    getMilkById, updateMilk
} from "../../api/milkManageApi";


const EditMilk = () => {

    const {
        id
    } = useParams();

    const navigate =
        useNavigate();


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [milk, setMilk] =
        useState({});


    /*
    |--------------------------------------------------------------------------
    | LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadMilk =
            async () => {

                try {

                    setLoading(
                        true
                    );


                    const response =
                        await getMilkById(
                            id
                        );



                    if (
                        response?.success !== true
                    ) {

                        alert(
                            response?.message ||
                            "Unable to fetch milk record."
                        );


                        navigate(
                            "/milk"
                        );


                        return;

                    }


                    setMilk(
                        response.data
                    );

                } catch (error) {

                    console.error(
                        "GET MILK ERROR:",
                        error
                    );


                    alert(

                        error?.response?.data?.message ||

                        "Unable to fetch milk record."

                    );


                    navigate(
                        "/milk"
                    );

                } finally {

                    setLoading(
                        false
                    );

                }

            };


        if (
            id
        ) {

            loadMilk();

        }

    }, [id, navigate]);


    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        payload
    ) => {

        try {

            setSaving(
                true
            );


            const response =
                await updateMilk(
                    id,
                    payload
                );

            if (
                response?.success === true
            ) {

                alert(
                    response.message ||
                    "Milk record updated successfully."
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
                "Unable to update milk record."
            );

        } catch (error) {

            console.error(
                "UPDATE MILK ERROR:",
                error
            );


            alert(

                error?.response?.data?.message ||

                error?.message ||

                "Unable to update milk record."

            );

        } finally {

            setSaving(
                false
            );

        }

    };


    if (
        loading
    ) {

        return (

            <div className="container-fluid px-4 py-5">

                <div className="text-center">

                    <div
                        className="spinner-border"
                    />

                    <div className="mt-2 text-muted">

                        Loading milk record...

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="container-fluid px-4 py-3">

            <MilkForm
                initialValues={
                    milk
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


export default EditMilk;