import axios from "axios";
import storage from "../utils/storage";
import { aesDecrypt, SECRET_KEY } from "../utils/helpers";

const BASE_URL =
    import.meta.env.VITE_API_URL || "https://income-expense-api-v2.vercel.app/api";
    // import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// Helper to decrypt string if encrypted
const decryptIfEncrypted = (value) => {
    if (typeof value !== "string" || !value) return value;
    try {
        const decrypted = aesDecrypt(SECRET_KEY, value);
        if (decrypted) {
            try {
                return JSON.parse(decrypted);
            } catch {
                return decrypted;
            }
        }
    } catch {
        // Return original value if not encrypted or decryption fails
    }
    return value;
};

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = storage.getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        let resData = response.data;
        if (resData && typeof resData === "object") {
            // Case 1: resData.data is encrypted string
            if (typeof resData.data === "string") {
                resData.data = decryptIfEncrypted(resData.data);
            }
            // Case 2: resData.data has encrypted rows
            if (resData.data && typeof resData.data === "object" && typeof resData.data.rows === "string") {
                resData.data.rows = decryptIfEncrypted(resData.data.rows);
            }
            // Case 3: resData itself has encrypted rows
            if (typeof resData.rows === "string") {
                resData.rows = decryptIfEncrypted(resData.rows);
            }
            // Case 4: resData.data has nested data as encrypted string
            if (resData.data && typeof resData.data === "object" && typeof resData.data.data === "string") {
                resData.data.data = decryptIfEncrypted(resData.data.data);
            }
            // Case 5: resData.items is encrypted string
            if (typeof resData.items === "string") {
                resData.items = decryptIfEncrypted(resData.items);
            }
        }
        return resData;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                   storage.clear();

                    if (window.location.pathname !== "/login") {
                        window.location.href = "/login";
                    }
                    break;

                case 403:
                    console.error("Forbidden");
                    break;

                case 404:
                    console.error("API Not Found");
                    break;

                case 500:
                    console.error("Internal Server Error");
                    break;

                default:
                    console.error(error.response.data?.message || "Something went wrong");
            }
        } else {
            console.error("Network Error");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
