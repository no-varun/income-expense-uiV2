import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

import { getSliceColors } from "./chartColors";


/*
|--------------------------------------------------------------------------
| CENTER TEXT PLUGIN
|--------------------------------------------------------------------------
*/

const centerTextPlugin = {

    id: "centerText",

    beforeDraw(
        chart,
        args,
        options
    ) {

        if (
            !options?.display
        ) {
            return;
        }

        const meta =
            chart.getDatasetMeta(0);

        if (
            !meta?.data?.length
        ) {
            return;
        }

        const {
            ctx
        } = chart;

        const x =
            meta.data[0].x;

        const y =
            meta.data[0].y;

        ctx.save();

        ctx.font =
            "bold 18px Arial";

        ctx.fillStyle =
            "#212529";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(

            `₹${Number(
                options.total || 0
            ).toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 2
                }
            )}`,

            x,
            y

        );

        ctx.restore();

    }

};


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    centerTextPlugin
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
        getNumber(value) /
        getNumber(total)
    ) * 100;

};


/*
|--------------------------------------------------------------------------
| PIE CARD
|--------------------------------------------------------------------------
*/

const PieCard = ({
    title,
    badgeColor,
    data = [],
    total = 0,
    pendingTotal = 0,
    recoveredTotal = 0,
    isDebt = false,
    offset = 0
}) => {

    const rows =
        Array.isArray(data)
            ? data
            : [];


    return (

        <div
            className="
                col-12
                col-md-6
                col-xl-4
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

                {/* HEADER */}

                <div
                    className="
                        card-header
                    "
                >

                    <div
                        className="
                            d-flex
                            justify-content-between
                            align-items-center
                            gap-2
                        "
                    >

                        <h6
                            className="
                                mb-0
                                text-truncate
                            "
                            title={title}
                        >

                            {title}

                        </h6>


                        <span
                            className={`
                                badge
                                ${badgeColor}
                                fs-6
                            `}
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

                        </span>

                    </div>


                    {/* DEBT SUMMARY */}

                    {isDebt && (

                        <div
                            className="
                                row
                                g-2
                                mt-3
                            "
                        >

                            <DebtSummary
                                title="Actual"
                                value={total}
                                className=""
                            />


                            <DebtSummary
                                title="Pending"
                                value={pendingTotal}
                                className="text-warning"
                            />


                            <DebtSummary
                                title="Recovered"
                                value={recoveredTotal}
                                className="text-success"
                            />

                        </div>

                    )}

                </div>


                {/* CHART */}

                <div
                    className="
                        card-body
                    "
                    style={{
                        height: 350,
                        position: "relative",
                        minWidth: 0
                    }}
                >

                    {rows.length > 0 ? (

                        <Pie

                            data={{

                                labels:
                                    rows.map(
                                        item =>
                                            item?.label ||
                                            item?.title ||
                                            "Unknown"
                                    ),

                                datasets: [

                                    {

                                        data:
                                            rows.map(
                                                item =>
                                                    getNumber(
                                                        item?.amount
                                                    )
                                            ),

                                        backgroundColor:
                                            getSliceColors(
                                                rows.length,
                                                offset
                                            ),

                                        borderColor:
                                            "#fff",

                                        borderWidth:
                                            2

                                    }

                                ]

                            }}


                            options={{

                                responsive:
                                    true,

                                maintainAspectRatio:
                                    false,


                                plugins: {

                                    legend: {

                                        position:
                                            "bottom",

                                        labels: {

                                            boxWidth:
                                                12,

                                            padding:
                                                10,

                                            usePointStyle:
                                                true

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


                                                    const totalValue =
                                                        context
                                                            .dataset
                                                            .data
                                                            .reduce(
                                                                (
                                                                    sum,
                                                                    item
                                                                ) =>
                                                                    sum +
                                                                    getNumber(
                                                                        item
                                                                    ),
                                                                0
                                                            );


                                                    const percentage =
                                                        getPercentage(
                                                            value,
                                                            totalValue
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

                                    },


                                    centerText: {

                                        display:
                                            true,

                                        total:
                                            total

                                    }

                                }

                            }}

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

                            No data available

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};


/*
|--------------------------------------------------------------------------
| DEBT SUMMARY ITEM
|--------------------------------------------------------------------------
*/

const DebtSummary = ({
    title,
    value,
    className = ""
}) => {

    return (

        <div
            className="
                col-4
            "
        >

            <div
                className="
                    border
                    rounded
                    p-2
                    text-center
                    h-100
                "
            >

                <div
                    className="
                        small
                        text-muted
                    "
                >

                    {title}

                </div>


                <div
                    className={`
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

    );

};


/*
|--------------------------------------------------------------------------
| TITLE TABLE
|--------------------------------------------------------------------------
*/

const TitleTable = ({
    title,
    data = [],
    total = 0,
    pendingTotal = 0,
    recoveredTotal = 0,
    isDebt = false
}) => {

    const rows =
        Array.isArray(data)
            ? data
            : [];


    const totalCount =
        rows.reduce(
            (
                sum,
                item
            ) =>
                sum +
                getNumber(
                    item?.count
                ),
            0
        );


    return (

        <div
            className="
                col-12
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

                    <div
                        className="
                            d-flex
                            justify-content-between
                            align-items-center
                            gap-2
                        "
                    >

                        <h6 className="mb-0">

                            {title}

                        </h6>


                        <strong>

                            {
                                formatCurrency(
                                    total
                                )
                            }

                        </strong>

                    </div>


                    {isDebt && (

                        <div
                            className="
                                row
                                g-2
                                mt-3
                            "
                        >

                            <DebtSummary
                                title="Actual Debt"
                                value={total}
                            />


                            <DebtSummary
                                title="Pending Debt"
                                value={pendingTotal}
                                className="text-warning"
                            />


                            <DebtSummary
                                title="Recovered"
                                value={recoveredTotal}
                                className="text-success"
                            />

                        </div>

                    )}

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
                                            Title
                                        </th>

                                        <th>
                                            Exists
                                        </th>

                                        <th
                                            className="
                                                text-end
                                            "
                                        >
                                            Actual
                                        </th>

                                        {isDebt && (

                                            <th
                                                className="
                                                    text-end
                                                "
                                            >
                                                Pending
                                            </th>

                                        )}

                                        {isDebt && (

                                            <th
                                                className="
                                                    text-end
                                                "
                                            >
                                                Recovered
                                            </th>

                                        )}

                                        <th
                                            className="
                                                text-end
                                            "
                                        >
                                            Count
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

                                            const actual =
                                                getNumber(
                                                    item?.amount
                                                );


                                            const pending =
                                                isDebt
                                                    ? getNumber(
                                                        item?.pendingAmount
                                                    )
                                                    : 0;


                                            const recovered =
                                                isDebt

                                                    ? Math.max(
                                                        0,
                                                        actual -
                                                        pending
                                                    )

                                                    : 0;


                                            const percentage =
                                                getPercentage(
                                                    actual,
                                                    total
                                                );


                                            const label =
                                                item?.label ||
                                                item?.title ||
                                                "Unknown";


                                            const exists =
                                                String(
                                                    item?.exists ||
                                                    "no"
                                                ).toLowerCase();


                                            return (

                                                <tr
                                                    key={
                                                        `${label}-${index}`
                                                    }
                                                >

                                                    <td>

                                                        <strong>

                                                            {label}

                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                exists === "yes"
                                                                    ? "badge bg-success"
                                                                    : "badge bg-danger"
                                                            }
                                                        >

                                                            {
                                                                exists === "yes"
                                                                    ? "Yes"
                                                                    : "No"
                                                            }

                                                        </span>

                                                    </td>


                                                    <td
                                                        className="
                                                            text-end
                                                        "
                                                    >

                                                        {
                                                            formatCurrency(
                                                                actual
                                                            )
                                                        }

                                                    </td>


                                                    {isDebt && (

                                                        <td
                                                            className="
                                                                text-end
                                                                text-warning
                                                            "
                                                        >

                                                            {
                                                                formatCurrency(
                                                                    pending
                                                                )
                                                            }

                                                        </td>

                                                    )}


                                                    {isDebt && (

                                                        <td
                                                            className="
                                                                text-end
                                                                text-success
                                                            "
                                                        >

                                                            {
                                                                formatCurrency(
                                                                    recovered
                                                                )
                                                            }

                                                        </td>

                                                    )}


                                                    <td
                                                        className="
                                                            text-end
                                                        "
                                                    >

                                                        {
                                                            getNumber(
                                                                item?.count
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

                                        <th>
                                            -
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


                                        {isDebt && (

                                            <th
                                                className="
                                                    text-end
                                                    text-warning
                                                "
                                            >

                                                {
                                                    formatCurrency(
                                                        pendingTotal
                                                    )
                                                }

                                            </th>

                                        )}


                                        {isDebt && (

                                            <th
                                                className="
                                                    text-end
                                                    text-success
                                                "
                                            >

                                                {
                                                    formatCurrency(
                                                        recoveredTotal
                                                    )
                                                }

                                            </th>

                                        )}


                                        <th
                                            className="
                                                text-end
                                            "
                                        >

                                            {totalCount}

                                        </th>


                                        <th
                                            className="
                                                text-end
                                            "
                                        >

                                            100%

                                        </th>

                                    </tr>

                                </tfoot>

                            </table>

                        </div>

                    ) : (

                        <div
                            className="
                                p-4
                                text-center
                                text-muted
                            "
                        >

                            No title data available

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};


/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

const TitleTypeChart = ({
    data = {}
}) => {

    /*
    |--------------------------------------------------------------------------
    | API RESPONSE
    |--------------------------------------------------------------------------
    */

    const apiData =
        Array.isArray(
            data?.data
        )
            ? data.data
            : [];


    const apiTotals =
        data?.totals &&
        typeof data.totals === "object"
            ? data.totals
            : {};


    /*
    |--------------------------------------------------------------------------
    | GET TYPE DATA
    |--------------------------------------------------------------------------
    */

    const getTypeData = (
        type
    ) => {

        return apiData

            .filter(
                item =>
                    String(
                        item?.type || ""
                    ).toLowerCase() ===
                    String(
                        type
                    ).toLowerCase()
            )

            .map(
                item => ({

                    label:
                        item?.title ||
                        "Unknown",

                    amount:
                        getNumber(
                            item?.amount
                        ),

                    pendingAmount:
                        getNumber(
                            item?.pendingAmount
                        ),

                    count:
                        getNumber(
                            item?.count
                        ),

                    exists:
                        String(
                            item?.exists ||
                            "no"
                        ).toLowerCase()

                })
            );

    };


    /*
    |--------------------------------------------------------------------------
    | TOTAL
    |--------------------------------------------------------------------------
    */

    const getTypeTotal = (
        type
    ) => {

        return getNumber(
            apiTotals?.[type]?.amount
        );

    };


    /*
    |--------------------------------------------------------------------------
    | PENDING
    |--------------------------------------------------------------------------
    */

    const getPendingTotal = (
        type
    ) => {

        return getNumber(
            apiTotals?.[type]?.pendingAmount
        );

    };


    /*
    |--------------------------------------------------------------------------
    | RECOVERED
    |--------------------------------------------------------------------------
    */

    const getRecoveredTotal = (
        type
    ) => {

        const actual =
            getTypeTotal(
                type
            );

        const pending =
            getPendingTotal(
                type
            );


        return Math.max(
            0,
            actual -
            pending
        );

    };


    /*
    |--------------------------------------------------------------------------
    | CHART CONFIG
    |--------------------------------------------------------------------------
    */

    const charts = [

        {

            title:
                "Income Title",

            badgeColor:
                "bg-success",

            data:
                getTypeData(
                    "Income"
                ),

            total:
                getTypeTotal(
                    "Income"
                ),

            pendingTotal:
                0,

            recoveredTotal:
                0,

            isDebt:
                false,

            offset:
                0

        },


        {

            title:
                "Expense Title",

            badgeColor:
                "bg-danger",

            data:
                getTypeData(
                    "Expense"
                ),

            total:
                getTypeTotal(
                    "Expense"
                ),

            pendingTotal:
                0,

            recoveredTotal:
                0,

            isDebt:
                false,

            offset:
                4

        },


        {

            title:
                "Saving Title",

            badgeColor:
                "bg-primary",

            data:
                getTypeData(
                    "Saving"
                ),

            total:
                getTypeTotal(
                    "Saving"
                ),

            pendingTotal:
                0,

            recoveredTotal:
                0,

            isDebt:
                false,

            offset:
                8

        },


        {

            title:
                "Debt Title",

            badgeColor:
                "bg-warning text-dark",

            data:
                getTypeData(
                    "Debt"
                ),

            total:
                getTypeTotal(
                    "Debt"
                ),

            pendingTotal:
                getPendingTotal(
                    "Debt"
                ),

            recoveredTotal:
                getRecoveredTotal(
                    "Debt"
                ),

            isDebt:
                true,

            offset:
                12

        }

    ];


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
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
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
                    mx-0
                    mb-3
                "
            >

                {charts.map(
                    chart => (

                        <SummaryCard
                            key={
                                `summary-${chart.title}`
                            }

                            title={
                                chart.title
                            }

                            value={
                                chart.total
                            }

                            className={
                                chart.badgeColor
                                    .replace(
                                        "bg-",
                                        "text-"
                                    )
                                    .replace(
                                        " text-dark",
                                        ""
                                    )
                            }

                        />

                    )
                )}

            </div>


            {/* =====================================================
                PIE CHARTS
            ===================================================== */}

            <div
                className="
                    row
                    g-3
                    mx-0
                "
            >

                {charts.map(
                    chart => (

                        <PieCard
                            key={
                                chart.title
                            }

                            title={
                                chart.title
                            }

                            badgeColor={
                                chart.badgeColor
                            }

                            data={
                                chart.data
                            }

                            total={
                                chart.total
                            }

                            pendingTotal={
                                chart.pendingTotal
                            }

                            recoveredTotal={
                                chart.recoveredTotal
                            }

                            isDebt={
                                chart.isDebt
                            }

                            offset={
                                chart.offset
                            }

                        />

                    )
                )}

            </div>


            {/* =====================================================
                TABLES
            ===================================================== */}

            <div
                className="
                    row
                    g-3
                    mx-0
                    mt-1
                "
            >

                {charts.map(
                    chart => (

                        <TitleTable
                            key={
                                `${chart.title}-table`
                            }

                            title={
                                chart.title
                            }

                            data={
                                chart.data
                            }

                            total={
                                chart.total
                            }

                            pendingTotal={
                                chart.pendingTotal
                            }

                            recoveredTotal={
                                chart.recoveredTotal
                            }

                            isDebt={
                                chart.isDebt
                            }

                        />

                    )
                )}

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
    className = ""
}) => {

    return (

        <div
            className="
                col-12
                col-sm-6
                col-lg-3
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
                            small
                            text-muted
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


export default TitleTypeChart;