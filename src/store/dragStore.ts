import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { Item } from '@/components/form-builder';

export const useDragStore = defineStore('drag_item', () => {
  const dragData = ref<null | { x: number; y: number; item: Item }>(null);
  function setDrag(data: { x: number; y: number; item: Item }) {
    dragData.value = data;
  }
  function clear() {
    dragData.value = null;
  }

  return { dragData, setDrag, clear };
});
