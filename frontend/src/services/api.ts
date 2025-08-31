import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// API endpoints
const endpoints = {
  health: {
    basic: '/api/v1/health',
    detailed: '/api/v1/health/detailed',
  },
  startups: {
    list: '/api/v1/startups',
    detail: (id: number) => `/api/v1/startups/${id}`,
    create: '/api/v1/startups',
    update: (id: number) => `/api/v1/startups/${id}`,
    delete: (id: number) => `/api/v1/startups/${id}`,
    evaluation: (id: number) => `/api/v1/startups/${id}/evaluation`,
  },
  documents: {
    list: '/api/v1/documents',
    detail: (id: number) => `/api/v1/documents/${id}`,
    upload: '/api/v1/documents/upload',
    delete: (id: number) => `/api/v1/documents/${id}`,
    process: (id: number) => `/api/v1/documents/${id}/process`,
  },
  analysis: {
    start: '/api/v1/analysis/startup',
    detail: (id: string) => `/api/v1/analysis/${id}`,
    history: (startupId: number) => `/api/v1/analysis/startup/${startupId}/history`,
    cancel: (id: string) => `/api/v1/analysis/${id}/cancel`,
    benchmarks: (sector: string) => `/api/v1/analysis/benchmarks/${sector}`,
    compare: '/api/v1/analysis/compare',
  },
};

// API service
export const apiService = {
  health: {
    getBasic: () => api.get(endpoints.health.basic),
    getDetailed: () => api.get(endpoints.health.detailed),
  },
  startups: {
    getList: (params?: any) => api.get(endpoints.startups.list, { params }),
    getDetail: (id: number) => api.get(endpoints.startups.detail(id)),
    create: (data: any) => api.post(endpoints.startups.create, data),
    update: (id: number, data: any) => api.put(endpoints.startups.update(id), data),
    delete: (id: number) => api.delete(endpoints.startups.delete(id)),
    getEvaluation: (id: number) => api.get(endpoints.startups.evaluation(id)),
  },
  documents: {
    getList: (params?: any) => api.get(endpoints.documents.list, { params }),
    getDetail: (id: number) => api.get(endpoints.documents.detail(id)),
    upload: (file: File, startupId?: number) => {
      const formData = new FormData();
      formData.append('file', file);
      if (startupId) formData.append('startup_id', startupId.toString());
      return api.post(endpoints.documents.upload, formData);
    },
    delete: (id: number) => api.delete(endpoints.documents.delete(id)),
    process: (id: number) => api.post(endpoints.documents.process(id)),
  },
  analysis: {
    start: (data: any) => api.post(endpoints.analysis.start, data),
    getDetail: (id: string) => api.get(endpoints.analysis.detail(id)),
    getHistory: (startupId: number) => api.get(endpoints.analysis.history(startupId)),
    cancel: (id: string) => api.post(endpoints.analysis.cancel(id)),
    getBenchmarks: (sector: string) => api.get(endpoints.analysis.benchmarks(sector)),
    compare: (startupIds: number[]) => api.post(endpoints.analysis.compare, { startup_ids: startupIds }),
  },
};

export default api;
