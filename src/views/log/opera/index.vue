<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.log'), $t('menu.log.opera')]" />
      <a-card :title="$t('menu.log.opera')" class="general-card">
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
                    :label="$t('log.opera.form.username')"
                    field="username"
                  >
                    <a-input
                      v-model="formModel.username"
                      :placeholder="$t('log.opera.form.username.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="$t('log.opera.form.ip')" field="ip">
                    <a-input
                      v-model="formModel.ip"
                      :placeholder="$t('log.opera.form.ip.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :label="$t('log.opera.form.status')"
                    field="status"
                  >
                    <a-select
                      v-model="formModel.status"
                      :options="statusOptions"
                      :placeholder="$t('log.opera.form.selectDefault')"
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
                {{ $t('log.opera.form.search') }}
              </a-button>
              <a-button @click="reset">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('log.opera.form.reset') }}
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
                :color="`magenta`"
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
            <template #code="{ record }">
              <a-tag v-if="record.code == 200" :color="`green`" bordered>
                {{ record.code }}
              </a-tag>
              <a-tag v-else :color="`orange`" bordered>
                {{ record.code }}
              </a-tag>
            </template>
            <template #status="{ record }">
              <a-tag v-if="record.status === 1" :color="`green`" bordered>
                {{ $t(`log.opera.form.status.${record.status}`) }}
              </a-tag>
              <a-tag v-else :color="`red`" bordered>
                {{ $t(`log.opera.form.status.${record.status}`) }}
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
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import Footer from '@/components/footer/index.vue';
  import { OperaLogParams, OperaLogRes, queryOperaLogList } from '@/api/log';

  const generateFormModel = () => {
    return {
      username: undefined,
      ip: undefined,
      status: undefined,
    };
  };

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<OperaLogRes[]>([]);
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
      title: t('log.opera.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      ellipsis: true,
      tooltip: true,
      width: 50,
    },
    {
      title: t('log.opera.columns.username'),
      dataIndex: 'username',
      slotName: 'username',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: t('log.opera.columns.method'),
      dataIndex: 'method',
      slotName: 'method',
      align: 'center',
      width: 100,
    },
    {
      title: t('log.opera.columns.title'),
      dataIndex: 'title',
      slotName: 'title',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: t('log.opera.columns.path'),
      dataIndex: 'path',
      slotName: 'path',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: t('log.opera.columns.code'),
      dataIndex: 'code',
      slotName: 'code',
      align: 'center',
      width: 100,
    },
    {
      title: t('log.opera.columns.ip'),
      dataIndex: 'ip',
      slotName: 'ip',
      width: 120,
    },
    {
      title: t('log.opera.columns.city'),
      dataIndex: 'city',
      slotName: 'city',
      width: 100,
    },
    {
      title: t('log.opera.columns.browser'),
      dataIndex: 'browser',
      slotName: 'browser',
      width: 150,
    },
    {
      title: t('log.opera.columns.device'),
      dataIndex: 'device',
      slotName: 'device',
      align: 'center',
      width: 100,
    },
    {
      title: t('log.opera.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 100,
    },
    {
      title: t('log.opera.columns.msg'),
      dataIndex: 'msg',
      slotName: 'msg',
      ellipsis: true,
      tooltip: true,
      width: 160,
    },
    {
      title: t('log.opera.columns.args'),
      dataIndex: 'args',
      slotName: 'args',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: t('log.opera.columns.cost_time'),
      dataIndex: 'cost_time',
      slotName: 'cost_time',
      width: 100,
    },
    {
      title: t('log.opera.columns.opera_time'),
      dataIndex: 'opera_time',
      slotName: 'opera_time',
      width: 180,
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('log.opera.form.status.1'),
      value: 1,
    },
    {
      label: t('log.opera.form.status.0'),
      value: 0,
    },
  ]);

  // 请求数据
  const fetchData = async (params: OperaLogParams = { page: 1, size: 20 }) => {
    setLoading(true);
    try {
      const data = await queryOperaLogList(params);
      if (data.items.length !== 0) {
        data.items.forEach((item) => {
          if (item?.args) {
            try {
              item.args = JSON.stringify(item.args, null, 2);
            } catch (error) {
              // console.log(error);
            }
          }
        });
      }
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
    } as unknown as OperaLogParams);
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
    name: 'Opera',
  };
</script>

<style lang="less" scoped></style>
