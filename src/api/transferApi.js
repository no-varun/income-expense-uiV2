import api from "./axios";

/**
 * Get Transfer List
 *
 * Supports:
 * page
 * limit
 * search
 * fromAccount
 * toAccount
 * dateFrom
 * dateTo
 */
export const getTransfers = async (params = {}) => {

    const response = await api.get(
        "/transfers",
        {
            params
        }
    );

    return response.data;

};


/**
 * Get Transfer By ID
 */
export const getTransferById = async (id) => {

    const response = await api.get(
        `/transfers/${id}`
    );

    return response.data;

};


/**
 * Create Transfer
 *
 * Example:
 *
 * {
 *   fromAccount: "RBL_ACCOUNT_ID",
 *   toAccount: "PNB_ACCOUNT_ID",
 *   amount: 10000,
 *   date: "2026-08-20",
 *   purpose: "RD",
 *   note: "Monthly transfer"
 * }
 */
export const createTransfer = async (data) => {

    const response = await api.post(
        "/transfers",
        data
    );

    return response.data;

};


/**
 * Delete Transfer
 */
export const deleteTransfer = async (id) => {

    const response = await api.delete(
        `/transfers/${id}`
    );

    return response.data;

};


/**
 * Get Account Balance
 *
 * Used by Transfer form
 * to show available balance
 * before transferring.
 */
export const getAccountBalance = async (
    accountId
) => {

    const response = await api.get(
        `/transfers/account/${accountId}/balance`
    );

    return response.data;

};