import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PreciousItemForm from "../../components/preciousItem/PreciousItemForm";

import { getPreciousItem, updatePreciousItem } from "../../api/preciousItemApi";
import { aesDecrypt } from "../../utils/helpers";

let secretKey = "n63expe6oc4dahmi";

const EditPreciousItem = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState({});

    const loadPreciousItem = async () => {

        try {

            const response = await getPreciousItem(id);

            if (response.success) {

                let itemData =
                    response.data?.data ??
                    response.data?.item ??
                    response.data?.preciousItem ??
                    response.data;

                if (typeof itemData === "string") {
                    try {
                        const decrypted = aesDecrypt(secretKey, itemData);
                        if (decrypted) {
                            itemData = JSON.parse(decrypted);
                        } else {
                            itemData = JSON.parse(itemData);
                        }
                    } catch (e) {
                        console.error("Failed to parse preciousItem data:", e);
                    }
                }

                if (itemData?.rows && Array.isArray(itemData.rows)) {
                    itemData = itemData.rows[0] || {};
                } else if (itemData?.data && typeof itemData.data === "object") {
                    itemData = Array.isArray(itemData.data) ? itemData.data[0] || {} : itemData.data;
                } else if (Array.isArray(itemData)) {
                    itemData = itemData[0] || {};
                }

                setInitialValues(
                    itemData && typeof itemData === "object" ? itemData : {}
                );

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

        if (id) {
            loadPreciousItem();
        }

    }, [id]);

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