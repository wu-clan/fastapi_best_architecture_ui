import axios from 'axios';
import qs from 'query-string';

export interface LoginLogRecord {
  id: number;
  username: string;
  ip: string;
  browser: string;
  device: string;
  city: string;
  status: 0 | 1;
  msg: string;
  created_time: string;
}

export interface LoginLogParams extends Partial<LoginLogRecord> {
  page: number;
  size: number;
}

export interface LoginLogListRes {
  items: LoginLogRecord[];
  total: number;
}

export function queryLoginLogList(params: LoginLogParams) {
  return axios.get<LoginLogListRes>('/api/v1/log/login', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
