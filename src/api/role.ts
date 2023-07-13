import { SysMenuRes } from '@/api/menu';

export interface SysRoleRes {
  id: number;
  name: string;
  data_scope: number;
  status: number;
  remark?: string;
  created_time: string;
  menus: SysMenuRes[];
}
