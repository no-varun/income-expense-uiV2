import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/notifications";
import LoanForm from "../../components/loan/LoanForm";
import { createLoan } from "../../api/loanApi";

const AddLoan = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await createLoan(data);

            const isSuccess = response?.success === true || response?.data?.success === true;
            if (isSuccess) {
                notify(
                    response?.message ||
                    response?.data?.message ||
                    "Loan recorded successfully."
                );
                navigate("/loans");
                return;
            }

            notify(
                response?.message ||
                response?.data?.message ||
                "Unable to record loan."
            );
        } catch (error) {
            notify(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to record loan."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid px-0">
            <LoanForm
                loading={loading}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default AddLoan;
