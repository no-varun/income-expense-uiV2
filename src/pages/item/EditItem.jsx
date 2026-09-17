import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getItem,
    updateItem
} from "../../api/itemApi";
import ItemForm from "../../components/item/ItemForm";
import { aesDecrypt, SECRET_KEY } from "../../utils/helpers";

const EditItem = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({});

    const loadItem = useCallback(async () => {

        try {

            const response = await getItem(id);

            if (response.success) {
                let itemData = response.data?.data ?? response.data;
                if (typeof itemData === "string") {
                    try {
                        const decrypted = aesDecrypt(SECRET_KEY, itemData);
                        itemData = decrypted ? JSON.parse(decrypted) : JSON.parse(itemData);
                    } catch (e) {
                        console.error("Failed to parse item data:", e);
                    }
                }
                setInitialValues(itemData && typeof itemData === "object" ? itemData : {});
            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to load item."
            );

        }

    }, [id]);

    useEffect(() => {

        loadItem();

    }, [loadItem]);

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);

            const response = await updateItem(id, formData);

            if (response.success) {
                alert(response.message);
                navigate("/items");
            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to update item."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid">

            <div className="mb-4">
                <h3>Edit Item</h3>
            </div>

            <ItemForm
                initialValues={initialValues}
                loading={loading}
                onSubmit={handleSubmit}
            />

        </div>

    );

};

export default EditItem;
