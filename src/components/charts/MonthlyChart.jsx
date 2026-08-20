import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

import {
    expenseBorderColor,
    expenseColor,
    incomeBorderColor,
    incomeColor
} from "./chartColors";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


/*
|--------------------------------------------------------------------------
| COLORS
|--------------------------------------------------------------------------
*/

const savingColor =
    "#198754";

const savingBorderColor =
    "#146c43";

const debtColor =
    "#ffc107";

const debtBorderColor =
    "#cc9a06";

const pendingDebtColor =
    "#0dcaf0";

const pendingDebtBorderColor =
    "#0aa2c0";


/*
|--------------------------------------------------------------------------
| FORMAT AMOUNT
|--------------------------------------------------------------------------
*/

const formatAmount = (
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
| NORMALIZE MONTH
|--------------------------------------------------------------------------
*/

const getMonthLabel = (
    item
) => {

    return (
        item?.month ??
        item?.label ??
        item?.name ??
        "-"
    );

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
| MONTHLY CHART
|--------------------------------------------------------------------------
*/

const MonthlyChart = ({
    data = []
}) => {

    /*
    |--------------------------------------------------------------------------
    | SAFE DATA
    |--------------------------------------------------------------------------
    */

    const rows =
        Array.isArray(data)
            ? data
            : [];


    /*
    |--------------------------------------------------------------------------
    | TOTALS
    |--------------------------------------------------------------------------
    */

    const totalIncome =
        rows.reduce(
            (
                total,
                item
            ) =>
                total +
                getNumber(
                    item?.income
                ),
            0
        );


    const totalExpense =
        rows.reduce(
            (
                total,
                item
            ) =>
                total +
                getNumber(
                    item?.expense
                ),
            0
        );


    const totalSaving =
        rows.reduce(
            (
                total,
                item
            ) =>
                total +
                getNumber(
                    item?.saving
                ),
            0
        );


    const totalDebt =
        rows.reduce(
            (
                total,
                item
            ) =>
                total +
                getNumber(
                    item?.totalDebt
                ),
            0
        );


    const totalPendingDebt =
        rows.reduce(
            (
                total,
                item
            ) =>
                total +
                getNumber(
                    item?.pendingDebt
                ),
            0
        );


    /*
    |--------------------------------------------------------------------------
    | CHART DATA
    |--------------------------------------------------------------------------
    */

    const chartData = {

        labels:
            rows.map(
                item =>
                    getMonthLabel(
                        item
                    )
            ),

        datasets: [

            /*
            |--------------------------------------------------------------------------
            | INCOME
            |--------------------------------------------------------------------------
            */

            {

                label:
                    "Income",

                data:
                    rows.map(
                        item =>
                            getNumber(
                                item?.income
                            )
                    ),

                backgroundColor:
                    incomeColor,

                borderColor:
                    incomeBorderColor,

                borderWidth:
                    1,

                borderRadius:
                    4,

                maxBarThickness:
                    45

            },


            /*
            |--------------------------------------------------------------------------
            | EXPENSE
            |--------------------------------------------------------------------------
            */

            {

                label:
                    "Expense",

                data:
                    rows.map(
                        item =>
                            getNumber(
                                item?.expense
                            )
                    ),

                backgroundColor:
                    expenseColor,

                borderColor:
                    expenseBorderColor,

                borderWidth:
                    1,

                borderRadius:
                    4,

                maxBarThickness:
                    45

            },


            /*
            |--------------------------------------------------------------------------
            | SAVING
            |--------------------------------------------------------------------------
            */

            {

                label:
                    "Saving",

                data:
                    rows.map(
                        item =>
                            getNumber(
                                item?.saving
                            )
                    ),

                backgroundColor:
                    savingColor,

                borderColor:
                    savingBorderColor,

                borderWidth:
                    1,

                borderRadius:
                    4,

                maxBarThickness:
                    45

            },


            /*
            |--------------------------------------------------------------------------
            | DEBT
            |--------------------------------------------------------------------------
            */

            {

                label:
                    "Debt",

                data:
                    rows.map(
                        item =>
                            getNumber(
                                item?.totalDebt
                            )
                    ),

                backgroundColor:
                    debtColor,

                borderColor:
                    debtBorderColor,

                borderWidth:
                    1,

                borderRadius:
                    4,

                maxBarThickness:
                    45

            },


            /*
            |--------------------------------------------------------------------------
            | PENDING DEBT
            |--------------------------------------------------------------------------
            */

            {

                label:
                    "Pending Debt",

                data:
                    rows.map(
                        item =>
                            getNumber(
                                item?.pendingDebt
                            )
                    ),

                backgroundColor:
                    pendingDebtColor,

                borderColor:
                    pendingDebtBorderColor,

                borderWidth:
                    1,

                borderRadius:
                    4,

                maxBarThickness:
                    45

            }

        ]

    };


    /*
    |--------------------------------------------------------------------------
    | CHART OPTIONS
    |--------------------------------------------------------------------------
    */

    const options = {

        responsive:
            true,

        maintainAspectRatio:
            false,

        interaction: {

            mode:
                "index",

            intersect:
                false

        },


        plugins: {

            legend: {

                position:
                    "top",

                labels: {

                    usePointStyle:
                        true,

                    padding:
                        14

                }

            },


            title: {

                display:
                    true,

                text:
                    "Monthly Income vs Expense"

            },


            tooltip: {

                callbacks: {

                    label:
                        context => {

                            const value =
                                getNumber(
                                    context.raw
                                );


                            return (

                                `${context.dataset.label}: ` +

                                formatAmount(
                                    value
                                )

                            );

                        }

                }

            }

        },


        scales: {

            x: {

                stacked:
                    false,

                grid: {

                    display:
                        false

                }

            },


            y: {

                beginAtZero:
                    true,

                ticks: {

                    callback:
                        value => {

                            return formatAmount(
                                value
                            );

                        }

                }

            }

        }

    };


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
                minWidth: 0,
                maxWidth: "100%",
                overflow: "hidden"
            }}
        >

            {/* =====================================================
                SUMMARY CARDS
            ===================================================== */}

            <div
                className="
                    row
                    g-3
                    mb-3
                "
            >

                <SummaryCard
                    title="Income"
                    value={
                        totalIncome
                    }
                    className="text-success"
                />


                <SummaryCard
                    title="Expense"
                    value={
                        totalExpense
                    }
                    className="text-danger"
                />


                <SummaryCard
                    title="Saving"
                    value={
                        totalSaving
                    }
                    className="text-primary"
                />


                <SummaryCard
                    title="Debt"
                    value={
                        totalDebt
                    }
                    className="text-warning"
                />


                <SummaryCard
                    title="Pending Debt"
                    value={
                        totalPendingDebt
                    }
                    className="text-info"
                />

            </div>


            {/* =====================================================
                CHART
            ===================================================== */}

            <div
                className="
                    card
                    shadow-sm
                    w-100
                    mb-3
                "
            >

                <div
                    className="
                        card-header
                        d-flex
                        justify-content-between
                        align-items-center
                    "
                >

                    <h5 className="mb-0">

                        Monthly Income vs Expense

                    </h5>


                    <span
                        className="
                            text-muted
                            small
                        "
                    >

                        ₹

                    </span>

                </div>


                <div
                    className="
                        card-body
                    "
                    style={{
                        height: "420px",
                        minWidth: 0,
                        position: "relative"
                    }}
                >

                    {rows.length > 0 ? (

                        <Bar
                            data={
                                chartData
                            }
                            options={
                                options
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

                            No monthly data available

                        </div>

                    )}

                </div>

            </div>


            {/* =====================================================
                MONTHLY SUMMARY
            ===================================================== */}

            {rows.length > 0 && (

                <div
                    className="
                        card
                        shadow-sm
                        w-100
                    "
                >

                    <div
                        className="
                            card-header
                        "
                    >

                        <h5 className="mb-0">

                            Monthly Summary

                        </h5>

                    </div>


                    <div
                        className="
                            card-body
                            p-0
                        "
                    >

                        <div
                            className="
                                table-responsive
                            "
                        >

                            <table
                                className="
                                    table
                                    table-hover
                                    table-bordered
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
                                            Month
                                        </th>

                                        <th
                                            className="
                                                text-end
                                            "
                                        >
                                            Income
                                        </th>

                                        <th
                                            className="
                                                text-end
                                            "
                                        >
                                            Expense
                                        </th>

                                        <th
                                            className="
                                                text-end
                                            "
                                        >
                                            Saving
                                        </th>

                                        <th
                                            className="
                                                text-end
                                            "
                                        >
                                            Total Debt
                                        </th>

                                        <th
                                            className="
                                                text-end
                                            "
                                        >
                                            Pending Debt
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {rows.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    `${getMonthLabel(item)}-${index}`
                                                }
                                            >

                                                <td
                                                    className="
                                                        fw-bold
                                                    "
                                                >

                                                    {
                                                        getMonthLabel(
                                                            item
                                                        )
                                                    }

                                                </td>


                                                <td
                                                    className="
                                                        text-end
                                                        text-success
                                                        fw-semibold
                                                    "
                                                >

                                                    {
                                                        formatAmount(
                                                            item?.income
                                                        )
                                                    }

                                                </td>


                                                <td
                                                    className="
                                                        text-end
                                                        text-danger
                                                        fw-semibold
                                                    "
                                                >

                                                    {
                                                        formatAmount(
                                                            item?.expense
                                                        )
                                                    }

                                                </td>


                                                <td
                                                    className="
                                                        text-end
                                                        text-primary
                                                        fw-semibold
                                                    "
                                                >

                                                    {
                                                        formatAmount(
                                                            item?.saving
                                                        )
                                                    }

                                                </td>


                                                <td
                                                    className="
                                                        text-end
                                                        text-warning
                                                        fw-semibold
                                                    "
                                                >

                                                    {
                                                        formatAmount(
                                                            item?.totalDebt
                                                        )
                                                    }

                                                </td>


                                                <td
                                                    className="
                                                        text-end
                                                        text-info
                                                        fw-semibold
                                                    "
                                                >

                                                    {
                                                        formatAmount(
                                                            item?.pendingDebt
                                                        )
                                                    }

                                                </td>

                                            </tr>

                                        )
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
                                                text-success
                                            "
                                        >

                                            {
                                                formatAmount(
                                                    totalIncome
                                                )
                                            }

                                        </th>

                                        <th
                                            className="
                                                text-end
                                                text-danger
                                            "
                                        >

                                            {
                                                formatAmount(
                                                    totalExpense
                                                )
                                            }

                                        </th>

                                        <th
                                            className="
                                                text-end
                                                text-primary
                                            "
                                        >

                                            {
                                                formatAmount(
                                                    totalSaving
                                                )
                                            }

                                        </th>

                                        <th
                                            className="
                                                text-end
                                                text-warning
                                            "
                                        >

                                            {
                                                formatAmount(
                                                    totalDebt
                                                )
                                            }

                                        </th>

                                        <th
                                            className="
                                                text-end
                                                text-info
                                            "
                                        >

                                            {
                                                formatAmount(
                                                    totalPendingDebt
                                                )
                                            }

                                        </th>

                                    </tr>

                                </tfoot>

                            </table>

                        </div>

                    </div>

                </div>

            )}

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
                col-xl
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
                            formatAmount(
                                value
                            )
                        }

                    </div>

                </div>

            </div>

        </div>

    );

};


export default MonthlyChart;