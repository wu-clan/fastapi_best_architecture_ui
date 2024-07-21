import type { LocationQueryRaw, Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import { DEFAULT_ROUTE_NAME } from '@/router/constants';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();

    // 处理 OAuth 回调
    if (to.name === 'oauth2CallBack') {
      const oauth2 = await userStore.oauth2Login();
      if (oauth2) {
        await userStore.info();
        next({ name: DEFAULT_ROUTE_NAME });
      } else {
        next({
          name: 'login',
          query: {
            redirect: to.name,
            ...to.query,
          } as LocationQueryRaw,
        });
      }
      return;
    }

    if (isLogin()) {
      if (userStore.roles) {
        next();
      } else {
        try {
          await userStore.info();
          next();
        } catch (error) {
          await userStore.logout();
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else if (to.name === 'login') {
      next();
    } else {
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
