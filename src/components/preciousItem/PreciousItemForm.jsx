import { notify } from "../../utils/notifications";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDocuments } from "../../api/documentApi";

const PREDEFINED_ITEMS = {
    GOLD: [
        ["Gold Necklace", "सोने का हार"],
        ["Gold Chain", "सोने की चेन"],
        ["Gold Mangalsutra", "सोने का मंगलसूत्र"],
        ["Gold Earrings", "सोने के कान के झुमके"],
        ["Gold Tops", "सोने के टॉप्स"],
        ["Gold Jhumka", "सोने के झुमके"],
        ["Gold Nose Ring", "सोने की नथ"],
        ["Gold Nose Pin", "सोने की नोज पिन"],
        ["Gold Ring", "सोने की अंगूठी"],
        ["Gold Bangles", "सोने की चूड़ियाँ"],
        ["Gold Kada", "सोने का कड़ा"],
        ["Gold Bracelet", "सोने का ब्रेसलेट"],
        ["Gold Payal", "सोने की पायल"],
        ["Gold Anklet", "सोने का पाजेब"],
        ["Gold Maang Tikka", "सोने का मांग टीका"],
        ["Gold Nath", "सोने की नथनी"],
        ["Gold Waist Belt", "सोने की कमरबंद"],
        ["Gold Armlet (बाजूबंद)", "सोने का बाजूबंद"],
        ["Gold Pendant", "सोने का पेंडेंट"],
        ["Gold Hair Accessory", "सोने का हेयर एक्सेसरी"]
    ],
    SILVER: [
        ["Silver Payal", "चाँदी की पायल"],
        ["Silver Bichhiya", "चाँदी की बिछिया"],
        ["Silver Anklet", "चाँदी का पाजेब"],
        ["Silver Toe Rings", "चाँदी के पैर के छल्ले"],
        ["Silver Ring", "चाँदी की अंगूठी"],
        ["Silver Chain", "चाँदी की चेन"],
        ["Silver Necklace", "चाँदी का हार"],
        ["Silver Earrings", "चाँदी के झुमके"],
        ["Silver Tops", "चाँदी के टॉप्स"],
        ["Silver Jhumka", "चाँदी के झुमके"],
        ["Silver Bangles", "चाँदी की चूड़ियाँ"],
        ["Silver Kada", "चाँदी का कड़ा"],
        ["Silver Bracelet", "चाँदी का ब्रेसलेट"],
        ["Silver Nose Pin", "चाँदी की नोज पिन"],
        ["Silver Nose Ring", "चाँदी की नथ"],
        ["Silver Pendant", "चाँदी का पेंडेंट"],
        ["Silver Mangalsutra", "चाँदी का मंगलसूत्र"],
        ["Silver Maang Tikka", "चाँदी का मांग टीका"],
        ["Silver Kamarbandh", "चाँदी का कमरबंद"],
        ["Silver Bajuband", "चाँदी का बाजूबंद"]
    ]
};

const formatPresetName = (name, hindiName) => `${name} - ${hindiName}`;

