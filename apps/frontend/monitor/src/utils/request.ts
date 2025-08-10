import axios, { CreateAxiosDefaults } from 'axios';

const config: CreateAxiosDefaults = {
  baseURL: '/api',
  timeout: 5000
};

export const request = axios.create(config);

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

request.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
