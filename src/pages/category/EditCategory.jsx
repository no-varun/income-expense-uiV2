import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CategoryForm from "../../components/category/CategoryForm";

import {
    getCategory,
    updateCategory
} from "../../api/categoryApi";
import { aesDecrypt, SECRET_KEY } from "../../utils/helpers";

const EditCategory = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState({});

    const loadCategory = async () => {

        try {

            const response = await getCategory(id);

            if (response.success) {

                let catData = response.data?.data ?? response.data;
                if (typeof catData === "string") {
                    try {
                        const decrypted = aesDecrypt(SECRET_KEY, catData);
                        catData = decrypted ? JSON.parse(decrypted) : JSON.parse(catData);
                    } catch (e) {
                        console.error("Failed to parse category data:", e);
                    }
                }
                setInitialValues(catData && typeof catData === "object" ? catData : {});

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to load category."
            );

        }

    };

    useEffect(() => {

        if (id) {
            loadCategory();
        }

    }, [id]);

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);

            const response = await updateCategory(
                id,
                formData
            );

            if (response.success) {

                alert(response.message);

                navigate("/categories");

            } else {

                alert(response.message);

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to update category."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container-fluid">

            <div className="mb-4">

                <h3>

                    Edit Category

                </h3>

            </div>

            <CategoryForm
                initialValues={initialValues}
                loading={loading}
                onSubmit={handleSubmit}
            />

        </div>

    );

};

export default EditCategory;