const PreciousItemForm = ({ initialValues = {}, onSubmit, loading = false }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        type: "GOLD",
        description: "",
        location: "",
        document: ""
    });

    const [documents, setDocuments] = useState([]);
    const [documentsLoading, setDocumentsLoading] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState("");

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                setDocumentsLoading(true);
                const response = await getDocuments({ limit: 100, status: "true" });
                const result = response?.data?.rows !== undefined ? response.data : response;
                setDocuments(Array.isArray(result?.rows) ? result.rows : []);
            } catch (error) {
                setDocuments([]);
            } finally {
                setDocumentsLoading(false);
            }
        };

        loadDocuments();
    }, []);
    /*
     * =========================
     * EDIT MODE
     * =========================
     */
    useEffect(() => {

        if (Object.keys(initialValues).length > 0) {
            const type = initialValues.type || "GOLD";
            const preset = PREDEFINED_ITEMS[type]?.find(([name, hindiName]) =>
                initialValues.name === name || initialValues.name === formatPresetName(name, hindiName)
            );
            setForm({
                name: initialValues.name || "",
                type,
                description: initialValues.description || "",
                location: initialValues.location || "",
                document: initialValues.document?._id || initialValues.document || ""
            });
            setSelectedPreset(preset?.[0] || "");
        }

    }, [initialValues]);


    /*
     * =========================
     * HANDLE CHANGE
     * =========================
     */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        if (name === "type" || name === "name") {
            setSelectedPreset("");
        }

    };

    const handlePresetChange = (event) => {
        const name = event.target.value;
        const preset = PREDEFINED_ITEMS[form.type].find(([itemName]) => itemName === name);
        setSelectedPreset(name);
        if (preset) {
            setForm(prev => ({ ...prev, name: formatPresetName(preset[0], preset[1]) }));
        }
    };


    /*
     * =========================
     * SUBMIT
     * =========================
     */

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            notify("PreciousItem name is required.");
            return;
        }

        if (!form.type) {
            notify("PreciousItem type is required.");
            return;
        }


        onSubmit({

            ...form,

            document: form.document || null,

            name:
                form.name.trim(),

            type:
                form.type.toUpperCase()

        });

    };


    /*
     * =========================
     * RENDER
     * =========================
     */

    return (

        <div className="card shadow">

            {/* ================= HEADER ================= */}

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">
                    PreciousItem Details
                </h5>


                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                        navigate("/preciousItem")
                    }
                >

                    ← Back

                </button>

            </div>


            {/* ================= BODY ================= */}

            <div className="card-body">

                <form onSubmit={handleSubmit}>


                    {/* ================= NAME ================= */}

                    <div className="mb-3">

                        <label className="form-label">

                            PreciousItem Name

                        </label>


                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter PreciousItem name"
                            required
                        />

                    </div>


                    {/* ================= TYPE ================= */}

                    <fieldset className="mb-3">

                        <legend className="form-label mb-2">
                            Precious Item Type
                        </legend>

                        <div className="btn-group" role="group" aria-label="Precious item type">
                            <input
                                type="radio"
                                className="btn-check"
                                name="type"
                                id="precious-item-gold"
                                value="GOLD"
                                checked={form.type === "GOLD"}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <label className="btn btn-outline-warning" htmlFor="precious-item-gold">
                                Gold
                            </label>

                            <input
                                type="radio"
                                className="btn-check"
                                name="type"
                                id="precious-item-silver"
                                value="SILVER"
                                checked={form.type === "SILVER"}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <label className="btn btn-outline-secondary" htmlFor="precious-item-silver">
                                Silver
                            </label>
                        </div>

                    </fieldset>


                    {/* ================= PREDEFINED ITEM ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Choose Predefined Item
                        </label>

                        <select
                            className="form-select"
                            value={selectedPreset}
                            onChange={handlePresetChange}
                            disabled={loading}
                        >
                            <option value="">Custom item</option>
                            {PREDEFINED_ITEMS[form.type].map(([name, hindiName]) => (
                                <option key={name} value={name}>
                                    {name} - {hindiName}
                                </option>
                            ))}
                        </select>

                    </div>


                    {/* ================= DESCRIPTION ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Description
                        </label>
                        <textarea
                            className="form-control"
                            rows="4"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                        />

                    </div>
                    {/* ================= location ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Location
                        </label>
                        <textarea
                            className="form-control"
                            rows="4"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Enter location"
                        />

                    </div>


                    {/* ================= DOCUMENT ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Related Document
                        </label>

                        <select
                            className="form-select"
                            name="document"
                            value={form.document}
                            onChange={handleChange}
                            disabled={documentsLoading || loading}
                        >

                            <option value="">
                                {documentsLoading ? "Loading documents..." : "No related document"}
                            </option>

                            {documents.map(document => (
                                <option key={document._id} value={document._id}>
                                    {document.title}{document.documentNumber ? ` - ${document.documentNumber}` : ""}
                                </option>
                            ))}

                        </select>

                    </div>


                    {/* ================= SUBMIT ================= */}
                    <button type="submit" className="btn btn-primary" disabled={loading}> {loading ? "Please wait..." : "Save PreciousItem"}</button>

                </form>

            </div>

        </div>

    );

};

export default PreciousItemForm;
