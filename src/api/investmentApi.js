import api from "./axios";

/**
 * Get Investment List
 *
 * Supports:
 * page
 * limit
 * search
 * type
 * account
 * status
 * dateFrom
 * dateTo
 */
export const getInvestments = async (params = {}) => {

    const response = await api.get(
        "/investments",
        {
            params
        }
    );

    return response.data;

};


/**
 * Get Investment By ID
 */
export const getInvestmentById = async (id) => {

    const response = await api.get(
        `/investments/${id}`
    );

    return response.data;

};


/**
 * Create Investment
 *
 * Example:
 *
 * {
 *   name: "ICICI SIP",
 *   type: "SIP",
 *   account: "ACCOUNT_ID",
 *   investedAmount: 10000,
 *   currentValue: 10500,
 *   investmentDate: "2026-08-20",
 *   status: true,
 *   note: "Monthly SIP"
 * }
 */
export const createInvestment = async (data) => {

    const response = await api.post(
        "/investments",
        data
    );

    return response.data;

};


/**
 * Update Investment
 */
export const updateInvestment = async (
    id,
    data
) => {

    const response = await api.put(
        `/investments/${id}`,
        data
    );

    return response.data;

};


/**
 * Delete Investment
 */
export const deleteInvestment = async (id) => {

    const response = await api.delete(
        `/investments/${id}`
    );

    return response.data;

};


/**
 * Get Investment Summary
 *
 * Returns:
 * totalInvested
 * totalCurrentValue
 * totalProfitLoss
 * returnPercentage
 * typeSummary
 */
export const getInvestmentSummary = async () => {

    const response = await api.get(
        "/investments/summary"
    );

    return response.data;

};