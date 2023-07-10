<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.monitor'), $t('menu.monitor.server')]" />
      <a-card :title="$t('menu.monitor.server')" class="general-card">
        <div class="content">
          <a-row :gutter="20">
            <a-col :span="12">
              <a-card title="CPU" class="info-card">
                <a-space :size="60">
                  <template #split>
                    <a-divider direction="vertical" />
                  </template>
                  <a-statistic
                    :extra="$t('menu.monitor.server.cpu.usage')"
                    :value="cpuData.usage"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :animation="true"
                    :value-style="usageStyle()"
                  >
                    <template #suffix> %</template>
                  </a-statistic>
                  <a-statistic
                    :extra="$t('menu.monitor.server.cpu.current-frequency')"
                    :value="cpuData.current_freq"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :animation="true"
                  >
                    <template #suffix> MHz</template>
                  </a-statistic>
                  <a-statistic
                    :extra="$t('menu.monitor.server.cpu.logical-cores')"
                    :value="cpuData.logical_num"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :animation="true"
                  />
                  <a-statistic
                    :extra="$t('menu.monitor.server.cpu.physical-cores')"
                    :value="cpuData.physical_num"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :animation="true"
                  />
                </a-space>
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card
                :title="$t('menu.monitor.server.memory')"
                class="info-card"
              >
                <a-space :size="60">
                  <template #split>
                    <a-divider direction="vertical" />
                  </template>
                  <a-statistic
                    :extra="$t('menu.monitor.server.memory.total')"
                    :value="memData.total"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :animation="true"
                  >
                    <template #suffix> GB</template>
                  </a-statistic>
                  <a-statistic
                    :extra="$t('menu.monitor.server.memory.used')"
                    :value="memData.used"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :animation="true"
                  >
                    <template #suffix> GB</template>
                  </a-statistic>
                  <a-statistic
                    :extra="$t('menu.monitor.server.memory.free')"
                    :value="memData.free"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :animation="true"
                  >
                    <template #suffix> GB</template>
                  </a-statistic>
                  <a-statistic
                    :extra="$t('menu.monitor.server.memory.usage')"
                    :value="memData.usage"
                    :placeholder="$t('menu.monitor.server.placeholder')"
                    :animation="true"
                    :value-style="usageStyle()"
                  >
                    <template #suffix> %</template>
                  </a-statistic>
                </a-space>
              </a-card>
            </a-col>
          </a-row>
          <a-space style="padding-top: 22px" />
          <a-card :title="$t('menu.monitor.server.service')" class="info-card">
            <a-descriptions :data="serviceData"></a-descriptions>
          </a-card>
          <a-space style="padding-top: 22px" />
          <a-card :title="$t('menu.monitor.server.system')" class="info-card">
            <a-descriptions
              :data="osData"
              :column="4"
              :layout="'vertical'"
              :bordered="true"
            ></a-descriptions>
          </a-card>
          <a-space style="padding-top: 22px" />
          <a-card :title="$t('menu.monitor.server.disk')" class="info-card">
            <a-descriptions :data="diskData" :bordered="true"></a-descriptions>
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
  import Footer from '@/components/footer/index.vue';
  import Breadcrumb from '@/components/breadcrumb/index.vue';
  import useLoading from '@/hooks/loading';
  import { queryServerMonitor } from '@/api/monitor';
  import { computed, ref } from 'vue';
  import { DescData } from '@arco-design/web-vue';

  const { setLoading } = useLoading(true);

  const setServerData = ref<Record<string, any>>({});
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
  const diskData = computed<DescData[]>(() => {
    const data: DescData[] = [];
    if (setServerData.value.disk) {
      setServerData.value.disk.forEach((item: Record<string, any>) => {
        Object.keys(item).forEach((key) => {
          data.push({
            label: key,
            value: item[key],
          });
        });
      });
    }
    return data;
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

  const usageStyle = () => {
    if (setServerData.value.cpu?.usage < 50) {
      return { color: 'rgb(var(--green-6))' };
    }
    if (setServerData.value.cpu?.usage < 80) {
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
      setServerData.value.disk = res.disk;
      setServerData.value.service = res.service;
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
