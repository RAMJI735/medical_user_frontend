import { api } from "../authService/authService";

export const AddressService = {
    createAddress: async (addressData) => {
        try {
            const res = await api.post("/address", addressData);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getAddresses: async () => {
        try {
            const res = await api.get("/address");
            return res.data;
        } catch (error) {
            throw error;
        }
    }
};
