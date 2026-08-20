import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

import { getSliceColors } from "./chartColors";


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);


/*
|--------------------------------------------------------------------------
| FORMAT CURRENCY
|--------------------------------------------------------------------------
*/

const formatCurrency = (
    value
) => {

    return `₹${Number(
        value || 0
    ).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    )}`;

};


/*
|--------------------------------------------------------------------------
| GET NUMBER
|--------------------------------------------------------------------------
*/

const getNumber = (
    value
) => {

    return Number(
        value || 0
    );

};


/*
|--------------------------------------------------------------------------
| PAYMENT MODE NAME
|--------------------------------------------------------------------------
*/

const getPaymentMode = (
    item
) => {

    return (
        item?._id ||
        item?.paymentMode ||
        item?.name ||
        "Unknown"
    );

};


/*
|--------------------------------------------------------------------------
| PAYMENT MODE VALUE
|--------------------------------------------------------------------------
*/

const getPaymentValue = (
    item
) => {

    return getNumber(
        item?.value ??
        item?.amount ??
        item?.total
    );

};


/*
|--------------------------------------------------------------------------
| GET TOTAL
|--------------------------------------------------------------------------
*/

const getTotal = (
    items
) => {

    return items.reduce(
        (
            sum,
            item
        ) => {

            return (
                sum +
                getPaymentValue(
                    item
                )
            );

        },
        0
    );

};


/*
|--------------------------------------------------------------------------
| GET PERCENTAGE
|--------------------------------------------------------------------------
*/

const getPercentage = (
    value,
    total
) => {

    if (
        !total
    ) {

        return 0;

    }


    return (
        getNumber(
            value
        ) /
        total
    ) * 100;

};


/*
|--------------------------------------------------------------------------
| DOUGHNUT CARD
|--------------------------------------------------------------------------
*/

