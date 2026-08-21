import React, { useMemo } from "react";

const DashboardChart = ({ data }) => {
    console.log("DASHBOARD DATA:", data);

    const dashboardData = useMemo(() => {
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            return {};
        }

        if (data.success && data.data && typeof data.data === "object") {
            return data.data;
        }

        return data;
    }, [data]);

    const income = Array.isArray(dashboardData.income)
        ? dashboardData.income
        : [];

    const expense = Array.isArray(dashboardData.expense)
        ? dashboardData.expense
        : [];

    const saving = Array.isArray(dashboardData.saving)
        ? dashboardData.saving
        : [];

    const debt = Array.isArray(dashboardData.Debt)
        ? dashboardData.Debt
        : [];

    const pendingDebt = Array.isArray(dashboardData.pendingDebt)
        ? dashboardData.pendingDebt
        : [];

    const months = [
        { id: 1, name: "Jan" },
        { id: 2, name: "Feb" },
        { id: 3, name: "Mar" },
        { id: 4, name: "Apr" },
        { id: 5, name: "May" },
        { id: 6, name: "Jun" },
        { id: 7, name: "Jul" },
        { id: 8, name: "Aug" },
        { id: 9, name: "Sep" },
        { id: 10, name: "Oct" },
        { id: 11, name: "Nov" },
        { id: 12, name: "Dec" }
    ];

    const getAmount = item => {
        if (!item) {
            return 0;
        }

        if (typeof item === "number") {
            return Number(item) || 0;
        }

        return Number(
            item.total ??
            item.amount ??
            item.totalAmount ??
            item.value ??
            0
        ) || 0;
    };

    const getMonthAmount = (items, monthId) => {
        const item = items.find(
            item => Number(item?._id) === monthId
        );

        return item ? getAmount(item) : 0;
    };

    const monthlyData = useMemo(() => {
        return months.map(month => ({
            id: month.id,
            name: month.name,
            income: getMonthAmount(income, month.id),
            expense: getMonthAmount(expense, month.id),
            saving: getMonthAmount(saving, month.id),
            debt: getMonthAmount(debt, month.id),
            pendingDebt: getMonthAmount(
                pendingDebt,
                month.id
            )
        }));
    }, [
        income,
        expense,
        saving,
        debt,
        pendingDebt
    ]);

    const totals = useMemo(() => {
        return {
            income: monthlyData.reduce(
                (sum, item) => sum + item.income,
                0
            ),
            expense: monthlyData.reduce(
                (sum, item) => sum + item.expense,
                0
            ),
            saving: monthlyData.reduce(
                (sum, item) => sum + item.saving,
                0
            ),
            debt: monthlyData.reduce(
                (sum, item) => sum + item.debt,
                0
            ),
            pendingDebt: monthlyData.reduce(
                (sum, item) => sum + item.pendingDebt,
                0
            )
        };
    }, [monthlyData]);

    const maxValue = Math.max(
        ...monthlyData.flatMap(item => [
            item.income,
            item.expense,
            item.saving,
            item.debt,
            item.pendingDebt
        ]),
        1
    );

    const formatAmount = amount => {
        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );
    };

    return (
        <div className="w-100">
            <div className="row g-3 mb-3">
                <div className="col-12 col-md-6 col-lg">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="text-muted mb-2">
                                Income
                            </div>
                            <h4 className="mb-0 text-success">
                                ₹{formatAmount(totals.income)}
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="text-muted mb-2">
                                Expense
                            </div>
                            <h4 className="mb-0 text-danger">
                                ₹{formatAmount(totals.expense)}
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="text-muted mb-2">
                                Saving
                            </div>
                            <h4 className="mb-0 text-primary">
                                ₹{formatAmount(totals.saving)}
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="text-muted mb-2">
                                Debt
                            </div>
                            <h4 className="mb-0 text-warning">
                                ₹{formatAmount(totals.debt)}
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="text-muted mb-2">
                                Pending Debt
                            </div>
                            <h4 className="mb-0 text-info">
                                ₹{formatAmount(totals.pendingDebt)}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">
                            Dashboard Overview
                        </h4>
                        <span className="text-muted">
                            {new Date().getFullYear()}
                        </span>
                    </div>
                </div>

                <div className="card-body">
                    <div
                        className="w-100"
                        style={{
                            overflowX: "auto"
                        }}
                    >
                        <div
                            style={{
                                minWidth: "900px"
                            }}
                        >
                            <div
                                className="d-flex align-items-end"
                                style={{
                                    height: "350px",
                                    gap: "12px",
                                    padding: "20px 10px 0"
                                }}
                            >
                                {monthlyData.map(month => {
                                    const incomeHeight =
                                        month.income > 0
                                            ? Math.max(
                                                (month.income / maxValue) * 250,
                                                4
                                            )
                                            : 2;

                                    const expenseHeight =
                                        month.expense > 0
                                            ? Math.max(
                                                (month.expense / maxValue) * 250,
                                                4
                                            )
                                            : 2;

                                    const savingHeight =
                                        month.saving > 0
                                            ? Math.max(
                                                (month.saving / maxValue) * 250,
                                                4
                                            )
                                            : 2;

                                    return (
                                        <div
                                            key={month.id}
                                            className="flex-fill d-flex flex-column align-items-center"
                                            style={{
                                                minWidth: "60px",
                                                height: "100%"
                                            }}
                                        >
                                            <div
                                                className="d-flex align-items-end justify-content-center gap-1"
                                                style={{
                                                    height: "280px",
                                                    width: "100%"
                                                }}
                                            >
                                                <div
                                                    title={`Income: ₹${formatAmount(month.income)}`}
                                                    style={{
                                                        width: "10px",
                                                        height: `${incomeHeight}px`,
                                                        backgroundColor: "#198754",
                                                        borderRadius: "4px 4px 0 0"
                                                    }}
                                                />

                                                <div
                                                    title={`Expense: ₹${formatAmount(month.expense)}`}
                                                    style={{
                                                        width: "10px",
                                                        height: `${expenseHeight}px`,
                                                        backgroundColor: "#dc3545",
                                                        borderRadius: "4px 4px 0 0"
                                                    }}
                                                />

                                                <div
                                                    title={`Saving: ₹${formatAmount(month.saving)}`}
                                                    style={{
                                                        width: "10px",
                                                        height: `${savingHeight}px`,
                                                        backgroundColor: "#0d6efd",
                                                        borderRadius: "4px 4px 0 0"
                                                    }}
                                                />
                                            </div>

                                            <div
                                                className="fw-semibold mt-2"
                                                style={{
                                                    fontSize: "13px"
                                                }}
                                            >
                                                {month.name}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="d-flex justify-content-center gap-4 mt-3 flex-wrap">
                                <div className="d-flex align-items-center gap-2">
                                    <span
                                        style={{
                                            width: "12px",
                                            height: "12px",
                                            backgroundColor: "#198754",
                                            borderRadius: "2px"
                                        }}
                                    />
                                    <span className="small">
                                        Income
                                    </span>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <span
                                        style={{
                                            width: "12px",
                                            height: "12px",
                                            backgroundColor: "#dc3545",
                                            borderRadius: "2px"
                                        }}
                                    />
                                    <span className="small">
                                        Expense
                                    </span>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <span
                                        style={{
                                            width: "12px",
                                            height: "12px",
                                            backgroundColor: "#0d6efd",
                                            borderRadius: "2px"
                                        }}
                                    />
                                    <span className="small">
                                        Saving
                                    </span>
                                </div>
                            </div>

                            <div className="table-responsive mt-4">
                                <table className="table table-bordered align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th className="text-end">
                                                Income
                                            </th>
                                            <th className="text-end">
                                                Expense
                                            </th>
                                            <th className="text-end">
                                                Saving
                                            </th>
                                            <th className="text-end">
                                                Debt
                                            </th>
                                            <th className="text-end">
                                                Pending Debt
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {monthlyData.map(month => (
                                            <tr key={month.id}>
                                                <td className="fw-semibold">
                                                    {month.name}
                                                </td>

                                                <td className="text-end text-success">
                                                    ₹{formatAmount(
                                                        month.income
                                                    )}
                                                </td>

                                                <td className="text-end text-danger">
                                                    ₹{formatAmount(
                                                        month.expense
                                                    )}
                                                </td>

                                                <td className="text-end text-primary">
                                                    ₹{formatAmount(
                                                        month.saving
                                                    )}
                                                </td>

                                                <td className="text-end text-warning">
                                                    ₹{formatAmount(
                                                        month.debt
                                                    )}
                                                </td>

                                                <td className="text-end text-info">
                                                    ₹{formatAmount(
                                                        month.pendingDebt
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    <tfoot>
                                        <tr className="fw-bold">
                                            <td>
                                                Total
                                            </td>

                                            <td className="text-end text-success">
                                                ₹{formatAmount(
                                                    totals.income
                                                )}
                                            </td>

                                            <td className="text-end text-danger">
                                                ₹{formatAmount(
                                                    totals.expense
                                                )}
                                            </td>

                                            <td className="text-end text-primary">
                                                ₹{formatAmount(
                                                    totals.saving
                                                )}
                                            </td>

                                            <td className="text-end text-warning">
                                                ₹{formatAmount(
                                                    totals.debt
                                                )}
                                            </td>

                                            <td className="text-end text-info">
                                                ₹{formatAmount(
                                                    totals.pendingDebt
                                                )}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardChart;