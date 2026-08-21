import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDailyChart, getMonthlyChart, getWeeklyChart, getYearlyChart, getWeekWiseExpenseChart, getCategoryChart, getPaymentModeChart, getDashboardChart, getTitleTypeChart } from "../../api/chartApi";
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
    const location = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const getChartType = () => {
        const path = location.pathname.toLowerCase();

        if (path.includes("titletype") || path.includes("title-type")) {
            return "titleType";
        }

        if (path.includes("paymentmode") || path.includes("payment-mode")) {
            return "paymentMode";
        }

        if (path.includes("category")) {
            return "category";
        }

        if (path.includes("weekwise") || path.includes("week-wise")) {
            return "weekWise";
        }

        if (path.includes("weekly")) {
            return "weekly";
        }

        if (path.includes("yearly")) {
            return "yearly";
        }

        if (path.includes("daily")) {
            return "daily";
        }

        if (path.includes("dashboard")) {
            return "dashboard";
        }

        return "monthly";
    };

    const chartType = getChartType();

    console.log("CHART TYPE:", chartType);
    console.log("CHART DATA:", data);

    const loadChart = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            if (chartType === "dashboard") {
                setData({});
            } else if (chartType === "titleType") {
                setData({
                    data: [],
                    totals: {}
                });
            } else {
                setData([]);
            }

            let response;

            if (chartType === "titleType") {
                console.log("CALLING TITLE TYPE API:", year, month);
                response = await getTitleTypeChart(year, month);
            } else if (chartType === "daily") {
                console.log("CALLING DAILY API:", month, year);
                response = await getDailyChart(month, year);
            } else if (chartType === "monthly") {
                console.log("CALLING MONTHLY API:", year);
                response = await getMonthlyChart(year);
            } else if (chartType === "weekly") {
                console.log("CALLING WEEKLY API");
                response = await getWeeklyChart();
            } else if (chartType === "yearly") {
                console.log("CALLING YEARLY API");
                response = await getYearlyChart();
            } else if (chartType === "weekWise") {
                console.log("CALLING WEEK WISE API:", month, year);
                response = await getWeekWiseExpenseChart(month, year);
            } else if (chartType === "category") {
                console.log("CALLING CATEGORY API:", year, month);
                response = await getCategoryChart(year, month);
            } else if (chartType === "paymentMode") {
                console.log("CALLING PAYMENT MODE API:", year, month);
                response = await getPaymentModeChart(year, month);
            } else if (chartType === "dashboard") {
                console.log("CALLING DASHBOARD API:", year);
                response = await getDashboardChart(year);
            }

            console.log("Chart Type:", chartType);
            console.log("Chart Response:", response);

            const apiResponse = response?.data ?? response;

            console.log("API Response:", apiResponse);

            if (apiResponse?.success === false) {
                setError(
                    apiResponse?.message ||
                    "Unable to load chart."
                );
                return;
            }

            if (chartType === "dashboard") {
                let dashboardData = apiResponse;

                if (
                    dashboardData?.success &&
                    dashboardData?.data
                ) {
                    dashboardData = dashboardData.data;
                }

                if (
                    dashboardData?.data &&
                    typeof dashboardData.data === "object" &&
                    !Array.isArray(dashboardData.data) &&
                    (
                        dashboardData.data.income ||
                        dashboardData.data.expense ||
                        dashboardData.data.saving ||
                        dashboardData.data.Debt ||
                        dashboardData.data.pendingDebt
                    )
                ) {
                    dashboardData = dashboardData.data;
                }

                if (
                    !dashboardData ||
                    typeof dashboardData !== "object" ||
                    Array.isArray(dashboardData)
                ) {
                    dashboardData = {};
                }

                console.log("DASHBOARD DATA:", dashboardData);

                setData(dashboardData);
                return;
            }

            if (chartType === "titleType") {
                let titleTypeData = apiResponse;

                if (
                    titleTypeData?.success &&
                    titleTypeData?.data
                ) {
                    titleTypeData = titleTypeData.data;
                }

                if (
                    titleTypeData?.data &&
                    Array.isArray(titleTypeData.data)
                ) {
                    setData({
                        data: titleTypeData.data,
                        totals: titleTypeData.totals || {}
                    });
                    return;
                }

                if (Array.isArray(titleTypeData)) {
                    setData({
                        data: titleTypeData,
                        totals: {}
                    });
                    return;
                }

                setData({
                    data: [],
                    totals: {}
                });
                return;
            }

            if (chartType === "paymentMode") {
                let paymentModeData = apiResponse;

                if (
                    paymentModeData?.success &&
                    paymentModeData?.data !== undefined
                ) {
                    paymentModeData = paymentModeData.data;
                }

                if (
                    paymentModeData?.data &&
                    typeof paymentModeData.data === "object" &&
                    !Array.isArray(paymentModeData.data)
                ) {
                    paymentModeData = paymentModeData.data;
                }

                if (
                    paymentModeData &&
                    typeof paymentModeData === "object"
                ) {
                    console.log(
                        "PAYMENT MODE DATA:",
                        paymentModeData
                    );

                    setData(paymentModeData);
                    return;
                }

                if (Array.isArray(paymentModeData)) {
                    console.log(
                        "PAYMENT MODE ARRAY DATA:",
                        paymentModeData
                    );

                    setData(paymentModeData);
                    return;
                }

                setData([]);
                return;
            }

            let chartData = apiResponse;

            if (
                chartData?.success &&
                chartData?.data !== undefined
            ) {
                chartData = chartData.data;
            }

            if (
                chartData &&
                chartData.data !== undefined
            ) {
                if (Array.isArray(chartData.data)) {
                    setData(chartData.data);
                    return;
                }

                if (
                    chartData.data &&
                    typeof chartData.data === "object"
                ) {
                    setData(chartData.data);
                    return;
                }
            }

            if (Array.isArray(chartData)) {
                setData(chartData);
                return;
            }

            if (
                chartData &&
                typeof chartData === "object"
            ) {
                setData(chartData);
                return;
            }

            setData([]);
        } catch (error) {
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
    }, [chartType, year, month]);

    useEffect(() => {
        loadChart();
    }, [loadChart]);

    const getTitle = () => {
        switch (chartType) {
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

    const renderChart = () => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center align-items-center py-5">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />
                    <span className="ms-3">
                        Loading chart...
                    </span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="alert alert-danger">
                    {error}
                </div>
            );
        }

        if (chartType === "dashboard") {
            return (
                <DashboardChart
                    data={data}
                />
            );
        }

        if (chartType === "titleType") {
            return (
                <TitleTypeChart
                    data={data}
                />
            );
        }

        if (chartType === "daily") {
            return (
                <DailyChart
                    data={data}
                />
            );
        }

        if (chartType === "monthly") {
            return (
                <MonthlyChart
                    data={data}
                />
            );
        }

        if (chartType === "weekly") {
            return (
                <WeeklyChart
                    data={data}
                />
            );
        }

        if (chartType === "yearly") {
            return (
                <YearlyChart
                    data={data}
                />
            );
        }

        if (chartType === "weekWise") {
            return (
                <WeekWiseChart
                    data={data}
                />
            );
        }

        if (chartType === "category") {
            return (
                <CategoryChart
                    data={data}
                />
            );
        }

        if (chartType === "paymentMode") {
            return (
                <PaymentModeChart
                    data={data}
                />
            );
        }

        return null;
    };