const PaymentModeDoughnut = ({
    title,
    data,
    total,
    offset,
    type
}) => {

    const rows =
        Array.isArray(data)
            ? data
            : [];


    /*
    |--------------------------------------------------------------------------
    | CHART DATA
    |--------------------------------------------------------------------------
    */

    const chartData = {

        labels:
            rows.map(
                item =>
                    getPaymentMode(
                        item
                    )
            ),

        datasets: [

            {

                label:
                    type,

                data:
                    rows.map(
                        item =>
                            getPaymentValue(
                                item
                            )
                    ),

                backgroundColor:
                    getSliceColors(
                        rows.length,
                        offset
                    ),

                borderColor:
                    "#ffffff",

                borderWidth:
                    2,

                hoverOffset:
                    5

            }

        ]

    };


    /*
    |--------------------------------------------------------------------------
    | OPTIONS
    |--------------------------------------------------------------------------
    */

    const chartOptions = {

        responsive:
            true,

        maintainAspectRatio:
            false,


        plugins: {

            legend: {

                position:
                    "bottom",

                labels: {

                    usePointStyle:
                        true,

                    padding:
                        12,

                    boxWidth:
                        12

                }

            },


            tooltip: {

                callbacks: {

                    label:
                        context => {

                            const value =
                                getNumber(
                                    context.raw
                                );


                            const percentage =
                                getPercentage(
                                    value,
                                    total
                                );


                            return (

                                `${context.label}: ` +

                                `${formatCurrency(
                                    value
                                )} ` +

                                `(${percentage.toFixed(
                                    2
                                )}%)`

                            );

                        }

                }

            }

        }

    };


    return (

        <div
            className="
                col-12
                col-xl-6
            "
        >

            <div
                className="
                    card
                    shadow-sm
                    h-100
                "
                style={{
                    minWidth: 0,
                    overflow: "hidden"
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        card-header
                        d-flex
                        justify-content-between
                        align-items-center
                        gap-2
                    "
                >

                    <h5
                        className="
                            mb-0
                            text-truncate
                        "
                        title={title}
                    >

                        {title}

                    </h5>


                    <strong
                        style={{
                            whiteSpace:
                                "nowrap",
                            flexShrink:
                                0
                        }}
                    >

                        {
                            formatCurrency(
                                total
                            )
                        }

                    </strong>

                </div>


                {/* =================================================
                    CHART
                ================================================= */}

                <div
                    className="
                        card-body
                    "
                    style={{
                        height: "360px",
                        minWidth: 0,
                        position: "relative"
                    }}
                >

                    {rows.length > 0 ? (

                        <Doughnut
                            data={
                                chartData
                            }
                            options={
                                chartOptions
                            }
                        />

                    ) : (

                        <div
                            className="
                                d-flex
                                justify-content-center
                                align-items-center
                                h-100
                                text-muted
                            "
                        >

                            No {type.toLowerCase()} payment data

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};


/*
|--------------------------------------------------------------------------
| PAYMENT MODE TABLE
|--------------------------------------------------------------------------
*/

const PaymentModeTable = ({
    title,
    data,
    total
}) => {

    const rows =
        Array.isArray(data)
            ? data
            : [];


    return (

        <div
            className="
                col-12
                col-xl-6
            "
        >

            <div
                className="
                    card
                    shadow-sm
                    h-100
                "
            >

                {/* HEADER */}

                <div
                    className="
                        card-header
                    "
                >

                    <h6 className="mb-0">

                        {title}

                    </h6>

                </div>


                {/* TABLE */}

                <div
                    className="
                        card-body
                        p-0
                    "
                >

                    {rows.length > 0 ? (

                        <div
                            className="
                                table-responsive
                            "
                        >

                            <table
                                className="
                                    table
                                    table-bordered
                                    table-hover
                                    align-middle
                                    mb-0
                                "
                            >

                                <thead
                                    className="
                                        table-light
                                    "
                                >

                                    <tr>

                                        <th>
                                            Payment Mode
                                        </th>

                                        <th
                                            className="
                                                text-end
                                            "
                                        >
                                            Amount
                                        </th>

                                        <th
                                            className="
                                                text-end
                                            "
                                        >
                                            %
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {rows.map(
                                        (
                                            item,
                                            index
                                        ) => {

                                            const value =
                                                getPaymentValue(
                                                    item
                                                );


                                            const percentage =
                                                getPercentage(
                                                    value,
                                                    total
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        `${getPaymentMode(item)}-${index}`
                                                    }
                                                >

                                                    <td>

                                                        <strong>

                                                            {
                                                                getPaymentMode(
                                                                    item
                                                                )
                                                            }

                                                        </strong>

                                                    </td>


                                                    <td
                                                        className="
                                                            text-end
                                                        "
                                                    >

                                                        {
                                                            formatCurrency(
                                                                value
                                                            )
                                                        }

                                                    </td>


                                                    <td
                                                        className="
                                                            text-end
                                                        "
                                                    >

                                                        {
                                                            percentage.toFixed(
                                                                2
                                                            )
                                                        }

                                                        %

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>


                                <tfoot
                                    className="
                                        table-light
                                    "
                                >

                                    <tr>

                                        <th>
                                            Total
                                        </th>

                                        <th
                                            className="
                                                text-end
                                            "
                                        >

                                            {
                                                formatCurrency(
                                                    total
                                                )
                                            }

                                        </th>

                                        <th
                                            className="
                                                text-end
                                            "
                                        >

                                            {
                                                rows.length > 0
                                                    ? "100%"
                                                    : "0%"
                                            }

                                        </th>

                                    </tr>

                                </tfoot>

                            </table>

                        </div>

                    ) : (

                        <div
                            className="
                                text-center
                                text-muted
                                p-4
                            "
                        >

                            No payment mode data

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};


/*
|--------------------------------------------------------------------------
| MAIN PAYMENT MODE CHART
|--------------------------------------------------------------------------
*/

const PaymentModeChart = ({
    data = {}
}) => {

    /*
    |--------------------------------------------------------------------------
    | SAFE DATA
    |--------------------------------------------------------------------------
    */

    const income =
        Array.isArray(
            data?.income
        )
            ? data.income
            : [];


    const expense =
        Array.isArray(
            data?.expense
        )
            ? data.expense
            : [];


    /*
    |--------------------------------------------------------------------------
    | TOTALS
    |--------------------------------------------------------------------------
    */

    const incomeTotal =
        getTotal(
            income
        );


    const expenseTotal =
        getTotal(
            expense
        );


    /*
    |--------------------------------------------------------------------------
    | GRAND TOTAL
    |--------------------------------------------------------------------------
    */

    const grandTotal =
        incomeTotal +
        expenseTotal;


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="
                w-100
            "
            style={{
                maxWidth: "100%",
                minWidth: 0,
                overflow: "hidden"
            }}
        >

            {/* =====================================================
                SUMMARY
            ===================================================== */}

            <div
                className="
                    row
                    g-3
                    mb-3
                "
            >

                <SummaryCard
                    title="Total Income"
                    value={
                        incomeTotal
                    }
                    className="text-success"
                />


                <SummaryCard
                    title="Total Expense"
                    value={
                        expenseTotal
                    }
                    className="text-danger"
                />


                <SummaryCard
                    title="Total Transactions"
                    value={
                        grandTotal
                    }
                    className="text-primary"
                />

            </div>


            {/* =====================================================
                DOUGHNUT CHARTS
            ===================================================== */}

            <div
                className="
                    row
                    g-3
                    mx-0
                    mb-3
                "
            >

                <PaymentModeDoughnut

                    title="
                        Income Payment Modes (₹)
                    "

                    data={
                        income
                    }

                    total={
                        incomeTotal
                    }

                    offset={
                        0
                    }

                    type="
                        Income
                    "

                />


                <PaymentModeDoughnut

                    title="
                        Expense Payment Modes (₹)
                    "

                    data={
                        expense
                    }

                    total={
                        expenseTotal
                    }

                    offset={
                        4
                    }

                    type="
                        Expense
                    "

                />

            </div>


            {/* =====================================================
                TABLES
            ===================================================== */}

            <div
                className="
                    row
                    g-3
                    mx-0
                "
            >

                <PaymentModeTable

                    title="
                        Income Payment Mode Summary
                    "

                    data={
                        income
                    }

                    total={
                        incomeTotal
                    }

                />


                <PaymentModeTable

                    title="
                        Expense Payment Mode Summary
                    "

                    data={
                        expense
                    }

                    total={
                        expenseTotal
                    }

                />

            </div>

        </div>

    );

};


/*
|--------------------------------------------------------------------------
| SUMMARY CARD
|--------------------------------------------------------------------------
*/

const SummaryCard = ({
    title,
    value,
    className
}) => {

    return (

        <div
            className="
                col-12
                col-sm-6
                col-lg-4
            "
        >

            <div
                className="
                    card
                    shadow-sm
                    h-100
                "
            >

                <div
                    className="
                        card-body
                    "
                >

                    <div
                        className="
                            text-muted
                            small
                            mb-1
                        "
                    >

                        {title}

                    </div>


                    <div
                        className={`
                            fs-5
                            fw-bold
                            ${className}
                        `}
                    >

                        {
                            formatCurrency(
                                value
                            )
                        }

                    </div>

                </div>

            </div>

        </div>

    );

};


export default PaymentModeChart;