<script lang="ts" setup>
import { ref } from 'vue';

import DraggableItem from '@/components/DragItem.vue';

import type { Item } from './types';

import { useI18n } from './composables/useI18n';

defineProps<{
  fields: Item[];
  statics: Item[];
  isOpen: boolean;
}>();

const { t } = useI18n();
const tab = ref('fields');
</script>

<template>
  <aside
    :class="isOpen ? 'w-120 opacity-100' : 'w-0 opacity-0'"
    class="m-2! flex flex-col gap-2 bg-[rgb(var(--v-theme-surface))] p-2! transition-all duration-300"
  >
    <VSheet class="flex! h-full! flex-col">
      <VTabs v-model="tab" class="w-full" grow>
        <VTab value="fields"> {{ t('fields') }} </VTab>
        <VTab value="static"> {{ t('static') }} </VTab>
      </VTabs>

      <VTabsWindow v-model="tab" class="h-full! overflow-y-auto">
        <VTabsWindowItem value="fields">
          <DraggableItem v-for="item in fields" :key="item.id" :item="item" />
        </VTabsWindowItem>
        <VTabsWindowItem value="static">
          <DraggableItem v-for="item in statics" :key="item.id" :item="item" />
        </VTabsWindowItem>
      </VTabsWindow>
    </VSheet>
  </aside>
</template>
