<script lang="ts" setup>
import JsonEditorVue from 'json-editor-vue';

import type { FormType } from '@/store/form';

import { Constants } from '@/utils/enum.ts';

import 'vanilla-jsoneditor/themes/jse-theme-dark.css';

import { useI18n } from './composables/useI18n';

defineProps<{
  modelValue: boolean;
  form: FormType;
  isDark: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update-form', value: any): void;
}>();

const { t } = useI18n();

const updateForm = (v: any) => {
  if (!v) return;
  const parsed = JSON.parse(v);
  const form = {
    schema: parsed.schema && typeof parsed.schema === 'object' ? parsed.schema : {},
    steps: parsed.steps && typeof parsed.steps === 'object' && Object.keys(parsed.steps).length ? parsed.steps : undefined,
  };
  emit('update-form', form);
};
</script>

<template>
  <VDialog
    :attach="`.${Constants.CssPrefix}`"
    :max-width="800"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <VCard>
      <VCardTitle class="text-h6">{{ t('exportImportTitle') }}</VCardTitle>
      <JsonEditorVue
        :class="[isDark && 'jse-theme-dark']"
        :model-value="form"
        v-bind="{ mode: 'text' as any, statusBar: true, mainMenuBar: true }"
        @update:model-value="updateForm"
      />

      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="$emit('update:modelValue', false)">{{ t('close') }}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
