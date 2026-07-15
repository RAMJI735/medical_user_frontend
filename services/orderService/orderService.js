import { api } from "../authService/authService";

export const OrderService = {
    createOrder: async (orderData) => {
        try {
            const res = await api.post("/orders", orderData);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getOrders: async () => {
        try {
            const res = await api.get("/orders");
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getOrderById: async (id) => {
        try {
            const res = await api.get(`/orders/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    cancelOrder: async (id) => {
        try {
            const res = await api.patch(`/orders/${id}/cancel`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    hideOrder: async (id) => {
        try {
            const res = await api.patch(`/orders/${id}/hide`);
            return res.data;
        } catch (error) {
            throw error;
        }
    }
};
