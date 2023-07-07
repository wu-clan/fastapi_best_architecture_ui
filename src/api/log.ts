import axios from 'axios';
import qs from 'query-string';

export interface LoginLogRes {
  id: number;
  username: string;
  ip: string;
  browser: string;
  device: string;
  city: string;
  status: 0 | 1;
  msg: string;
  login_time: string;
}

export interface OperaLogRes {
  id: number;
  username?: string;
  method: string;
  title: string;
  path: string;
  ip: string;
  city: string;
  browser: string;
  device: string;
  args?: string;
  status: 0 | 1;
  code: string;
  msg: string;
  cost_time: number;
  opera_time: string;
}

export interface LoginLogParams {
  page?: number;
  size?: number;
}

export type OperaLogParams = LoginLogParams;

export interface LoginLogListRes {
  items: LoginLogRes[];
  total: number;
}

export interface OperaLogListRes {
  items: OperaLogRes[];
  total: number;
}

export function queryLoginLogList(
  params: LoginLogParams
): Promise<LoginLogListRes> {
  return axios.get('/api/v1/logs/login', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryOperaLogList(
  params: OperaLogParams
): Promise<OperaLogListRes> {
  return axios.get('/api/v1/logs/opera', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
