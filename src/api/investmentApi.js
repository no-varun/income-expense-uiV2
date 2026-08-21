import axios from "./axios";


/*
|--------------------------------------------------------------------------
| Create Investment
|--------------------------------------------------------------------------
*/

export const createInvestment = async (payload) => {

    const response =
        await axios.post(
            "/investments",
            payload
        );

    return response;

};


/*
|--------------------------------------------------------------------------
| Get Investments
|--------------------------------------------------------------------------
*/

export const getInvestments = async (params = {}) => {

    const response =
        await axios.get(
            "/investments",
            {
                params
            }
        );

    return response;

};


/*
|--------------------------------------------------------------------------
| Get Investment By ID
|--------------------------------------------------------------------------
*/

export const getInvestmentById = async (id) => {

    const response =
        await axios.get(
            `/investments/${id}`
        );

    return response;

};


/*
|--------------------------------------------------------------------------
| Update Investment
|--------------------------------------------------------------------------
*/

export const updateInvestment = async (
    id,
    payload
) => {

    const response =
        await axios.put(
            `/investments/${id}`,
            payload
        );

    return response;

};


/*
|--------------------------------------------------------------------------
| Delete Investment
|--------------------------------------------------------------------------
*/

export const deleteInvestment = async (
    id
) => {

    const response =
        await axios.delete(
            `/investments/${id}`
        );

    return response;

};


/*
|--------------------------------------------------------------------------
| Investment Summary
|--------------------------------------------------------------------------
*/

export const getInvestmentSummary = async () => {

    const response =
        await axios.get(
            "/investments/summary"
        );

    return response;

};