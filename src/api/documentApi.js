import axios from "./axios";

export const createDocument = (payload) =>
    axios.post("/documents", payload, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const getDocuments = (params = {}) =>
    axios.get("/documents", { params });

export const getDocumentById = (id) =>
    axios.get(`/documents/${id}`);

export const updateDocument = (id, payload) =>
    axios.put(`/documents/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const deleteDocument = (id) =>
    axios.delete(`/documents/${id}`);

export const downloadDocument = (id) =>
    axios.get(`/documents/${id}/download`, { responseType: "blob" });
