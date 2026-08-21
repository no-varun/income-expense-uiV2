import { useEffect, useState } from "react";

import SummaryCard from "../../components/dashboard/SummaryCard";
import RecentTransaction from "../../components/dashboard/RecentTransaction";

import {
    getSummary,
    getRecentTransactions
} from "../../api/dashboardApi";


const Dashboard = () => {

    const [summary, setSummary] = useState({});
    const [transactions, setTransactions] = useState([]);

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
    | FORMAT BANK
    |--------------------------------------------------------------------------
    */

    const formatBankName = (bank) => {

        if (!bank) {
            return "-";
        }

        return (
            bank.charAt(0).toUpperCase() +
            bank.slice(1)
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
                transactionResponse
            ] = await Promise.all([

                getSummary(),

                getRecentTransactions()

            ]);


            console.log(
                "Dashboard Summary Response:",
                summaryResponse
            );


            console.log(
                "Recent Transactions Response:",
                transactionResponse
            );


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


            console.log(
                "Parsed Dashboard Summary:",
                summaryData
            );


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


        } catch (err) {

            console.error(
                "Dashboard Load Error:",
                err
            );


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


    const investments =
        Array.isArray(
            summary?.investments
        )
            ? summary.investments
            : [];


    const bankWise =
        Array.isArray(
            summary?.bankWise
        )
            ? summary.bankWise
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
            className="
                container-fluid
                py-3
            "
            style={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0
            }}
        >


            {/* =========================================================
                HEADER
            ========================================================= */}

            <div
                className="
                    d-flex
                    justify-content-between
                    align-items-center
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
                className="
                    card
                    shadow-sm
                    border-0
                    mb-4
                "
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
                CASH / ACCOUNTS
            ========================================================= */}

            <div
                className="
                    card
                    shadow-sm
                    border-0
                    mb-4
                "
            >

                <div className="card-body">

                    <div className="mb-4">

                        <h4 className="mb-1">
                            Cash & Accounts
                        </h4>

                        <div className="text-muted small">
                            Money currently available in your accounts
                        </div>

                    </div>


                    <div className="row g-3">

                        <SummaryCard
                            title="Total Account Balance"
                            value={totalAccountBalance}
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Current Balance"
                            value={
                                Number(
                                    summary?.currentBalance || 0
                                )
                            }
                            bg="bg-primary"
                        />


                        <SummaryCard
                            title="Accounts"
                            value={
                                Number(
                                    summary?.accountCount || 0
                                )
                            }
                            bg="bg-dark"
                            prefix=""
                        />

                    </div>

                </div>

            </div>


            {/* =========================================================
                INVESTMENT SUMMARY
            ========================================================= */}

            <div
                className="
                    card
                    shadow-sm
                    border-0
                    mb-4
                "
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

                </div>

            </div>


            {/* =========================================================
                INVESTMENT LIST
            ========================================================= */}

            <div
                className="
                    card
                    shadow-sm
                    border-0
                    mb-4
                "
            >

                <div className="card-body">

                    <div className="mb-4">

                        <h4 className="mb-1">
                            Investment Portfolio
                        </h4>

                        <div className="text-muted small">
                            Investment-wise current value and returns
                        </div>

                    </div>


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


                                                    <td>

                                                        <div className="fw-semibold">

                                                            {
                                                                investment.account?.name ||
                                                                "-"
                                                            }

                                                        </div>


                                                        <small className="text-muted">

                                                            {
                                                                formatBankName(
                                                                    investment.account?.bank
                                                                )
                                                            }

                                                        </small>

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
                                                            ${
                                                                profitLoss >= 0
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
                className="
                    card
                    shadow-sm
                    border-0
                    mb-4
                "
            >

                <div className="card-body">

                    <h4 className="mb-4">
                        Cash Flow
                    </h4>


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


            {/* =========================================================
                DEBT
            ========================================================= */}

            <div
                className="
                    card
                    shadow-sm
                    border-0
                    mb-4
                "
            >

                <div className="card-body">

                    <h4 className="mb-1">
                        Debt
                    </h4>

                    <div className="text-muted small mb-4">
                        Outstanding financial liabilities
                    </div>


                    <div className="row g-3">

                        <SummaryCard
                            title="Total Debt"
                            value={
                                Number(
                                    summary?.totalDebt || 0
                                )
                            }
                            bg="bg-warning"
                        />


                        <SummaryCard
                            title="Pending Debt"
                            value={
                                Number(
                                    summary?.totalPendingDebt || 0
                                )
                            }
                            bg="bg-danger"
                        />

                    </div>

                </div>

            </div>


            {/* =========================================================
                ACCOUNTS
            ========================================================= */}

            <div
                className="
                    card
                    shadow-sm
                    border-0
                    mb-4
                "
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
                                Cash balance and investments by account
                            </div>

                        </div>


                        <span className="badge bg-primary">

                            {accounts.length} Accounts

                        </span>

                    </div>


                    {accounts.length > 0 ? (

                        <div className="row g-3">

                            {accounts.map(
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
                                                    ${
                                                        belowMinimum
                                                            ? "border-danger"
                                                            : "border-0"
                                                    }
                                                `}
                                            >

                                                <div className="card-body">


                                                    {/* ACCOUNT HEADER */}

                                                    <div
                                                        className="
                                                            d-flex
                                                            justify-content-between
                                                            align-items-start
                                                        "
                                                    >

                                                        <div>

                                                            <h5 className="mb-1">

                                                                {
                                                                    account.name
                                                                }

                                                            </h5>

                                                            <div className="text-muted small">

                                                                {
                                                                    formatBankName(
                                                                        account.bank
                                                                    )
                                                                }

                                                            </div>

                                                        </div>


                                                        <span
                                                            className="
                                                                badge
                                                                bg-light
                                                                text-dark
                                                            "
                                                        >

                                                            {
                                                                account.accountType ||
                                                                "Account"
                                                            }

                                                        </span>

                                                    </div>


                                                    {/* CASH BALANCE */}

                                                    <div className="mt-4">

                                                        <div className="text-muted small">
                                                            Available Balance
                                                        </div>

                                                        <div
                                                            className={`
                                                                fs-4
                                                                fw-bold
                                                                ${
                                                                    belowMinimum
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

                                                    <div
                                                        className="
                                                            mt-3
                                                            p-3
                                                            rounded
                                                            bg-light
                                                        "
                                                    >

                                                        <div className="small text-muted mb-2">
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


                                                            {belowMinimum && (

                                                                <div
                                                                    className="
                                                                        alert
                                                                        alert-danger
                                                                        py-2
                                                                        px-3
                                                                        mt-2
                                                                        mb-0
                                                                        small
                                                                    "
                                                                >

                                                                    Account is below minimum balance.

                                                                </div>

                                                            )}

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

                            No accounts found.

                        </div>

                    )}

                </div>

            </div>


            {/* =========================================================
                BANK WISE
            ========================================================= */}

            <div
                className="
                    card
                    shadow-sm
                    border-0
                    mb-4
                "
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
                                Bank Wise Summary
                            </h4>

                            <div className="text-muted small">
                                Cash and investment value by bank
                            </div>

                        </div>


                        <span className="badge bg-primary">

                            {bankWise.length} Banks

                        </span>

                    </div>


                    <div className="table-responsive">

                        <table
                            className="
                                table
                                table-bordered
                                table-hover
                                align-middle
                                mb-0
                            "
                        >

                            <thead className="table-light">

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Bank
                                    </th>

                                    <th className="text-center">
                                        Accounts
                                    </th>

                                    <th className="text-end">
                                        Cash Balance
                                    </th>

                                    <th className="text-end">
                                        Investment Value
                                    </th>

                                    <th className="text-end">
                                        Total Value
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {bankWise.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const balance =
                                            Number(
                                                item?.balance || 0
                                            );


                                        const investmentValue =
                                            Number(
                                                item?.investmentCurrentValue || 0
                                            );


                                        const total =
                                            Number(
                                                item?.totalBalance ??
                                                (
                                                    balance +
                                                    investmentValue
                                                )
                                            );


                                        return (

                                            <tr
                                                key={
                                                    `${item?.bank}-${index}`
                                                }
                                            >

                                                <td>
                                                    {index + 1}
                                                </td>


                                                <td>

                                                    <strong>

                                                        {
                                                            formatBankName(
                                                                item?.bank
                                                            )
                                                        }

                                                    </strong>

                                                </td>


                                                <td className="text-center">

                                                    {
                                                        Number(
                                                            item?.accountCount || 0
                                                        )
                                                    }

                                                </td>


                                                <td className="text-end text-success fw-semibold">

                                                    ₹{" "}

                                                    {
                                                        formatAmount(
                                                            balance
                                                        )
                                                    }

                                                </td>


                                                <td className="text-end text-primary fw-semibold">

                                                    ₹{" "}

                                                    {
                                                        formatAmount(
                                                            investmentValue
                                                        )
                                                    }

                                                </td>


                                                <td className="text-end fw-bold">

                                                    ₹{" "}

                                                    {
                                                        formatAmount(
                                                            total
                                                        )
                                                    }

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>


                            <tfoot className="table-light">

                                <tr>

                                    <th
                                        colSpan="3"
                                        className="text-end"
                                    >
                                        Total
                                    </th>


                                    <th className="text-end">

                                        ₹{" "}

                                        {
                                            formatAmount(
                                                bankWise.reduce(
                                                    (
                                                        total,
                                                        item
                                                    ) =>
                                                        total +
                                                        Number(
                                                            item?.balance || 0
                                                        ),
                                                    0
                                                )
                                            )
                                        }

                                    </th>


                                    <th className="text-end">

                                        ₹{" "}

                                        {
                                            formatAmount(
                                                bankWise.reduce(
                                                    (
                                                        total,
                                                        item
                                                    ) =>
                                                        total +
                                                        Number(
                                                            item?.investmentCurrentValue || 0
                                                        ),
                                                    0
                                                )
                                            )
                                        }

                                    </th>


                                    <th className="text-end">

                                        ₹{" "}

                                        {
                                            formatAmount(
                                                bankWise.reduce(
                                                    (
                                                        total,
                                                        item
                                                    ) =>
                                                        total +
                                                        Number(
                                                            item?.totalBalance || 0
                                                        ),
                                                    0
                                                )
                                            )
                                        }

                                    </th>

                                </tr>

                            </tfoot>

                        </table>

                    </div>

                </div>

            </div>


            {/* =========================================================
                RECENT TRANSACTIONS
            ========================================================= */}

            <RecentTransaction
                transactions={
                    transactions
                }
            />

        </div>

    );

};


export default Dashboard;