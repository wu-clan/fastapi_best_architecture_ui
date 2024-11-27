import localeLogin from '@/views/login/locale/en-US';
import localeSysMenu from '@/views/admin/menu/locale/en-US';
import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';
import localeLogLogin from '@/views/log/login/locale/en-US';
import localeIconPicker from '@/components/icon-picker/locale/en-US';
import localeLogOpera from '@/views/log/opera/locale/en-US';
import localeSysDept from '@/views/admin/dept/locale/en-US';
import localeServerMonitor from '@/views/monitor/server/locale/en-US';
import localeRedisMonitor from '@/views/monitor/redis/locale/en-US';
import localeSysApi from '@/views/admin/api/locale/en-US';
import localeSysUser from '@/views/admin/user/locale/en-US';
import localeSysRole from '@/views/admin/role/locale/en-US';
import localeGenerator from '@/views/automation/code-generator/local/en-US';
import localeDataRule from '@/views/admin/data-rule/local/en-US';
import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.admin': 'System Manage',
  'menu.automation': 'System Automation',
  'menu.monitor': 'System Monitor',
  'menu.log': 'Log',
  'menu.arcoWebsite': 'Arco Design',
  'menu.site': ' Official Website',
  'menu.github': 'GitHub',
  'menu.sponsor': 'Sponsor',
  'navbar.action.locale': 'Switch to English',
  'modal.title.tips': 'Warm Tips',
  'modal.title.tips.delete': 'Are you sure you want to delete it？',
  'switch.open': 'Enable',
  'switch.close': 'Disable',
  'submit.create.success': 'Created success',
  'submit.update.success': 'Updated success',
  'submit.delete.success': 'Deleted success',
  'copy.success': 'Copy success',
  'copy.error': 'Copy failed',
  ...localeSettings,
  ...localeLogin,
  ...localeWorkplace,
  ...localeLogLogin,
  ...localeSysMenu,
  ...localeIconPicker,
  ...localeLogOpera,
  ...localeSysDept,
  ...localeServerMonitor,
  ...localeRedisMonitor,
  ...localeSysApi,
  ...localeSysUser,
  ...localeSysRole,
  ...localeGenerator,
  ...localeDataRule,
};
