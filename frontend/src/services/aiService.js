import api from './api';

export const sendChat     = (data)   => api.post('/ai/chat', data);
export const summarize    = (data)   => api.post('/ai/summarize', data);
export const generate     = (data)   => api.post('/ai/generate', data);
export const getHistory   = (params) => api.get('/ai/history', { params });
export const deleteRecord = (id)     => api.delete(`/ai/history/${id}`);
export const clearHistory = (params) => api.delete('/ai/history', { params });
