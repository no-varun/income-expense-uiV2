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

const savingColor = "#198754";
const savingBorderColor = "#146c43";

const debtColor = "#ffc107";
const debtBorderColor = "#cc9a06";

const pendingDebtColor = "#0dcaf0";
const pendingDebtBorderColor = "#0aa2c0";


/*
|--------------------------------------------------------------------------
| FORMAT AMOUNT
|--------------------------------------------------------------------------
*/

const formatAmount = (
    amount
) => {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );

};


/*
|--------------------------------------------------------------------------
| FORMAT DATE
|--------------------------------------------------------------------------
*/

const formatDate = (
    date
) => {

    if (!date) {
        return "-";
    }


    const parsedDate =
        new Date(
            `${date}T00:00:00`
        );


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return date;

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
| GET FIELD VALUE
|--------------------------------------------------------------------------
*/

const getFieldValue = (
    item,
    field
) => {

    return Number(
        item?.[field] || 0
    );

};


/*
|--------------------------------------------------------------------------
| DAILY SECTION
|--------------------------------------------------------------------------
*/

const DailySection = ({
    title,
    tableTitle,
    data = [],
    field,
    color,
    borderColor,
    badgeColor,
    amountLabel
}) => {

    const rows =
        Array.isArray(data)
            ? data
            : [];


    /*
    |--------------------------------------------------------------------------
    | TOTAL
    |--------------------------------------------------------------------------
    */

    const total =
        rows.reduce(
            (
                sum,
                item
            ) => {

                return (
                    sum +
                    getFieldValue(
                        item,
                        field
                    )
                );

            },
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
                    item?.day ??
                    item?.date ??
                    "-"
            ),

        datasets: [

            {

                label:
                    title,

                data:
                    rows.map(
                        item =>
                            getFieldValue(
                                item,
                                field
                            )
                    ),

                backgroundColor:
                    color,

                borderColor:
                    borderColor,

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
                        12

                }

            },


            title: {

                display:
                    true,

                text:
                    title

            },


            tooltip: {

                callbacks: {

                    label:
                        context => {

                            return (

                                `${context.dataset.label}: ₹` +

                                formatAmount(
                                    context.raw
                                )

                            );

                        }

                }

            }

        },


        scales: {

            x: {

                title: {

                    display:
                        true,

                    text:
                        "Day"

                },

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

                            return (

                                `₹${Number(
                                    value
                                ).toLocaleString(
                                    "en-IN"
                                )}`

                            );

                        }

                }

            }

        }

    };


    return (

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

            {/* =====================================================
                HEADER
            ===================================================== */}

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


                <span
                    className={`
                        badge
                        ${badgeColor}
                    `}
                    style={{
                        whiteSpace:
                            "nowrap",
                        flexShrink:
                            0
                    }}
                >

                    ₹
                    {formatAmount(
                        total
                    )}

                </span>

            </div>


            {/* =====================================================
                CHART
            ===================================================== */}

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

                        No data found

                    </div>

                )}

            </div>


            {/* =====================================================
                TABLE HEADER
            ===================================================== */}

            <div
                className="
                    border-top
                    px-3
                    py-2
                    bg-light
                "
            >

                <h6 className="mb-0">

                    {tableTitle}

                </h6>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

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
                                Date
                            </th>

                            <th
                                className="
                                    text-end
                                "
                            >
                                {amountLabel}
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {rows.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="2"
                                    className="
                                        text-center
                                        text-muted
                                        py-3
                                    "
                                >

                                    No data found

                                </td>

                            </tr>

                        ) : (

                            rows.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            `${item?.date || item?.day}-${field}-${index}`
                                        }
                                    >

                                        <td>

                                            {formatDate(
                                                item?.date
                                            )}

                                        </td>


                                        <td
                                            className="
                                                text-end
                                            "
                                        >

                                            <span
                                                className={`
                                                    badge
                                                    ${badgeColor}
                                                `}
                                            >

                                                ₹
                                                {formatAmount(
                                                    getFieldValue(
                                                        item,
                                                        field
                                                    )
                                                )}

                                            </span>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>


                    {rows.length > 0 && (

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

                                    ₹
                                    {formatAmount(
                                        total
                                    )}

                                </th>

                            </tr>

                        </tfoot>

                    )}

                </table>

            </div>

        </div>

    );

};


