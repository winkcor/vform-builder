<script setup lang="ts">
import { computed, defineEmits, ref, watch } from 'vue';

import type { Item } from '@/components/form-builder/types';

import { useDragStore } from '@/store/dragStore.ts';

const emit = defineEmits<{ (e: 'drop', item: Item): void }>();

const store = useDragStore();
const dragData = computed(() => store.dragData);

const zone = ref<HTMLElement>();
const isOver = ref<Item | null>(null);

function isInside(x: number, y: number) {
  const r = zone.value?.getBoundingClientRect();
  return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

watch(
  () => dragData.value,
  (data) => {
    if (!data) {
      if (isOver.value) {
        emit('drop', isOver.value);
      }
      isOver.value = null;
      return;
    }
    isOver.value = isInside(data.x, data.y) ? data.item : null;
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>

<template>
  <div ref="zone" v-bind="$attrs">
    <slot :isOver="isOver" />
  </div>
</template>
