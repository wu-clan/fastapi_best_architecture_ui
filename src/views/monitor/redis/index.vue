<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.monitor'), $t('menu.monitor.redis')]" />
      <a-card :title="$t('menu.monitor.redis')" class="general-card">
        <div class="content"></div>
      </a-card>
    </a-layout>
  </div>
  <div class="footer">
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';
</script>

<style scoped lang="less"></style>
