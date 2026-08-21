import {
    getCategoryBadgeStyle,
    getTransactionTypeBadgeClass
} from "../../utils/badgeStyles";


const RecentTransaction = ({
    transactions = []
}) => {

    /*
    |--------------------------------------------------------------------------
    | FORMAT AMOUNT
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
    | FORMAT DATE
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
    | AMOUNT CLASS
    |--------------------------------------------------------------------------
    */

    const getAmountClass = (type) => {

        switch (type) {

            case "Income":
                return "text-success";

            case "Expense":
                return "text-danger";

            case "Debt":
                return "text-warning";

            default:
                return "text-dark";

        }

    };


    /*
    |--------------------------------------------------------------------------
    | AMOUNT PREFIX
    |--------------------------------------------------------------------------
    */

    const getAmountPrefix = (type) => {

        switch (type) {

            case "Income":
                return "+";

            case "Expense":
                return "-";

            case "Debt":
                return "";

            default:
                return "";

        }

    };


    /*
    |--------------------------------------------------------------------------
    | EMPTY STATE
    |--------------------------------------------------------------------------
    */

    if (!Array.isArray(transactions) || !transactions.length) {

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


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="card border-0 shadow-sm mt-4">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="card-header bg-white py-3">

                <div className="
                    d-flex
                    justify-content-between
                    align-items-center
                ">

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

                    <table className="
                        table
                        table-hover
                        align-middle
                        mb-0
                    ">

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

                                <th className="text-end">
                                    Pending
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {transactions.map(
                                (item, index) => {

                                    const type =
                                        item?.type || "-";


                                    const pendingAmount =
                                        Number(
                                            item?.pendingAmount || 0
                                        );


                                    return (

                                        <tr
                                            key={
                                                item?._id ||
                                                index
                                            }
                                        >


                                            {/* =================================================
                                                DATE
                                            ================================================== */}

                                            <td>

                                                <span className="text-nowrap">

                                                    {formatDate(
                                                        item?.date
                                                    )}

                                                </span>

                                            </td>


                                            {/* =================================================
                                                TITLE
                                            ================================================== */}

                                            <td>

                                                <div className="fw-semibold">

                                                    {
                                                        item?.title ||
                                                        "-"
                                                    }

                                                </div>


                                                {item?.note && (

                                                    <small className="text-muted">

                                                        {
                                                            item.note
                                                        }

                                                    </small>

                                                )}

                                            </td>


                                            {/* =================================================
                                                ACCOUNT
                                            ================================================== */}

                                            <td>

                                                {item?.account ? (

                                                    <div>

                                                        <div className="fw-semibold">

                                                            {
                                                                item.account?.name ||
                                                                "-"
                                                            }

                                                        </div>


                                                        {item.account?.bank && (

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


                                            {/* =================================================
                                                CATEGORY
                                            ================================================== */}

                                            <td>

                                                <span
                                                    className="badge"
                                                    style={
                                                        getCategoryBadgeStyle(
                                                            item?.category
                                                        )
                                                    }
                                                >

                                                    {
                                                        item?.category?.name ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* =================================================
                                                TYPE
                                            ================================================== */}

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


                                            {/* =================================================
                                                AMOUNT
                                            ================================================== */}

                                            <td
                                                className={`
                                                    text-end
                                                    fw-bold
                                                    ${getAmountClass(type)}
                                                `}
                                            >

                                                {
                                                    getAmountPrefix(
                                                        type
                                                    )
                                                }

                                                ₹{" "}

                                                {
                                                    formatAmount(
                                                        item?.amount
                                                    )
                                                }

                                            </td>


                                            {/* =================================================
                                                PENDING DEBT
                                            ================================================== */}

                                            <td className="text-end">

                                                {type === "Debt" ? (

                                                    <span
                                                        className={`
                                                            fw-semibold
                                                            ${
                                                                pendingAmount > 0
                                                                    ? "text-danger"
                                                                    : "text-success"
                                                            }
                                                        `}
                                                    >

                                                        ₹{" "}

                                                        {
                                                            formatAmount(
                                                                pendingAmount
                                                            )
                                                        }

                                                    </span>

                                                ) : (

                                                    <span className="text-muted">

                                                        -

                                                    </span>

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


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <div className="card-footer bg-white">

                <div className="
                    d-flex
                    justify-content-between
                    align-items-center
                    small
                    text-muted
                ">

                    <span>
                        Showing latest transactions
                    </span>

                    <span>
                        Saving is tracked through accounts,
                        transfers and investments.
                    </span>

                </div>

            </div>

        </div>

    );

};


export default RecentTransaction;