import axios from "./axios";

export const getSplitUsers = (params) => axios.get("/splitwise/users", { params });
export const getSplitwiseDashboard = () => axios.get("/splitwise/dashboard");
export const createSplitUser = (payload) => axios.post("/splitwise/users", payload);
export const updateSplitUser = (id, payload) => axios.put(`/splitwise/users/${id}`, payload);
export const deleteSplitUser = (id) => axios.delete(`/splitwise/users/${id}`);

export const getSplitGroups = () => axios.get("/splitwise/groups");
export const createSplitGroup = (payload) => axios.post("/splitwise/groups", payload);
export const updateSplitGroup = (id, payload) => axios.put(`/splitwise/groups/${id}`, payload);
export const deleteSplitGroup = (id) => axios.delete(`/splitwise/groups/${id}`);
export const getSplitGroup = (id) => axios.get(`/splitwise/groups/${id}`);
export const addSplitGroupMember = (groupId, payload) => axios.post(`/splitwise/groups/${groupId}/members`, payload);
export const removeSplitGroupMember = (groupId, memberId) => axios.delete(`/splitwise/groups/${groupId}/members/${memberId}`);

export const getSplitExpenses = (groupId, params) => axios.get(`/splitwise/groups/${groupId}/expenses`, { params });
export const createSplitExpense = (groupId, payload) => axios.post(`/splitwise/groups/${groupId}/expenses`, payload);
export const deleteSplitExpense = (id) => axios.delete(`/splitwise/expenses/${id}`);
export const getSplitSettlements = (groupId, params) => axios.get(`/splitwise/groups/${groupId}/settlements`, { params });
export const createSplitSettlement = (groupId, payload) => axios.post(`/splitwise/groups/${groupId}/settlements`, payload);
export const deleteSplitSettlement = (id) => axios.delete(`/splitwise/settlements/${id}`);
export const getSplitTransfers = (groupId, params) => axios.get(`/splitwise/groups/${groupId}/transfers`, { params });
export const createSplitTransfer = (groupId, payload) => axios.post(`/splitwise/groups/${groupId}/transfers`, payload);
export const deleteSplitTransfer = (id) => axios.delete(`/splitwise/transfers/${id}`);
export const getSplitBalances = (groupId) => axios.get(`/splitwise/groups/${groupId}/balances`);
export const getSplitSuggestions = (groupId) => axios.get(`/splitwise/groups/${groupId}/settlements/suggestions`);
