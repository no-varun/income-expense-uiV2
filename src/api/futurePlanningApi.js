import axios from "./axios";

/*
|--------------------------------------------------------------------------
| GET FUTURE PLANNING LIST
|--------------------------------------------------------------------------
*/

export const getFuturePlannings = async (params = {}) => {
    const response = await axios.get(
        "/futurePlanning",
        {
            params
        }
    );

    return response;
};


/*
|--------------------------------------------------------------------------
| GET FUTURE PLANNING BY ID
|--------------------------------------------------------------------------
*/

export const getFuturePlanning = async (id) => {
    const response = await axios.get(
        `/futurePlanning/${id}`
    );

    return response;
};


/*
|--------------------------------------------------------------------------
| CREATE FUTURE PLANNING
|--------------------------------------------------------------------------
*/

export const createFuturePlanning = async (data) => {
    const response = await axios.post(
        "/futurePlanning",
        data
    );

    return response;
};


/*
|--------------------------------------------------------------------------
| UPDATE FUTURE PLANNING
|--------------------------------------------------------------------------
*/

export const updateFuturePlanning = async (
    id,
    data
) => {
    const response = await axios.put(
        `/futurePlanning/${id}`,
        data
    );

    return response;
};


/*
|--------------------------------------------------------------------------
| DELETE FUTURE PLANNING
|--------------------------------------------------------------------------
*/

export const deleteFuturePlanning = async (id) => {
    const response = await axios.delete(
        `/futurePlanning/${id}`
    );

    return response;
};