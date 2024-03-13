import axios from 'axios';
import qs from 'query-string';

export interface SysApiReq {
  name: string;
  method: string;
  path: string;
  remark?: string;
}

export interface SysApiRes extends SysApiReq {
  id: number;
}

export interface SysApiParams {
  name?: string;
  method?: string;
  path?: string;
  page?: number;
  size?: number;
}

export interface SysApiListRes {
  items: SysApiRes[];
  total: number;
}

export interface SysApiDeleteParams {
  pk: number[];
}

export function querySysApiList(params: SysApiParams): Promise<SysApiListRes> {
  return axios.get('/api/v1/sys/apis', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function querySysApiAll(): Promise<SysApiRes[]> {
  return axios.get('/api/v1/sys/apis/all');
}

export function querySysApiDetail(pk: number): Promise<SysApiRes> {
  return axios.get(`/api/v1/sys/apis/${pk}`);
}

export function createSysApi(data: SysApiReq) {
  return axios.post('/api/v1/sys/apis', data);
}

export function updateSysApi(pk: number, data: SysApiReq) {
  return axios.put(`/api/v1/sys/apis/${pk}`, data);
}

export function deleteSysApi(params: SysApiDeleteParams) {
  return axios.delete(`/api/v1/sys/apis`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
