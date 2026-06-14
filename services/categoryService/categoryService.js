import { api } from "../authService/authService";

export const CategoryService = {
    getAllCategories: async (search = "", isActive = "") => {
        try {
            const params = {};
            if (search) params.search = search;
            if (isActive !== "") params.isActive = isActive;

            const res = await api.get("/categories", { params });
            return res.data;
        } catch (error) {
            throw error;
        }
    },
    
    createCategory: async (categoryData) => {
        try {
            const res = await api.post("/categories", categoryData);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            const res = await api.delete(`/categories/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    }
};
