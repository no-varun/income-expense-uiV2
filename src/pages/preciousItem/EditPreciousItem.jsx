import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PreciousItemForm from "../../components/preciousItem/PreciousItemForm";

import { getPreciousItem, updatePreciousItem } from "../../api/preciousItemApi";

const EditPreciousItem = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState({});

    const loadPreciousItem = async () => {

        try {

            const response = await getPreciousItem(id);

            if (response.success) {

                setInitialValues(response.data);

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to load preciousItem."
            );

        }

    };

    useEffect(() => {

        loadPreciousItem();

    }, []);

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);

            const response = await updatePreciousItem(
                id,
                formData
            );

            if (response.success) {

                alert(response.message);

                navigate("/preciousItem");

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to update preciousItem."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid">

            <div className="mb-4">

                <h3>

                    Edit preciousItem

                </h3>

            </div>

            <PreciousItemForm
                initialValues={initialValues}
                loading={loading}
                onSubmit={handleSubmit}
            />

        </div>

    );

};

export default EditPreciousItem;