import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000/api/",
    withCredentials: true,
});

export const AuthService = {
    login: async (email, password) => {
        try {
            const res = await api.post("/auth/login", { email, password });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    signup: async (data) => {
        try {
            const res = await api.post("/auth/user/signup", { ...data });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getMe: async () => {
        try {
            const res = await api.get("/auth/me");
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            const res = await api.post("/auth/logout");
            return res.data;
        } catch (error) {
            throw error;
        }
    }
};