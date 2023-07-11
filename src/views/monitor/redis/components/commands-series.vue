<template>
  <Chart :options="chartOption" :height="`350px`" />
</template>

<script lang="ts" setup>
  import useChartOption from '@/hooks/chart-option';
  import { PropType } from 'vue';

  const props = defineProps({
    stats: {
      type: Array as PropType<Record<string, any>[]>,
      required: true,
      default: [] as Record<string, any>[],
    },
  });

  const { chartOption } = useChartOption((isDark) => {
    return {
      series: [
        {
          type: 'pie',
          data: props.stats,
          label: {
            formatter: '{b}: {d}%',
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
        },
      ],
    };
  });
</script>

<style scoped lang="less"></style>
