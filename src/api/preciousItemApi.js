import axios from "./axios";

/**
 * Get All Expense
 */
export const getPreciousItems = async (params = {}) => {

    return await axios.get("/preciousItem", {
        params
    });

};

/**
 * Get Single Expense
 */
export const getPreciousItem = async (id) => {

    return await axios.get(`/preciousItem/${id}`);

};

/**
 * Create Expense
 */
export const createPreciousItem = async (data) => {

    return await axios.post("/preciousItem", data);

};

/**
 * Update Expense
 */
export const updatePreciousItem = async (id, data) => {

    return await axios.put(`/preciousItem/${id}`, data);

};

/**
 * Delete Expense
 */
export const deletePreciousItem = async (id) => {

    return await axios.delete(`/preciousItem/${id}`);

};