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
| PERCENTAGE
|--------------------------------------------------------------------------
*/

const getPercentage = (
    value,
    total
) => {

    const numericTotal =
        Number(total) || 0;

    if (
        numericTotal <= 0
    ) {
        return 0;
    }


    return (
        (
            Number(value) || 0
        ) /
        numericTotal
    ) * 100;

};


/*
|--------------------------------------------------------------------------
| NORMALIZE CATEGORY ROW
|--------------------------------------------------------------------------
*/

const getLabel = (
    item
) => {

    return (
        item?.label ||
        item?.name ||
        item?._id ||
        "Unknown"
    );

};


const getValue = (
    item
) => {

    return Number(
        item?.value ??
        item?.amount ??
        0
    );

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
    offset = 0
}) => {

    const safeData =
        Array.isArray(data)
            ? data
            : [];


    const safeTotal =
        Number(total) || 0;


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
                            whiteSpace: "nowrap",
                            flexShrink: 0
                        }}
                    >

                        {formatCurrency(
                            safeTotal
                        )}

                    </span>

                </div>


                {/* CHART */}

                <div
                    className="
                        card-body
                    "
                    style={{
                        height: 350,
                        minWidth: 0,
                        position: "relative"
                    }}
                >

                    {safeData.length > 0 ? (

                        <Pie

                            data={{

                                labels:
                                    safeData.map(
                                        item =>
                                            getLabel(
                                                item
                                            )
                                    ),

                                datasets: [

                                    {

                                        data:
                                            safeData.map(
                                                item =>
                                                    getValue(
                                                        item
                                                    )
                                            ),

                                        backgroundColor:
                                            getSliceColors(
                                                safeData.length,
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

                                responsive: true,

                                maintainAspectRatio:
                                    false,

                                layout: {

                                    padding: 10

                                },


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
                                                        Number(
                                                            context.raw
                                                        ) || 0;


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
                                                                    (
                                                                        Number(
                                                                            item
                                                                        ) || 0
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
                                            safeTotal

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
| CATEGORY TABLE
|--------------------------------------------------------------------------
*/

const CategoryTable = ({
    title,
    data = [],
    total = 0
}) => {

    const safeData =
        Array.isArray(data)
            ? data
            : [];


    const safeTotal =
        Number(total) || 0;


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
                        d-flex
                        justify-content-between
                        align-items-center
                    "
                >

                    <h6 className="mb-0">

                        {title}

                    </h6>


                    <strong>

                        {formatCurrency(
                            safeTotal
                        )}

                    </strong>

                </div>


                {/* TABLE */}

                <div
                    className="
                        card-body
                        p-0
                    "
                >

                    {safeData.length > 0 ? (

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
                                            Category
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

                                    {safeData.map(
                                        (
                                            item,
                                            index
                                        ) => {

                                            const value =
                                                getValue(
                                                    item
                                                );


                                            const percentage =
                                                getPercentage(
                                                    value,
                                                    safeTotal
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        `${getLabel(item)}-${index}`
                                                    }
                                                >

                                                    <td>

                                                        <strong>

                                                            {
                                                                getLabel(
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
                                                    safeTotal
                                                )
                                            }

                                        </th>


                                        <th
                                            className="
                                                text-end
                                            "
                                        >

                                            {
                                                safeData.length > 0
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
                                p-4
                                text-muted
                                text-center
                            "
                        >

                            No category data available

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};


/*
|--------------------------------------------------------------------------
| MAIN CATEGORY CHART
|--------------------------------------------------------------------------
*/

const CategoryChart = ({
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


    const saving =
        Array.isArray(
            data?.saving
        )
            ? data.saving
            : [];


    const debt =
        Array.isArray(
            data?.debt
        )
            ? data.debt
            : [];


    const pendingDebt =
        Array.isArray(
            data?.pendingDebt
        )
            ? data.pendingDebt
            : [];


    /*
    |--------------------------------------------------------------------------
    | TOTALS
    |--------------------------------------------------------------------------
    */

    const totalIncome =
        Number(
            data?.totalIncome || 0
        );


    const totalExpense =
        Number(
            data?.totalExpense || 0
        );


    const totalSaving =
        Number(
            data?.totalSaving || 0
        );


    const totalDebt =
        Number(
            data?.totalDebt || 0
        );


    const totalPendingDebt =
        Number(
            data?.totalPendingDebt || 0
        );


    /*
    |--------------------------------------------------------------------------
    | CHARTS
    |--------------------------------------------------------------------------
    */

    const charts = [

        {
            title:
                "Income Category",

            badgeColor:
                "bg-success",

            data:
                income,

            total:
                totalIncome,

            offset:
                0
        },

        {
            title:
                "Expense Category",

            badgeColor:
                "bg-danger",

            data:
                expense,

            total:
                totalExpense,

            offset:
                4
        },

        {
            title:
                "Saving Category",

            badgeColor:
                "bg-primary",

            data:
                saving,

            total:
                totalSaving,

            offset:
                8
        },

        {
            title:
                "Debt Category",

            badgeColor:
                "bg-warning text-dark",

            data:
                debt,

            total:
                totalDebt,

            offset:
                12
        },

        {
            title:
                "Pending Debt Category",

            badgeColor:
                "bg-info text-dark",

            data:
                pendingDebt,

            total:
                totalPendingDebt,

            offset:
                16
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
                maxWidth: "100%",
                minWidth: 0,
                overflow: "hidden"
            }}
        >

            {/* =========================================================
                PIE CHARTS
            ========================================================= */}

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

                            {...chart}

                        />

                    )
                )}

            </div>


            {/* =========================================================
                CATEGORY TABLES
            ========================================================= */}

            <div
                className="
                    row
                    g-3
                    mx-0
                    mt-1
                "
            >

                <CategoryTable
                    title="Income Categories"
                    data={income}
                    total={totalIncome}
                />


                <CategoryTable
                    title="Expense Categories"
                    data={expense}
                    total={totalExpense}
                />


                <CategoryTable
                    title="Saving Categories"
                    data={saving}
                    total={totalSaving}
                />


                <CategoryTable
                    title="Debt Categories"
                    data={debt}
                    total={totalDebt}
                />


                <CategoryTable
                    title="Pending Debt Categories"
                    data={pendingDebt}
                    total={totalPendingDebt}
                />

            </div>

        </div>

    );

};


export default CategoryChart;