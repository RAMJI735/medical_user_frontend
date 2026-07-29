import { api } from "../authService/authService";

export const PaymentService = {
    createPaymentOrder: async (data) => {
        try {
            const payload = typeof data === "object" ? data : { orderId: data };
            const res = await api.post("/payment/create-order", payload);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    verifyPayment: async (paymentData) => {
        try {
            const res = await api.post("/payment/verify-payment", paymentData);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getRazorpayKey: async () => {
        try {
            const res = await api.get("/payment/key");
            return res.data;
        } catch (error) {
            throw error;
        }
    }
};
