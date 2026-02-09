import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

console.log("API URL configured as:", api.defaults.baseURL);

export const getArticles = async (params) => {
    const response = await api.get('/articles', { params });
    return response.data;
};

export const triggerScrape = async () => {
    const response = await api.post('/articles/scrape');
    return response.data;
};

export default api;
