import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

export interface HttpError {
  msg: string;
  code: number;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const { data } = response.data;
    return data || response.data;
  },
  (error) => {
    let res: HttpError = {
      msg: '请求失败，请稍后再试',
      code: 500,
    };
    if (error.response) {
      res = error.response.data;
    } else if (error.message === 'Network Error') {
      res.msg = '网络连接断开';
    } else if (error.code === 'ECONNABORTED') {
      res.msg = '请求超时，请稍后重试';
    }
    return Promise.reject(res);
  }
);
