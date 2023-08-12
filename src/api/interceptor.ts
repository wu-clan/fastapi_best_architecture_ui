import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { Message } from '@arco-design/web-vue';
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = any> {
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
    const { data }: { data: HttpResponse } = response.data;
    const { msg }: { msg: string } = response.data;
    const { code }: { code: number } = response.data;

    if (code === 401) {
      Message.error({
        content: msg,
        duration: 5 * 1000,
      });
      // TODO: token 监听，自动刷新，重新登录
    } else if (code !== 200) {
      Message.error({
        content: msg,
        duration: 5 * 1000,
      });
    }

    return data;
  },
  (error) => {
    let res: HttpError = {
      msg: '请求失败，请稍后再试',
      code: 500,
    };

    if (error.response) {
      res = error.response.data;
    } else if (error.message === 'Network Error') {
      res.msg = '服务器连接异常，请稍后重试';
    } else if (error.code === 'ECONNABORTED') {
      res.msg = '请求超时，请稍后重试';
    }

    Message.error({
      content: res.msg,
      duration: 5 * 1000,
    });

    return Promise.reject(res);
  }
);