return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <div>
                <h3 className="mb-1">{getTitle()}</h3>
                <div className="text-muted">View and analyse your financial data.</div>
            </div>

            <div className="d-flex align-items-end gap-3 flex-nowrap">
                {(chartType === "daily" || chartType === "weekWise" || chartType === "titleType") && (
                    <div style={{ width: 180 }}>
                        <label className="form-label mb-1">Month</label>
                        <select className="form-select" value={month} onChange={e => setMonth(Number(e.target.value))}>
                            <option value={1}>January</option>
                            <option value={2}>February</option>
                            <option value={3}>March</option>
                            <option value={4}>April</option>
                            <option value={5}>May</option>
                            <option value={6}>June</option>
                            <option value={7}>July</option>
                            <option value={8}>August</option>
                            <option value={9}>September</option>
                            <option value={10}>October</option>
                            <option value={11}>November</option>
                            <option value={12}>December</option>
                        </select>
                    </div>
                )}

                <div style={{ width: 130 }}>
                    <label className="form-label mb-1">Year</label>
                    <select className="form-select" value={year} onChange={e => setYear(Number(e.target.value))}>
                        {Array.from({ length: 7 }, (_, index) => {
                            const itemYear = new Date().getFullYear() - index;

                            return (
                                <option key={itemYear} value={itemYear}>
                                    {itemYear}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
        </div>

        {renderChart()}
    </div>
);
};

export default Charts;