import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PFAccountStatementForm from "../../components/pf/PFAccountStatementForm";
import { createPFAccountStatement } from "../../api/pfAccountStatementApi";

const AddPFAccountStatement = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const save = async (payload) => {
        try {
            setSaving(true);
            const response = await createPFAccountStatement(payload);
            if (!response?.success) throw new Error(response?.message || "Unable to create PF statement.");
            alert(response.message || "PF statement created successfully.");
            navigate("/pf-statements");
        } catch (error) {
            alert(error?.response?.data?.message || error?.message || "Unable to create PF statement.");
        } finally { setSaving(false); }
    };
    return <div className="container-fluid px-4 py-4"><div className="mb-4"><h3 className="mb-1">Add PF Statement</h3><div className="text-muted">Record an EPF, EPS, or pension contribution.</div></div><PFAccountStatementForm onSubmit={save} saving={saving} /></div>;
};

export default AddPFAccountStatement;
