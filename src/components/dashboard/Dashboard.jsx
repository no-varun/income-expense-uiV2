import { useEffect, useState } from "react";

import SummaryCard from "../../components/dashboard/SummaryCard";
import RecentTransaction from "../../components/dashboard/RecentTransaction";
import BrandImage from "../common/BrandImage";
import MilkSummaryDashboard from "../milk/MilkSummaryDashboard";
import { getSummary, getRecentTransactions, totalDebtItemWise, getMilkSummary } from "../../api/dashboardApi";
const Dashboard = () => {

    const [summary, setSummary] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [milkSummary, setMilkSummary] = useState({});
    const [openDashboardSection, setOpenDashboardSection] = useState("net-worth");
    const [selectedAccountBank, setSelectedAccountBank] = useState("");
    const [debtSummary, setDebtSummary] = useState({
        totalDebt: 0,
        totalPendingAmount: 0,
        items: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | FORMAT AMOUNT
    |--------------------------------------------------------------------------
    */

    const formatAmount = (value) => {

        const number =
            Number(value || 0);

        return number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | LOAD DASHBOARD
    |--------------------------------------------------------------------------
    */

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");


            const [
                summaryResponse,
                transactionResponse,
                debtResponse,
                milkResponse
            ] = await Promise.all([

                getSummary(),

                getRecentTransactions(),

                totalDebtItemWise(),

                getMilkSummary().catch(() => null)

            ]);


            /*
            |--------------------------------------------------------------------------
            | SUMMARY RESPONSE
            |--------------------------------------------------------------------------
            */

            let summaryData = {};


            if (
                summaryResponse &&
                typeof summaryResponse === "object" &&
                !Array.isArray(summaryResponse)
            ) {

                if (
                    summaryResponse.data &&
                    typeof summaryResponse.data === "object" &&
                    !Array.isArray(summaryResponse.data)
                ) {

                    summaryData =
                        summaryResponse.data;

                } else {

                    summaryData =
                        summaryResponse;

                }

            }


            setSummary(
                summaryData
            );


            /*
            |--------------------------------------------------------------------------
            | TRANSACTIONS
            |--------------------------------------------------------------------------
            */

            let transactionData = [];


            if (
                Array.isArray(
                    transactionResponse
                )
            ) {

                transactionData =
                    transactionResponse;

            }

            else if (
                Array.isArray(
                    transactionResponse?.data
                )
            ) {

                transactionData =
                    transactionResponse.data;

            }

            else if (
                Array.isArray(
                    transactionResponse?.data?.data
                )
            ) {

                transactionData =
                    transactionResponse.data.data;

            }


            setTransactions(
                transactionData
            );

            const debtData =
                debtResponse?.data &&
                    typeof debtResponse.data === "object"
                    ? debtResponse.data
                    : debtResponse || {};

            setDebtSummary({
                totalDebt: Number(debtData.totalDebt || 0),
                totalPendingAmount: Number(debtData.totalPendingAmount || 0),
                items: Array.isArray(debtData.items)
                    ? debtData.items
                    : []
            });

            const milkData = milkResponse?.data;
            setMilkSummary(
                milkData && typeof milkData === "object" && !Array.isArray(milkData)
                    ? milkData
                    : {}
            );


        } catch (err) {

            // console.error(
            // "Dashboard Load Error:",
            // err
            // );


            setError(

                err?.response?.data?.message ||
                err?.message ||
                "Unable to load dashboard."

            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadDashboard();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    const accounts =
        Array.isArray(
            summary?.accounts
        )
            ? summary.accounts
            : [];

    const accountBanks = [...new Set(accounts.map((account) => account?.bank).filter(Boolean))];
    const visibleAccounts = selectedAccountBank
        ? accounts.filter((account) => account?.bank === selectedAccountBank)
        : accounts;

    const visibleAccountTotals = visibleAccounts.reduce((totals, account) => {
        const balance = Number(account?.balance || 0);
        const invested = Number(account?.investmentAmount || 0);
        const investmentValue = Number(account?.investmentCurrentValue || 0);
        const bankName = String(account?.bank || "").trim().toLowerCase();
        const accountType = String(account?.accountType || "").trim().toLowerCase();
        const isCash = bankName === "cash" || accountType === "cash";
        const isWallet = ["amazonpay", "meeso","pf"].includes(bankName) || accountType === "wallet";
        return {
            bankBalance: totals.bankBalance + (!isCash && !isWallet ? balance : 0),
            walletBalance: totals.walletBalance + (isWallet ? balance : 0),
            cashBalance: totals.cashBalance + (isCash ? balance : 0),
            invested: totals.invested + invested,
            investmentValue: totals.investmentValue + investmentValue,
            profitLoss: totals.profitLoss + Number(account?.investmentProfitLoss ?? investmentValue - invested),
            investmentCount: totals.investmentCount + Number(account?.investmentCount || 0),
            totalValue: totals.totalValue + Number(account?.totalBalance ?? balance + investmentValue)
        };
    }, {
        bankBalance: 0,
        walletBalance: 0,
        cashBalance: 0,
        invested: 0,
        investmentValue: 0,
        profitLoss: 0,
        investmentCount: 0,
        totalValue: 0
    });


    const investments =
        Array.isArray(
            summary?.investments
        )
            ? summary.investments
            : [];


    /*
    |--------------------------------------------------------------------------
    | INVESTMENT VALUES
    |--------------------------------------------------------------------------
    */

    const totalInvestmentAmount =
        Number(
            summary?.totalInvestmentAmount || 0
        );


    const totalInvestmentCurrentValue =
        Number(
            summary?.totalInvestmentCurrentValue || 0
        );


    const investmentProfitLoss =
        Number(
            summary?.investmentProfitLoss || 0
        );


    const investmentProfitLossPercentage =
        Number(
            summary?.investmentProfitLossPercentage || 0
        );


    /*
    |--------------------------------------------------------------------------
    | TOTAL ASSETS
    |--------------------------------------------------------------------------
    */

    const totalAssets =
        Number(
            summary?.totalAssets || 0
        );


    const totalLiabilities =
        Number(
            summary?.totalLiabilities || 0
        );


    const totalNetWorth =
        Number(
            summary?.totalNetWorth || 0
        );


    /*
    |--------------------------------------------------------------------------
    | ACCOUNT TOTALS
    |--------------------------------------------------------------------------
    */

    const totalAccountBalance =
        Number(
            summary?.totalAccountBalance || 0
        );


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="container-fluid py-5">

                <div className="text-center">

                    <div
                        className="
                            spinner-border
                            text-primary
                        "
                        role="status"
                    />

                    <div className="mt-3 text-muted">

                        Loading dashboard...

                    </div>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div className="container-fluid py-4">

                <div className="alert alert-danger">

                    <strong>
                        Unable to load dashboard
                    </strong>

                    <div className="mt-1">
                        {error}
                    </div>

                </div>


                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={loadDashboard}
                >

                    Retry

                </button>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    return (

        <div
            onClick={(event) => {
                const heading = event.target.closest("h4, [data-dashboard-section='recent-transactions'] h5");
                const section = heading?.closest("[data-dashboard-section]");
                if (section) {
                    setOpenDashboardSection((current) =>
                        current === section.dataset.dashboardSection
                            ? ""
                            : section.dataset.dashboardSection
                    );
                }
            }}
            className="
                container-fluid
                py-3
            "
            style={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                rowGap: "1.5rem"
            }}
        >

            <style>{`.dashboard-accordion-section[data-open="false"] > .card-body > :not(:first-child) { display: none; }
.dashboard-accordion-section > .card-body h4,
.dashboard-accordion-section[data-dashboard-section="recent-transactions"] h5 { cursor: pointer; }
.dashboard-accordion-section[data-dashboard-section="recent-transactions"][data-open="false"] .card-body { display: none; }
.dashboard-accordion-section { margin-bottom: 0 !important; }
.dashboard-accordion-section[data-dashboard-section="recent-transactions"] .card { margin-top: 0 !important; }
.dashboard-page-header { margin-bottom: 0 !important; }`}</style>


            {/* =========================================================
                HEADER
            ========================================================= */}

            <div
                className="
                    d-flex
                    justify-content-between
                    align-items-center
                    dashboard-page-header
                    mb-4
                "
            >

                <div>

                    <h2 className="mb-1 fw-bold">

                        Dashboard

                    </h2>

                    <div className="text-muted">

                        Complete financial overview

                    </div>

                </div>


                <button
                    type="button"
                    className="
                        btn
                        btn-outline-primary
                    "
                    onClick={loadDashboard}
                >

                    ↻ Refresh

                </button>

            </div>


            {/* =========================================================
                NET WORTH
            ========================================================= */}

            <div
                data-dashboard-section="net-worth"
                data-open={openDashboardSection === "net-worth"}
                style={{ order: 1 }}
                className="dashboard-accordion-section card shadow-sm border-0 mb-4"
            >

                <div className="card-body">

                    <div className="mb-4">

                        <h4 className="mb-1">
                            Net Worth
                        </h4>

                        <div className="text-muted small">
                            Your complete financial position
                        </div>

                    </div>


                    <div className="row g-3">

                        <SummaryCard
                            title="Total Assets"
                            value={totalAssets}
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Total Liabilities"
                            value={totalLiabilities}
                            bg="bg-danger"
                        />


                        <SummaryCard
                            title="Net Worth"
                            value={totalNetWorth}
                            bg={
                                totalNetWorth >= 0
                                    ? "bg-primary"
                                    : "bg-danger"
                            }
                        />

                    </div>

                </div>

            </div>


            {/* =========================================================
                INVESTMENT SUMMARY
            ========================================================= */}

            <div
                data-dashboard-section="investments"
                data-open={openDashboardSection === "investments"}
                style={{ order: 9 }}
                className="dashboard-accordion-section card shadow-sm border-0 mb-4"
            >

                <div className="card-body">

                    <div
                        className="
                            d-flex
                            justify-content-between
                            align-items-center
                            mb-4
                        "
                    >

                        <div>

                            <h4 className="mb-1">
                                Investments
                            </h4>

                            <div className="text-muted small">
                                Current investment portfolio
                            </div>

                        </div>


                        <span className="badge bg-primary">

                            {investments.length} Investments

                        </span>

                    </div>


                    <div className="row g-3">

                        <SummaryCard
                            title="Invested Amount"
                            value={totalInvestmentAmount}
                            bg="bg-primary"
                        />


                        <SummaryCard
                            title="Current Value"
                            value={totalInvestmentCurrentValue}
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Profit / Loss"
                            value={investmentProfitLoss}
                            bg={
                                investmentProfitLoss >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                        />


                        <SummaryCard
                            title="Return"
                            value={investmentProfitLossPercentage}
                            bg={
                                investmentProfitLossPercentage >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                            prefix=""
                            suffix="%"
                        />

                    </div>

                <hr className="my-4" />


                    {investments.length > 0 ? (

                        <div className="table-responsive">

                            <table
                                className="
                                    table
                                    table-hover
                                    table-bordered
                                    align-middle
                                    mb-0
                                "
                            >

                                <thead className="table-light">

                                    <tr>

                                        <th>
                                            Investment
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Account
                                        </th>

                                        <th className="text-end">
                                            Invested
                                        </th>

                                        <th className="text-end">
                                            Current Value
                                        </th>

                                        <th className="text-end">
                                            P/L
                                        </th>

                                        <th className="text-center">
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {investments.map(
                                        (investment) => {

                                            const invested =
                                                Number(
                                                    investment?.investedAmount || 0
                                                );


                                            const currentValue =
                                                Number(
                                                    investment?.currentValue || 0
                                                );


                                            const profitLoss =
                                                currentValue -
                                                invested;


                                            return (

                                                <tr
                                                    key={
                                                        investment._id
                                                    }
                                                >

                                                    <td>

                                                        <strong>

                                                            {
                                                                investment.name ||
                                                                "-"
                                                            }

                                                        </strong>


                                                        {investment.maturityDate && (

                                                            <div
                                                                className="
                                                                    text-muted
                                                                    small
                                                                "
                                                            >

                                                                Maturity:{" "}

                                                                {new Date(
                                                                    investment.maturityDate
                                                                ).toLocaleDateString(
                                                                    "en-IN"
                                                                )}

                                                            </div>

                                                        )}

                                                    </td>


                                                    <td>

                                                        <span
                                                            className="
                                                                badge
                                                                bg-light
                                                                text-dark
                                                            "
                                                        >

                                                            {
                                                                investment.type ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </td>


                                                    <td className="text-center align-middle">
                                                        <BrandImage type="bank" value={investment.account?.bank} size="2.5rem" />
                                                    </td>


                                                    <td className="text-end">

                                                        ₹{" "}

                                                        {
                                                            formatAmount(
                                                                invested
                                                            )
                                                        }

                                                    </td>


                                                    <td className="text-end fw-semibold">

                                                        ₹{" "}

                                                        {
                                                            formatAmount(
                                                                currentValue
                                                            )
                                                        }

                                                    </td>


                                                    <td
                                                        className={`
                                                            text-end
                                                            fw-bold
                                                            ${profitLoss >= 0
                                                                ? "text-success"
                                                                : "text-danger"
                                                            }
                                                        `}
                                                    >

                                                        {
                                                            profitLoss >= 0
                                                                ? "+"
                                                                : ""
                                                        }

                                                        ₹{" "}

                                                        {
                                                            formatAmount(
                                                                profitLoss
                                                            )
                                                        }

                                                    </td>


                                                    <td className="text-center">

                                                        <span
                                                            className={
                                                                investment.status
                                                                    ? "badge bg-success"
                                                                    : "badge bg-secondary"
                                                            }
                                                        >

                                                            {
                                                                investment.status
                                                                    ? "Active"
                                                                    : "Inactive"
                                                            }

                                                        </span>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <div
                            className="
                                text-center
                                text-muted
                                py-4
                            "
                        >

                            No investments found.

                        </div>

                    )}

                </div>

            </div>


            {/* =========================================================
                CASH FLOW
            ========================================================= */}

            <div
                data-dashboard-section="cash-flow-accounts"
                data-open={openDashboardSection === "cash-flow-accounts"}
                style={{ order: 2 }}
                className="dashboard-accordion-section card shadow-sm border-0 mb-4"
            >

                <div className="card-body">

                    <h4 className="mb-1">
                        Cash Flow & Accounts
                    </h4>

                    <div className="text-muted small mb-4">
                        Account balances and cash flow across today, this month, and this year
                    </div>

                    <h6 className="text-muted mb-3">Accounts</h6>

                    <div className="row g-3 mb-4">
                        <SummaryCard
                            title="Total Account Balance"
                            value={totalAccountBalance}
                            bg="bg-success"
                        />
                        <SummaryCard
                            title="Current Balance"
                            value={Number(summary?.currentBalance || 0)}
                            bg="bg-primary"
                        />
                        <SummaryCard
                            title="Accounts"
                            value={Number(summary?.accountCount || 0)}
                            bg="bg-dark"
                            prefix=""
                        />
                    </div>


                    {/* TODAY */}

                    <h6 className="text-muted mb-3">
                        Today
                    </h6>


                    <div className="row g-3 mb-4">

                        <SummaryCard
                            title="Income"
                            value={
                                Number(
                                    summary?.todayIncome || 0
                                )
                            }
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Expense"
                            value={
                                Number(
                                    summary?.todayExpense || 0
                                )
                            }
                            bg="bg-danger"
                        />


                        <SummaryCard
                            title="Net"
                            value={
                                Number(
                                    summary?.todayNet || 0
                                )
                            }
                            bg={
                                Number(
                                    summary?.todayNet || 0
                                ) >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                        />

                    </div>


                    {/* MONTH */}

                    <h6 className="text-muted mb-3">
                        This Month
                    </h6>


                    <div className="row g-3 mb-4">

                        <SummaryCard
                            title="Income"
                            value={
                                Number(
                                    summary?.monthIncome || 0
                                )
                            }
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Expense"
                            value={
                                Number(
                                    summary?.monthExpense || 0
                                )
                            }
                            bg="bg-danger"
                        />


                        <SummaryCard
                            title="Net"
                            value={
                                Number(
                                    summary?.monthNet || 0
                                )
                            }
                            bg={
                                Number(
                                    summary?.monthNet || 0
                                ) >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                        />

                    </div>


                    {/* YEAR */}

                    <h6 className="text-muted mb-3">
                        This Year
                    </h6>


                    <div className="row g-3">

                        <SummaryCard
                            title="Income"
                            value={
                                Number(
                                    summary?.yearIncome || 0
                                )
                            }
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Expense"
                            value={
                                Number(
                                    summary?.yearExpense || 0
                                )
                            }
                            bg="bg-danger"
                        />


                        <SummaryCard
                            title="Net"
                            value={
                                Number(
                                    summary?.yearNet || 0
                                )
                            }
                            bg={
                                Number(
                                    summary?.yearNet || 0
                                ) >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                        />

                    </div>

                </div>

            </div>


            {/* MILK SUMMARY */}
            <div data-dashboard-section="milk" data-open={openDashboardSection === "milk"} style={{ order: 3 }} className="dashboard-accordion-section card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <h4 className="mb-1">Milk</h4>
                    <div className="text-muted small mb-4">
                        Overall milk quantity, amount, and unpaid balance
                    </div>
                    <MilkSummaryDashboard {...milkSummary} />
                </div>
            </div>


            {/* =========================================================
                DEBT
            ========================================================= */}

            <div
                data-dashboard-section="debt"
                data-open={openDashboardSection === "debt"}
                style={{ order: 8 }}
                className="dashboard-accordion-section card shadow-sm border-0 mb-4"
            >

                <div className="card-body">

                    <h4 className="mb-1">
                        Debt
                    </h4>

                    <div className="text-muted small mb-4">
                        Outstanding debt position
                    </div>


                    <div className="row g-3">

                        <SummaryCard
                            title="Total Debt"
                            value={
                                debtSummary.totalDebt
                            }
                            bg="bg-warning"
                        />


                        <SummaryCard
                            title="Pending Debt"
                            value={
                                debtSummary.totalPendingAmount
                            }
                            bg="bg-danger"
                        />

                    </div>

                    <div className="table-responsive mt-4">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>
                                    <th>Item</th>
                                    <th className="text-center">Records</th>
                                    <th className="text-end">Total Debt</th>
                                    <th className="text-end">Pending Amount</th>
                                </tr>

                            </thead>

                            <tbody>

                                {debtSummary.items.length > 0 ? (

                                    debtSummary.items.map((item, index) => (

                                        <tr key={item?._id || index}>
                                            <td className="fw-semibold">
                                                {item?._id || "Untitled debt"}
                                            </td>
                                            <td className="text-center">
                                                {Number(item?.totalItems || 0)}
                                            </td>
                                            <td className="text-end">
                                                {"Rs. "}{formatAmount(item?.totalDebt)}
                                            </td>
                                            <td className="text-end text-danger fw-semibold">
                                                {"Rs. "}{formatAmount(item?.totalPendingAmount)}
                                            </td>
                                        </tr>

                                    ))

                                ) : (

                                    <tr>
                                        <td colSpan="4" className="text-center text-muted py-4">
                                            No debt items found.
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


            {/* =========================================================
                ACCOUNTS
            ========================================================= */}

            <div
                data-dashboard-section="accounts-banks"
                data-open={openDashboardSection === "accounts-banks"}
                style={{ order: 4 }}
                className="dashboard-accordion-section card shadow-sm border-0 mb-4"
            >

                <div className="card-body">

                    <div
                        className="
                            d-flex
                            justify-content-between
                            align-items-center
                            mb-4
                        "
                    >

                        <div>

                        <h4 className="mb-1">
                            My Accounts
                            </h4>

                            <div className="text-muted small">
                                Account balances, bank details, and investments
                            </div>

                        </div>


                        <span className="badge bg-primary">

                            {visibleAccounts.length} Accounts

                        </span>

                    </div>


                    <div className="d-flex flex-wrap gap-2 mb-4" aria-label="Filter accounts by bank">
                        <button
                            type="button"
                            className={`btn btn-sm rounded-pill ${selectedAccountBank === "" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setSelectedAccountBank("")}
                            aria-pressed={selectedAccountBank === ""}
                        >
                            All Banks <span className="badge bg-white text-primary ms-1">{accounts.length}</span>
                        </button>
                        {accountBanks.map((bank) => {
                            const count = accounts.filter((account) => account?.bank === bank).length;
                            const active = selectedAccountBank === bank;
                            return (
                                <button
                                    key={bank}
                                    type="button"
                                    className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-2 ${active ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setSelectedAccountBank(active ? "" : bank)}
                                    aria-pressed={active}
                                >
                                    <BrandImage type="bank" value={bank} size="1.25rem" />
                                    {bank}
                                    <span className={`badge ${active ? "bg-white text-primary" : "text-bg-primary"}`}>{count}</span>
                                </button>
                            );
                        })}
                    </div>

                    <h6 className="text-muted mb-3">
                        {selectedAccountBank ? `${selectedAccountBank} Account Summary` : "Total Account Summary"}
                    </h6>
                    <div className="row g-3 mb-4">
                        <SummaryCard title="Bank Balance" value={visibleAccountTotals.bankBalance} bg="bg-primary" />
                        <SummaryCard title="Wallet Balance (Apay, Meeso and Pf)" value={visibleAccountTotals.walletBalance} bg="bg-info" />
                        <SummaryCard title="Cash Balance" value={visibleAccountTotals.cashBalance} bg="bg-success" />
                        <SummaryCard title="Invested Amount" value={visibleAccountTotals.invested} bg="bg-primary" />
                        <SummaryCard title="Investment Value" value={visibleAccountTotals.investmentValue} bg="bg-info" />
                        <SummaryCard
                            title="Investment P/L"
                            value={visibleAccountTotals.profitLoss}
                            bg={visibleAccountTotals.profitLoss >= 0 ? "bg-success" : "bg-danger"}
                        />
                        <SummaryCard title="Investment Count" value={visibleAccountTotals.investmentCount} bg="bg-dark" prefix="" />
                        <SummaryCard title="Total Account Value" value={visibleAccountTotals.totalValue} bg="bg-secondary" />
                    </div>


                    <div className="table-responsive d-none">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">
                                <tr>
                                    <th>Account</th>
                                    <th>Bank</th>
                                    <th>Type</th>
                                    <th className="text-end">Cash Balance</th>
                                    <th className="text-end">Minimum Balance</th>
                                    <th className="text-end">Invested</th>
                                    <th className="text-end">Current Value</th>
                                    <th className="text-end">P/L</th>
                                    <th className="text-center">Investments</th>
                                    <th className="text-end">Total Value</th>
                                </tr>
                            </thead>

                            <tbody>
                                {accounts.length > 0 ? (
                                    accounts.map((account, index) => {
                                        const balance = Number(account?.balance || 0);
                                        const minimumBalance = Number(account?.minimumBalance || 0);
                                        const investmentAmount = Number(account?.investmentAmount || 0);
                                        const investmentCurrentValue = Number(account?.investmentCurrentValue || 0);
                                        const investmentProfitLoss = Number(account?.investmentProfitLoss || 0);
                                        const totalBalance = Number(
                                            account?.totalBalance ??
                                            balance + investmentCurrentValue
                                        );
                                        const belowMinimum =
                                            minimumBalance > 0 && balance < minimumBalance;

                                        return (
                                            <tr key={account?._id || index}>
                                                <td className="fw-semibold">{account?.name || "Unnamed account"}</td>
                                                <td className="text-center align-middle"><BrandImage type="bank" value={account?.bank} size="2.5rem" /></td>
                                                <td>{account?.accountType || "Account"}</td>
                                                <td className={
                                                    `text-end fw-semibold ${belowMinimum ? "text-danger" : "text-success"}`
                                                }>
                                                    {"Rs. "}{formatAmount(balance)}
                                                </td>
                                                <td className="text-end">
                                                    {minimumBalance > 0
                                                        ? `${belowMinimum ? "Rs. " : "Rs. "}${formatAmount(minimumBalance)}`
                                                        : "-"}
                                                </td>
                                                <td className="text-end">{"Rs. "}{formatAmount(investmentAmount)}</td>
                                                <td className="text-end">{"Rs. "}{formatAmount(investmentCurrentValue)}</td>
                                                <td className={
                                                    `text-end fw-semibold ${investmentProfitLoss >= 0 ? "text-success" : "text-danger"}`
                                                }>
                                                    {investmentProfitLoss > 0 ? "+" : ""}
                                                    {"Rs. "}{formatAmount(investmentProfitLoss)}
                                                </td>
                                                <td className="text-center">
                                                    {Number(account?.investmentCount || 0)}
                                                </td>
                                                <td className="text-end fw-bold text-primary">
                                                    {"Rs. "}{formatAmount(totalBalance)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center text-muted py-4">
                                            No accounts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>

                    </div>


                    <div>

                        {visibleAccounts.length > 0 ? (

                            <div className="row g-3">

                                {visibleAccounts.map(
                                    (account) => {

                                        const balance =
                                            Number(
                                                account?.balance || 0
                                            );


                                        const minimumBalance =
                                            Number(
                                                account?.minimumBalance || 0
                                            );


                                        const investmentAmount =
                                            Number(
                                                account?.investmentAmount || 0
                                            );


                                        const investmentCurrentValue =
                                            Number(
                                                account?.investmentCurrentValue || 0
                                            );


                                        const investmentProfitLoss =
                                            Number(
                                                account?.investmentProfitLoss || 0
                                            );


                                        const totalBalance =
                                            Number(
                                                account?.totalBalance ??
                                                (
                                                    balance +
                                                    investmentCurrentValue
                                                )
                                            );


                                        const belowMinimum =
                                            minimumBalance > 0 &&
                                            balance < minimumBalance;

                                        const showMinimumWarning = ["icici", "rbl", "pnb"].includes(
                                            String(account?.bank || "").trim().toLowerCase()
                                        );


                                        return (

                                            <div
                                                className="
                                                col-12
                                                col-md-6
                                                col-xl-4
                                            "
                                                key={
                                                    account._id
                                                }
                                            >

                                                <div
                                                    className={`
                                                    card
                                                    h-100
                                                    shadow-sm
                                                    rounded-4
                                                    overflow-hidden
                                                    ${belowMinimum
                                                            ? "border-danger"
                                                            : "border-0"
                                                        }
                                                `}
                                                >

                                                    <div className="card-body">


                                                        {/* ACCOUNT HEADER */}

                                                        <div className="d-flex align-items-center gap-3 border-bottom pb-3">
                                                            <BrandImage type="bank" value={account.bank} size="2.75rem" />
                                                            <div>
                                                                <h5 className="mb-1">{account.name || "Unnamed account"}</h5>
                                                                <span className="badge bg-light text-dark">
                                                                    {account.accountType || "Account"}
                                                                </span>
                                                                {showMinimumWarning && (
                                                                    <div className="alert alert-danger py-1 px-2 mt-2 mb-0 small" role="status">
                                                                        Account is below minimum balance.
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>


                                                        {/* CASH BALANCE */}

                                                        <div className={`mt-3 p-3 rounded-3 ${belowMinimum ? "bg-danger-subtle" : "bg-success-subtle"}`}>

                                                            <div className="text-muted small">
                                                                Available Balance
                                                            </div>

                                                            <div
                                                                className={`
                                                                fs-4
                                                                fw-bold
                                                                ${belowMinimum
                                                                        ? "text-danger"
                                                                        : "text-success"
                                                                    }
                                                            `}
                                                            >

                                                                ₹{" "}

                                                                {
                                                                    formatAmount(
                                                                        balance
                                                                    )
                                                                }

                                                            </div>

                                                        </div>


                                                        {/* INVESTMENT */}

                                                        <div className="mt-3 p-3 rounded-3 bg-primary-subtle">

                                                            <div className="small text-primary-emphasis fw-semibold mb-2">
                                                                Investments
                                                            </div>


                                                            <div
                                                                className="
                                                                d-flex
                                                                justify-content-between
                                                            "
                                                            >

                                                                <span className="small">
                                                                    Invested
                                                                </span>

                                                                <strong>
                                                                    ₹{" "}
                                                                    {
                                                                        formatAmount(
                                                                            investmentAmount
                                                                        )
                                                                    }
                                                                </strong>

                                                            </div>


                                                            <div
                                                                className="
                                                                d-flex
                                                                justify-content-between
                                                            "
                                                            >

                                                                <span className="small">
                                                                    Current Value
                                                                </span>

                                                                <strong>
                                                                    ₹{" "}
                                                                    {
                                                                        formatAmount(
                                                                            investmentCurrentValue
                                                                        )
                                                                    }
                                                                </strong>

                                                            </div>


                                                            <div
                                                                className="
                                                                d-flex
                                                                justify-content-between
                                                            "
                                                            >

                                                                <span className="small">
                                                                    P/L
                                                                </span>

                                                                <strong
                                                                    className={
                                                                        investmentProfitLoss >= 0
                                                                            ? "text-success"
                                                                            : "text-danger"
                                                                    }
                                                                >

                                                                    {
                                                                        investmentProfitLoss >= 0
                                                                            ? "+"
                                                                            : ""
                                                                    }

                                                                    ₹{" "}

                                                                    {
                                                                        formatAmount(
                                                                            investmentProfitLoss
                                                                        )
                                                                    }

                                                                </strong>

                                                            </div>


                                                            <div
                                                                className="
                                                                d-flex
                                                                justify-content-between
                                                            "
                                                            >

                                                                <span className="small">
                                                                    Investments
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        Number(
                                                                            account?.investmentCount || 0
                                                                        )
                                                                    }
                                                                </strong>

                                                            </div>

                                                        </div>


                                                        {/* TOTAL */}

                                                        <div
                                                            className="
                                                            mt-3
                                                            pt-3
                                                            border-top
                                                        "
                                                        >

                                                            <div
                                                                className="
                                                                d-flex
                                                                justify-content-between
                                                                align-items-center
                                                            "
                                                            >

                                                                <span className="fw-semibold">
                                                                    Total Value
                                                                </span>


                                                                <span
                                                                    className="
                                                                    fs-5
                                                                    fw-bold
                                                                    text-primary
                                                                "
                                                                >

                                                                    ₹{" "}

                                                                    {
                                                                        formatAmount(
                                                                            totalBalance
                                                                        )
                                                                    }

                                                                </span>

                                                            </div>

                                                        </div>


                                                        {/* MINIMUM */}

                                                        {minimumBalance > 0 && (

                                                            <div className="mt-3">

                                                                <div
                                                                    className="
                                                                    d-flex
                                                                    justify-content-between
                                                                    small
                                                                "
                                                                >

                                                                    <span className="text-muted">
                                                                        Minimum Balance
                                                                    </span>

                                                                    <span
                                                                        className={
                                                                            belowMinimum
                                                                                ? "text-danger fw-bold"
                                                                                : "text-muted"
                                                                        }
                                                                    >

                                                                        ₹{" "}

                                                                        {
                                                                            formatAmount(
                                                                                minimumBalance
                                                                            )
                                                                        }

                                                                    </span>

                                                                </div>


                                                            </div>

                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        ) : (

                            <div
                                className="
                                text-center
                                text-muted
                                py-5
                            "
                            >

                                {selectedAccountBank
                                    ? `No accounts found for ${selectedAccountBank}.`
                                    : "No accounts found."}

                            </div>

                        )}

                                </div>


                </div>

            </div>

            {/* =========================================================
                RECENT TRANSACTIONS
            ========================================================= */}
            <div
                data-dashboard-section="recent-transactions"
                data-open={openDashboardSection === "recent-transactions"}
                className="dashboard-accordion-section"
                style={{ order: 7 }}
            >
                <RecentTransaction transactions={transactions} />
            </div>

        </div>

    );

};


export default Dashboard;
