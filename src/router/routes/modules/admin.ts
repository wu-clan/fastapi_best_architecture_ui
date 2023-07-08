import { AppRouteRecordRaw } from '@/router/routes/types';
import { DEFAULT_LAYOUT } from '@/router/routes/base';

const SYSTEM: AppRouteRecordRaw = {
  path: '/admin',
  name: 'admin',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 1,
  },
  children: [
    {
      path: 'sys-dept',
      name: 'SysDept',
      component: () => import('@/views/admin/dept/index.vue'),
      meta: {
        locale: 'menu.system.sysDept',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'sys-menu',
      name: 'SysMenu',
      component: () => import('@/views/admin/menu/index.vue'),
      meta: {
        locale: 'menu.system.sysMenu',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SYSTEM;
