import axios from 'axios';
import qs from 'query-string';

export interface SysDataRuleReq {
  name: string;
  model: string;
  column: string;
  operator: number;
  expression: number;
  value: string;
}

export interface SysDataRuleRes extends SysDataRuleReq {
  id: number;
}

export interface SysDataRuleParams {
  name?: string;
  page?: number;
  size?: number;
}

export interface SysDataRuleListRes {
  items: SysDataRuleRes[];
  total: number;
}

export interface SysDataRuleDeleteParams {
  pk: number[];
}

export function querySysDataRuleModels(): Promise<string[]> {
  return axios.get('/api/v1/sys/data-rules/models');
}

export function querySysDataRuleColumns(model: string): Promise<string[]> {
  return axios.get(`/api/v1/sys/data-rules/model/${model}/columns`);
}

export function querySysDataRuleAll(): Promise<SysDataRuleRes[]> {
  return axios.get('/api/v1/sys/data-rules/all');
}

export function querySysDataRuleDetail(pk: number): Promise<SysDataRuleRes> {
  return axios.get(`/api/v1/sys/data-rules/${pk}`);
}

export function querySysDataRuleList(
  params: SysDataRuleParams
): Promise<SysDataRuleListRes> {
  return axios.get('/api/v1/sys/data-rules', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function createSysDataRule(data: SysDataRuleReq) {
  return axios.post('/api/v1/sys/data-rules', data);
}

export function updateSysDataRule(pk: number, data: SysDataRuleReq) {
  return axios.put(`/api/v1/sys/data-rules/${pk}`, data);
}

export function deleteSysDataRule(params: SysDataRuleDeleteParams) {
  return axios.delete('/api/v1/sys/data-rules', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
