<script lang="ts" setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

import type { FormType } from '@/store/form';

import FormItem from '@/components/FormItem.vue';
import DropArea from '@/components/DropArea.vue';
import DropWrapper from '@/components/DropWrapper.vue';

import type { Item } from './types';

defineProps<{
  displayedItems: Item[];
  form: FormType;
  stepsEnabled: boolean;
  formComponent?: any;
  locale?: string;
}>();

defineEmits<{
  (e: 'drop', item: Item): void;
  (e: 'drop-side', position: 'top' | 'right' | 'left' | 'bottom', item: Item, index: number): void;
  (e: 'delete', item: Item): void;
  (e: 'copy', item: Item): void;
}>();

const gridRef = ref<HTMLDivElement | null>(null);

defineExpose({
  gridRef,
});
</script>

<template>
  <div v-if="displayedItems.length" ref="gridRef" class="col-span-12 grid w-full" style="grid-template-columns: repeat(12, 1fr)">
    <DropWrapper
      v-for="(item, index) in displayedItems"
      :key="item.id"
      :col-span="form.schema[item.id]?.columns?.container ?? 12"
      class="w-full gap-2 p-4"
      @drop="(position, i) => $emit('drop-side', position, i, index)"
    >
      <div class="w-full">
        <FormItem
          :gridRef="gridRef!"
          :item="item"
          :formComponent="formComponent"
          :locale="$props.locale"
          @delete="$emit('delete', item)"
          @copy="$emit('copy', item)"
        />
      </div>
    </DropWrapper>
  </div>

  <DropArea v-if="!displayedItems.length" class="flex h-auto w-full" @drop="$emit('drop', $event)">
    <template #default="{ isOver }">
      <div
        :class="{
          'border-blue-500/50 bg-blue-500/20': isOver,
          'border-gray-300/50 dark:border-gray-600/50': !isOver,
        }"
        class="m-4! flex min-h-40 w-full items-center justify-center rounded-md border-2 border-dashed transition-colors"
      >
        <Icon icon="lucide:plus-circle" class="text-4xl text-gray-500 dark:text-gray-400" />
      </div>
    </template>
  </DropArea>
</template>
