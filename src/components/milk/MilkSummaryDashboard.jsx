const MilkSummaryDashboard = ({
    totalQuantity = 0,
    totalAmount = 0,
    averagePrice = 0,
    totalRecords = 0,
    totalPaidAmount = 0,
    totalPaidQuantity = 0,
    totalPaidRecords = 0,
    totalUnpaidAmount = 0,
    totalUnpaidQuantity = 0,
    totalUnpaidRecords = 0
}) => {
    const formatNumber = (value) =>
        Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const renderMetric = (title, value, theme, { currency = false, unit = "" } = {}) => (
        <div className="col-12 col-md-4" key={title}>
            <div className={`card border-0 shadow-sm h-100 ${theme.card}`}>
                <div className="card-body">
                    <div className={`small mb-2 ${theme.label}`}>{title}</div>
                    <div className={`fs-4 fw-bold ${theme.value}`}>
                        {currency && <span>{"\u20B9"}</span>}
                        {formatNumber(value)}
                        {unit && <span className="fs-6 fw-normal ms-1">{unit}</span>}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGroup = (title, metrics, theme) => (
        <section className="mb-4" key={title}>
            <h6 className="mb-3">
                <span className={`badge rounded-pill ${theme.badge}`}>{title}</span>
            </h6>
            <div className="row g-3">
                {metrics.map(([label, value, options]) =>
                    renderMetric(label, value, theme, options)
                )}
            </div>
        </section>
    );

    return (
        <div className="mb-4">
            <div className="card border-0 shadow-sm mb-3 bg-primary text-white">
                <div className="card-body py-3">
                    <div className="small mb-1 text-white-50">Average Price</div>
                    <div className="fs-2 fw-bold">
                        {"\u20B9"}{formatNumber(averagePrice)}
                        <span className="fs-5 fw-normal ms-2 text-white-50">/ L</span>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    {renderGroup("Overall", [
                        ["Total Quantity", totalQuantity, { unit: "L" }],
                        ["Total Amount", totalAmount, { currency: true }],
                        ["Total Records", totalRecords]
                    ], {
                        card: "bg-primary-subtle",
                        label: "text-primary-emphasis",
                        value: "text-primary",
                        badge: "text-bg-primary"
                    })}
                    {renderGroup("Paid", [
                        ["Paid Quantity", totalPaidQuantity, { unit: "L" }],
                        ["Paid Amount", totalPaidAmount, { currency: true }],
                        ["Paid Records", totalPaidRecords]
                    ], {
                        card: "bg-success-subtle",
                        label: "text-success-emphasis",
                        value: "text-success",
                        badge: "text-bg-success"
                    })}
                    {renderGroup("Unpaid", [
                        ["Unpaid Quantity", totalUnpaidQuantity, { unit: "L" }],
                        ["Unpaid Amount", totalUnpaidAmount, { currency: true }],
                        ["Unpaid Records", totalUnpaidRecords]
                    ], {
                        card: "bg-warning-subtle",
                        label: "text-warning-emphasis",
                        value: "text-danger",
                        badge: "text-bg-warning"
                    })}
                </div>
            </div>
        </div>
    );
};

export default MilkSummaryDashboard;
