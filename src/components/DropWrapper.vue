<script setup lang="ts">
import { defineEmits } from 'vue';

import type { Item } from '@/components/form-builder/types';

import DropArea from '@/components/DropArea.vue';

withDefaults(defineProps<{ colSpan: number }>(), {});

const emit = defineEmits<{ (e: 'drop', position: 'top' | 'right' | 'left' | 'bottom', item: Item): void }>();
</script>

<template>
  <div
    class="relative flex w-full flex-col"
    :style="{ gridColumn: `span ${colSpan} / span ${colSpan}` }"
    :class="$attrs.class"
    v-bind="$attrs"
  >
    <DropArea class="h-2" @drop="(item: Item) => emit('drop', 'top', item)">
      <template #default="{ isOver }">
        <div class="h-full w-full rounded-md transition-colors" :class="{ 'border-blue-500/50 bg-blue-500/20': isOver }" />
      </template>
    </DropArea>

    <div class="flex w-full flex-row">
      <div class="flex w-full flex-row">
        <DropArea class="flex h-full w-2" @drop="(item: Item) => emit('drop', 'left', item)">
          <template #default="{ isOver }">
            <div class="h-full w-full rounded-md transition-colors" :class="{ 'border-blue-500/50 bg-blue-500/20': isOver }" />
          </template>
        </DropArea>
        <slot />
        <DropArea class="flex h-full w-2" @drop="(item: Item) => emit('drop', 'right', item)">
          <template #default="{ isOver }">
            <div class="h-full w-full rounded-md transition-colors" :class="{ 'border-blue-500/50 bg-blue-500/20': isOver }" />
          </template>
        </DropArea>
      </div>
    </div>

    <DropArea class="h-2" @drop="(item: Item) => emit('drop', 'bottom', item)">
      <template #default="{ isOver }">
        <div class="h-full w-full rounded-md transition-colors" :class="{ 'border-blue-500/50 bg-blue-500/20': isOver }" />
      </template>
    </DropArea>
  </div>
</template>
