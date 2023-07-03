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
  login_time: string;
}

export interface LoginLogParams extends Partial<LoginLogRecord> {
  page?: number;
  size?: number;
}

export interface LoginLogListRes {
  items: LoginLogRecord[];
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
