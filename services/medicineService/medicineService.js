import { api } from "../authService/authService";

export const MedicineService = {
    getAllMedicines: async (search = "", categoryId = "", page = 1, limit = 10) => {
        try {
            const params = { page, limit };
            if (search) params.search = search;
            if (categoryId) params.category = categoryId;

            const res = await api.get("/medicines", { params });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getMedicinesByCategory: async (categoryId, page = 1, limit = 10) => {
        try {
            const res = await api.get(`/medicines/category/${categoryId}`, {
                params: { page, limit }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getMedicineById: async (id) => {
        try {
            const res = await api.get(`/medicines/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    createMedicine: async (medicineData) => {
        try {
            const res = await api.post("/medicines", medicineData);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    updateMedicine: async (id, updates) => {
        try {
            const res = await api.put(`/medicines/${id}`, updates);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    deleteMedicine: async (id) => {
        try {
            const res = await api.delete(`/medicines/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    }
};
