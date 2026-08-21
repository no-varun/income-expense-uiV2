import axios from "./axios";


/*
|--------------------------------------------------------------------------
| GET EXPENSE LIST
|--------------------------------------------------------------------------
*/

export const getExpenses = async (
    params = {}
) => {

    const response = await axios.get(
        "/expense",
        {
            params
        }
    );

    return response.data.data;
};


/*
|--------------------------------------------------------------------------
| GET EXPENSE BY ID
|--------------------------------------------------------------------------
*/

export const getExpense = async (
    id
) => {

    const response = await axios.get(
        `/expense/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| CREATE EXPENSE
|--------------------------------------------------------------------------
*/

export const createExpense = async (data) => {

    const response = await axios.post(
        "/expense",
        data
    );

    return response;
};

/*
|--------------------------------------------------------------------------
| UPDATE EXPENSE
|--------------------------------------------------------------------------
*/

export const updateExpense = async (
    id,
    data
) => {

    const response = await axios.put(
        `/expense/${id}`,
        data
    );

    return response;
};


/*
|--------------------------------------------------------------------------
| DELETE EXPENSE
|--------------------------------------------------------------------------
*/

export const deleteExpense = async (
    id
) => {

    const response = await axios.delete(
        `/expense/${id}`
    );

    return response;
};


/*
|--------------------------------------------------------------------------
| EXPORT EXCEL
|--------------------------------------------------------------------------
*/

export const exportExpensesExcel = async (
    params = {}
) => {

    const response = await axios.get(
        "/expense/export/excel",
        {
            params,
            responseType: "blob"
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| IMPORT EXCEL
|--------------------------------------------------------------------------
*/

export const importExpensesExcel = async (
    file
) => {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    const response = await axios.post(
        "/expense/import/excel",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );

    return response.data;
};