import axios from 'axios';

const API_BASE_URL = 'https://api.ktkv.dev';

export const loginUser = async (id: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { id });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || error.message;
    }
};

export const getMessages = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/messages/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || error.message;
    }
};

export const getUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`); // Предполагается наличие этого эндпоинта
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || error.message;
    }
};