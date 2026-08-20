import axios from "./axios";


/*
|--------------------------------------------------------------------------
| Dashboard Summary
|--------------------------------------------------------------------------
| GET /dashboard/summary
|
| Returns:
| - currentBalance
| - totalAccountBalance
| - accountCount
| - accounts
| - bankWise
| - today summary
| - monthly summary
| - yearly summary
| - debt summary
|--------------------------------------------------------------------------
*/

export const getSummary = async () => {

    const response = await axios.get(
        "/dashboard/summary"
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| Recent Income
|--------------------------------------------------------------------------
*/

export const getRecentIncome = async () => {

    const response = await axios.get(
        "/dashboard/recent-income"
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| Recent Expense
|--------------------------------------------------------------------------
*/

export const getRecentExpense = async () => {

    const response = await axios.get(
        "/dashboard/recent-expense"
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| Recent Transactions
|--------------------------------------------------------------------------
| Returns latest Income / Expense / Saving / Debt
|--------------------------------------------------------------------------
*/

export const getRecentTransactions = async () => {

    const response = await axios.get(
        "/dashboard/recent-transactions"
    );

    return response.data;

};