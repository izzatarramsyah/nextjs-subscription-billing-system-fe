import apiClient from './apiClient';

export const request = {
  get: async (url: string, params?: any) => {
    const res = await apiClient.get(url, { params });
    return res.data;
  },
  post: async (url: string, data?: any) => {
    const res = await apiClient.post(url, data);
    return res.data;
  },
  put: async (url: string, data?: any) => {
    const res = await apiClient.put(url, data);
    return res.data;
  },
  delete: async (url: string) => {
    const res = await apiClient.delete(url);
    return res.data;
  },
  upload: async (url: string, formData: FormData) => {
    const res = await apiClient.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  postWithBlob: async (url: string, data?: any) => {
    const res = await apiClient.post(url, data, {
      responseType: 'blob',
    });
    return res;
  },
};
