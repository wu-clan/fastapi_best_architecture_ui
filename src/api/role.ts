import axios from 'axios';
import qs from 'query-string';
import { SysMenuRes, SysMenuTreeRes } from '@/api/menu';

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
  return axios.get('/api/v1/sys/roles/all');
}

export function querySysRoleAllBySysUser(pk: number): Promise<SysRoleRes[]> {
  return axios.get(`/api/v1/sys/roles/${pk}/all`);
}

export function querySysMenuTreeBySysRole(
  pk: number
): Promise<SysMenuTreeRes[]> {
  return axios.get(`/api/v1/sys/roles/${pk}/menus`);
}

export function querySysRoleList(
  params: SysRoleParams
): Promise<SysRoleListRes> {
  return axios.get('/api/v1/sys/roles', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function querySysRoleDetail(pk: number): Promise<SysRoleRes> {
  return axios.get(`/api/v1/sys/roles/${pk}`);
}

export function createSysRole(data: SysRoleReq) {
  return axios.post('/api/v1/sys/roles', data);
}

export function updateSysRole(pk: number, data: SysRoleReq) {
  return axios.put(`/api/v1/sys/roles/${pk}`, data);
}

export function deleteSysRole(params: SysRoleDeleteParams) {
  return axios.delete(`/api/v1/sys/roles`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function updateSysRoleMenu(pk: number, data: SysRoleMenuReq) {
  return axios.put(`/api/v1/sys/roles/${pk}/menu`, data);
}
