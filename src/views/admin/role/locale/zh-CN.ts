export default {
  'menu.admin.sysRole': '角色管理',
  // data scope
  'admin.role.data_scope': '数据权限',
  'admin.role.data_scope.0': '全部数据权限',
  'admin.role.data_scope.1': '自定义数据权限',
  'admin.role.data_scope.2': '所在部门及以下数据权限',
  'admin.role.data_scope.3': '所在部门数据权限',
  'admin.role.data_scope.4': '仅本人数据权限',
  // form
  'admin.role.form.name': '菜单名称',
  'admin.role.form.name.placeholder': '请输入菜单名称',
  'admin.role.form.name.help': '菜单名称是必填项',
  'admin.role.form.status': '状态',
  'admin.role.form.status.1': '正常',
  'admin.role.form.status.0': '停用',
  'admin.role.form.selectDefault': '全部',
  'admin.role.form.search': '搜索',
  'admin.role.form.reset': '重置',
  // button
  'admin.role.button.create': '新建',
  'admin.role.button.delete': '删除',
  // columns
  'admin.role.columns.new.drawer': '新建角色',
  'admin.role.columns.delete.drawer': '删除角色',
  'admin.role.columns.edit.drawer': '编辑角色',
  'admin.role.columns.name': '角色名称',
  'admin.role.columns.status': '状态',
  'admin.role.columns.remark': '备注',
  'admin.role.columns.operate': '编辑',
  'admin.role.columns.perms': '权限设置',
  'admin.role.columns.edit': '编辑',
  'admin.role.columns.delete': '删除',
  'admin.role.columns.menus': '菜单',
  // modal
  'admin.role.modal.delete':
    '确定要删除吗？角色删除没有设置强制检测，删除角色后，用户对应的角色权限将会被清空，可能造成无法挽回的后果，请慎重操作！',
  // drawer
  'admin.role.drawer.menu': '角色菜单',
  'admin.role.drawer.api': 'Casbin',
  'admin.role.drawer.dataScope': '数据权限',
  'admin.role.drawer.dataScope.alert':
    '此配置将影响用户对系统数据的可见性，请谨慎操作！',
  'admin.role.drawer.menu.button.select': '全选/取消全选',
  'admin.role.drawer.menu.button.collapse': '展开/收起',
  // alert
  'admin.role.alert.data_scope':
    '设置数据权限为全部时，将忽略菜单授权或API授权，直接拥有所有权限，请谨慎操作！',
};
