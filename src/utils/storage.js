// src/utils/storage.js

const TOKEN_KEY = "token";
const USER_KEY = "user";

const storage = {

    // Token
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    // User
    setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    getUser() {
        const user = localStorage.getItem(USER_KEY);

        if (!user) {
            return null;
        }

        try {
            return JSON.parse(user);
        } catch {
            localStorage.removeItem(USER_KEY);
            return null;
        }
    },

    removeUser() {
        localStorage.removeItem(USER_KEY);
    },

    // Clear All
    clear() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

};

export default storage;
