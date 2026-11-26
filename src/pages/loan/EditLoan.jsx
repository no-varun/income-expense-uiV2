import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notify } from "../../utils/notifications";
import LoanForm from "../../components/loan/LoanForm";
import { getLoan, updateLoan } from "../../api/loanApi";

const EditLoan = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadLoan = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getLoan(id);

            let loanData = null;
            if (response?.success === true) {
                loanData = response?.data?.data || response?.data;
            } else if (response?._id) {
                loanData = response;
            } else if (response?.data?._id) {
                loanData = response.data;
            }

            if (loanData?._id) {
                setLoan(loanData);
                return;
            }

            setError(response?.message || "Loan not found.");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load loan."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadLoan();
        }
    }, [id]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            const response = await updateLoan(id, formData);

            const isSuccess = response?.success === true || response?.data?.success === true;
            if (isSuccess) {
                notify(
                    response?.message ||
                    response?.data?.message ||
                    "Loan updated successfully."
                );
                navigate("/loans");
                return;
            }

            notify(
                response?.message ||
                response?.data?.message ||
                "Unable to update loan."
            );
        } catch (err) {
            notify(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to update loan."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading loan...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => navigate("/loans")}
                >
                    Back to Loans
                </button>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0">
            <LoanForm
                initialValues={loan}
                loading={saving}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default EditLoan;
