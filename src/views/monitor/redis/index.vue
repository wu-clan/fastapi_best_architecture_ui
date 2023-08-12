<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.monitor'), $t('menu.monitor.redis')]" />
      <a-card :title="$t('menu.monitor.redis')" class="general-card">
        <div class="content">
          <a-card
            :title="$t('monitor.redis.showData.title')"
            :loading="loading"
            class="info-card"
          >
            <a-descriptions :data="showData"></a-descriptions>
          </a-card>
          <a-space style="padding-top: 22px" />
          <a-row :gutter="20">
            <a-col :span="12">
              <a-card
                :title="$t('monitor.redis.stats.title.commands')"
                :loading="loading"
                class="info-card"
              >
                <CommandsSeries :stats="redisStats" />
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card
                :title="$t('monitor.redis.stats.title.used_memory')"
                :loading="loading"
                class="info-card"
              >
                <ActiveSeries :memory="redisUsedMemory" />
              </a-card>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </a-layout>
  </div>
  <div class="footer">
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { DescData } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import Footer from '@/components/footer/index.vue';
  import Breadcrumb from '@/components/breadcrumb/index.vue';
  import useLoading from '@/hooks/loading';
  import { queryRedisMonitor } from '@/api/monitor';
  import CommandsSeries from '@/views/monitor/redis/components/commands-series.vue';
  import ActiveSeries from '@/views/monitor/redis/components/active-series.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  const redisInfo = ref<Record<string, any>>({});
  const redisStats = ref<Record<string, any>[]>([]);
  const showData = computed<DescData[]>(() => [
    {
      label: t('monitor.redis.showData.version'),
      value: redisInfo.value?.redis_version,
    },
    {
      label: t('monitor.redis.showData.os'),
      value: redisInfo.value?.os,
    },
    {
      label: t('monitor.redis.showData.arch'),
      value: redisInfo.value?.arch_bits,
    },
    {
      label: t('monitor.redis.showData.mode'),
      value: redisInfo.value?.redis_mode,
    },
    {
      label: t('monitor.redis.showData.role'),
      value: redisInfo.value?.role,
    },
    {
      label: t('monitor.redis.showData.memory_human'),
      value: redisInfo.value?.used_memory_human,
    },
    {
      label: t('monitor.redis.showData.connections_received'),
      value: redisInfo.value?.total_connections_received,
    },
    {
      label: t('monitor.redis.showData.clients'),
      value: redisInfo.value?.blocked_clients,
    },
    {
      label: t('monitor.redis.showData.rejected_connections'),
      value: redisInfo.value?.rejected_connections,
    },
    {
      label: t('monitor.redis.showData.commands_processed'),
      value: redisInfo.value?.total_commands_processed,
    },
    {
      label: t('monitor.redis.showData.keys_command_stats'),
      value:
        Number(redisInfo.value?.keyspace_hits) +
        Number(redisInfo.value?.keyspace_misses),
    },
    {
      label: t('monitor.redis.showData.keys_num'),
      value: redisInfo.value?.keys_num,
    },
    {
      label: t('monitor.redis.showData.used_cpu'),
      value: redisInfo.value?.used_cpu_sys,
    },
    {
      label: t('monitor.redis.showData.used_cpu_children'),
      value: redisInfo.value?.used_cpu_sys_children,
    },
    {
      label: t('monitor.redis.showData.uptime'),
      value: redisInfo.value?.uptime_in_seconds,
    },
  ]);
  const usedMemory = ref<number>(0);
  const redisUsedMemory = computed(() => [
    {
      name: t('monitor.redis.stats.title.used_memory'),
      value: usedMemory.value,
    },
  ]);

  // 请求数据
  const fetchRedisData = async () => {
    setLoading(true);
    try {
      const res = await queryRedisMonitor();
      redisInfo.value = res.info;
      redisStats.value = res.stats;
    } catch (err) {
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchRedisData();

  watch(redisInfo, (val) => {
    usedMemory.value = parseFloat(
      (Number(val.used_memory) / 1024 / 1024).toFixed(2)
    );
  });
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
