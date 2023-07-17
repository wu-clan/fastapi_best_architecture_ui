import { SysMenuRes } from '@/api/menu';
import axios from 'axios';
import qs from 'query-string';

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

export function querySysRoleAll(): Promise<SysRoleRes[]> {
  return axios.get('/api/v1/roles/all');
}

export function querySysRoleAllBySysUser(pk: number): Promise<SysRoleRes[]> {
  return axios.get(`/api/v1/roles/${pk}/all`);
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
