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
| CURRENCY FORMATTER
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
| MONTH NAMES
|--------------------------------------------------------------------------
*/

const getMonthName = (
    month
) => {

    return new Date(
        2000,
        month - 1,
        1
    ).toLocaleString(
        "en-IN",
        {
            month: "short"
        }
    );

};


/*
|--------------------------------------------------------------------------
| GET MONTH VALUE
|--------------------------------------------------------------------------
*/

const getMonthValue = (
    items,
    month
) => {

    if (
        !Array.isArray(items)
    ) {

        return 0;

    }


    const row =
        items.find(
            item =>
                Number(
                    item?._id
                ) === Number(month)
        );


    return Number(
        row?.total || 0
    );

};


/*
|--------------------------------------------------------------------------
| NORMALIZE DATA
|--------------------------------------------------------------------------
*/

const normalizeItems = (
    value
) => {

    if (
        !Array.isArray(value)
    ) {

        return [];

    }


    return value;

};


/*
|--------------------------------------------------------------------------
| DASHBOARD CHART
|--------------------------------------------------------------------------
*/

const DashboardChart = ({
    data = {},
    year = "all"
}) => {

    /*
    |--------------------------------------------------------------------------
    | API DATA
    |--------------------------------------------------------------------------
    */

    const income =
        normalizeItems(
            data?.income
        );


    const expense =
        normalizeItems(
            data?.expense
        );


    const saving =
        normalizeItems(
            data?.Saving ??
            data?.saving
        );


    const debt =
        normalizeItems(
            data?.Debt ??
            data?.debt
        );


    const pendingDebt =
        normalizeItems(
            data?.pendingDebt ??
            data?.PendingDebt
        );


    /*
    |--------------------------------------------------------------------------
    | FILTER
    |--------------------------------------------------------------------------
    */

    const isAll =
        String(
            year
        ).toLowerCase() === "all";


    /*
    |--------------------------------------------------------------------------
    | MONTHS
    |--------------------------------------------------------------------------
    |
    | Dashboard API returns:
    |
    | [
    |   {
    |      _id: 1,
    |      total: 100
    |   }
    | ]
    |
    | Create a complete month list when data exists.
    |
    */

    const monthNumbers = [

        ...new Set([

            ...income.map(
                item =>
                    Number(
                        item?._id
                    )
            ),

            ...expense.map(
                item =>
                    Number(
                        item?._id
                    )
            ),

            ...saving.map(
                item =>
                    Number(
                        item?._id
                    )
            ),

            ...debt.map(
                item =>
                    Number(
                        item?._id
                    )
            ),

            ...pendingDebt.map(
                item =>
                    Number(
                        item?._id
                    )
            )

        ])

    ]
        .filter(
            month =>
                Number.isFinite(
                    month
                ) &&
                month >= 1 &&
                month <= 12
        )
        .sort(
            (a, b) =>
                a - b
        );


    /*
    |--------------------------------------------------------------------------
    | MONTH LABELS
    |--------------------------------------------------------------------------
    */

    const labels =
        monthNumbers.map(
            month =>
                getMonthName(
                    month
                )
        );


    /*
    |--------------------------------------------------------------------------
    | MONTHLY ROWS
    |--------------------------------------------------------------------------
    */

    const rows =
        monthNumbers.map(
            month => {

                return {

                    month,

                    monthName:
                        getMonthName(
                            month
                        ),

                    income:
                        getMonthValue(
                            income,
                            month
                        ),

                    expense:
                        getMonthValue(
                            expense,
                            month
                        ),

                    saving:
                        getMonthValue(
                            saving,
                            month
                        ),

                    debt:
                        getMonthValue(
                            debt,
                            month
                        ),

                    pendingDebt:
                        getMonthValue(
                            pendingDebt,
                            month
                        )

                };

            }
        );


    /*
    |--------------------------------------------------------------------------
    | CHART DATA
    |--------------------------------------------------------------------------
    */

    const chartData = {

        labels,

        datasets: [

            {
                label:
                    "Income",

                data:
                    monthNumbers.map(
                        month =>
                            getMonthValue(
                                income,
                                month
                            )
                    ),

                backgroundColor:
                    incomeColor,

                borderColor:
                    incomeBorderColor,

                borderWidth:
                    1

            },


            {
                label:
                    "Expense",

                data:
                    monthNumbers.map(
                        month =>
                            getMonthValue(
                                expense,
                                month
                            )
                    ),

                backgroundColor:
                    expenseColor,

                borderColor:
                    expenseBorderColor,

                borderWidth:
                    1

            },


            {
                label:
                    "Saving",

                data:
                    monthNumbers.map(
                        month =>
                            getMonthValue(
                                saving,
                                month
                            )
                    ),

                backgroundColor:
                    savingColor,

                borderColor:
                    savingBorderColor,

                borderWidth:
                    1

            },


            {
                label:
                    "Debt",

                data:
                    monthNumbers.map(
                        month =>
                            getMonthValue(
                                debt,
                                month
                            )
                    ),

                backgroundColor:
                    debtColor,

                borderColor:
                    debtBorderColor,

                borderWidth:
                    1

            },


            {
                label:
                    "Pending Debt",

                data:
                    monthNumbers.map(
                        month =>
                            getMonthValue(
                                pendingDebt,
                                month
                            )
                    ),

                backgroundColor:
                    pendingDebtColor,

                borderColor:
                    pendingDebtBorderColor,

                borderWidth:
                    1

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
                        18

                }

            },


            title: {

                display:
                    true,

                text:
                    isAll

                        ? "Dashboard Overview - All Years"

                        : `Dashboard Overview - ${year}`

            },


            tooltip: {

                callbacks: {

                    label:
                        context => {

                            const value =
                                Number(
                                    context.raw
                                ) || 0;


                            return (

                                `${context.dataset.label}: ` +

                                formatCurrency(
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
                        value =>

                            formatCurrency(
                                value
                            )

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
                maxWidth: "100%"
            }}
        >

            {/* =========================================================
                SUMMARY
            ========================================================= */}

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
                        income.reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                Number(
                                    item?.total || 0
                                ),
                            0
                        )
                    }
                    className="text-success"
                />


                <SummaryCard
                    title="Expense"
                    value={
                        expense.reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                Number(
                                    item?.total || 0
                                ),
                            0
                        )
                    }
                    className="text-danger"
                />


                <SummaryCard
                    title="Saving"
                    value={
                        saving.reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                Number(
                                    item?.total || 0
                                ),
                            0
                        )
                    }
                    className="text-primary"
                />


                <SummaryCard
                    title="Debt"
                    value={
                        debt.reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                Number(
                                    item?.total || 0
                                ),
                            0
                        )
                    }
                    className="text-warning"
                />


                <SummaryCard
                    title="Pending Debt"
                    value={
                        pendingDebt.reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                Number(
                                    item?.total || 0
                                ),
                            0
                        )
                    }
                    className="text-info"
                />

            </div>


            {/* =========================================================
                CHART
            ========================================================= */}

            <div
                className="
                    card
                    shadow-sm
                    w-100
                    mb-4
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

                        Dashboard Overview

                    </h5>


                    <span
                        className="
                            text-muted
                        "
                    >

                        {
                            isAll
                                ? "All Years"
                                : year
                        }

                    </span>

                </div>


                <div
                    className="
                        card-body
                    "
                    style={{
                        height: "450px",
                        minWidth: 0,
                        position: "relative"
                    }}
                >

                    {monthNumbers.length > 0 ? (

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

                            No chart data available

                        </div>

                    )}

                </div>

            </div>


            {/* =========================================================
                MONTHLY SUMMARY
            ========================================================= */}

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

                        <h6 className="mb-0">

                            Monthly Summary

                        </h6>

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
                                            Debt
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
                                        row => (

                                            <tr
                                                key={
                                                    row.month
                                                }
                                            >

                                                <td>

                                                    <strong>

                                                        {
                                                            row.monthName
                                                        }

                                                    </strong>

                                                </td>


                                                <td
                                                    className="
                                                        text-end
                                                        text-success
                                                        fw-semibold
                                                    "
                                                >

                                                    {
                                                        formatCurrency(
                                                            row.income
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
                                                        formatCurrency(
                                                            row.expense
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
                                                        formatCurrency(
                                                            row.saving
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
                                                        formatCurrency(
                                                            row.debt
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
                                                        formatCurrency(
                                                            row.pendingDebt
                                                        )
                                                    }

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

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


export default DashboardChart;