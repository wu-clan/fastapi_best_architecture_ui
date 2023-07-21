<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.system'), $t('menu.system.sysRole')]" />
      <a-card :title="$t('menu.system.sysRole')" class="general-card">
        <a-row>
          <a-col :span="12">
            <a-form
              :auto-label-width="true"
              :label-col-props="{ span: 6 }"
              :model="formModel"
              label-align="right"
            >
              <a-row>
                <a-col :span="12">
                  <a-form-item :label="$t('admin.role.form.name')" field="name">
                    <a-input
                      v-model="formModel.name"
                      :placeholder="$t('admin.role.form.name.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('admin.role.form.status')"
                    field="status"
                  >
                    <a-select
                      v-model="formModel.status"
                      :options="statusOptions"
                      :placeholder="$t('admin.role.form.selectDefault')"
                      allow-clear
                      @clear="resetStatus"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider direction="vertical" style="height: 30px" />
          <a-col :span="8">
            <a-space :size="'medium'" direction="horizontal">
              <a-button type="primary" @click="search">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('admin.role.form.search') }}
              </a-button>
              <a-button @click="resetSelect">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('admin.role.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-divider />
        <a-space :size="'medium'">
          <a-button type="primary" @click="NewRole">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('admin.role.button.create') }}
          </a-button>
          <a-button
            :disabled="deleteButtonStatus()"
            status="danger"
            @click="DeleteRole"
          >
            <template #icon>
              <icon-minus />
            </template>
            {{ $t('admin.role.button.delete') }}
          </a-button>
        </a-space>
        <a-alert :type="'warning'" style="margin-top: 20px">
          {{ $t('admin.role.alert.data_scope') }}
        </a-alert>
        <div class="content">
          <a-table
            v-model:selected-keys="rowSelectKeys"
            :bordered="false"
            :columns="(cloneColumns as TableColumnData[])"
            :data="renderData"
            :loading="loading"
            :pagination="pagination"
            :row-selection="rowSelection"
            :size="size"
            row-key="id"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
          >
            <template #index="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
            <template #status="{ record }">
              <a-tag v-if="record.status === 1" :color="`green`" bordered>
                {{ $t(`admin.menu.form.status.${record.status}`) }}
              </a-tag>
              <a-tag v-else :color="`red`" bordered>
                {{ $t(`admin.menu.form.status.${record.status}`) }}
              </a-tag>
            </template>
            <template #data_scope="{ record }">
              {{ dataScopeText(record.data_scope) }}
            </template>
            <template #operate="{ record }">
              <a-space>
                <a-link @click="EditPerm(record.id)">
                  {{ $t(`admin.role.columns.perms`) }}
                </a-link>
                <a-link @click="EditRole(record.id)">
                  {{ $t(`admin.role.columns.edit`) }}
                </a-link>
              </a-space>
            </template>
          </a-table>
        </div>
        <div class="content-modal">
          <a-modal
            :closable="false"
            :on-before-ok="beforeSubmit"
            :title="drawerTitle"
            :visible="openNewOrEdit"
            :width="550"
            @cancel="cancelReq"
            @ok="submitNewOrEdit"
          >
            <a-form ref="formRef" :model="form">
              <a-form-item
                :label="$t('admin.role.columns.name')"
                :rules="[
                  {
                    required: true,
                    message: $t('admin.role.form.name.help'),
                  },
                ]"
                field="name"
              >
                <a-input v-model="form.name"></a-input>
              </a-form-item>
              <a-form-item
                :label="$t('admin.role.columns.data_scope')"
                :rules="[
                  {
                    required: true,
                    message: $t('admin.role.form.data_scope.help'),
                  },
                ]"
                field="data_scope"
              >
                <a-select
                  v-model="form.data_scope"
                  :options="dataScopeOptions"
                ></a-select>
              </a-form-item>
              <a-form-item
                :label="$t('admin.role.columns.status')"
                field="status"
              >
                <a-switch
                  v-model="form.status"
                  v-model:model-value="switchStatus"
                  :checked-text="$t('switch.open')"
                  :unchecked-text="$t('switch.close')"
                ></a-switch>
              </a-form-item>
              <a-form-item
                :label="$t('admin.role.columns.remark')"
                field="remark"
              >
                <a-textarea v-model="form.remark"></a-textarea>
              </a-form-item>
            </a-form>
          </a-modal>
          <a-modal
            :closable="false"
            :title="`${$t('modal.title.tips')}`"
            :visible="openDelete"
            @cancel="cancelReq"
            @ok="submitDelete"
          >
            <a-space>
              <icon-exclamation-circle-fill size="24" style="color: #e6a23c" />
              {{ $t('admin.role.modal.delete') }}
            </a-space>
          </a-modal>
          <a-drawer
            :closable="false"
            :title="drawerTitle"
            :visible="openEditPerm"
            :width="688"
            :header="false"
            @ok="submitPerms"
            @cancel="cancelReq"
          >
            <a-tabs
              v-model:active-key="activePerm"
              :animation="true"
              :type="'card-gutter'"
              :justify="true"
            >
              <a-tab-pane
                key="menu"
                :closable="false"
                :title="$t('admin.role.drawer.menu')"
              >
                <a-space style="margin: 0 0 20px 20px" :size="'medium'">
                  <a-button
                    :type="'outline'"
                    :shape="'round'"
                    @click="checkMenu"
                  >
                    {{ $t('admin.role.drawer.menu.button.select') }}
                  </a-button>
                  <a-button :type="'outline'" :shape="'round'" @click="expand">
                    {{ $t('admin.role.drawer.menu.button.collapse') }}
                  </a-button>
                  <a-input-search
                    :style="{ width: '360px' }"
                    :placeholder="
                      $t('admin.role.drawer.menu.input.placeholder')
                    "
                  />
                </a-space>
                <a-tree
                  ref="menuTreeDataRef"
                  v-model:checked-keys="checkedKeys"
                  :checkable="true"
                  :data="menuTreeData"
                  :field-names="selectMenuTreeFieldNames"
                  style="margin-left: 20px"
                  :check-strictly="true"
                  :default-expand-all="true"
                ></a-tree>
              </a-tab-pane>
              <a-tab-pane
                key="api"
                :closable="false"
                :title="$t('admin.role.drawer.api')"
              >
                <a-input-search
                  :style="{ width: '360px', margin: '0 0 20px 20px' }"
                  :placeholder="$t('admin.role.drawer.api.input.placeholder')"
                />
              </a-tab-pane>
            </a-tabs>
          </a-drawer>
        </div>
      </a-card>
    </a-layout>
  </div>
  <div class="footer">
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';
  import Breadcrumb from '@/components/breadcrumb/index.vue';
  import { computed, reactive, ref, watch } from 'vue';
  import { cloneDeep } from 'lodash';
  import {
    Message,
    SelectOptionData,
    TableColumnData,
    TreeFieldNames,
  } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    createSysRole,
    deleteSysRole,
    querySysRoleDetail,
    querySysRoleList,
    SysRoleParams,
    SysRoleReq,
    SysRoleRes,
    updateSysRole,
    updateSysRoleMenu,
  } from '@/api/role';
  import { Pagination } from '@/types/global';
  import {
    querySysMenuTree,
    querySysMenuTreeBySysRole,
    SysMenuTreeParams,
    SysMenuTreeRes,
  } from '@/api/menu';

  type Column = TableColumnData & { checked?: true };
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  // 表单
  const generateFormModel = () => {
    return {
      name: undefined,
      status: undefined,
    };
  };
  const formModel = ref(generateFormModel());
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('admin.role.form.status.1'),
      value: 1,
    },
    {
      label: t('admin.role.form.status.0'),
      value: 0,
    },
  ]);

  // 表格
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const renderData = ref<SysRoleRes[]>([]);
  const size = ref<SizeProps>('medium');
  const rowSelectKeys = ref<number[]>([]);
  const rowSelection = reactive({
    showCheckedAll: true,
    selectedRowKeys: rowSelectKeys.value,
  });
  const basePagination: Pagination = {
    current: 1,
    defaultPageSize: 20,
    showTotal: true,
    showPageSize: true,
    bufferSize: 3,
  };
  const pagination: Pagination = reactive({
    ...basePagination,
  });
  const operateRow = ref<number>(0);
  const NewRole = () => {
    buttonStatus.value = 'new';
    drawerTitle.value = t('admin.role.columns.new.drawer');
    resetForm(formDefaultValues);
    openNewOrEdit.value = true;
  };
  const DeleteRole = () => {
    drawerTitle.value = t('admin.role.columns.delete.drawer');
    openDelete.value = true;
  };
  const EditPerm = async (pk: number) => {
    operateRow.value = pk;
    await fetchMenuTree();
    await fetchRoleMenuTree();
    checkedKeys.value = [];
    fetchCheckedKeys(menuTreeDataByRole.value);
    openEditPerm.value = true;
  };
  const EditRole = async (pk: number) => {
    buttonStatus.value = 'edit';
    operateRow.value = pk;
    drawerTitle.value = t('admin.role.columns.edit.drawer');
    await fetchRoleDetail(pk);
    openNewOrEdit.value = true;
  };
  const columns = computed<TableColumnData[]>(() => [
    {
      title: 'ID',
      dataIndex: 'index',
      slotName: 'index',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: t('admin.role.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: t('admin.role.columns.data_scope'),
      dataIndex: 'data_scope',
      slotName: 'data_scope',
    },
    {
      title: t('admin.role.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
    },
    {
      title: t('admin.role.columns.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('admin.role.columns.operate'),
      dataIndex: 'operate',
      slotName: 'operate',
      align: 'center',
    },
  ]);

  // 对话框
  const openNewOrEdit = ref<boolean>(false);
  const drawerTitle = ref<string>('');
  const openDelete = ref<boolean>(false);
  const openEditPerm = ref<boolean>(false);
  const formRef = ref();
  const cancelReq = () => {
    openNewOrEdit.value = false;
    openDelete.value = false;
    openEditPerm.value = false;
  };
  const formDefaultValues: SysRoleReq = {
    name: '',
    data_scope: 1,
    status: 1,
    remark: undefined,
  };
  const form = reactive<SysRoleReq>({ ...formDefaultValues });
  const buttonStatus = ref<string>();
  const dataScopeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('admin.role.form.data_scope.1'),
      value: 1,
    },
    {
      label: t('admin.role.form.data_scope.2'),
      value: 2,
    },
  ]);
  const switchStatus = ref<boolean>(Boolean(form.status));

  // 抽屉
  const checkedKeys = ref<number[]>([]);
  const menuTreeData = ref();
  const menuTreeDataByRole = ref();
  const selectMenuTreeFieldNames: TreeFieldNames = {
    key: 'id',
    title: 'title',
    children: 'children',
    icon: 'iconRender',
  };
  const expandAll = ref<boolean>(false);
  const checkAll = ref<boolean>(false);
  const menuTreeDataRef = ref();
  const activePerm = ref<string>('menu');
  const submitPerms = async () => {
    if (activePerm.value === 'menu') {
      await submitRoleMenu();
    }
  };
  const roleMenuKeys = computed(() => {
    return { menus: checkedKeys.value };
  });

  // 表单校验
  const beforeSubmit = async (done: any) => {
    const res = await formRef.value?.validate();
    if (!res) {
      done(true);
    }
    done(false);
  };

  // 提交按钮
  const submitNewOrEdit = async () => {
    setLoading(true);
    try {
      if (buttonStatus.value === 'new') {
        await createSysRole(form);
        cancelReq();
        Message.success(t('submit.create.success'));
        await fetchRoleList();
      } else {
        await updateSysRole(operateRow.value, form);
        cancelReq();
        Message.success(t('submit.update.success'));
        await fetchRoleList();
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 删除角色
  const submitDelete = async () => {
    setLoading(true);
    try {
      await deleteSysRole({ pk: rowSelectKeys.value });
      cancelReq();
      Message.success(t('submit.delete.success'));
      await fetchRoleList();
      rowSelectKeys.value = [];
    } catch (error) {
      openDelete.value = false;
      // console.log(error);
    } finally {
      openDelete.value = false;
      setLoading(false);
    }
  };

  // 删除按钮状态
  const deleteButtonStatus = () => {
    return rowSelectKeys.value?.length === 0;
  };

  // 请求角色列表
  const fetchRoleList = async (params: SysRoleParams = {}) => {
    setLoading(true);
    try {
      const res = await querySysRoleList(params);
      renderData.value = res.items;
      pagination.total = res.total;
      pagination.current = params.page;
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  fetchRoleList();

  // 请求菜单树
  const fetchMenuTree = async (params: SysMenuTreeParams = {}) => {
    setLoading(true);
    try {
      menuTreeData.value = await querySysMenuTree(params);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 请求角色菜单树
  const fetchRoleMenuTree = async () => {
    setLoading(true);
    try {
      menuTreeDataByRole.value = await querySysMenuTreeBySysRole(
        operateRow.value
      );
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 请求角色详情
  const fetchRoleDetail = async (pk: number) => {
    setLoading(true);
    try {
      const res = await querySysRoleDetail(pk);
      resetForm(res);
      switchStatus.value = Boolean(res.status);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 更新角色菜单
  const submitRoleMenu = async () => {
    setLoading(true);
    try {
      await updateSysRoleMenu(operateRow.value, roleMenuKeys.value);
      cancelReq();
      Message.success(t('submit.update.success'));
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // 获取菜单选中节点
  const fetchCheckedKeys = (data: SysMenuTreeRes[]) => {
    data.forEach((item: SysMenuTreeRes) => {
      const checkedKey = item.id;
      if (item.children && item.children.length > 0) {
        fetchCheckedKeys(item.children);
      }
      checkedKeys.value.push(checkedKey);
    });
  };

  // 事件: 分页
  const onPageChange = async (current: number) => {
    await fetchRoleList({ page: current, size: pagination.pageSize });
  };

  // 事件: 分页大小
  const onPageSizeChange = async (pageSize: number) => {
    pagination.pageSize = pageSize;
    await fetchRoleList({ page: 1, size: pageSize });
  };

  // 搜索
  const search = async () => {
    await fetchRoleList({
      ...formModel.value,
    } as unknown as SysRoleParams);
  };

  // 重置
  const resetSelect = () => {
    formModel.value = generateFormModel();
  };

  // 重置状态
  const resetStatus = () => {
    formModel.value.status = undefined;
  };

  // 数据权限说明
  const dataScopeText = (ds: number) => {
    if (ds === 1) {
      return t('admin.role.columns.data_scope.1');
    }
    return t('admin.role.columns.data_scope.2');
  };

  // 重置表单
  const resetForm = (data: Record<any, any>) => {
    Object.keys(data).forEach((key) => {
      // @ts-ignore
      form[key] = data[key];
    });
  };

  // 全选/取消全选
  const checkMenu = () => {
    checkAll.value = !checkAll.value;
    menuTreeDataRef.value.checkAll(checkAll.value);
  };

  // 展开/收起
  const expand = () => {
    expandAll.value = !expandAll.value;
    menuTreeDataRef.value.expandAll(expandAll.value);
  };

  // 监听columns变化
  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SysRole',
  };
</script>

<style lang="less" scoped>
  .content {
    padding-top: 20px;
  }
</style>
