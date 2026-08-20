import axios from "./axios";


/*
|--------------------------------------------------------------------------
| GET DEBTS
|--------------------------------------------------------------------------
*/

export const getDebts = async (params = {}) => {

    const response = await axios.get(
        "/debt",
        {
            params
        }
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| GET DEBT BY ID
|--------------------------------------------------------------------------
*/

export const getDebt = async (id) => {

    const response = await axios.get(
        `/debt/${id}`
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| CREATE DEBT
|--------------------------------------------------------------------------
*/

export const createDebt = async (data) => {

    const response = await axios.post(
        "/debt",
        data
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| UPDATE DEBT
|--------------------------------------------------------------------------
*/

export const updateDebt = async (
    id,
    data
) => {

    const response = await axios.put(
        `/debt/${id}`,
        data
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| DELETE DEBT
|--------------------------------------------------------------------------
*/

export const deleteDebt = async (id) => {

    const response = await axios.delete(
        `/debt/${id}`
    );

    return response.data;

};