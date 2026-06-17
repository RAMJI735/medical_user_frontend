import { api } from "../authService/authService";

export const CartService = {
    addToCart: async (medicineId, quantity = 1) => {
        try {
            const res = await api.post("/cart", { medicineId, quantity });
            return res.data;
        } catch (error) {
            console.error("CartService addToCart error:", error);
            throw error;
        }
    },

    getCart: async () => {
        try {
            const res = await api.get("/cart");
            return res.data;
        } catch (error) {
            console.error("CartService getCart error:", error);
            throw error;
        }
    },

    updateCartItem: async (medicineId, quantity) => {
        try {
            const res = await api.put(`/cart/${medicineId}`, { quantity });
            return res.data;
        } catch (error) {
            console.error("CartService updateCartItem error:", error);
            throw error;
        }
    },

    removeFromCart: async (medicineId) => {
        try {
            const res = await api.delete(`/cart/${medicineId}`);
            return res.data;
        } catch (error) {
            console.error("CartService removeFromCart error:", error);
            throw error;
        }
    },

    clearCart: async () => {
        try {
            const res = await api.delete("/cart");
            return res.data;
        } catch (error) {
            console.error("CartService clearCart error:", error);
            throw error;
        }
    }
};
