import axios from "./axios";

export const createPFAccountStatement = (payload) =>
    axios.post("/pf-statements", payload);

export const getPFAccountStatements = (params = {}) =>
    axios.get("/pf-statements", { params });

export const getPFAccountStatementById = (id) =>
    axios.get(`/pf-statements/${id}`);

export const updatePFAccountStatement = (id, payload) =>
    axios.put(`/pf-statements/${id}`, payload);

export const deletePFAccountStatement = (id) =>
    axios.delete(`/pf-statements/${id}`);

export const getPFSummary = () =>
    axios.get("/pf-statements/summary");
