import api from "./axios";

/**
 * Get Accounts
 *
 * Supports:
 * page
 * limit
 * search
 * bank
 * accountType
 * status
 */
export const getAccounts = async (params = {}) => {

    const response = await api.get("/accounts", {
        params
    });

    return response.data;

};


/**
 * Get Active Accounts
 *
 * Used by:
 * Income
 * Expense
 * Transfer
 * Investment
 */
export const getActiveAccounts = async () => {

    const response = await api.get("/accounts/active");

    return response.data;

};


/**
 * Get Account By ID
 */
export const getAccountById = async (id) => {

    const response = await api.get(`/accounts/${id}`);

    return response.data;

};


/**
 * Create Account
 */
export const createAccount = async (data) => {

    const response = await api.post(
        "/accounts",
        data
    );

    return response.data;

};


/**
 * Update Account
 */
export const updateAccount = async (id, data) => {

    const response = await api.put(
        `/accounts/${id}`,
        data
    );

    return response.data;

};


/**
 * Delete Account
 */
export const deleteAccount = async (id) => {

    const response = await api.delete(
        `/accounts/${id}`
    );

    return response.data;

};