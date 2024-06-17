export default {
  'menu.system.sysMenu': '菜单管理',
  // form
  'admin.menu.form.name': '菜单名称',
  'admin.menu.form.name.placeholder': '请输入菜单名称',
  'admin.menu.form.status': '状态',
  'admin.menu.form.status.1': '正常',
  'admin.menu.form.status.0': '停用',
  'admin.menu.form.selectDefault': '全部',
  'admin.menu.form.search': '搜索',
  'admin.menu.form.reset': '重置',
  'admin.menu.form.title': '菜单标题',
  'admin.menu.form.title.placeholder': '请输入标题',
  'admin.menu.form.title.help': '菜单标题是必填项',
  'admin.menu.form.path.name': '请输入路由名称',
  'admin.menu.form.name.help':
    '菜单名称要与路由配置里meta.locale后缀一致，如路由`menu.system`, 则这里应命名为system',
  'admin.menu.form.path.placeholder': '请输入路由路径',
  'admin.menu.form.component.placeholder': '请输入组件路径',
  'admin.menu.form.perms.placeholder': '请输入权限字符',
  'admin.menu.form.remark.placeholder': '请输入备注',
  'admin.menu.form.parent_id.placeholder': '顶级',
  'admin.menu.form.path.help':
    '访问的路由地址，如：`admin`，如果为空，则默认使用路由名称转化的小写字母加中划线为路由地址，如 `SysMenu` -> `sys-menu`，如果是外网地址需内链访问，则以`http(s)://`开头',
  'admin.menu.form.component.help':
    '访问的组件路径，如：`/log/login/index.vue`，默认在`views`目录下',
  'admin.menu.form.perms.help':
    '作为 server 端 API 验权使用，如 `admin:list`，多个权限时使用 `,`(英文逗号) 间隔，请谨慎修改',
  // button
  'admin.menu.button.create': '新增',
  'admin.menu.button.collapse': '展开/收起',
  // columns
  'admin.menu.columns.title': '菜单标题',
  'admin.menu.columns.name': '路由名称',
  'admin.menu.columns.parent_name': '父级菜单',
  'admin.menu.columns.type': '菜单类型',
  'admin.menu.columns.type.0': '目录',
  'admin.menu.columns.type.1': '菜单',
  'admin.menu.columns.type.2': '按钮',
  'admin.menu.columns.icon': '图标',
  'admin.menu.columns.path': '路由路径',
  'admin.menu.columns.component': '组件路径',
  'admin.menu.columns.perms': '权限标识',
  'admin.menu.columns.sort': '排序',
  'admin.menu.columns.sort.placeholder': '请输入',
  'admin.menu.columns.show': '是否显示',
  'admin.menu.columns.cache': '是否缓存',
  'admin.menu.columns.status': '状态',
  'admin.menu.columns.remark': '备注',
  'admin.menu.columns.created_time': '创建时间',
  'admin.menu.columns.operate': '操作',
  'admin.menu.columns.new': '新增',
  'admin.menu.columns.new.drawer': '新增菜单',
  'admin.menu.columns.edit': '编辑',
  'admin.menu.columns.edit.drawer': '编辑菜单',
  'admin.menu.columns.delete': '删除',
  'admin.menu.columns.delete.drawer': '删除菜单',
};
