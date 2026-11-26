import axios from "./axios";

/*
|--------------------------------------------------------------------------
| GET ALL LOANS
|--------------------------------------------------------------------------
*/
export const getLoans = async (params = {}) => {
    const response = await axios.get("/loan", { params });
    return response?.data || response;
};

/*
|--------------------------------------------------------------------------
| GET LOAN BY ID
|--------------------------------------------------------------------------
*/
export const getLoan = async (id) => {
    const response = await axios.get(`/loan/${id}`);
    return response?.data || response;
};

/*
|--------------------------------------------------------------------------
| CREATE LOAN (Take Loan)
|--------------------------------------------------------------------------
*/
export const createLoan = async (data) => {
    const response = await axios.post("/loan", data);
    return response;
};

/*
|--------------------------------------------------------------------------
| UPDATE LOAN
|--------------------------------------------------------------------------
*/
export const updateLoan = async (id, data) => {
    const response = await axios.put(`/loan/${id}`, data);
    return response;
};

/*
|--------------------------------------------------------------------------
| DELETE LOAN
|--------------------------------------------------------------------------
*/
export const deleteLoan = async (id) => {
    const response = await axios.delete(`/loan/${id}`);
    return response;
};

/*
|--------------------------------------------------------------------------
| REPAY LOAN
|--------------------------------------------------------------------------
*/
export const repayLoan = async (id, data) => {
    const response = await axios.post(`/loan/${id}/repay`, data);
    return response;
};
