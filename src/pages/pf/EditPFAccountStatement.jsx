import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PFAccountStatementForm from "../../components/pf/PFAccountStatementForm";
import { getPFAccountStatementById, updatePFAccountStatement } from "../../api/pfAccountStatementApi";

const EditPFAccountStatement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [statement, setStatement] = useState(null);
    const [saving, setSaving] = useState(false);
    useEffect(() => { (async () => { try { const response = await getPFAccountStatementById(id); if (!response?.success || !response?.data) throw new Error(response?.message || "PF statement not found."); setStatement(response.data); } catch (error) { alert(error?.response?.data?.message || error?.message || "Unable to load PF statement."); navigate("/pf-statements"); } })(); }, [id, navigate]);
    const save = async (payload) => { try { setSaving(true); const response = await updatePFAccountStatement(id, payload); if (!response?.success) throw new Error(response?.message || "Unable to update PF statement."); alert(response.message || "PF statement updated successfully."); navigate("/pf-statements"); } catch (error) { alert(error?.response?.data?.message || error?.message || "Unable to update PF statement."); } finally { setSaving(false); } };
    if (!statement) return <div className="container-fluid px-4 py-5 text-center"><div className="spinner-border text-primary" /><div className="text-muted mt-2">Loading PF statement...</div></div>;
    return <div className="container-fluid px-4 py-4"><div className="mb-4"><h3 className="mb-1">Edit PF Statement</h3><div className="text-muted">Update PF account contribution details.</div></div><PFAccountStatementForm initialValues={statement} onSubmit={save} saving={saving} /></div>;
};

export default EditPFAccountStatement;
