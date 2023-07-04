import axios from 'axios';
import qs from 'query-string';

export interface SysMenuRecord {
  id: number;
  name: string;
  menu_type: number;
  icon?: string;
  perms?: string;
  sort: number;
  show: 0 | 1;
  status: 0 | 1;
  remark?: string;
  created_time: string;
  children?: SysMenuRecord[];
}

type SysMenuTreeRes = SysMenuRecord[];

export interface SysMenuTreeParams {
  title?: string;
  status?: boolean;
}

export function querySysMenuTree(
  params: SysMenuTreeParams
): Promise<SysMenuTreeRes> {
  return axios.get('/api/v1/menus', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
