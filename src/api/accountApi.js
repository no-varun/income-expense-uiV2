import axios from "./axios";

/*
|--------------------------------------------------------------------------
| NORMALIZE RESPONSE
|--------------------------------------------------------------------------
|
| Supports both:
|
| 1. Normal Axios:
|    axios.post() => { data: { success: true, ... } }
|
| 2. Axios interceptor:
|    axios.post() => { success: true, ... }
|
|--------------------------------------------------------------------------
*/

const normalizeResponse = (response) => {

    if (
        response &&
        typeof response === "object" &&
        response.success !== undefined
    ) {

        return response;

    }


    if (
        response &&
        typeof response === "object" &&
        response.data &&
        typeof response.data === "object"
    ) {

        return response.data;

    }


    return response;

};


/*
|--------------------------------------------------------------------------
| GET ACCOUNT LIST
|--------------------------------------------------------------------------
*/

export const getAccounts = async (params = {}) => {

    const response = await axios.get(
        "/accounts",
        {
            params
        }
    );

    return normalizeResponse(
        response
    );

};


/*
|--------------------------------------------------------------------------
| GET ACCOUNT BY ID
|--------------------------------------------------------------------------
*/

export const getAccount = async (id) => {

    const response = await axios.get(
        `/accounts/${id}`
    );

    return normalizeResponse(
        response
    );

};


/*
|--------------------------------------------------------------------------
| CREATE ACCOUNT
|--------------------------------------------------------------------------
*/

export const createAccount = async (data) => {

    const response = await axios.post(
        "/accounts",
        data
    );

    console.log(
        "CREATE ACCOUNT RAW RESPONSE:",
        response
    );


    const result =
        normalizeResponse(
            response
        );


    console.log(
        "CREATE ACCOUNT NORMALIZED RESPONSE:",
        result
    );


    return result;

};


/*
|--------------------------------------------------------------------------
| UPDATE ACCOUNT
|--------------------------------------------------------------------------
*/

export const updateAccount = async (
    id,
    data
) => {

    const response = await axios.put(
        `/accounts/${id}`,
        data
    );

    return normalizeResponse(
        response
    );

};


/*
|--------------------------------------------------------------------------
| DELETE ACCOUNT
|--------------------------------------------------------------------------
*/

export const deleteAccount = async (
    id
) => {

    const response = await axios.delete(
        `/accounts/${id}`
    );

    return normalizeResponse(
        response
    );

};