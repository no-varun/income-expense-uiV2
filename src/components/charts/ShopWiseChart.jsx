import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { expenseBorderColor, expenseColor } from "./chartColors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const formatCurrency = (value) => `INR ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2
})}`;

const ShopWiseChart = ({ data = {} }) => {
    const shops = Array.isArray(data?.shops) ? data.shops : [];
    const totalExpense = Number(data?.totalExpense || 0);

    const chartData = {
        labels: shops.map((shop) => shop.label || "Unknown shop"),
        datasets: [{
            label: "Expense",
            data: shops.map((shop) => Number(shop.value || 0)),
            backgroundColor: expenseColor,
            borderColor: expenseBorderColor,
            borderWidth: 1,
            borderRadius: 4
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        scales: {
            x: {
                beginAtZero: true,
                ticks: { callback: (value) => formatCurrency(value) }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => formatCurrency(context.raw)
                }
            }
        }
    };

    return <div className="row g-3">
        <div className="col-12 col-xl-7">
            <div className="card shadow-sm h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center gap-2">
                    <h5 className="mb-0">Expense by Shop</h5>
                    <span className="badge text-bg-danger">{formatCurrency(totalExpense)}</span>
                </div>
                <div className="card-body" style={{ height: Math.max(360, shops.length * 52), minHeight: 360 }}>
                    {shops.length ? <Bar data={chartData} options={chartOptions} /> : <div className="h-100 d-flex align-items-center justify-content-center text-muted">No shop expenses for this period</div>}
                </div>
            </div>
        </div>
        <div className="col-12 col-xl-5">
            <div className="card shadow-sm h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Shop Totals</h5>
                    <strong>{formatCurrency(totalExpense)}</strong>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light"><tr><th>Shop</th><th className="text-end">Expense</th><th className="text-end">Share</th></tr></thead>
                        <tbody>
                            {shops.length ? shops.map((shop, index) => {
                                const value = Number(shop.value || 0);
                                const share = totalExpense ? (value / totalExpense) * 100 : 0;
                                return <tr key={`${shop.label || "shop"}-${index}`}><td className="fw-semibold">{shop.label || "Unknown shop"}</td><td className="text-end text-danger">{formatCurrency(value)}</td><td className="text-end">{share.toFixed(2)}%</td></tr>;
                            }) : <tr><td colSpan="3" className="text-center text-muted py-5">No shop expenses found</td></tr>}
                        </tbody>
                        {shops.length > 0 && <tfoot className="table-light"><tr><th>Total</th><th className="text-end text-danger">{formatCurrency(totalExpense)}</th><th className="text-end">100%</th></tr></tfoot>}
                    </table>
                </div>
            </div>
        </div>
    </div>;
};

export default ShopWiseChart;
