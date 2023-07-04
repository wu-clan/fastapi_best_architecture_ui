<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.system'), $t('menu.system.sysMenu')]" />
      <a-card :title="$t('menu.system.sysMenu')" class="general-card">
        <a-row>
          <a-col :span="12">
            <a-form
              :label-col-props="{ span: 6 }"
              :model="formModel"
              label-align="right"
              :auto-label-width="true"
            >
              <a-row>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('system.menu.form.name')"
                    field="name"
                  >
                    <a-input
                      v-model="formModel.title"
                      :placeholder="$t('system.menu.form.name.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('system.menu.form.status')"
                    field="status"
                  >
                    <a-select
                      v-model="formModel.status"
                      :options="statusOptions"
                      :placeholder="$t('system.menu.form.selectDefault')"
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
                {{ $t('system.menu.form.search') }}
              </a-button>
              <a-button @click="reset">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('system.menu.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-divider />
        <a-space :size="'medium'">
          <a-button type="primary" @click="NewMenu">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('system.menu.button.create') }}
          </a-button>
          <a-button @click="expand">
            {{ $t('system.menu.button.collapse') }}
          </a-button>
        </a-space>
        <div class="content">
          <a-table
            ref="tableRef"
            :bordered="false"
            :columns="(cloneColumns as TableColumnData[])"
            :data="renderData"
            :loading="loading"
            :size="size"
            row-key="id"
            :pagination="false"
          >
            <template #menu_type="{ record }">
              <a-tag v-if="record.menu_type === 0" :color="`orange`" bordered>
                {{ $t(`system.menu.columns.type.${record.menu_type}`) }}
              </a-tag>
              <a-tag
                v-else-if="record.menu_type === 1"
                :color="`purple`"
                bordered
              >
                {{ $t(`system.menu.columns.type.${record.menu_type}`) }}
              </a-tag>
              <a-tag v-else :color="`blue`" bordered>
                {{ $t(`system.menu.columns.type.${record.menu_type}`) }}
              </a-tag>
            </template>
            <template #icon="{ record }">
              <component :is="record.icon" :size="20"></component>
            </template>
            <template #show="{ record }">
              <a-badge v-if="record.show === 1" :status="'success'" />
              <a-badge v-else :status="'danger'" />
            </template>
            <template #status="{ record }">
              <a-tag v-if="record.status === 1" :color="`green`" bordered>
                {{ $t(`system.menu.form.status.${record.status}`) }}
              </a-tag>
              <a-tag v-else :color="`red`" bordered>
                {{ $t(`system.menu.form.status.${record.status}`) }}
              </a-tag>
            </template>
            <template #operate>
              <a-space>
                <a-link @click="NewMenu">
                  {{ $t(`system.menu.columns.new`) }}
                </a-link>
                <a-link @click="EditMenu">
                  {{ $t(`system.menu.columns.edit`) }}
                </a-link>
                <a-link :status="'danger'" @click="DeleteMenu">
                  {{ $t(`system.menu.columns.delete`) }}
                </a-link>
              </a-space>
            </template>
          </a-table>
        </div>
      </a-card>
    </a-layout>
  </div>
  <div class="content-drawer">
    <a-modal
      :visible="openNewOrEdit"
      :title="drawerTitle"
      :closable="false"
      :width="550"
      @ok="submitNewOrEdit"
      @cancel="cancelReq"
    >
      <a-form>
        <a-form-item :label="$t('system.menu.columns.type')" field="menu_type">
          <a-radio-group v-model:model-value="menuType">
            <a-radio :value="0">
              {{ $t('system.menu.columns.type.0') }}
            </a-radio>
            <a-radio :value="1" :default-checked="true">
              {{ $t('system.menu.columns.type.1') }}
            </a-radio>
            <a-radio :value="2">
              {{ $t('system.menu.columns.type.2') }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :label="$t('system.menu.columns.parent_name')"
          field="parent_id"
        >
          <a-select></a-select>
        </a-form-item>
        <a-form-item
          :label="$t('system.menu.columns.title')"
          field="title"
          :required="true"
        >
          <a-input></a-input>
        </a-form-item>
        <a-form-item
          v-if="menuType === 0 || menuType === 1"
          :label="$t('system.menu.columns.name')"
          field="name"
          :required="true"
        >
          <a-input></a-input>
        </a-form-item>
        <a-form-item
          v-if="menuType === 0 || menuType === 1"
          :label="$t('system.menu.columns.icon')"
          field="icon"
        >
          <a-select></a-select>
        </a-form-item>
        <a-form-item
          v-if="menuType === 0 || menuType === 1"
          :label="$t('system.menu.columns.path')"
          field="path"
        >
          <a-input></a-input>
        </a-form-item>
        <a-form-item
          v-if="menuType === 1"
          :label="$t('system.menu.columns.component')"
          field="component"
        >
          <a-input></a-input>
        </a-form-item>
        <a-form-item
          v-if="menuType === 1 || menuType === 2"
          :label="$t('system.menu.columns.perms')"
          field="perms"
        >
          <a-input></a-input>
        </a-form-item>
        <a-form-item :label="$t('system.menu.columns.remark')" field="remark">
          <a-textarea></a-textarea>
        </a-form-item>
        <a-form-item
          v-if="menuType === 1"
          :label="$t('system.menu.columns.cache')"
          field="cache"
          :required="true"
        >
          <a-switch />
        </a-form-item>
        <a-form-item
          v-if="menuType === 0 || menuType === 1"
          :label="$t('system.menu.columns.show')"
          field="show"
          :required="true"
        >
          <a-switch />
        </a-form-item>
        <a-form-item
          v-if="menuType === 0 || menuType === 1"
          :label="$t('system.menu.columns.status')"
          field="status"
          :required="true"
        >
          <a-switch />
        </a-form-item>
        <a-form-item
          :label="$t('system.menu.columns.sort')"
          field="sort"
          :required="true"
        >
          <a-input-number
            :placeholder="$t('system.menu.columns.sort')"
            :default-value="0"
            :mode="'button'"
            style="width: 35%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      :visible="openDelete"
      :title="`${$t('modal.title.tips')}`"
      :closable="false"
      :width="360"
      @ok="submitDelete"
      @cancel="cancelReq"
    >
      <a-space>
        <icon-exclamation-circle-fill size="24" style="color: #e6a23c" />
        {{ $t('modal.title.tips.delete') }}
      </a-space>
    </a-modal>
  </div>
  <div class="footer">
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';
  import { computed, ref, watch } from 'vue';
  import { SelectOptionData, TableColumnData } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    querySysMenuTree,
    SysMenuRecord,
    SysMenuTreeParams,
  } from '@/api/menu';
  import { cloneDeep } from 'lodash';

  type Column = TableColumnData & { checked?: true };
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  // 表单
  const generateFormModel = () => {
    return {
      title: undefined,
      status: undefined,
    };
  };
  const formModel = ref(generateFormModel());
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('system.menu.form.status.1'),
      value: 1,
    },
    {
      label: t('system.menu.form.status.0'),
      value: 0,
    },
  ]);

  // 表格
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const renderData = ref<SysMenuRecord[]>([]);
  const size = ref<SizeProps>('medium');
  const tableRef = ref();
  const expandAll = ref<boolean>(false);
  const NewMenu = () => {
    drawerTitle.value = t('system.menu.columns.new.drawer');
    openNewOrEdit.value = true;
  };
  const EditMenu = () => {
    drawerTitle.value = t('system.menu.columns.edit.drawer');
    openNewOrEdit.value = true;
  };
  const DeleteMenu = () => {
    drawerTitle.value = t('system.menu.columns.delete.drawer');
    openDelete.value = true;
  };
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('system.menu.columns.title'),
      dataIndex: 'title',
      slotName: 'title',
    },
    {
      title: t('system.menu.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: t('system.menu.columns.type'),
      dataIndex: 'menu_type',
      slotName: 'menu_type',
    },
    {
      title: t('system.menu.columns.icon'),
      dataIndex: 'icon',
      slotName: 'icon',
      align: 'center',
    },
    {
      title: t('system.menu.columns.perms'),
      dataIndex: 'perms',
      slotName: 'perms',
    },
    {
      title: t('system.menu.columns.sort'),
      dataIndex: 'sort',
      slotName: 'sort',
    },
    {
      title: t('system.menu.columns.show'),
      dataIndex: 'show',
      slotName: 'show',
      align: 'center',
    },
    {
      title: t('system.menu.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('system.menu.columns.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
    },
    {
      title: t('system.menu.columns.created_time'),
      dataIndex: 'created_time',
      slotName: 'created_time',
    },
    {
      title: t('system.menu.columns.operate'),
      dataIndex: 'operate',
      slotName: 'operate',
    },
  ]);

  // 对话框
  const openNewOrEdit = ref<boolean>(false);
  const openDelete = ref<boolean>(false);
  const drawerTitle = ref<string>('');
  const submitNewOrEdit = ref<() => void>(() => {});
  const submitDelete = ref<() => void>(() => {});
  const cancelReq = () => {
    openNewOrEdit.value = false;
    openDelete.value = false;
  };
  const menuType = ref<number>(1);

  // 请求数据
  const fetchData = async (params: SysMenuTreeParams = {}) => {
    setLoading(true);
    try {
      renderData.value = await querySysMenuTree(params);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  // 事件: 搜索
  const search = () => {
    fetchData({
      ...formModel.value,
    } as unknown as SysMenuTreeParams);
  };

  // 事件: 重置
  const reset = () => {
    formModel.value = generateFormModel();
  };

  // 事件: 重置状态
  const resetStatus = () => {
    formModel.value.status = undefined;
  };

  // 展开/收起
  const expand = () => {
    expandAll.value = !expandAll.value;
    tableRef.value.expandAll(expandAll.value);
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
    name: 'SysMenu',
  };
</script>

<style lang="less" scoped>
  .content {
    padding-top: 20px;
  }
</style>