/*
|--------------------------------------------------------------------------
| DAILY CHART
|--------------------------------------------------------------------------
*/

const DailyChart = ({
    data = [],
    month,
    year
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
    | MONTH / YEAR ARE KEPT IN PROPS
    |--------------------------------------------------------------------------
    |
    | Charts.jsx still passes these values.
    | The API response itself contains the daily rows.
    |
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
                HEADER
            ===================================================== */}

            <div
                className="
                    d-flex
                    justify-content-between
                    align-items-center
                    flex-wrap
                    gap-2
                    mb-3
                "
            >

                <div>

                    <h4 className="mb-1">

                        Daily Charts

                    </h4>

                    <div
                        className="
                            text-muted
                            small
                        "
                    >

                        Daily income, expense,
                        saving and debt analysis

                    </div>

                </div>


                {(month || year) && (

                    <div
                        className="
                            text-muted
                            small
                        "
                    >

                        {month !== "all" && month}
                        {month !== "all" && year !== "all" && " / "}
                        {year !== "all" && year}

                    </div>

                )}

            </div>


            {/* =====================================================
                CHART GRID
            ===================================================== */}

            <div
                className="
                    row
                    g-3
                    mx-0
                "
            >

                {/* =================================================
                    INCOME
                ================================================= */}

                <div
                    className="
                        col-12
                        col-xl-6
                        px-0
                        pe-xl-2
                    "
                >

                    <DailySection

                        title="Daily Income"

                        tableTitle="Date Wise Income List"

                        data={
                            rows
                        }

                        field="income"

                        color={
                            incomeColor
                        }

                        borderColor={
                            incomeBorderColor
                        }

                        badgeColor="bg-success"

                        amountLabel="Total Income"

                    />

                </div>


                {/* =================================================
                    EXPENSE
                ================================================= */}

                <div
                    className="
                        col-12
                        col-xl-6
                        px-0
                        ps-xl-2
                    "
                >

                    <DailySection

                        title="Daily Expense"

                        tableTitle="Date Wise Expense List"

                        data={
                            rows
                        }

                        field="expense"

                        color={
                            expenseColor
                        }

                        borderColor={
                            expenseBorderColor
                        }

                        badgeColor="bg-danger"

                        amountLabel="Total Expense"

                    />

                </div>


                {/* =================================================
                    SAVING
                ================================================= */}

                <div
                    className="
                        col-12
                        col-xl-6
                        px-0
                        pe-xl-2
                    "
                >

                    <DailySection

                        title="Daily Saving"

                        tableTitle="Date Wise Saving List"

                        data={
                            rows
                        }

                        field="saving"

                        color={
                            savingColor
                        }

                        borderColor={
                            savingBorderColor
                        }

                        badgeColor="bg-primary"

                        amountLabel="Total Saving"

                    />

                </div>


                {/* =================================================
                    DEBT
                ================================================= */}

                <div
                    className="
                        col-12
                        col-xl-6
                        px-0
                        ps-xl-2
                    "
                >

                    <DailySection

                        title="Daily Debt"

                        tableTitle="Date Wise Debt List"

                        data={
                            rows
                        }

                        field="totalDebt"

                        color={
                            debtColor
                        }

                        borderColor={
                            debtBorderColor
                        }

                        badgeColor="
                            bg-warning
                            text-dark
                        "

                        amountLabel="Total Debt"

                    />

                </div>


                {/* =================================================
                    PENDING DEBT
                ================================================= */}

                <div
                    className="
                        col-12
                        col-xl-6
                        px-0
                        pe-xl-2
                    "
                >

                    <DailySection

                        title="Daily Pending Debt"

                        tableTitle="Date Wise Pending Debt List"

                        data={
                            rows
                        }

                        field="pendingDebt"

                        color={
                            pendingDebtColor
                        }

                        borderColor={
                            pendingDebtBorderColor
                        }

                        badgeColor="
                            bg-info
                            text-dark
                        "

                        amountLabel="Pending Debt"

                    />

                </div>

            </div>

        </div>

    );

};


export default DailyChart;