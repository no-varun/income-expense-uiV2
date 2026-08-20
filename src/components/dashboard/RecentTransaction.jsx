import {
    getCategoryBadgeStyle,
    getTransactionTypeBadgeClass
} from "../../utils/badgeStyles";


const RecentTransaction = ({
    transactions = []
}) => {


    /*
    |--------------------------------------------------------------------------
    | Format Amount
    |--------------------------------------------------------------------------
    */

    const formatAmount = (amount) => {

        return Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "-";

        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Amount Class
    |--------------------------------------------------------------------------
    */

    const getAmountClass = (type) => {

        switch (type) {

            case "Income":
                return "text-success";

            case "Expense":
                return "text-danger";

            case "Saving":
                return "text-info";

            case "Debt":
                return "text-warning";

            default:
                return "text-dark";

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Amount Prefix
    |--------------------------------------------------------------------------
    */

    const getAmountPrefix = (type) => {

        switch (type) {

            case "Income":
                return "+";

            case "Expense":
                return "-";

            case "Saving":
                return "-";

            case "Debt":
                return "";

            default:
                return "";

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Empty State
    |--------------------------------------------------------------------------
    */

    if (!transactions.length) {

        return (

            <div className="card border-0 shadow-sm mt-4">

                <div className="card-header bg-white py-3">

                    <h5 className="mb-0">

                        Recent Transactions

                    </h5>

                </div>


                <div className="card-body">

                    <div className="text-center py-4 text-muted">

                        No recent transactions found.

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="card border-0 shadow-sm mt-4">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="card-header bg-white py-3">

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <h5 className="mb-1">

                            Recent Transactions

                        </h5>

                        <small className="text-muted">

                            Latest financial activity

                        </small>

                    </div>


                    <span className="badge bg-primary">

                        {transactions.length} Transactions

                    </span>

                </div>

            </div>


            {/* =====================================================
                TABLE
            ====================================================== */}

            <div className="card-body p-0">

                <div className="table-responsive">

                    <table className="table table-hover align-middle mb-0">

                        <thead className="table-light">

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Title
                                </th>

                                <th>
                                    Account
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Type
                                </th>

                                <th className="text-end">
                                    Amount
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {transactions.map(
                                (item) => {

                                    const type =
                                        item.type || "-";


                                    return (

                                        <tr
                                            key={
                                                item._id
                                            }
                                        >


                                            {/* DATE */}

                                            <td>

                                                <span className="text-nowrap">

                                                    {formatDate(
                                                        item.date
                                                    )}

                                                </span>

                                            </td>


                                            {/* TITLE */}

                                            <td>

                                                <div className="fw-semibold">

                                                    {
                                                        item.title ||
                                                        "-"
                                                    }

                                                </div>

                                            </td>


                                            {/* ACCOUNT */}

                                            <td>

                                                {item.account ? (

                                                    <div>

                                                        <div className="fw-semibold">

                                                            {
                                                                item.account.name ||
                                                                "-"
                                                            }

                                                        </div>


                                                        {item.account.bank && (

                                                            <small className="text-muted">

                                                                {
                                                                    item.account.bank
                                                                }

                                                            </small>

                                                        )}

                                                    </div>

                                                ) : (

                                                    <span className="text-muted">

                                                        -

                                                    </span>

                                                )}

                                            </td>


                                            {/* CATEGORY */}

                                            <td>

                                                <span
                                                    className="badge"
                                                    style={
                                                        getCategoryBadgeStyle(
                                                            item.category
                                                        )
                                                    }
                                                >

                                                    {
                                                        item.category?.name ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* TYPE */}

                                            <td>

                                                <span
                                                    className={
                                                        getTransactionTypeBadgeClass(
                                                            type
                                                        )
                                                    }
                                                >

                                                    {type}

                                                </span>

                                            </td>


                                            {/* AMOUNT */}

                                            <td
                                                className={`text-end fw-bold ${getAmountClass(
                                                    type
                                                )}`}
                                            >

                                                {
                                                    getAmountPrefix(
                                                        type
                                                    )
                                                }

                                                ₹{" "}

                                                {formatAmount(
                                                    item.amount
                                                )}

                                            </td>

                                        </tr>

                                    );

                                }
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};


export default RecentTransaction;