<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.system'), $t('menu.system.sysApi')]" />
      <a-card :title="$t('menu.system.sysApi')" class="general-card">
        <a-row>
          <a-col :flex="62">
            <a-form
              :auto-label-width="true"
              :model="formModel"
              label-align="right"
            >
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item :label="$t('admin.api.form.name')" field="name">
                    <a-input
                      v-model="formModel.name"
                      :placeholder="$t('admin.api.form.name.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="$t('admin.api.form.path')" field="path">
                    <a-input
                      v-model="formModel.path"
                      :placeholder="$t('admin.api.form.path.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :label="$t('admin.api.form.method')"
                    field="method"
                  >
                    <a-select
                      v-model="formModel.method"
                      :allow-clear="true"
                      :on-clear="resetMethod"
                      :options="selectMethodOptions"
                      :placeholder="$t('admin.api.form.method.placeholder')"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider direction="vertical" style="height: 30px" />
          <a-col :span="6">
            <a-space :size="'medium'" direction="horizontal">
              <a-button type="primary" @click="search">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('admin.api.form.search') }}
              </a-button>
              <a-button @click="resetSelect">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('admin.api.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-divider />
        <a-space :size="'medium'">
          <a-button type="primary" @click="NewApi()">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('admin.api.button.create') }}
          </a-button>
          <a-button
            :disabled="deleteButtonStatus()"
            status="danger"
            @click="DeleteApi"
          >
            <template #icon>
              <icon-minus />
            </template>
            {{ $t('admin.api.button.delete') }}
          </a-button>
        </a-space>
        <div class="content">
          <a-table
            v-model:selected-keys="rowSelectKeys"
            :bordered="false"
            :columns="columns"
            :data="renderData"
            :loading="loading"
            :pagination="pagination"
            :row-selection="rowSelection"
            :size="'medium'"
            row-key="id"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
          >
            <template #index="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
            <template #method="{ record }">
              <a-tag
                v-if="record.method === 'GET'"
                :color="`arcoblue`"
                bordered
              >
                {{ record.method }}
              </a-tag>
              <a-tag
                v-else-if="record.method === 'POST'"
                :color="`green`"
                bordered
              >
                {{ record.method }}
              </a-tag>
              <a-tag
                v-else-if="record.method === 'DELETE'"
                :color="`red`"
                bordered
              >
                {{ record.method }}
              </a-tag>
              <a-tag v-else :color="`cyan`" bordered>
                {{ record.method }}
              </a-tag>
            </template>
            <template #operate="{ record }">
              <a-space>
                <a-link @click="EditApi(record.id)">
                  {{ $t(`admin.api.columns.edit`) }}
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
                :feedback="true"
                :label="$t('admin.api.columns.name')"
                :rules="[
                  { required: true, message: $t('admin.api.form.name.help') },
                ]"
                field="name"
              >
                <a-input
                  v-model="form.name"
                  :placeholder="$t('admin.api.form.name.placeholder')"
                ></a-input>
              </a-form-item>
              <a-form-item
                :feedback="true"
                :label="$t('admin.api.columns.path')"
                :rules="[
                  { required: true, message: $t('admin.api.form.path.help') },
                ]"
                field="path"
              >
                <a-input
                  v-model="form.path"
                  :placeholder="$t('admin.api.form.path.placeholder')"
                ></a-input>
              </a-form-item>
              <a-form-item
                :feedback="true"
                :label="$t('admin.api.columns.method')"
                :rules="[
                  { required: true, message: $t('admin.api.form.method.help') },
                ]"
                field="method"
              >
                <a-select
                  v-model="form.method"
                  :allow-clear="true"
                  :on-clear="resetMethod"
                  :options="selectMethodOptions"
                  :placeholder="$t('admin.api.form.method.help')"
                />
              </a-form-item>
              <a-form-item
                :label="$t('admin.api.columns.remark')"
                field="remark"
              >
                <a-textarea
                  v-model="form.remark"
                  :placeholder="$t('admin.api.form.remark.placeholder')"
                ></a-textarea>
              </a-form-item>
            </a-form>
          </a-modal>
          <a-modal
            :closable="false"
            :title="`${$t('modal.title.tips')}`"
            :visible="openDelete"
            :width="360"
            @cancel="cancelReq"
            @ok="submitDelete"
          >
            <a-space>
              <icon-exclamation-circle-fill size="24" style="color: #e6a23c" />
              {{ $t('modal.title.tips.delete') }}
            </a-space>
          </a-modal>
        </div>
      </a-card>
    </a-layout>
  </div>
  <div class="footer">
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  import {
    Message,
    SelectOptionData,
    TableColumnData,
  } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { computed, reactive, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import Footer from '@/components/footer/index.vue';
  import {
    createSysApi,
    deleteSysApi,
    querySysApiDetail,
    querySysApiList,
    SysApiParams,
    SysApiReq,
    SysApiRes,
    updateSysApi,
  } from '@/api/api';
  import { Pagination } from '@/types/global';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  // 表单
  const generateFormModel = () => {
    return {
      name: undefined,
      path: undefined,
      method: undefined,
    };
  };
  const formModel = ref(generateFormModel());
  const selectMethodOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'GET',
      value: 'GET',
    },
    {
      label: 'POST',
      value: 'POST',
    },
    {
      label: 'PUT',
      value: 'PUT',
    },
    {
      label: 'DELETE',
      value: 'DELETE',
    },
  ]);
  // 表格
  const renderData = ref<SysApiRes[]>([]);
  const operateRow = ref<number>(0);
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
  const NewApi = () => {
    buttonStatus.value = 'new';
    drawerTitle.value = t('admin.api.columns.new.drawer');
    resetForm(formDefaultValues);
    openNewOrEdit.value = true;
  };
  const EditApi = async (pk: number) => {
    buttonStatus.value = 'edit';
    operateRow.value = pk;
    drawerTitle.value = t('admin.api.columns.edit.drawer');
    await fetchApiDetail(pk);
    openNewOrEdit.value = true;
  };
  const DeleteApi = () => {
    drawerTitle.value = t('admin.api.columns.delete.drawer');
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
      title: t('admin.api.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: t('admin.api.columns.method'),
      dataIndex: 'method',
      slotName: 'method',
    },
    {
      title: t('admin.api.columns.path'),
      dataIndex: 'path',
      slotName: 'path',
    },
    {
      title: t('admin.api.columns.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: t('admin.api.columns.operate'),
      dataIndex: 'operate',
      slotName: 'operate',
      align: 'center',
    },
  ]);

  // 对话框
  const openNewOrEdit = ref<boolean>(false);
  const openDelete = ref<boolean>(false);
  const drawerTitle = ref<string>('');
  const cancelReq = () => {
    openNewOrEdit.value = false;
    openDelete.value = false;
  };
  const formDefaultValues: SysApiReq = {
    name: '',
    method: '',
    path: '',
    remark: undefined,
  };
  const form = reactive<SysApiReq>({ ...formDefaultValues });
  const buttonStatus = ref<string>();
  const formRef = ref();

  // 表单校验
  const beforeSubmit = async (done: any) => {
    const res = await formRef.value?.validate();
    if (!res) {
      // 关闭对话框
      done(true);
    }
    done(false);
  };

  // 提交按钮
  const submitNewOrEdit = async () => {
    setLoading(true);
    try {
      if (buttonStatus.value === 'new') {
        await createSysApi(form);
        cancelReq();
        Message.success(t('submit.create.success'));
        await fetchApiList();
      } else {
        await updateSysApi(operateRow.value, form);
        cancelReq();
        Message.success(t('submit.update.success'));
        await fetchApiList();
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 删除按钮状态
  const deleteButtonStatus = () => {
    return rowSelectKeys.value?.length === 0;
  };

  // 删除按钮
  const submitDelete = async () => {
    setLoading(true);
    try {
      await deleteSysApi({ pk: rowSelectKeys.value });
      cancelReq();
      Message.success(t('submit.delete.success'));
      await fetchApiList();
      rowSelectKeys.value = [];
    } catch (error) {
      openDelete.value = false;
      // console.log(error);
    } finally {
      openDelete.value = false;
      setLoading(false);
    }
  };

  // 请求API列表
  const fetchApiList = async (params: SysApiParams = {}) => {
    setLoading(true);
    try {
      const res = await querySysApiList(params);
      renderData.value = res.items;
      pagination.total = res.total;
      pagination.current = params.page;
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  fetchApiList();

  // 请求部门详情
  const fetchApiDetail = async (pk: number) => {
    setLoading(true);
    try {
      const res = await querySysApiDetail(pk);
      resetForm(res);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 事件: 分页
  const onPageChange = async (current: number) => {
    await fetchApiList({ page: current, size: pagination.pageSize });
  };

  // 事件: 分页大小
  const onPageSizeChange = async (pageSize: number) => {
    pagination.pageSize = pageSize;
    await fetchApiList({ page: 1, size: pageSize });
  };

  // 搜索
  const search = async () => {
    await fetchApiList({
      ...formModel.value,
    } as unknown as SysApiParams);
  };

  // 重置
  const resetSelect = () => {
    formModel.value = generateFormModel();
  };

  // 重置方法
  const resetMethod = () => {
    formModel.value.method = undefined;
  };

  // 重置表单
  const resetForm = (data: Record<any, any>) => {
    Object.keys(data).forEach((key) => {
      // @ts-ignore
      form[key] = data[key];
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'SysApi',
  };
</script>

<style lang="less" scoped>
  .content {
    padding-top: 20px;
  }
</style>
