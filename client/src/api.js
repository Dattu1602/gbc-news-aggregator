import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getArticles = async (params) => {
    const response = await api.get('/articles', { params });
    return response.data;
};

export const triggerScrape = async () => {
    const response = await api.post('/articles/scrape');
    return response.data;
};

export default api;
