import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/automation',
  name: 'automation',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.automation',
    requiresAuth: true,
    icon: 'icon-code-square',
    order: 2,
    hideInMenu: false,
  },
  children: [
    {
      path: 'code-generator',
      name: 'CodeGenerator',
      component: () => import('@/views/automation/code-generator/index.vue'),
      meta: {
        locale: 'menu.automation.codeGenerator',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: false,
      },
    },
  ],
};

export default DASHBOARD;
