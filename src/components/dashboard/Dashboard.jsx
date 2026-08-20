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
    | Load Dashboard
    |--------------------------------------------------------------------------
    */

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");


            const [
                summaryRes,
                transactionRes
            ] = await Promise.all([

                getSummary(),

                getRecentTransactions()

            ]);


            setSummary(
                summaryRes?.data || {}
            );


            setTransactions(
                transactionRes?.data || []
            );

        } catch (err) {

            console.error(
                "Dashboard Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadDashboard();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Format Amount
    |--------------------------------------------------------------------------
    */

    const formatAmount = (amount) => {

        return Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Format Bank
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
    | Account Data
    |--------------------------------------------------------------------------
    */

    const accounts =
        summary.accounts || [];


    const bankWise =
        summary.bankWise || [];


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="container-fluid py-5">

                <div className="text-center">

                    <div
                        className="spinner-border text-primary"
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
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div className="container-fluid py-4">

                <div className="alert alert-danger">

                    <div className="fw-bold mb-1">

                        Unable to load dashboard

                    </div>

                    <div>

                        {error}

                    </div>

                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mt-3"
                        onClick={loadDashboard}
                    >

                        Retry

                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="container-fluid py-3">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">

                        Dashboard

                    </h2>

                    <div className="text-muted">

                        Overview of your finances

                    </div>

                </div>


                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={loadDashboard}
                >

                    ↻ Refresh

                </button>

            </div>


            {/* =====================================================
                OVERALL FINANCIAL POSITION
            ====================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>

                            <h4 className="mb-1">

                                Overall Financial Position

                            </h4>

                            <div className="text-muted small">

                                Current balances from your accounts

                            </div>

                        </div>

                    </div>


                    <div className="row g-3">


                        <SummaryCard
                            title="Current Balance"
                            value={
                                summary.currentBalance
                            }
                            bg="bg-primary"
                            icon="₹"
                        />


                        <SummaryCard
                            title="Total Accounts"
                            value={
                                summary.accountCount || accounts.length
                            }
                            bg="bg-success"
                            icon="🏦"
                        />


                        <SummaryCard
                            title="Total Debt"
                            value={
                                summary.totalDebt
                            }
                            bg="bg-warning"
                            icon="💳"
                        />


                        <SummaryCard
                            title="Pending Debt"
                            value={
                                summary.totalPendingDebt
                            }
                            bg="bg-danger"
                            icon="⏳"
                        />

                    </div>

                </div>

            </div>


            {/* =====================================================
                TODAY
            ====================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="mb-4">

                        <h4 className="mb-1">

                            Today's Summary

                        </h4>

                        <div className="text-muted small">

                            Today's income and expenses

                        </div>

                    </div>


                    <div className="row g-3">


                        <SummaryCard
                            title="Today's Income"
                            value={
                                summary.todayIncome
                            }
                            bg="bg-success"
                            icon="↗"
                        />


                        <SummaryCard
                            title="Today's Expense"
                            value={
                                summary.todayExpense
                            }
                            bg="bg-danger"
                            icon="↘"
                        />


                        <SummaryCard
                            title="Today's Saving"
                            value={
                                summary.todaySaving
                            }
                            bg="bg-info"
                            icon="💰"
                        />


                        <SummaryCard
                            title="Today's Net"
                            value={
                                summary.todayNet
                            }
                            bg={
                                Number(summary.todayNet || 0) >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                            icon="="
                        />

                    </div>

                </div>

            </div>


            {/* =====================================================
                MONTHLY
            ====================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="mb-4">

                        <h4 className="mb-1">

                            Monthly Summary

                        </h4>

                        <div className="text-muted small">

                            Current month's financial activity

                        </div>

                    </div>


                    <div className="row g-3">


                        <SummaryCard
                            title="Monthly Income"
                            value={
                                summary.monthIncome
                            }
                            bg="bg-success"
                            icon="↗"
                        />


                        <SummaryCard
                            title="Monthly Expense"
                            value={
                                summary.monthExpense
                            }
                            bg="bg-danger"
                            icon="↘"
                        />


                        <SummaryCard
                            title="Monthly Saving"
                            value={
                                summary.monthSaving
                            }
                            bg="bg-info"
                            icon="💰"
                        />


                        <SummaryCard
                            title="Monthly Net"
                            value={
                                summary.monthNet ??
                                summary.monthProfit
                            }
                            bg={
                                Number(
                                    summary.monthNet ??
                                    summary.monthProfit ??
                                    0
                                ) >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                            icon="="
                        />

                    </div>

                </div>

            </div>


            {/* =====================================================
                YEARLY
            ====================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="mb-4">

                        <h4 className="mb-1">

                            Yearly Summary

                        </h4>

                        <div className="text-muted small">

                            Current year's financial activity

                        </div>

                    </div>


                    <div className="row g-3">


                        <SummaryCard
                            title="Yearly Income"
                            value={
                                summary.yearIncome
                            }
                            bg="bg-success"
                            icon="↗"
                        />


                        <SummaryCard
                            title="Yearly Expense"
                            value={
                                summary.yearExpense
                            }
                            bg="bg-danger"
                            icon="↘"
                        />


                        <SummaryCard
                            title="Yearly Saving"
                            value={
                                summary.yearSaving
                            }
                            bg="bg-info"
                            icon="💰"
                        />


                        <SummaryCard
                            title="Yearly Net"
                            value={
                                summary.yearNet ??
                                summary.yearProfit
                            }
                            bg={
                                Number(
                                    summary.yearNet ??
                                    summary.yearProfit ??
                                    0
                                ) >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                            icon="="
                        />

                    </div>

                </div>

            </div>


            {/* =====================================================
                MY ACCOUNTS
            ====================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>

                            <h4 className="mb-1">

                                My Accounts

                            </h4>

                            <div className="text-muted small">

                                Current balance of each account

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
                                            account.openingBalance || 0
                                        );


                                    const minimumBalance =
                                        Number(
                                            account.minimumBalance || 0
                                        );


                                    const belowMinimum =
                                        minimumBalance > 0 &&
                                        balance < minimumBalance;


                                    return (

                                        <div
                                            className="col-12 col-md-6 col-xl-4"
                                            key={account._id}
                                        >

                                            <div
                                                className={`card h-100 border ${
                                                    belowMinimum
                                                        ? "border-danger"
                                                        : ""
                                                }`}
                                            >

                                                <div className="card-body">

                                                    <div className="d-flex justify-content-between align-items-start">

                                                        <div>

                                                            <h5 className="mb-1">

                                                                {account.name}

                                                            </h5>

                                                            <div className="text-muted small">

                                                                {formatBankName(
                                                                    account.bank
                                                                )}

                                                            </div>

                                                        </div>


                                                        <span className="badge bg-light text-dark">

                                                            {account.accountType ||
                                                                "Account"}

                                                        </span>

                                                    </div>


                                                    <div className="mt-4">

                                                        <div className="text-muted small">

                                                            Current Balance

                                                        </div>

                                                        <div
                                                            className={`fs-4 fw-bold ${
                                                                balance >= 0
                                                                    ? "text-success"
                                                                    : "text-danger"
                                                            }`}
                                                        >

                                                            ₹{" "}
                                                            {formatAmount(
                                                                balance
                                                            )}

                                                        </div>

                                                    </div>


                                                    {minimumBalance > 0 && (

                                                        <div className="mt-3">

                                                            <div className="d-flex justify-content-between small">

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
                                                                    {formatAmount(
                                                                        minimumBalance
                                                                    )}

                                                                </span>

                                                            </div>


                                                            {belowMinimum && (

                                                                <div className="alert alert-danger py-2 px-3 mt-2 mb-0 small">

                                                                    Balance is below minimum

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

                        <div className="text-center py-5">

                            <div className="text-muted mb-2">

                                No accounts found

                            </div>

                            <small className="text-muted">

                                Add an account to start managing your balances.

                            </small>

                        </div>

                    )}

                </div>

            </div>


            {/* =====================================================
                BANK SUMMARY
            ====================================================== */}

            {bankWise.length > 0 && (

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body">

                        <div className="mb-4">

                            <h4 className="mb-1">

                                Bank Summary

                            </h4>

                            <div className="text-muted small">

                                Balance grouped by bank

                            </div>

                        </div>


                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

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
                                            Balance
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {bankWise.map(
                                        (item, index) => {

                                            const balance =
                                                Number(
                                                    item.balance || 0
                                                );


                                            return (

                                                <tr
                                                    key={`${item.bank}-${index}`}
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    <td>

                                                        <strong>

                                                            {formatBankName(
                                                                item.bank
                                                            )}

                                                        </strong>

                                                    </td>

                                                    <td className="text-center">

                                                        <span className="badge bg-light text-dark">

                                                            {item.accountCount || 0}

                                                        </span>

                                                    </td>

                                                    <td
                                                        className={`text-end fw-bold ${
                                                            balance >= 0
                                                                ? "text-success"
                                                                : "text-danger"
                                                        }`}
                                                    >

                                                        ₹{" "}
                                                        {formatAmount(
                                                            balance
                                                        )}

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>


                                <tfoot className="table-light">

                                    <tr>

                                        <th colSpan="3">

                                            Total Account Balance

                                        </th>

                                        <th className="text-end text-primary">

                                            ₹{" "}
                                            {formatAmount(
                                                summary.totalAccountBalance ??
                                                summary.currentBalance
                                            )}

                                        </th>

                                    </tr>

                                </tfoot>

                            </table>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                RECENT TRANSACTIONS
            ====================================================== */}

            <RecentTransaction
                transactions={transactions}
            />

        </div>

    );

};


export default Dashboard;