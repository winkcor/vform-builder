<script setup lang="ts">
import { nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import { Motion, useAnimationControls } from 'motion-v';

import type { Item } from '@/components/form-builder/types';

import { useDragStore } from '@/store/dragStore.ts';

const props = defineProps<{ item: Item }>();

const animationControls = useAnimationControls();

const store = useDragStore();

function getPoint(e: any, i: any) {
  if (i?.point) {
    return i.point;
  }
  return {
    x: e.clientX ?? e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? e.target?.getBoundingClientRect?.().left ?? 0,
    y: e.clientY ?? e.touches?.[0]?.clientY ?? e.changedTouches?.[0]?.clientY ?? e.target?.getBoundingClientRect?.().top ?? 0,
  };
}

function onDrag(e: any, i: any) {
  const { x, y } = getPoint(e, i);
  const d = store.dragData;
  if (d?.x === x && d?.y === y) return;
  store.setDrag({ x, y, item: props.item, isDragging: true });
}

async function onDrop(e: any, i: any) {
  store.setDrag({ ...getPoint(e, i), item: props.item, isDragging: false });
  await nextTick();
  store.clear();
  animationControls.set({ x: 0, y: 0 });
}
</script>

<template>
  <div class="relative p-1 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_10px_rgba(0,0,0,0.25)]">
    <div class="flex h-24 w-full cursor-grab items-center gap-3 p-2!">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
        <Icon v-if="item.icon" :icon="item.icon" class="text-xl text-blue-600 dark:text-blue-400" />
      </div>
      <div class="flex min-w-0 flex-1 flex-col">
        <p class="font-medium">{{ item.name }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</p>
      </div>
    </div>
    <Motion
      drag
      layout
      :layout-id="item.id"
      :drag-elastic="0"
      :drag-momentum="false"
      @drag="(e, info) => onDrag(e, info)"
      @drag-end="(e, info) => onDrop(e, info)"
      :animate="animationControls"
      :style="
        store.dragData?.item.id === item.id && store.dragData?.isDragging
          ? { left: store.dragData.x + 'px', top: store.dragData.y + 'px' }
          : {}
      "
      :class="[
        'flex h-24 cursor-grab items-center gap-3 bg-(--v-theme-surface) p-2!',
        store.dragData?.item.id === item.id && store.dragData?.isDragging
          ? 'fixed z-50 w-56 opacity-100 shadow-lg'
          : 'absolute top-0 left-0 z-10 w-full opacity-50',
      ]"
    >
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
        <Icon v-if="item.icon" :icon="item.icon" class="text-xl text-blue-600 dark:text-blue-400" />
      </div>
      <div class="flex min-w-0 flex-1 flex-col">
        <p class="font-medium">{{ item.name }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</p>
      </div>
    </Motion>
  </div>
</template>
