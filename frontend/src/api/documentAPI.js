import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

export const uploadDocument = (formData) =>
  API.post('/documents/upload', formData);

export const getAllDocuments = () =>
  API.get('/documents');

export const downloadDocument = (id) =>
  API.get(`/documents/${id}`, { responseType: 'blob' });

export const deleteDocument = (id) =>
  API.delete(`/documents/${id}`);
