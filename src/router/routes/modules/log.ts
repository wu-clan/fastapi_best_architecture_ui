import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LOG: AppRouteRecordRaw = {
  path: '/log',
  name: 'log',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.log',
    requiresAuth: true,
    icon: 'icon-bug',
    order: 3,
  },
  children: [
    {
      path: 'login',
      name: 'Login',
      component: () => import('@/views/log/login/index.vue'),
      meta: {
        locale: 'menu.log.login',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'opera',
      name: 'Opera',
      component: () => import('@/views/log/opera/index.vue'),
      meta: {
        locale: 'menu.log.opera',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LOG;
