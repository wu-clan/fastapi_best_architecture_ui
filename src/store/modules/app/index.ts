import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import defaultSettings from '@/config/settings.json';
import { getUserMenuList } from '@/api/user';
import convertToCamelCase from '@/utils/string';
import { AppState, MenuItem, MenuState } from './types';

export function generateMenu(data: MenuItem[], parentName?: string) {
  const menuData: MenuState[] = [];
  const views = import.meta.glob('@/views/**/*.vue');

  data.forEach((menu) => {
    const localeName = convertToCamelCase(menu.name);
    const menuItem: MenuState = {
      name: menu.name,
      path: !menu.path ? `/${menu.name}` : menu.path,
      component: !menu.component
        ? () => import('@/layout/default-layout.vue')
        : views[`/src/views${menu.component}`],
      children: [],
      meta: {
        icon: menu.icon,
        hideInMenu: menu.show === 0,
        ignoreCache: menu.cache === 0,
        order: menu.sort,
        // roles: menu.perms ? menu.perms.split(',') : [],
        roles: ['*'],
        locale: parentName
          ? `menu.${parentName}.${localeName}`
          : `menu.${localeName}`,
      },
    };

    if (menu.children && menu.children.length > 0) {
      menuItem.children = generateMenu(menu.children, localeName);
    }

    menuData.push(menuItem);
  });

  return menuData;
}

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): MenuState[] {
      return state.serverMenu as unknown as MenuState[];
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
      let notifyInstance: NotificationReturn | null = null;
      try {
        notifyInstance = Notification.info({
          id: 'menuNotice', // Keep the instance id the same
          content: 'loading',
          closable: true,
        });
        const data = await getUserMenuList();
        this.serverMenu = generateMenu(data);
        notifyInstance = Notification.success({
          id: 'menuNotice',
          content: 'success',
          closable: true,
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: 'error',
          closable: true,
        });
      }
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
  },
});

export default useAppStore;
