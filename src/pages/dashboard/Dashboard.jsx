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

        return Number(value || 0).toLocaleString(
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
            | SUMMARY
            |--------------------------------------------------------------------------
            |
            | getSummary() is already returning:
            |
            | {
            |     todayIncome: 15,
            |     todayExpense: 889,
            |     ...
            | }
            |
            |--------------------------------------------------------------------------
            */

            let summaryData = {};


            if (
                summaryResponse &&
                typeof summaryResponse === "object" &&
                !Array.isArray(summaryResponse)
            ) {

                /*
                | If API function returns:
                |
                | {
                |     success: true,
                |     data: {...}
                | }
                */

                if (
                    summaryResponse.data &&
                    typeof summaryResponse.data === "object" &&
                    !Array.isArray(summaryResponse.data)
                ) {

                    summaryData =
                        summaryResponse.data;

                }

                /*
                | If API function returns:
                |
                | {
                |     todayIncome: 15,
                |     todayExpense: 889,
                |     ...
                | }
                */

                else if (
                    summaryResponse.todayIncome !== undefined ||
                    summaryResponse.todayExpense !== undefined ||
                    summaryResponse.monthIncome !== undefined ||
                    summaryResponse.totalIncome !== undefined
                ) {

                    summaryData =
                        summaryResponse;

                }

            }


            console.log(
                "Dashboard Parsed Summary:",
                summaryData
            );


            setSummary(
                summaryData
            );


            /*
            |--------------------------------------------------------------------------
            | RECENT TRANSACTIONS
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
    | LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadDashboard();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | BANK WISE
    |--------------------------------------------------------------------------
    */

    const bankWise =
        Array.isArray(summary?.bankWise)
            ? summary.bankWise
            : [];


    const bankTotalBalance =
        bankWise.reduce(
            (total, item) => {

                return (
                    total +
                    Number(
                        item?.balance || 0
                    )
                );

            },
            0
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
            className="container-fluid py-3"
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
                        Financial overview and account summary
                    </div>

                </div>


                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={loadDashboard}
                >

                    Refresh

                </button>

            </div>


            {/* =========================================================
                OVERALL SUMMARY
            ========================================================= */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="mb-4">
                        Overall Summary
                    </h4>


                    <div className="row g-3">

                        <SummaryCard
                            title="Current Balance"
                            value={formatAmount(
                                summary.currentBalance
                            )}
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Calculated Balance"
                            value={formatAmount(
                                summary.calculatedBalance
                            )}
                            bg="bg-primary"
                        />


                        <SummaryCard
                            title="Total Account Balance"
                            value={formatAmount(
                                summary.totalAccountBalance
                            )}
                            bg="bg-dark"
                        />


                        <SummaryCard
                            title="Total Debt"
                            value={formatAmount(
                                summary.totalDebt
                            )}
                            bg="bg-danger"
                        />


                        <SummaryCard
                            title="Pending Debt"
                            value={formatAmount(
                                summary.totalPendingDebt
                            )}
                            bg="bg-info"
                        />

                    </div>

                </div>

            </div>


            {/* =========================================================
                TODAY
            ========================================================= */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="mb-4">
                        Today's Summary
                    </h4>


                    <div className="row g-3">

                        <SummaryCard
                            title="Today's Income"
                            value={formatAmount(
                                summary.todayIncome
                            )}
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Today's Expense"
                            value={formatAmount(
                                summary.todayExpense
                            )}
                            bg="bg-danger"
                        />


                        <SummaryCard
                            title="Today's Saving"
                            value={formatAmount(
                                summary.todaySaving
                            )}
                            bg="bg-info"
                        />


                        <SummaryCard
                            title="Today's Net"
                            value={formatAmount(
                                summary.todayNet
                            )}
                            bg={
                                Number(
                                    summary.todayNet || 0
                                ) >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                        />

                    </div>

                </div>

            </div>


            {/* =========================================================
                MONTHLY
            ========================================================= */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="mb-4">
                        Monthly Summary
                    </h4>


                    <div className="row g-3">

                        <SummaryCard
                            title="Monthly Income"
                            value={formatAmount(
                                summary.monthIncome
                            )}
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Monthly Expense"
                            value={formatAmount(
                                summary.monthExpense
                            )}
                            bg="bg-danger"
                        />


                        <SummaryCard
                            title="Monthly Saving"
                            value={formatAmount(
                                summary.monthSaving
                            )}
                            bg="bg-info"
                        />


                        <SummaryCard
                            title="Monthly Net"
                            value={formatAmount(
                                summary.monthNet
                            )}
                            bg={
                                Number(
                                    summary.monthNet || 0
                                ) >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                        />


                        <SummaryCard
                            title="Monthly Profit"
                            value={formatAmount(
                                summary.monthProfit
                            )}
                            bg={
                                Number(
                                    summary.monthProfit || 0
                                ) >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                        />

                    </div>

                </div>

            </div>


            {/* =========================================================
                YEARLY
            ========================================================= */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="mb-4">
                        Yearly Summary
                    </h4>


                    <div className="row g-3">

                        <SummaryCard
                            title="Yearly Income"
                            value={formatAmount(
                                summary.yearIncome
                            )}
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Yearly Expense"
                            value={formatAmount(
                                summary.yearExpense
                            )}
                            bg="bg-danger"
                        />


                        <SummaryCard
                            title="Yearly Saving"
                            value={formatAmount(
                                summary.yearSaving
                            )}
                            bg="bg-info"
                        />


                        <SummaryCard
                            title="Yearly Net"
                            value={formatAmount(
                                summary.yearNet
                            )}
                            bg={
                                Number(
                                    summary.yearNet || 0
                                ) >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                        />


                        <SummaryCard
                            title="Yearly Profit"
                            value={formatAmount(
                                summary.yearProfit
                            )}
                            bg={
                                Number(
                                    summary.yearProfit || 0
                                ) >= 0
                                    ? "bg-success"
                                    : "bg-danger"
                            }
                        />

                    </div>

                </div>

            </div>


            {/* =========================================================
                LIFETIME
            ========================================================= */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="mb-4">
                        Lifetime Summary
                    </h4>


                    <div className="row g-3">

                        <SummaryCard
                            title="Total Income"
                            value={formatAmount(
                                summary.totalIncome
                            )}
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Total Expense"
                            value={formatAmount(
                                summary.totalExpense
                            )}
                            bg="bg-danger"
                        />


                        <SummaryCard
                            title="Total Saving"
                            value={formatAmount(
                                summary.totalSaving
                            )}
                            bg="bg-info"
                        />


                        <SummaryCard
                            title="Total Debt"
                            value={formatAmount(
                                summary.totalDebt
                            )}
                            bg="bg-warning"
                        />


                        <SummaryCard
                            title="Pending Debt"
                            value={formatAmount(
                                summary.totalPendingDebt
                            )}
                            bg="bg-primary"
                        />

                    </div>

                </div>

            </div>


            {/* =========================================================
                ACCOUNT SUMMARY
            ========================================================= */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <div
                        className="
                            d-flex
                            justify-content-between
                            align-items-center
                            mb-4
                        "
                    >

                        <h4 className="mb-0">
                            Account Summary
                        </h4>


                        <span className="badge bg-primary">

                            {Number(
                                summary.accountCount || 0
                            )} Accounts

                        </span>

                    </div>


                    <div className="row g-3">

                        <SummaryCard
                            title="Total Account Balance"
                            value={formatAmount(
                                summary.totalAccountBalance
                            )}
                            bg="bg-success"
                        />


                        <SummaryCard
                            title="Account Count"
                            value={Number(
                                summary.accountCount || 0
                            )}
                            bg="bg-primary"
                        />

                    </div>

                </div>

            </div>


            {/* =========================================================
                BANK WISE
            ========================================================= */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <div
                        className="
                            d-flex
                            justify-content-between
                            align-items-center
                            mb-4
                        "
                    >

                        <h4 className="mb-0">
                            Bank Wise Summary
                        </h4>


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

                                    <th className="text-center">
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

                                {bankWise.length > 0 ? (

                                    bankWise.map(
                                        (
                                            item,
                                            index
                                        ) => {

                                            const balance =
                                                Number(
                                                    item?.balance || 0
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        `${item?.bank}-${index}`
                                                    }
                                                >

                                                    <td className="text-center">
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
                                                                item?.accountCount ||
                                                                0
                                                            )
                                                        }

                                                    </td>


                                                    <td
                                                        className={`
                                                            text-end
                                                            fw-bold
                                                            ${
                                                                balance >= 0
                                                                    ? "text-success"
                                                                    : "text-danger"
                                                            }
                                                        `}
                                                    >

                                                        ₹{" "}
                                                        {
                                                            formatAmount(
                                                                balance
                                                            )
                                                        }

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="
                                                text-center
                                                py-4
                                                text-muted
                                            "
                                        >

                                            No bank wise data available

                                        </td>

                                    </tr>

                                )}

                            </tbody>


                            {bankWise.length > 0 && (

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
                                                    bankTotalBalance
                                                )
                                            }

                                        </th>

                                    </tr>

                                </tfoot>

                            )}

                        </table>

                    </div>

                </div>

            </div>


            {/* =========================================================
                RECENT TRANSACTIONS
            ========================================================= */}

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <h4 className="mb-4">
                        Recent Transactions
                    </h4>


                    <RecentTransaction
                        transactions={
                            transactions
                        }
                    />

                </div>

            </div>

        </div>

    );

};


export default Dashboard;