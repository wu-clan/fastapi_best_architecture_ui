<template>
  <Chart :options="memoryOption" :height="`350px`" />
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { PropType } from 'vue';

  const { t } = useI18n();
  const props = defineProps({
    memory: {
      type: Array as PropType<Record<string, any>[]>,
      required: true,
      default: [] as Record<string, any>[],
    },
  });

  const memoryOption: Record<string, any> = {
    progress: {
      show: true,
    },
    series: [
      {
        name: t('monitor.redis.stats.title.used_memory'),
        type: 'gauge',
        data: props.memory,
      },
    ],
    detail: {
      valueAnimation: true,
      formatter: '{value} M',
    },
  };
</script>

<style scoped lang="less"></style>
