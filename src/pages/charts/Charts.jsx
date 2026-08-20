import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    getDailyChart,
    getMonthlyChart,
    getWeeklyChart,
    getYearlyChart,
    getWeekWiseExpenseChart,
    getCategoryChart,
    getPaymentModeChart,
    getDashboardChart,
    getTitleTypeChart
} from "../../api/chartApi";


import DashboardChart from "../../components/charts/DashboardChart";
import DailyChart from "../../components/charts/DailyChart";
import MonthlyChart from "../../components/charts/MonthlyChart";
import WeeklyChart from "../../components/charts/WeeklyChart";
import YearlyChart from "../../components/charts/YearlyChart";
import WeekWiseChart from "../../components/charts/WeekWiseExpenseChart";
import CategoryChart from "../../components/charts/CategoryChart";
import PaymentModeChart from "../../components/charts/PaymentModeChart";
import TitleTypeChart from "../../components/charts/TitleTypeChart";


const Charts = () => {

    const location =
        useLocation();

    const navigate =
        useNavigate();


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [data, setData] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const [year, setYear] =
        useState(
            new Date().getFullYear()
        );


    const [month, setMonth] =
        useState(
            new Date().getMonth() + 1
        );


    /*
    |--------------------------------------------------------------------------
    | GET CURRENT CHART
    |--------------------------------------------------------------------------
    */

    const getChartType = () => {

        const path =
            location.pathname.toLowerCase();


        if (
            path.includes(
                "titletype"
            )
        ) {
            return "titleType";
        }


        if (
            path.includes(
                "paymentmode"
            )
        ) {
            return "paymentMode";
        }


        if (
            path.includes(
                "category"
            )
        ) {
            return "category";
        }


        if (
            path.includes(
                "weekwise"
            )
        ) {
            return "weekWise";
        }


        if (
            path.includes(
                "weekly"
            )
        ) {
            return "weekly";
        }


        if (
            path.includes(
                "yearly"
            )
        ) {
            return "yearly";
        }


        if (
            path.includes(
                "daily"
            )
        ) {
            return "daily";
        }


        if (
            path.includes(
                "dashboard"
            )
        ) {
            return "dashboard";
        }


        return "monthly";

    };


    const chartType =
        getChartType();


    /*
    |--------------------------------------------------------------------------
    | LOAD CHART
    |--------------------------------------------------------------------------
    */

    const loadChart = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");

                setData([]);


                let response;


                /*
                |--------------------------------------------------------------------------
                | TITLE TYPE
                |--------------------------------------------------------------------------
                */

                if (
                    chartType ===
                    "titleType"
                ) {

                    console.log(
                        "Loading Title Type Chart"
                    );


                    response =
                        await getTitleTypeChart(
                            year,
                            month
                        );


                    console.log(
                        "Title Type API Response:",
                        response
                    );

                }


                /*
                |--------------------------------------------------------------------------
                | DAILY
                |--------------------------------------------------------------------------
                */

                else if (
                    chartType ===
                    "daily"
                ) {

                    response =
                        await getDailyChart(
                            month,
                            year
                        );

                }


                /*
                |--------------------------------------------------------------------------
                | MONTHLY
                |--------------------------------------------------------------------------
                */

                else if (
                    chartType ===
                    "monthly"
                ) {

                    response =
                        await getMonthlyChart(
                            year
                        );

                }


                /*
                |--------------------------------------------------------------------------
                | WEEKLY
                |--------------------------------------------------------------------------
                */

                else if (
                    chartType ===
                    "weekly"
                ) {

                    response =
                        await getWeeklyChart();

                }


                /*
                |--------------------------------------------------------------------------
                | YEARLY
                |--------------------------------------------------------------------------
                */

                else if (
                    chartType ===
                    "yearly"
                ) {

                    response =
                        await getYearlyChart();

                }


                /*
                |--------------------------------------------------------------------------
                | WEEK WISE
                |--------------------------------------------------------------------------
                */

                else if (
                    chartType ===
                    "weekWise"
                ) {

                    response =
                        await getWeekWiseExpenseChart(
                            month,
                            year
                        );

                }


                /*
                |--------------------------------------------------------------------------
                | CATEGORY
                |--------------------------------------------------------------------------
                */

                else if (
                    chartType ===
                    "category"
                ) {

                    response =
                        await getCategoryChart(
                            year,
                            month
                        );

                }


                /*
                |--------------------------------------------------------------------------
                | PAYMENT MODE
                |--------------------------------------------------------------------------
                */

                else if (
                    chartType ===
                    "paymentMode"
                ) {

                    response =
                        await getPaymentModeChart(
                            year,
                            month
                        );

                }


                /*
                |--------------------------------------------------------------------------
                | DASHBOARD
                |--------------------------------------------------------------------------
                */

                else if (
                    chartType ===
                    "dashboard"
                ) {

                    response =
                        await getDashboardChart(
                            year
                        );

                }


                /*
                |--------------------------------------------------------------------------
                | RESPONSE
                |--------------------------------------------------------------------------
                */

                console.log(
                    "Chart Type:",
                    chartType
                );

                console.log(
                    "Chart Response:",
                    response
                );


                /*
                |--------------------------------------------------------------------------
                | AXIOS RESPONSE UNWRAP
                |--------------------------------------------------------------------------
                */

                const apiResponse =
                    response?.data;


                /*
                |--------------------------------------------------------------------------
                | SUCCESS
                |--------------------------------------------------------------------------
                */

                if (
                    apiResponse?.success === false
                ) {

                    setError(
                        apiResponse?.message ||
                        "Unable to load chart."
                    );

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | TITLE TYPE
                |
                | IMPORTANT:
                | Keep the complete object because
                | TitleTypeChart needs:
                |
                | data
                | totals
                |--------------------------------------------------------------------------
                */

                if (
                    chartType ===
                    "titleType"
                ) {

                    const titleTypeData = {

                        data:
                            Array.isArray(
                                apiResponse?.data
                            )
                                ? apiResponse.data
                                : [],

                        totals:
                            apiResponse?.totals ||
                            {}

                    };


                    console.log(
                        "Title Type Data:",
                        titleTypeData
                    );


                    setData(
                        titleTypeData
                    );


                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | NORMAL CHART DATA
                |--------------------------------------------------------------------------
                */

                let chartData =
                    apiResponse?.data;


                /*
                |--------------------------------------------------------------------------
                | HANDLE PAGINATED DATA
                |--------------------------------------------------------------------------
                */

                if (
                    chartData &&
                    Array.isArray(
                        chartData.data
                    )
                ) {

                    chartData =
                        chartData.data;

                }


                /*
                |--------------------------------------------------------------------------
                | ARRAY
                |--------------------------------------------------------------------------
                */

                if (
                    Array.isArray(
                        chartData
                    )
                ) {

                    setData(
                        chartData
                    );

                }

                else if (
                    chartData &&
                    typeof chartData ===
                    "object"
                ) {

                    setData(
                        chartData
                    );

                }

                else {

                    setData([]);

                }

            } catch (
                error
            ) {

                console.error(
                    "Chart Load Error:",
                    error
                );


                setError(

                    error?.response?.data?.message ||

                    error?.message ||

                    "Unable to load chart."

                );

            } finally {

                setLoading(false);

            }

        },
        [
            chartType,
            year,
            month
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | LOAD WHEN PAGE CHANGES
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            loadChart();

        },
        [
            loadChart
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | FORMAT TITLE
    |--------------------------------------------------------------------------
    */

    const getTitle = () => {

        switch (
            chartType
        ) {

            case "dashboard":
                return "Dashboard Chart";

            case "daily":
                return "Daily Chart";

            case "weekly":
                return "This Week Chart";

            case "monthly":
                return "Monthly Chart";

            case "yearly":
                return "Yearly Chart";

            case "weekWise":
                return "Week Wise Chart";

            case "category":
                return "Category Wise Chart";

            case "paymentMode":
                return "Payment Mode Chart";

            case "titleType":
                return "Title Type Chart";

            default:
                return "Charts";

        }

    };


    /*
    |--------------------------------------------------------------------------
    | RENDER CHART
    |--------------------------------------------------------------------------
    */

    const renderChart = () => {

        if (
            loading
        ) {

            return (

                <div
                    className="
                        d-flex
                        justify-content-center
                        align-items-center
                        py-5
                    "
                >

                    <div
                        className="
                            spinner-border
                            text-primary
                        "
                        role="status"
                    />

                    <span className="ms-3">
                        Loading chart...
                    </span>

                </div>

            );

        }


        if (
            error
        ) {

            return (

                <div
                    className="
                        alert
                        alert-danger
                    "
                >

                    {error}

                </div>

            );

        }


        /*
        |--------------------------------------------------------------------------
        | TITLE TYPE
        |--------------------------------------------------------------------------
        */

        if (
            chartType ===
            "titleType"
        ) {

            return (

                <TitleTypeChart
                    data={
                        data
                    }
                />

            );

        }


        /*
        |--------------------------------------------------------------------------
        | DAILY
        |--------------------------------------------------------------------------
        */

        if (
            chartType ===
            "daily"
        ) {

            return (

                <DailyChart
                    data={
                        data
                    }
                />

            );

        }


        /*
        |--------------------------------------------------------------------------
        | MONTHLY
        |--------------------------------------------------------------------------
        */

        if (
            chartType ===
            "monthly"
        ) {

            return (

                <MonthlyChart
                    data={
                        data
                    }
                />

            );

        }


        /*
        |--------------------------------------------------------------------------
        | WEEKLY
        |--------------------------------------------------------------------------

        */

        if (
            chartType ===
            "weekly"
        ) {

            return (

                <WeeklyChart
                    data={
                        data
                    }
                />

            );

        }


        /*
        |--------------------------------------------------------------------------
        | YEARLY
        |--------------------------------------------------------------------------
        */

        if (
            chartType ===
            "yearly"
        ) {

            return (

                <YearlyChart
                    data={
                        data
                    }
                />

            );

        }


        /*
        |--------------------------------------------------------------------------
        | WEEK WISE
        |--------------------------------------------------------------------------
        */

        if (
            chartType ===
            "weekWise"
        ) {

            return (

                <WeekWiseChart
                    data={
                        data
                    }
                />

            );

        }


        /*
        |--------------------------------------------------------------------------
        | CATEGORY
        |--------------------------------------------------------------------------
        */

        if (
            chartType ===
            "category"
        ) {

            return (

                <CategoryChart
                    data={
                        data
                    }
                />

            );

        }


        /*
        |--------------------------------------------------------------------------
        | PAYMENT MODE
        |--------------------------------------------------------------------------
        */

        if (
            chartType ===
            "paymentMode"
        ) {

            return (

                <PaymentModeChart
                    data={
                        data
                    }
                />

            );

        }


        /*
        |--------------------------------------------------------------------------
        | DASHBOARD
        |--------------------------------------------------------------------------
        */

        if (
            chartType ===
            "dashboard"
        ) {

            return (

                <DashboardChart
                    data={
                        data
                    }
                />

            );

        }


        return null;

    };


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="
                container-fluid
                px-3
                px-md-4
                py-3
            "
            style={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0
            }}
        >

            {/* HEADER */}

            <div
                className="
                    d-flex
                    justify-content-between
                    align-items-center
                    flex-wrap
                    gap-3
                    mb-3
                "
            >

                <div>

                    <h3
                        className="mb-1"
                    >

                        {getTitle()}

                    </h3>


                    <div
                        className="
                            text-muted
                        "
                    >

                        View and analyse your
                        financial data.

                    </div>

                </div>


                {/* YEAR */}

                <select
                    className="
                        form-select
                    "
                    style={{
                        width: 130
                    }}
                    value={
                        year
                    }
                    onChange={e =>
                        setYear(
                            Number(
                                e.target.value
                            )
                        )
                    }
                >

                    {Array.from(
                        {
                            length: 7
                        },
                        (
                            _,
                            index
                        ) => {

                            const itemYear =
                                new Date()
                                    .getFullYear() -
                                index;

                            return (

                                <option
                                    key={
                                        itemYear
                                    }
                                    value={
                                        itemYear
                                    }
                                >

                                    {itemYear}

                                </option>

                            );

                        }
                    )}

                </select>

            </div>


            {/* MONTH */}

            {(
                chartType ===
                "daily" ||
                chartType ===
                "weekWise" ||
                chartType ===
                "titleType"
            ) && (

                <div
                    className="
                        mb-3
                    "
                    style={{
                        maxWidth: 180
                    }}
                >

                    <label
                        className="
                            form-label
                            mb-1
                        "
                    >

                        Month

                    </label>


                    <select
                        className="
                            form-select
                        "
                        value={
                            month
                        }
                        onChange={e =>
                            setMonth(
                                Number(
                                    e.target.value
                                )
                            )
                        }
                    >

                        <option value={1}>
                            January
                        </option>

                        <option value={2}>
                            February
                        </option>

                        <option value={3}>
                            March
                        </option>

                        <option value={4}>
                            April
                        </option>

                        <option value={5}>
                            May
                        </option>

                        <option value={6}>
                            June
                        </option>

                        <option value={7}>
                            July
                        </option>

                        <option value={8}>
                            August
                        </option>

                        <option value={9}>
                            September
                        </option>

                        <option value={10}>
                            October
                        </option>

                        <option value={11}>
                            November
                        </option>

                        <option value={12}>
                            December
                        </option>

                    </select>

                </div>

            )}


            {/* CHART */}

            {renderChart()}

        </div>

    );

};


export default Charts;