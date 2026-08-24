import axios from "./axios";

/*
|--------------------------------------------------------------------------
| GET MILK LIST
|--------------------------------------------------------------------------
*/
export const getMilkList = async (params = {}) => {
    const response = await axios.get("/milk", {
        params
    });
    return response;
};


/*
|--------------------------------------------------------------------------
| GET MILK BY ID
|--------------------------------------------------------------------------
*/
export const getMilkById = async (id) => {
    const response = await axios.get(`/milk/${id}`);


    return response;
};


/*
|--------------------------------------------------------------------------
| CREATE MILK
|--------------------------------------------------------------------------
*/
export const createMilk = async (data) => {
    const response = await axios.post(
        "/milk",
        data
    );
    return response;
};


/*
|--------------------------------------------------------------------------
| UPDATE MILK
|--------------------------------------------------------------------------
*/
export const updateMilk = async (
    id,
    data
) => {
    const response = await axios.put(
        `/milk/${id}`,
        data
    );

    return response;
};


/*
|--------------------------------------------------------------------------
| DELETE MILK
|--------------------------------------------------------------------------
*/
export const deleteMilk = async (id) => {
    const response = await axios.delete(
        `/milk/${id}`
    );
    return response;
};


/*
|--------------------------------------------------------------------------
| MILK SUMMARY
|--------------------------------------------------------------------------
*/
export const getMilkSummary = async () => {
    const response = await axios.get(
        "/milk/summary"
    );
    return response;
};