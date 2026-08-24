const MilkSummary = ({
    totalQuantity = 0,
    totalAmount = 0,
    averagePrice = 0,
    totalRecords = 0
}) => {

    const formatNumber = (
        value
    ) => {

        return Number(
            value || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    return (

        <div className="row g-3 mb-4">

            {/* TOTAL QUANTITY */}

            <div className="col-12 col-sm-6 col-xl-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="text-muted small mb-2">

                            Total Quantity

                        </div>

                        <div className="fs-4 fw-bold">

                            {formatNumber(
                                totalQuantity
                            )}

                            <span className="fs-6 fw-normal ms-1">

                                L

                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* TOTAL AMOUNT */}

            <div className="col-12 col-sm-6 col-xl-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="text-muted small mb-2">

                            Total Amount

                        </div>

                        <div className="fs-4 fw-bold">

                            ₹
                            {formatNumber(
                                totalAmount
                            )}

                        </div>

                    </div>

                </div>

            </div>


            {/* AVERAGE PRICE */}

            <div className="col-12 col-sm-6 col-xl-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="text-muted small mb-2">

                            Average Price

                        </div>

                        <div className="fs-4 fw-bold">

                            ₹
                            {formatNumber(
                                averagePrice
                            )}

                            <span className="fs-6 fw-normal ms-1">

                                / L

                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* RECORDS */}

            <div className="col-12 col-sm-6 col-xl-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="text-muted small mb-2">

                            Total Records

                        </div>

                        <div className="fs-4 fw-bold">

                            {totalRecords}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};


export default MilkSummary;