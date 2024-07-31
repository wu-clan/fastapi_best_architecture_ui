import localeLogin from '@/views/login/locale/zh-CN';
import localeSysMenu from '@/views/admin/menu/locale/zh-CN';
import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';
import localeLogLogin from '@/views/log/login/locale/zh-CN';
import localeIconPicker from '@/components/icon-picker/locale/zh-CN';
import localeLogOpera from '@/views/log/opera/locale/zh-CN';
import localeSysDept from '@/views/admin/dept/locale/zh-CN';
import localeSysApi from '@/views/admin/api/locale/zh-CN';
import localeServerMonitor from '@/views/monitor/server/locale/zh-CN';
import localeRedisMonitor from '@/views/monitor/redis/locale/zh-CN';
import localeSysUser from '@/views/admin/user/locale/zh-CN';
import localeSysRole from '@/views/admin/role/locale/zh-CN';
import localeGenerator from '@/views/automation/code-generator/local/zh-CN';
import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.admin': '系统管理',
  'menu.automation': '系统自动化',
  'menu.log': '日志',
  'menu.monitor': '系统监控',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'menu.github': 'GitHub',
  'menu.sponsor': '赞助',
  'navbar.action.locale': '切换为中文',
  'modal.title.tips': '温馨提示',
  'modal.title.tips.delete': '确定要删除吗？',
  'switch.open': '开启',
  'switch.close': '关闭',
  'submit.create.success': '创建成功',
  'submit.update.success': '更新成功',
  'submit.delete.success': '删除成功',
  'copy.success': '复制成功',
  'copy.error': '复制失败',
  ...localeSettings,
  ...localeLogin,
  ...localeWorkplace,
  ...localeLogLogin,
  ...localeSysMenu,
  ...localeIconPicker,
  ...localeLogOpera,
  ...localeSysDept,
  ...localeSysApi,
  ...localeServerMonitor,
  ...localeRedisMonitor,
  ...localeSysUser,
  ...localeSysRole,
  ...localeGenerator,
};
