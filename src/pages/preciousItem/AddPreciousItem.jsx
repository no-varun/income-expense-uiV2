import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PreciousItemForm from "../../components/preciousItem/PreciousItemForm";
import { createPreciousItem } from "../../api/preciousItemApi";

const AddPreciousItem = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);

            const response = await createPreciousItem(formData);

            if (response.success) {

                alert(response.message);

                navigate("/preciousItem");

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to create preciousItem."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid">

            <div className="mb-4">

                <h3>

                    Add Shop

                </h3>

            </div>

            <PreciousItemForm
                loading={loading}
                onSubmit={handleSubmit}
            />

        </div>

    );

};

export default AddPreciousItem;