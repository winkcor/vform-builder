import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { SchemaItem, StepItem } from '@/store/form.ts';

export const usePropertiesForm = defineStore('properties_panel', () => {
  const item = ref<(Partial<SchemaItem> & { id: string }) | null>(null);
  const step = ref<(Partial<StepItem> & { id: string }) | null>(null);

  return { item, step };
});
