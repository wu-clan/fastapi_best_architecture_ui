<template>
  <a-popover v-model:popup-visible="visible" trigger="click" position="bottom">
    <template #content>
      <div class="icon-container">
        <a-input-search
          style="width: 100%; margin-bottom: 20px"
          :placeholder="$t('icon.picker.search.placeholder')"
          :allow-clear="true"
          @search="onSearch"
        />
        <a-scrollbar style="height: 350px; overflow: auto">
          <div class="icon-wrapper">
            <a-row>
              <a-col v-for="item of iconNames" :key="item" :span="4">
                <div
                  class="flex justify-center items-center flex-col icon-item"
                  @click="onSelectItem(item)"
                >
                  <a-tooltip :content="item" mini>
                    <component :is="item" style="font-size: 26px" />
                  </a-tooltip>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-scrollbar>
      </div>
    </template>
    <a-input
      v-if="!selectedItem"
      :placeholder="$t('icon.picker.input.placeholder')"
    ></a-input>
    <a-input
      v-else
      v-model:model-value="selectedItem"
      allow-clear
      @clear="clearIcon"
    >
      <template #prefix>
        <component :is="selectedItem" />
      </template>
    </a-input>
  </a-popover>
</template>

<script lang="ts" setup>
  import * as Icons from '@arco-design/web-vue/es/icon';
  import { useClipboard } from '@vueuse/core';
  import { Message } from '@arco-design/web-vue';
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const emit = defineEmits(['onSelect', 'update:iconValue']);
  const props = defineProps({
    iconValue: {
      type: String,
      default: '',
    },
    enableCopy: {
      type: Boolean,
      default: false,
    },
  });
  const iconList = Object.keys(Icons).filter((it) => it !== 'default');
  const iconNames = ref(iconList);
  const searchList = ref<Array<string>>([]);
  const visible = ref<boolean>(false);
  const selectedItem = ref<string>(props.iconValue);

  function onSearch(searchValue: string) {
    if (searchValue) {
      const temp = searchValue.toLowerCase();
      searchList.value = iconList.filter((it) => {
        return it
          .toLowerCase()
          .startsWith((temp.startsWith('icon') ? '' : 'icon') + temp);
      });
      iconNames.value = searchList.value;
    } else {
      searchList.value = [];
      iconNames.value = iconList;
    }
  }

  async function onSelectItem(item: string) {
    emit('onSelect', item);
    emit('update:iconValue', item);
    selectedItem.value = item;
    visible.value = false;
    if (props.enableCopy) {
      const { isSupported, copied, copy } = useClipboard();
      if (isSupported) {
        await copy(`<${item} />`);
        if (copied) {
          Message.success(t('icon.picker.input.copy'));
        }
      }
    }
  }

  const clearIcon = () => {
    emit('onSelect', '');
    emit('update:iconValue', '');
    selectedItem.value = '';
  };

  watch(
    () => props.iconValue,
    (newVal) => {
      selectedItem.value = newVal;
    }
  );
</script>

<style lang="less" scoped>
  .icon-container {
    width: 360px;
    overflow: hidden;
    text-align: center;
    .icon-wrapper {
      .icon-item {
        height: 60px;
        overflow: hidden;
        text-align: center;
        .arco-icon {
          transform: scale(1);
          transition: transform 0.2s linear;
        }
        &:hover {
          cursor: pointer;
          .arco-icon {
            transform: scale(1.25);
            transition: transform 0.2s linear;
          }
        }
      }
    }
  }
</style>
