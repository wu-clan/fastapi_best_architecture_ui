<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.monitor'), $t('menu.monitor.server')]" />
      <a-card :title="$t('menu.monitor.server')" class="general-card">
        <div class="content">
          <a-row :gutter="20">
            <a-col :span="12">
              <a-card :loading="loading" class="info-card" title="CPU">
                <a-space :size="60">
                  <template #split>
                    <a-divider direction="vertical" />
                  </template>
                  <a-statistic
                    :animation="true"
                    :extra="$t('menu.monitor.server.cpu.usage')"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :value="cpuData.usage"
                    :value-style="usageStyle('cpu')"
                  >
                    <template #suffix> %</template>
                  </a-statistic>
                  <a-statistic
                    :animation="true"
                    :extra="$t('menu.monitor.server.cpu.current-frequency')"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :value="cpuData.current_freq"
                  >
                    <template #suffix> MHz</template>
                  </a-statistic>
                  <a-statistic
                    :animation="true"
                    :extra="$t('menu.monitor.server.cpu.logical-cores')"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :value="cpuData.logical_num"
                  />
                  <a-statistic
                    :animation="true"
                    :extra="$t('menu.monitor.server.cpu.physical-cores')"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :value="cpuData.physical_num"
                  />
                </a-space>
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card
                :loading="loading"
                :title="$t('menu.monitor.server.memory')"
                class="info-card"
              >
                <a-space :size="60">
                  <template #split>
                    <a-divider direction="vertical" />
                  </template>
                  <a-statistic
                    :animation="true"
                    :extra="$t('menu.monitor.server.memory.total')"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :value="memData.total"
                  >
                    <template #suffix> GB</template>
                  </a-statistic>
                  <a-statistic
                    :animation="true"
                    :extra="$t('menu.monitor.server.memory.used')"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :value="memData.used"
                  >
                    <template #suffix> GB</template>
                  </a-statistic>
                  <a-statistic
                    :animation="true"
                    :extra="$t('menu.monitor.server.memory.free')"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :value="memData.free"
                  >
                    <template #suffix> GB</template>
                  </a-statistic>
                  <a-statistic
                    :animation="true"
                    :extra="$t('menu.monitor.server.memory.usage')"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :value="memData.usage"
                    :value-style="usageStyle('memory')"
                  >
                    <template #suffix> %</template>
                  </a-statistic>
                </a-space>
              </a-card>
            </a-col>
          </a-row>
          <a-space style="padding-top: 22px" />
          <a-card
            :loading="loading"
            :title="$t('menu.monitor.server.service')"
            class="info-card"
          >
            <a-descriptions
              :bordered="true"
              :data="serviceData"
              :layout="'inline-vertical'"
            ></a-descriptions>
          </a-card>
          <a-space style="padding-top: 22px" />
          <a-card
            :loading="loading"
            :title="$t('menu.monitor.server.system')"
            class="info-card"
          >
            <a-descriptions
              :bordered="true"
              :column="4"
              :data="osData"
            ></a-descriptions>
          </a-card>
          <a-space style="padding-top: 22px" />
          <a-card
            :loading="loading"
            :title="$t('menu.monitor.server.disk')"
            class="info-card"
          >
            <a-table
              :columns="columns"
              :data="diskData"
              :hoverable="false"
              :pagination="false"
            ></a-table>
          </a-card>
        </div>
      </a-card>
    </a-layout>
  </div>
  <div class="footer">
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { DescData, TableColumnData } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import Footer from '@/components/footer/index.vue';
  import Breadcrumb from '@/components/breadcrumb/index.vue';
  import useLoading from '@/hooks/loading';
  import { queryServerMonitor } from '@/api/monitor';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  const setServerData = ref<Record<string, any>>({});
  const diskData = ref();
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('monitor.server.columns.dir'),
      dataIndex: 'dir',
    },
    {
      title: t('monitor.server.columns.type'),
      dataIndex: 'type',
    },
    {
      title: t('monitor.server.columns.device'),
      dataIndex: 'device',
    },
    {
      title: t('monitor.server.columns.total'),
      dataIndex: 'total',
    },
    {
      title: t('monitor.server.columns.free'),
      dataIndex: 'free',
    },
    {
      title: t('monitor.server.columns.used'),
      dataIndex: 'used',
    },
    {
      title: t('monitor.server.columns.usage'),
      dataIndex: 'usage',
    },
  ]);

  const cpuData = computed(() => {
    return {
      usage: setServerData.value.cpu?.usage,
      current_freq: setServerData.value.cpu?.current_freq,
      max_freq: setServerData.value.cpu?.max_freq,
      min_freq: setServerData.value.cpu?.min_freq,
      logical_num: setServerData.value.cpu?.logical_num,
      physical_num: setServerData.value.cpu?.physical_num,
    };
  });

  const memData = computed(() => {
    return {
      total: setServerData.value.memory?.total,
      used: setServerData.value.memory?.used,
      free: setServerData.value.memory?.free,
      usage: setServerData.value.memory?.usage,
    };
  });

  const serviceData = computed<DescData[]>(() => {
    const data: DescData[] = [];
    if (setServerData.value.service) {
      Object.keys(setServerData.value.service).forEach((key) => {
        data.push({
          label: key,
          value: setServerData.value.service[key],
        });
      });
    }
    return data;
  });

  const osData = computed<DescData[]>(() => {
    const data: DescData[] = [];
    if (setServerData.value.system) {
      Object.keys(setServerData.value.system).forEach((key) => {
        data.push({
          label: key,
          value: setServerData.value.system[key],
        });
      });
    }
    return data;
  });

  const usageStyle = (type: string) => {
    let num = 0;
    if (type === 'cpu') {
      num = setServerData.value.cpu?.usage;
    } else if (type === 'memory') {
      num = setServerData.value.memory?.usage;
    }
    if (num < 50) {
      return { color: 'rgb(var(--green-6))' };
    }
    if (num < 80) {
      return { color: 'rgb(var(--yellow-6))' };
    }
    return { color: 'rgb(var(--red-6))' };
  };

  // 请求 Server 数据
  const fetchServerData = async () => {
    setLoading(true);
    try {
      const res = await queryServerMonitor();
      setServerData.value.cpu = res.cpu;
      setServerData.value.memory = res.mem;
      setServerData.value.system = res.sys;
      setServerData.value.service = res.service;
      diskData.value = res.disk;
    } catch (err) {
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchServerData();
</script>

<script lang="ts">
  export default {
    name: 'Server',
  };
</script>

<style lang="less">
  .info-card {
    border-radius: 20px;
    border-bottom-width: 2px;

    & > .arco-card-header {
      height: auto;
      padding: 20px;
      border: none;
    }

    & > .arco-card-body {
      padding: 0 20px 20px 20px;
    }
  }
</style>
