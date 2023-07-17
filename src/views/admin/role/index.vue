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
                  <a-form-item
                    :label="$t('admin.role.form.title')"
                    field="name"
                  >
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
          </a-table>
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
  import { computed, reactive, watch } from 'vue/dist/vue';
  import { cloneDeep } from 'lodash';
  import { ref } from 'vue';
  import { SelectOptionData, TableColumnData } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { querySysRoleList, SysRoleParams, SysRoleRes } from '@/api/role';
  import { Pagination } from '@/types/global';

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
      label: t('admin.menu.form.status.1'),
      value: 1,
    },
    {
      label: t('admin.menu.form.status.0'),
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
  const NewRole = () => {
    drawerTitle.value = t('admin.role.columns.new.drawer');
  };
  const DeleteRole = () => {
    drawerTitle.value = t('admin.role.columns.delete.drawer');
    openDelete.value = true;
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
    },
    {
      title: t('admin.role.columns.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
    },
  ]);

  // 对话框
  const drawerTitle = ref<string>('');
  const openDelete = ref<boolean>(false);

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

<style lang="less" scoped></style>
