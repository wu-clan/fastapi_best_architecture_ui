<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.log'), $t('menu.log.login')]" />
      <a-card :title="$t('menu.log.login')" class="general-card">
        <a-row>
          <a-col :flex="62">
            <a-form
              :label-col-props="{ span: 6 }"
              :model="formModel"
              label-align="right"
              :auto-label-width="true"
            >
              <a-row>
                <a-col :span="8">
                  <a-form-item
                    :label="$t('log.login.form.username')"
                    field="username"
                  >
                    <a-input
                      v-model="formModel.username"
                      :placeholder="$t('log.login.form.username.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="$t('log.login.form.ip')" field="ip">
                    <a-input
                      v-model="formModel.ip"
                      :placeholder="$t('log.login.form.ip.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :label="$t('log.login.form.status')"
                    field="status"
                  >
                    <a-select
                      v-model="formModel.status"
                      :options="statusOptions"
                      :placeholder="$t('log.login.form.selectDefault')"
                      allow-clear
                      @clear="resetStatus"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider direction="vertical" style="height: 30px" />
          <a-col :flex="8">
            <a-space :size="'medium'" direction="horizontal">
              <a-button type="primary" @click="search">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('log.login.form.search') }}
              </a-button>
              <a-button @click="reset">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('log.login.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-divider />
        <div class="content">
          <a-table
            :bordered="false"
            :columns="columns"
            :data="renderData"
            :loading="loading"
            :pagination="pagination"
            :size="'medium'"
            row-key="id"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
          >
            <template #index="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
            <template #status="{ record }">
              <a-tag v-if="record.status === 1" :color="`green`" bordered>
                {{ $t(`log.login.form.status.${record.status}`) }}
              </a-tag>
              <a-tag v-else :color="`red`" bordered>
                {{ $t(`log.login.form.status.${record.status}`) }}
              </a-tag>
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
  import { computed, reactive, ref } from 'vue';
  import { SelectOptionData, TableColumnData } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { LoginLogParams, LoginLogRes, queryLoginLogList } from '@/api/log';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import Footer from '@/components/footer/index.vue';

  const generateFormModel = () => {
    return {
      username: undefined,
      ip: undefined,
      status: undefined,
    };
  };

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<LoginLogRes[]>([]);
  const formModel = ref(generateFormModel());
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
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('log.login.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('log.login.columns.username'),
      dataIndex: 'username',
      slotName: 'username',
    },
    {
      title: t('log.login.columns.ip'),
      dataIndex: 'ip',
      slotName: 'ip',
    },
    {
      title: t('log.login.columns.browser'),
      dataIndex: 'browser',
      slotName: 'browser',
    },
    {
      title: t('log.login.columns.device'),
      dataIndex: 'device',
      slotName: 'device',
    },
    {
      title: t('log.login.columns.city'),
      dataIndex: 'city',
      slotName: 'city',
    },
    {
      title: t('log.login.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('log.login.columns.msg'),
      dataIndex: 'msg',
      slotName: 'msg',
    },
    {
      title: t('log.login.columns.login_time'),
      dataIndex: 'created_time',
      slotName: 'created_time',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('log.login.form.status.1'),
      value: 1,
    },
    {
      label: t('log.login.form.status.0'),
      value: 0,
    },
  ]);

  // 请求数据
  const fetchData = async (params: LoginLogParams = { page: 1, size: 20 }) => {
    setLoading(true);
    try {
      const data = await queryLoginLogList(params);
      renderData.value = data.items;
      pagination.total = data.total;
      pagination.current = params.page;
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  // 事件: 分页
  const onPageChange = async (current: number) => {
    await fetchData({ page: current, size: pagination.pageSize });
  };

  // 事件: 分页大小
  const onPageSizeChange = async (pageSize: number) => {
    pagination.pageSize = pageSize;
    await fetchData({ page: 1, size: pageSize });
  };

  // 事件: 搜索
  const search = async () => {
    await fetchData({
      ...formModel.value,
    } as unknown as LoginLogParams);
  };

  // 事件: 重置
  const reset = () => {
    formModel.value = generateFormModel();
  };

  // 事件: 重置状态
  const resetStatus = () => {
    formModel.value.status = undefined;
  };
</script>

<script lang="ts">
  export default {
    name: 'Login',
  };
</script>

<style lang="less" scoped></style>
