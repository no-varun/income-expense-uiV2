import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import NextMonthPlanForm from "../../components/nextMonthPlan/NextMonthPlanForm";

const AddNextMonthPlan = () => {
    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="d-flex align-items-center mb-3">
                        <Link to="/next-month-plan" className="btn btn-outline-secondary btn-sm me-3">
                            <FaArrowLeft className="me-1" /> Back to Plans
                        </Link>
                        <h3 className="mb-0 fw-bold">Plan Next Month Income / Expense</h3>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <NextMonthPlanForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNextMonthPlan;
