<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.admin'), $t('menu.admin.sysDataRule')]" />
      <a-card :title="$t('menu.admin.sysDataRule')" class="general-card">
        <a-row>
          <a-col :span="6">
            <a-form
              :auto-label-width="true"
              :label-col-props="{ span: 6 }"
              :model="formModel"
              label-align="right"
            >
              <a-row>
                <a-col :span="24">
                  <a-form-item
                    :label="$t('admin.data-rule.form.name')"
                    field="name"
                  >
                    <a-input
                      v-model="formModel.name"
                      :placeholder="$t('admin.data-rule.form.name.placeholder')"
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
                {{ $t('admin.data-rule.form.search') }}
              </a-button>
              <a-button @click="resetSelect">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('admin.data-rule.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-divider />
        <a-space :size="'medium'" style="margin-bottom: 20px">
          <a-button type="primary" @click="newDataRule">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('admin.data-rule.button.create') }}
          </a-button>
          <a-button
            status="danger"
            :disabled="deleteButtonStatus()"
            @click="DeleteDataRule"
          >
            <template #icon>
              <icon-minus />
            </template>
            {{ $t('admin.data-rule.button.delete') }}
          </a-button>
        </a-space>
        <div class="content">
          <a-table
            v-model:selected-keys="rowSelectKeys"
            row-key="id"
            :size="'medium'"
            :columns="columns"
            :data="renderData"
            :bordered="false"
            :pagination="pagination"
            :row-selection="rowSelection"
            :loading="loading"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
          >
            <template #index="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
            <template #operator="{ record }">
              <p v-if="record.operator === 0"> AND </p>
              <p v-else> OR </p>
            </template>
            <template #expression="{ record }">
              <p v-if="record.expression === 0"> == </p>
              <p v-else-if="record.expression === 1"> &ne; </p>
              <p v-else-if="record.expression === 2"> &gt; </p>
              <p v-else-if="record.expression === 3"> &ge; </p>
              <p v-else-if="record.expression === 4"> &lt; </p>
              <p v-else-if="record.expression === 5"> &le; </p>
              <p v-else-if="record.expression === 6"> in </p>
              <p v-else> not_in </p>
            </template>
            <template #operate="{ record }">
              <a-space>
                <a-link @click="EditDataRule(record.id)">
                  {{ $t(`admin.data-rule.columns.edit`) }}
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
            @cancel="cancelReq"
            @ok="submitNewOrEdit"
          >
            <a-form ref="formRef" :model="form">
              <a-form-item
                :feedback="true"
                :label="$t('admin.data-rule.columns.name')"
                :rules="[
                  {
                    required: true,
                    message: $t('admin.data-rule.form.name.help'),
                  },
                ]"
                field="name"
              >
                <a-input
                  v-model="form.name"
                  :placeholder="$t('admin.data-rule.form.name.placeholder')"
                ></a-input>
              </a-form-item>
              <a-form-item
                :feedback="false"
                :label="$t('admin.data-rule.columns.model')"
                :rules="[
                  {
                    required: true,
                    message: $t('admin.data-rule.form.model.help'),
                  },
                ]"
                field="model"
              >
                <a-select
                  v-model="form.model"
                  :options="modelOptions"
                  :placeholder="$t('admin.data-rule.form.model.placeholder')"
                  @click="fetchDataRuleModel"
                ></a-select>
              </a-form-item>
              <a-form-item
                :feedback="false"
                :label="$t('admin.data-rule.columns.column')"
                :rules="[
                  {
                    required: true,
                    message: $t('admin.data-rule.form.column.help'),
                  },
                ]"
                field="column"
              >
                <a-select
                  v-model="form.column"
                  :options="columnOptions"
                  :disabled="columnSelectStatus"
                  :placeholder="$t('admin.data-rule.form.column.placeholder')"
                  @click="fetchDataRuleColumn"
                ></a-select>
              </a-form-item>
              <a-form-item
                :feedback="false"
                :label="$t('admin.data-rule.columns.operator')"
                :rules="[
                  {
                    required: true,
                  },
                ]"
                field="operator"
              >
                <a-select
                  v-model="form.operator"
                  :options="operatorOptions"
                ></a-select>
              </a-form-item>
              <a-form-item
                :feedback="false"
                :label="$t('admin.data-rule.columns.expression')"
                :rules="[
                  {
                    required: true,
                  },
                ]"
                field="expression"
              >
                <a-select
                  v-model="form.expression"
                  :options="expressionOptions"
                ></a-select>
              </a-form-item>
              <a-form-item
                :feedback="false"
                :label="$t('admin.data-rule.columns.value')"
                :rules="[
                  {
                    required: true,
                    message: $t('admin.data-rule.form.value.help'),
                  },
                ]"
                field="value"
              >
                <a-input
                  v-model="form.value"
                  :placeholder="$t('admin.data-rule.form.value.placeholder')"
                ></a-input>
              </a-form-item>
            </a-form>
          </a-modal>
          <a-modal
            :closable="false"
            :title="$t('modal.title.tips')"
            :width="380"
            :visible="openDelete"
            @click="cancelReq"
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
  import Footer from '@/components/footer/index.vue';
  import Breadcrumb from '@/components/breadcrumb/index.vue';
  import { computed, reactive, ref, watch } from 'vue';
  import { Pagination } from '@/types/global';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    createSysDataRule,
    deleteSysDataRule,
    querySysDataRuleColumns,
    querySysDataRuleDetail,
    querySysDataRuleList,
    querySysDataRuleModels,
    SysDataRuleParams,
    SysDataRuleReq,
    SysDataRuleRes,
    updateSysDataRule,
  } from '@/api/data-rule';
  import { Message, TableColumnData } from '@arco-design/web-vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  // 表单
  const generateFormModel = () => {
    return {
      name: undefined,
    };
  };
  const formModel = ref(generateFormModel());

  // 表格
  const renderData = ref<SysDataRuleRes[]>([]);
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
  const newDataRule = () => {
    buttonStatus.value = 'new';
    drawerTitle.value = t('admin.data-rule.columns.new.drawer');
    resetForm(formDefaultValues);
    openNewOrEdit.value = true;
    columnSelectStatus.value = true;
  };
  const EditDataRule = async (pk: number) => {
    buttonStatus.value = 'edit';
    operateRow.value = pk;
    drawerTitle.value = t('admin.data-rule.columns.edit.drawer');
    await fetchDataRuleDetail(pk);
    openNewOrEdit.value = true;
  };
  const DeleteDataRule = () => {
    drawerTitle.value = t('admin.data-rule.columns.delete.drawer');
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
      title: t('admin.data-rule.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
      ellipsis: true,
      tooltip: true,
      width: 350,
    },
    {
      title: t('admin.data-rule.columns.model'),
      dataIndex: 'model',
      slotName: 'model',
    },
    {
      title: t('admin.data-rule.columns.column'),
      dataIndex: 'column',
      slotName: 'column',
    },
    {
      title: t('admin.data-rule.columns.operator'),
      dataIndex: 'operator',
      slotName: 'operator',
      align: 'center',
    },
    {
      title: t('admin.data-rule.columns.expression'),
      dataIndex: 'expression',
      slotName: 'expression',
      align: 'center',
    },
    {
      title: t('admin.data-rule.columns.value'),
      dataIndex: 'value',
      slotName: 'value',
    },
    {
      title: t('admin.data-rule.columns.operate'),
      dataIndex: 'operate',
      slotName: 'operate',
      align: 'center',
    },
  ]);

  // 对话框
  const openNewOrEdit = ref<boolean>(false);
  const openDelete = ref<boolean>(false);
  const buttonStatus = ref<string>();
  const drawerTitle = ref<string>('');
  const cancelReq = () => {
    openNewOrEdit.value = false;
    openDelete.value = false;
  };
  const formDefaultValues: SysDataRuleReq = {
    name: '',
    model: '',
    column: '',
    operator: 1,
    expression: 0,
    value: '',
  };
  const form = reactive<SysDataRuleReq>({ ...formDefaultValues });
  const formRef = ref();
  const modelOptions = ref<string[]>();
  const columnOptions = ref<string[]>();
  const columnSelectStatus = ref<boolean>(true);
  const operatorOptions = reactive([
    {
      value: 0,
      label: 'AND',
    },
    {
      value: 1,
      label: 'OR',
    },
  ]);
  const expressionOptions = reactive([
    {
      value: 0,
      label: '==',
    },
    {
      value: 1,
      label: '!=',
    },
    {
      value: 2,
      label: '>',
    },
    {
      value: 3,
      label: '>=',
    },
    {
      value: 4,
      label: '<',
    },
    {
      value: 5,
      label: '<=',
    },
    {
      value: 6,
      label: 'in',
    },
    {
      value: 7,
      label: 'not_in',
    },
  ]);

  // 请求 model
  const fetchDataRuleModel = async () => {
    try {
      modelOptions.value = await querySysDataRuleModels();
    } catch (error) {
      // console.log(error)
    }
  };

  // 请求 column
  const fetchDataRuleColumn = async () => {
    try {
      columnOptions.value = await querySysDataRuleColumns(form.model);
    } catch (error) {
      // console.log(error)
    }
  };

  // 请求数据规则详情
  const fetchDataRuleDetail = async (pk: number) => {
    try {
      const res = await querySysDataRuleDetail(pk);
      resetForm(res);
    } catch (error) {
      // console.log(error)
    }
  };

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
        await createSysDataRule(form);
        cancelReq();
        Message.success(t('submit.create.success'));
        await fetchDataRuleList();
      } else {
        await updateSysDataRule(operateRow.value, form);
        cancelReq();
        Message.success(t('submit.update.success'));
        await fetchDataRuleList();
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 删除按钮
  const submitDelete = async () => {
    setLoading(true);
    try {
      await deleteSysDataRule({ pk: rowSelectKeys.value });
      cancelReq();
      Message.success(t('submit.delete.success'));
      await fetchDataRuleList();
      rowSelectKeys.value = [];
    } catch (error) {
      openDelete.value = false;
      // console.log(error);
    } finally {
      openDelete.value = false;
      setLoading(false);
    }
  };
  // 请求数据规则列表
  const fetchDataRuleList = async (params: SysDataRuleParams = {}) => {
    setLoading(true);
    try {
      const res = await querySysDataRuleList(params);
      renderData.value = res.items;
      pagination.total = res.total;
      pagination.current = params.page;
    } catch (error) {
      // console.log(error)
    } finally {
      setLoading(false);
    }
  };
  fetchDataRuleList();

  // 删除按钮状态
  const deleteButtonStatus = () => {
    return rowSelectKeys.value?.length === 0;
  };

  // 事件: 分页
  const onPageChange = async (current: number) => {
    await fetchDataRuleList({ page: current, size: pagination.pageSize });
  };

  // 事件: 分页大小
  const onPageSizeChange = async (pageSize: number) => {
    pagination.pageSize = pageSize;
    await fetchDataRuleList({ page: 1, size: pageSize });
  };

  // 搜索
  const search = async () => {
    await fetchDataRuleList({
      ...formModel.value,
    } as unknown as SysDataRuleParams);
  };

  // 重置
  const resetSelect = () => {
    formModel.value = generateFormModel();
  };

  // 重置表单
  const resetForm = (data: Record<any, any>) => {
    Object.keys(data).forEach((key) => {
      // @ts-ignore
      form[key] = data[key];
    });
  };

  watch(
    () => form.model,
    (val) => {
      if (val.length > 0) {
        columnSelectStatus.value = false;
      }
    }
  );
</script>

<script lang="ts">
  export default {
    name: 'SysDataRule',
  };
</script>

<style scoped lang="less"></style>
