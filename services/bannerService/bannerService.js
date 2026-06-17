import { api } from "../authService/authService";

export const BannerService = {
    getBanners: async (isActive) => {
        try {
            const query = isActive !== undefined ? `?isActive=${isActive}` : "";
            const res = await api.get(`/banners${query}`);
            return res.data;
        } catch (error) {
            console.error("Failed to fetch banners:", error);
            throw error;
        }
    }
};
