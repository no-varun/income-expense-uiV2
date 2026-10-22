import { notify } from "../../utils/notifications";
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

                notify(response.message);

                navigate("/preciousItem");

            } else {

                notify(response.message);

            }

        } catch (error) {

            notify(
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

                    Add PreciousItem

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