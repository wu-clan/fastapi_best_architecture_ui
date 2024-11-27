import { AppRouteRecordRaw } from '@/router/routes/types';
import { DEFAULT_LAYOUT } from '@/router/routes/base';

const SYSTEM: AppRouteRecordRaw = {
  path: '/admin',
  name: 'admin',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.admin',
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
        locale: 'menu.admin.sysDept',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'sys-user',
      name: 'SysUser',
      component: () => import('@/views/admin/user/index.vue'),
      meta: {
        locale: 'menu.admin.sysUser',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'sys-role',
      name: 'SysRole',
      component: () => import('@/views/admin/role/index.vue'),
      meta: {
        locale: 'menu.admin.sysRole',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'sys-menu',
      name: 'SysMenu',
      component: () => import('@/views/admin/menu/index.vue'),
      meta: {
        locale: 'menu.admin.sysMenu',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'sys-api',
      name: 'SysApi',
      component: () => import('@/views/admin/api/index.vue'),
      meta: {
        locale: 'menu.admin.sysApi',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'sys-data-rule',
      name: 'SysDataRule',
      component: () => import('@/views/admin/data-rule/index.vue'),
      meta: {
        locale: 'menu.admin.sysDataRule',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SYSTEM;
