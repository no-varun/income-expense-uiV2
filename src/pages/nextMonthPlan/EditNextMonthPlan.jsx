import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { notify } from "../../utils/notifications";
import { getNextMonthPlan } from "../../api/nextMonthPlanApi";
import NextMonthPlanForm from "../../components/nextMonthPlan/NextMonthPlanForm";

const EditNextMonthPlan = () => {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                setLoading(true);
                const res = await getNextMonthPlan(id);
                const data = res?.data?.data || res?.data || res;
                if (data && (data._id || data.title)) {
                    setPlan(data);
                } else {
                    notify("Failed to retrieve plan item details");
                }
            } catch (error) {
                notify(error.response?.data?.message || "Failed to fetch plan item");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPlan();
        }
    }, [id]);

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="d-flex align-items-center mb-3">
                        <Link to="/next-month-plan" className="btn btn-outline-secondary btn-sm me-3">
                            <FaArrowLeft className="me-1" /> Back to Plans
                        </Link>
                        <h3 className="mb-0 fw-bold">Edit Planned Item</h3>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <div className="text-muted mt-2">Loading plan item details...</div>
                                </div>
                            ) : plan ? (
                                <NextMonthPlanForm initialData={plan} />
                            ) : (
                                <div className="text-center py-5 text-danger">
                                    Plan item not found or could not be loaded.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditNextMonthPlan;
