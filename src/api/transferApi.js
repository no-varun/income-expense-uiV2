import axios from "./axios";


/*
|--------------------------------------------------------------------------
| NORMALIZE RESPONSE
|--------------------------------------------------------------------------
|
| Supports both:
|
| 1. Axios normal response
|    {
|       data: {
|          success: true,
|          message: "...",
|          data: {...}
|       }
|    }
|
| 2. axios.js interceptor already returns response.data
|    {
|       success: true,
|       message: "...",
|       data: {...}
|    }
|
|--------------------------------------------------------------------------
*/

const normalizeResponse = (response) => {

    /*
    |--------------------------------------------------------------------------
    | Already API response
    |--------------------------------------------------------------------------
    */

    if (
        response &&
        typeof response === "object" &&
        typeof response.success === "boolean"
    ) {

        return response;

    }


    /*
    |--------------------------------------------------------------------------
    | Axios response containing API response
    |--------------------------------------------------------------------------
    */

    if (
        response?.data &&
        typeof response.data === "object" &&
        typeof response.data.success === "boolean"
    ) {

        return response.data;

    }


    /*
    |--------------------------------------------------------------------------
    | Fallback
    |--------------------------------------------------------------------------
    */

    return response;

};


/*
|--------------------------------------------------------------------------
| GET ACCOUNTS
|--------------------------------------------------------------------------
*/

export const getAccounts = async (
    params = {}
) => {

    const response = await axios.get(
        "/accounts",
        {
            params
        }
    );


    console.log(
        "GET ACCOUNTS API:",
        response
    );


    return normalizeResponse(
        response
    );

};


/*
|--------------------------------------------------------------------------
| GET ACCOUNT BALANCE
|--------------------------------------------------------------------------
|
| Actual backend endpoint:
|
| GET
| /transfers/account/:accountId/balance/
|
|--------------------------------------------------------------------------
*/

export const getAccountBalance = async (
    accountId
) => {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    const response = await axios.get(

        `/transfers/account/${accountId}/balance/`,

        {

            params: {

                _t:
                    Date.now()

            },

            headers: {

                "Cache-Control":
                    "no-cache",

                "Pragma":
                    "no-cache",

                "Expires":
                    "0"

            }

        }

    );


    console.log(
        "GET ACCOUNT BALANCE API:",
        response
    );


    return normalizeResponse(
        response
    );

};


/*
|--------------------------------------------------------------------------
| CREATE TRANSFER
|--------------------------------------------------------------------------
*/

export const createTransfer = async (
    data
) => {

    console.log(
        "CREATE TRANSFER API PAYLOAD:",
        data
    );


    const response = await axios.post(
        "/transfers",
        data
    );


    console.log(
        "CREATE TRANSFER API RESPONSE:",
        response
    );


    return normalizeResponse(
        response
    );

};


/*
|--------------------------------------------------------------------------
| GET TRANSFERS
|--------------------------------------------------------------------------
*/

export const getTransfers = async (
    params = {}
) => {

    const response = await axios.get(
        "/transfers",
        {
            params
        }
    );


    console.log(
        "GET TRANSFERS API RESPONSE:",
        response
    );


    return normalizeResponse(
        response
    );

};


/*
|--------------------------------------------------------------------------
| GET TRANSFER BY ID
|--------------------------------------------------------------------------
*/

export const getTransfer = async (
    id
) => {

    if (!id) {

        throw new Error(
            "Transfer ID is required."
        );

    }


    const response = await axios.get(
        `/transfers/${id}`
    );


    console.log(
        "GET TRANSFER API RESPONSE:",
        response
    );


    return normalizeResponse(
        response
    );

};


/*
|--------------------------------------------------------------------------
| UPDATE TRANSFER
|--------------------------------------------------------------------------
*/

export const updateTransfer = async (
    id,
    data
) => {

    if (!id) {

        throw new Error(
            "Transfer ID is required."
        );

    }


    const response = await axios.put(
        `/transfers/${id}`,
        data
    );


    console.log(
        "UPDATE TRANSFER API RESPONSE:",
        response
    );


    return normalizeResponse(
        response
    );

};


/*
|--------------------------------------------------------------------------
| DELETE TRANSFER
|--------------------------------------------------------------------------
*/

export const deleteTransfer = async (
    id
) => {

    if (!id) {

        throw new Error(
            "Transfer ID is required."
        );

    }


    const response = await axios.delete(
        `/transfers/${id}`
    );


    console.log(
        "DELETE TRANSFER API RESPONSE:",
        response
    );


    return normalizeResponse(
        response
    );

};