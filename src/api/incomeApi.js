import axios from "./axios";


export const createIncome = async (data) => {

    const response = await axios.post(
        "/income",
        data
    );

    return response.data;

};


export const getIncomes = async (params = {}) => {

    const response = await axios.get(
        "/income",
        {
            params: {

                page:
                    params.page || 1,

                limit:
                    params.limit || 10,

                search:
                    params.search || "",

                category:
                    params.category || "",

                paymentMode:
                    params.paymentMode || "",

                account:
                    params.account || "",

                from:
                    params.from || "",

                to:
                    params.to || ""

            }
        }
    );

    return response.data;

};


export const getIncomeById = async (id) => {

    const response = await axios.get(
        `/income/${id}`
    );

    return response.data;

};


export const updateIncome = async (
    id,
    data
) => {

    const response = await axios.put(
        `/income/${id}`,
        data
    );

    return response.data;

};


export const deleteIncome = async (id) => {

    const response = await axios.delete(
        `/income/${id}`
    );

    return response.data;

};