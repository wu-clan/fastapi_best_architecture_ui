export interface AppState {
  theme: string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  device: string;
  tabBar: boolean;
  menuFromServer: boolean;
  serverMenu: MenuState[];
  [key: string]: unknown;
}

export interface MenuItem {
  id: number;
  title: string;
  name: string;
  level: number;
  sort: number;
  icon?: string;
  path?: string;
  menu_type: number;
  component?: string;
  perms?: string;
  status: 0 | 1;
  remark?: string;
  show: 0 | 1;
  cache: 0 | 1;
  parent_id?: number;
  children: MenuItem[] | [];
}

export interface MenuState {
  title: string;
  name: string;
  path?: string;
  component: any;
  children: MenuState[];
  meta: {
    roles?: string[];
    requiresAuth: boolean;
    icon?: string;
    hideInMenu: boolean;
    ignoreCache: boolean;
    order: number;
    locale: string;
  };
}
