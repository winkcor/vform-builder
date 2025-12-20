<script setup lang="ts">
import type { VueformSchema } from '@vueform/vueform';

import { dir } from 'i18next';
import { Motion } from 'motion-v';
import { Icon } from '@iconify/vue';
import { computed, ref, watch } from 'vue';

import type { Item } from '@/components/form-builder/types';

import { useFormStore } from '@/store/form';
import { usePropertiesForm } from '@/store/propertiesPanel';
import { useI18n } from '@/components/form-builder/composables/useI18n';

const props = defineProps<{
  item: Item;
  gridRef: HTMLDivElement;
  formComponent?: any;
  locale?: string;
}>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'copy'): void;
}>();

const formStore = useFormStore();
const propertyForm = usePropertiesForm();
const { getLocale } = useI18n();

function getLocalizedLabel(label: any, locale: string = 'en'): string {
  if (typeof label === 'object' && label !== null && !Array.isArray(label)) {
    return label[locale] || label.en || label.fa || Object.values(label)[0] || '';
  }
  return label || '';
}

const formItem = computed(() => {
  const item = formStore.form.schema[props.item.id];
  if (!item) return item;

  const localizedItem = { ...item };

  if (item.label) {
    localizedItem.label = getLocalizedLabel(item.label, props.locale || 'en');
  }

  if (item.buttonLabel) {
    localizedItem.buttonLabel = getLocalizedLabel(item.buttonLabel, props.locale || 'en');
  }

  if (item.text) {
    localizedItem.text = getLocalizedLabel(item.text, props.locale || 'en');
  }

  if (item.info) {
    localizedItem.info = getLocalizedLabel(item.info, props.locale || 'en');
  }

  if (item.placeholder) {
    localizedItem.placeholder = getLocalizedLabel(item.placeholder, props.locale || 'en');
  }

  if (item.description) {
    localizedItem.description = getLocalizedLabel(item.description, props.locale || 'en');
  }

  if (item.content) {
    localizedItem.content = getLocalizedLabel(item.content, props.locale || 'en');
  }

  if (item.labels && typeof item.labels === 'object') {
    localizedItem.labels = { ...item.labels };
    for (const [key, value] of Object.entries(item.labels)) {
      if (value && typeof value === 'object') {
        (localizedItem.labels as any)[key] = getLocalizedLabel(value, props.locale || 'en');
      }
    }
  }

  if (item.items && Array.isArray(item.items)) {
    localizedItem.items = item.items.map((item) => ({
      ...item,
      label: getLocalizedLabel(item.label, props.locale || 'en'),
    }));
  }

  return localizedItem;
});

const startX = ref(0);
const colSpan = ref(formItem.value?.columns?.container ?? 12);
const startSpan = ref(6);
const dragging = ref(false);

function handleItemClick() {
  propertyForm.item = { id: props.item.id, name: formItem.value?.name || props.item.id, ...formItem.value };
  propertyForm.step = null;
}

const onPointerDown = (e: PointerEvent) => {
  const handle = e.currentTarget as HTMLElement;
  handle.setPointerCapture(e.pointerId);
  startX.value = e.clientX;
  startSpan.value = colSpan.value;
  dragging.value = true;
};

const onPointerMove = (e: PointerEvent) => {
  if (!dragging.value || !props.gridRef) return;
  const delta = e.clientX - startX.value;
  const colWidth = props.gridRef.clientWidth / 12;

  const adjustedDelta = dir(getLocale()) === 'rtl' ? -delta : delta;
  const deltaCols = Math.round(adjustedDelta / colWidth);
  const newSpan = Math.min(12, Math.max(1, startSpan.value + deltaCols));
  colSpan.value = newSpan;
};

const onPointerUp = (e: PointerEvent) => {
  const handle = e.currentTarget as HTMLElement;
  try {
    handle.releasePointerCapture(e.pointerId);
  } catch {}
  dragging.value = false;
};

watch(
  () => formItem.value?.columns?.container,
  (col) => {
    if (col !== undefined) {
      colSpan.value = col;
    }
  },
  { immediate: true },
);

watch(
  () => colSpan.value,
  (col) => {
    if (col !== 12)
      formStore.form.schema[props.item.id]!.columns = {
        container: col,
      };
    else formStore.form.schema[props.item.id]!.columns = undefined;
  },
);

const formComponent = computed(() => props.formComponent || 'vueform');
</script>

<template>
  <div class="group w-full">
    <Motion
      layout
      :layout-id="item.id"
      :transition="{ duration: dragging ? 0 : 0.3 }"
      class="relative flex items-center rounded border-2 border-transparent p-2 group-hover:border-(--vf-primary)"
      :class="[propertyForm.item?.id === item.id && 'border-(--vf-primary)!']"
      @click="handleItemClick"
    >
      <component
        :is="formComponent"
        class="w-full"
        :locale="props.locale"
        :schema="{
          [props.item.id]: { ...formItem, columns: undefined } as VueformSchema,
        }"
      />

      <p
        class="bg-primary absolute end-full rounded-xs p-1 text-xs opacity-0 group-hover:opacity-100!"
        :class="[propertyForm.item?.id === item.id && 'opacity-100!']"
      >
        {{ colSpan }}
      </p>

      <Motion
        id="handle"
        class="absolute -end-1 h-3 w-2 cursor-ew-resize rounded-xs bg-(--vf-primary)! opacity-0 group-hover:opacity-100!"
        :class="[propertyForm.item?.id === item.id && 'opacity-100!']"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
      />

      <div
        class="absolute start-0 end-0 bottom-full flex justify-end gap-2 p-1 opacity-0 transition-opacity group-hover:opacity-100!"
        :class="[propertyForm.item?.id === item.id && 'opacity-100!']"
      >
        <button class="rounded bg-(--vf-primary)! px-2 py-1 text-xs" @click.stop="emit('copy')">
          <Icon icon="lucide:copy" />
        </button>
        <button class="rounded bg-(--vf-primary)! px-2 py-1 text-xs" @click="emit('delete')">
          <Icon icon="lucide:trash" />
        </button>
      </div>
    </Motion>
  </div>
</template>
