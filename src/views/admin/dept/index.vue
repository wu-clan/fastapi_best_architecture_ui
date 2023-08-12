<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.system'), $t('menu.system.sysDept')]" />
      <a-card :title="$t('menu.system.sysDept')" class="general-card">
        <a-row>
          <a-col :flex="62">
            <a-form
              :auto-label-width="true"
              :model="formModel"
              label-align="right"
            >
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item :label="$t('admin.dept.form.name')" field="name">
                    <a-input
                      v-model="formModel.name"
                      :placeholder="$t('admin.dept.form.name.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    :label="$t('admin.dept.form.leader')"
                    field="leader"
                  >
                    <a-input
                      v-model="formModel.leader"
                      :placeholder="$t('admin.dept.form.leader.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    :label="$t('admin.dept.form.phone')"
                    field="phone"
                  >
                    <a-input
                      v-model="formModel.phone"
                      :placeholder="$t('admin.dept.form.phone.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    :label="$t('admin.dept.form.status')"
                    field="status"
                  >
                    <a-select
                      v-model="formModel.status"
                      :options="statusOptions"
                      :placeholder="$t('admin.dept.form.selectDefault')"
                      allow-clear
                      @clear="resetStatus"
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
                {{ $t('admin.dept.form.search') }}
              </a-button>
              <a-button @click="resetSelect">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('admin.dept.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-divider />
        <a-space :size="'medium'">
          <a-button type="primary" @click="NewDept()">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('admin.dept.button.create') }}
          </a-button>
          <a-button @click="expand">
            {{ $t('admin.dept.button.collapse') }}
          </a-button>
        </a-space>
        <div class="content">
          <a-table
            ref="tableRef"
            :bordered="false"
            :columns="columns"
            :data="renderData"
            :loading="loading"
            :pagination="false"
            :size="'medium'"
            row-key="id"
          >
            <template #status="{ record }">
              <a-tag v-if="record.status === 1" :color="`green`" bordered>
                {{ $t(`admin.menu.form.status.${record.status}`) }}
              </a-tag>
              <a-tag v-else :color="`red`" bordered>
                {{ $t(`admin.menu.form.status.${record.status}`) }}
              </a-tag>
            </template>
            <template #operate="{ record }">
              <a-space>
                <a-link @click="NewDept(record.id)">
                  {{ $t(`admin.menu.columns.new`) }}
                </a-link>
                <a-link @click="EditDept(record.id)">
                  {{ $t(`admin.menu.columns.edit`) }}
                </a-link>
                <a-link :status="'danger'" @click="DeleteDept(record.id)">
                  {{ $t(`admin.menu.columns.delete`) }}
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
                :label="$t('admin.dept.columns.parent_name')"
                field="parent_id"
              >
                <a-tree-select
                  v-model="form.parent_id"
                  :allow-clear="true"
                  :allow-search="true"
                  :data="treeSelectData"
                  :field-names="selectTreeFieldNames"
                  :placeholder="$t('admin.dept.form.parent_name.placeholder')"
                ></a-tree-select>
              </a-form-item>
              <a-form-item
                :feedback="true"
                :label="$t('admin.dept.columns.name')"
                :rules="[
                  { required: true, message: $t('admin.dept.form.name.help') },
                ]"
                field="name"
              >
                <a-input
                  v-model="form.name"
                  :placeholder="$t('admin.dept.form.name.placeholder')"
                ></a-input>
              </a-form-item>
              <a-form-item
                :label="$t('admin.dept.columns.leader')"
                field="leader"
              >
                <a-input
                  v-model="form.leader"
                  :placeholder="$t('admin.dept.form.leader.placeholder')"
                ></a-input>
              </a-form-item>
              <a-form-item
                :label="$t('admin.dept.columns.phone')"
                field="phone"
              >
                <a-input
                  v-model="form.phone"
                  :placeholder="$t('admin.dept.form.phone.placeholder')"
                ></a-input>
              </a-form-item>
              <a-form-item
                :label="$t('admin.dept.columns.email')"
                field="email"
              >
                <a-input
                  v-model="form.email"
                  :placeholder="$t('admin.dept.form.email.placeholder')"
                  @blur="validateEmail"
                ></a-input>
              </a-form-item>
              <a-form-item
                :label="$t('admin.dept.columns.status')"
                :required="true"
                field="status"
              >
                <a-switch
                  v-model="switchStatus"
                  :checked-text="$t('switch.open')"
                  :unchecked-text="$t('switch.close')"
                />
              </a-form-item>
              <a-form-item :label="$t('admin.dept.columns.sort')" field="sort">
                <a-input-number
                  v-model="form.sort"
                  :default-value="0"
                  :mode="'button'"
                  :placeholder="$t('admin.dept.form.sort.placeholder')"
                  style="width: 35%"
                />
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
    TreeFieldNames,
  } from '@arco-design/web-vue';
  import { computed, reactive, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Footer from '@/components/footer/index.vue';
  import useLoading from '@/hooks/loading';
  import {
    createSysDept,
    deleteSysDept,
    querySysDeptDetail,
    querySysDeptTree,
    SysDeptReq,
    SysDeptTreeParams,
    SysDeptTreeRes,
    updateSysDept,
  } from '@/api/dept';
  import { treeSelectDataType } from '@/types/global';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  // 表单
  const generateFormModel = () => {
    return {
      name: undefined,
      leader: undefined,
      phone: undefined,
      status: undefined,
    };
  };
  const formModel = ref(generateFormModel());
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('admin.dept.form.status.1'),
      value: 1,
    },
    {
      label: t('admin.dept.form.status.0'),
      value: 0,
    },
  ]);

  // 表格
  const renderData = ref<SysDeptTreeRes[]>([]);
  const tableRef = ref();
  const expandAll = ref<boolean>(false);
  const operateRow = ref<number>(0);
  const NewDept = (pk?: number) => {
    buttonStatus.value = 'new';
    drawerTitle.value = t('admin.dept.columns.new.drawer');
    resetForm(formDefaultValues);
    switchStatus.value = true;
    form.parent_id = pk;
    openNewOrEdit.value = true;
  };
  const EditDept = async (pk: number) => {
    buttonStatus.value = 'edit';
    operateRow.value = pk;
    drawerTitle.value = t('admin.dept.columns.edit.drawer');
    await fetchDeptDetail(pk);
    openNewOrEdit.value = true;
  };
  const DeleteDept = (pk: number) => {
    operateRow.value = pk;
    drawerTitle.value = t('admin.dept.columns.delete.drawer');
    openDelete.value = true;
  };
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('admin.dept.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: t('admin.dept.columns.sort'),
      dataIndex: 'sort',
      slotName: 'sort',
      align: 'center',
    },
    {
      title: t('admin.dept.columns.leader'),
      dataIndex: 'leader',
      slotName: 'leader',
    },
    {
      title: t('admin.dept.columns.phone'),
      dataIndex: 'phone',
      slotName: 'phone',
    },
    {
      title: t('admin.dept.columns.email'),
      dataIndex: 'email',
      slotName: 'email',
    },
    {
      title: t('admin.dept.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
    },
    {
      title: t('admin.menu.columns.created_time'),
      dataIndex: 'created_time',
      slotName: 'created_time',
    },
    {
      title: t('admin.menu.columns.operate'),
      dataIndex: 'operate',
      slotName: 'operate',
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
  const formDefaultValues: SysDeptReq = {
    name: '',
    parent_id: undefined,
    leader: undefined,
    phone: undefined,
    email: undefined,
    status: 1,
    sort: undefined,
  };
  const form = reactive<SysDeptReq>({ ...formDefaultValues });
  const switchStatus = ref<boolean>(true);
  const treeSelectData = ref();
  const selectTreeFieldNames: TreeFieldNames = {
    key: 'id',
    title: 'name',
    children: 'children',
    icon: 'iconRender',
  };
  const buttonStatus = ref<string>();
  const formRef = ref();

  // 格式化邮箱
  const validateEmail = async () => {
    form.email = form.email?.length ? form.email : undefined;
  };

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
        await createSysDept(form);
        cancelReq();
        Message.success(t('submit.create.success'));
        await fetchDeptTree();
      } else {
        await updateSysDept(operateRow.value, form);
        cancelReq();
        Message.success(t('submit.update.success'));
        await fetchDeptTree();
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
      await deleteSysDept(operateRow.value);
      cancelReq();
      Message.success(t('submit.delete.success'));
      await fetchDeptTree();
    } catch (error) {
      openDelete.value = false;
      // console.log(error);
    } finally {
      openDelete.value = false;
      setLoading(false);
    }
  };

  // 请求部门树
  const fetchDeptTree = async (params: SysDeptTreeParams = {}) => {
    setLoading(true);
    try {
      const res = await querySysDeptTree(params);
      renderData.value = res;
      treeSelectData.value = transformDeptData(res);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  fetchDeptTree();

  // 请求部门详情
  const fetchDeptDetail = async (pk: number) => {
    setLoading(true);
    try {
      const res = await querySysDeptDetail(pk);
      resetForm(res);
      switchStatus.value = Boolean(res.status);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const search = async () => {
    await fetchDeptTree({
      ...formModel.value,
    } as unknown as SysDeptTreeParams);
  };

  // 重置
  const resetSelect = () => {
    formModel.value = generateFormModel();
  };

  // 重置状态
  const resetStatus = () => {
    formModel.value.status = undefined;
  };

  // 展开/收起
  const expand = () => {
    expandAll.value = !expandAll.value;
    tableRef.value?.expandAll(expandAll.value);
  };

  // 重置表单
  const resetForm = (data: Record<any, any>) => {
    Object.keys(data).forEach((key) => {
      // @ts-ignore
      form[key] = data[key];
    });
  };

  // 转换菜单数据结构
  const transformDeptData = (data: SysDeptTreeRes[]) => {
    const result: treeSelectDataType[] = [
      {
        id: null,
        name: '顶级',
        disabled: true,
        children: [],
      },
    ];
    data.forEach((item) => {
      result[0].children.push(item);
    });
    return result;
  };

  watch(
    () => switchStatus.value,
    (val) => {
      form.status = val ? 1 : 0;
    }
  );
</script>

<script lang="ts">
  export default {
    name: 'SysDept',
  };
</script>

<style lang="less" scoped>
  .content {
    padding-top: 20px;
  }
</style>
