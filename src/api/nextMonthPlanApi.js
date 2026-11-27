import axios from "./axios";

const BASE_PATH = "/next-month-plan";

export const getNextMonthPlans = async (params = {}) => {
    const response = await axios.get(BASE_PATH, { params });
    return response;
};

export const getNextMonthPlanSummary = async (monthYear) => {
    const params = monthYear ? { monthYear } : {};
    const response = await axios.get(`${BASE_PATH}/summary`, { params });
    return response;
};

export const getNextMonthPlan = async (id) => {
    const response = await axios.get(`${BASE_PATH}/${id}`);
    return response;
};

export const createNextMonthPlan = async (payload) => {
    const response = await axios.post(BASE_PATH, payload);
    return response;
};

export const updateNextMonthPlan = async (id, payload) => {
    const response = await axios.put(`${BASE_PATH}/${id}`, payload);
    return response;
};

export const deleteNextMonthPlan = async (id) => {
    const response = await axios.delete(`${BASE_PATH}/${id}`);
    return response;
};

export const updateNextMonthPlanStatus = async (id, status) => {
    const response = await axios.patch(`${BASE_PATH}/${id}/status`, { status });
    return response;
};
