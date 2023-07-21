import { SysMenuRes, SysMenuTreeRes } from '@/api/menu';
import axios from 'axios';
import qs from 'query-string';

export interface SysRoleReq {
  name: string;
  data_scope: number;
  status: number;
  remark?: string;
}

export interface SysRoleMenuReq {
  menus: number[];
}

export interface SysRoleRes {
  id: number;
  name: string;
  data_scope: number;
  status: number;
  remark?: string;
  created_time: string;
  menus?: SysMenuRes[];
}

export interface SysRoleParams {
  name?: string;
  status?: number;
  page?: number;
  size?: number;
}

export interface SysRoleListRes {
  items: SysRoleRes[];
  total: number;
}

export interface SysRoleDeleteParams {
  pk: number[];
}

export function querySysRoleAll(): Promise<SysRoleRes[]> {
  return axios.get('/api/v1/roles/all');
}

export function querySysRoleAllBySysUser(pk: number): Promise<SysRoleRes[]> {
  return axios.get(`/api/v1/roles/${pk}/all`);
}

export function querySysMenuTreeBySysRole(
  pk: number
): Promise<SysMenuTreeRes[]> {
  return axios.get(`/api/v1/roles/${pk}/menus`);
}

export function querySysRoleList(
  params: SysRoleParams
): Promise<SysRoleListRes> {
  return axios.get('/api/v1/roles', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function querySysRoleDetail(pk: number): Promise<SysRoleRes> {
  return axios.get(`/api/v1/roles/${pk}`);
}

export function createSysRole(data: SysRoleReq) {
  return axios.post('/api/v1/roles', data);
}

export function updateSysRole(pk: number, data: SysRoleReq) {
  return axios.put(`/api/v1/roles/${pk}`, data);
}

export function deleteSysRole(params: SysRoleDeleteParams) {
  return axios.delete(`/api/v1/roles`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function updateSysRoleMenu(pk: number, data: SysRoleMenuReq) {
  return axios.put(`/api/v1/roles/${pk}/menu`, data);
}
