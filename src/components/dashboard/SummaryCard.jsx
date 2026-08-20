const SummaryCard = ({
    title,
    value,
    bg = "bg-primary",
    subtitle,
    icon
}) => {

    const formatAmount = (amount) => {

        const value =
            Number(amount || 0);

        return value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    };


    return (

        <div className="col-12 col-sm-6 col-xl-3">

            <div
                className={`card border-0 shadow-sm h-100 ${bg}`}
            >

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-start">

                        <div>

                            <div className="small opacity-75 mb-2">
                                {title}
                            </div>

                            <h3 className="fw-bold mb-1">
                                ₹ {formatAmount(value)}
                            </h3>

                            {subtitle && (
                                <small className="opacity-75">
                                    {subtitle}
                                </small>
                            )}

                        </div>


                        {icon && (
                            <div
                                className="fs-3 opacity-75"
                                style={{
                                    lineHeight: 1
                                }}
                            >
                                {icon}
                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>

    );

};

export default SummaryCard;