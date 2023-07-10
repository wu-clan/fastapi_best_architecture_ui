import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LOG: AppRouteRecordRaw = {
  path: '/monitor',
  name: 'monitor',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.monitor',
    requiresAuth: true,
    icon: 'icon-computer',
    order: 2,
  },
  children: [
    {
      path: 'redis',
      name: 'Redis',
      component: () => import('@/views/monitor/redis/index.vue'),
      meta: {
        locale: 'menu.monitor.redis',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'server',
      name: 'Server',
      component: () => import('@/views/monitor/server/index.vue'),
      meta: {
        locale: 'menu.monitor.server',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LOG;
