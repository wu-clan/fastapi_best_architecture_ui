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
                      v-model="formModel.name"
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
          <a-button type="primary">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('system.menu.button.create') }}
          </a-button>
          <a-button> {{ $t('system.menu.button.collapse') }}</a-button>
        </a-space>
        <div class="content">
          <a-table
            :bordered="false"
            :columns="(cloneColumns as TableColumnData[])"
            :data="renderData"
            :loading="loading"
            :size="size"
            row-key="id"
            :pagination="false"
          >
            <template #icon="{ record }">
              <component :is="record.icon" :size="20"></component>
            </template>
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
            <template #show="{ record }">
              <a-badge v-if="record.status === 1" :status="'success'" />
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
                <a-link>{{ $t(`system.menu.columns.new`) }}</a-link>
                <a-link>{{ $t(`system.menu.columns.edit`) }}</a-link>
                <a-link :status="'danger'">{{
                  $t(`system.menu.columns.delete`)
                }}</a-link>
              </a-space>
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
  const generateFormModel = () => {
    return {
      title: undefined,
      status: undefined,
    };
  };
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const renderData = ref<SysMenuRecord[]>([]);
  const size = ref<SizeProps>('medium');
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
