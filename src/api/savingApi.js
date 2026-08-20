import axios from "./axios";


/*
|--------------------------------------------------------------------------
| GET SAVINGS
|--------------------------------------------------------------------------
*/

export const getSavings = async (
    params = {}
) => {

    const response =
        await axios.get(
            "/saving",
            {
                params
            }
        );


    return response.data;

};


/*
|--------------------------------------------------------------------------
| GET SAVING BY ID
|--------------------------------------------------------------------------
*/

export const getSaving = async (
    id
) => {

    const response =
        await axios.get(
            `/saving/${id}`
        );


    return response.data;

};


/*
|--------------------------------------------------------------------------
| CREATE SAVING
|--------------------------------------------------------------------------
*/

export const createSaving = async (
    data
) => {

    const response =
        await axios.post(
            "/saving",
            data
        );


    return response.data;

};


/*
|--------------------------------------------------------------------------
| UPDATE SAVING
|--------------------------------------------------------------------------
*/

export const updateSaving = async (
    id,
    data
) => {

    const response =
        await axios.put(
            `/saving/${id}`,
            data
        );


    return response.data;

};


/*
|--------------------------------------------------------------------------
| DELETE SAVING
|--------------------------------------------------------------------------
*/

export const deleteSaving = async (
    id
) => {

    const response =
        await axios.delete(
            `/saving/${id}`
        );


    return response.data;

};