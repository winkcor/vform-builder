<script setup lang="ts">
import { useTheme } from 'vuetify';
import { computed, nextTick, ref, watch } from 'vue';

import type { FormType } from '@/store/form';

import { useFormStore } from '@/store/form';

import type { Locale, LocaleMessages } from './form-builder/locales';

import {
  ElementsPanel,
  ExportDialog,
  FormCanvas,
  FormPreview,
  initI18n,
  LeftToolbar,
  PropertiesPanel,
  RightToolbar,
  StepsManager,
  StepsNavigation,
  useFormBuilderUI,
  useFormElements,
  useFormOperations,
  useFormSteps,
} from './form-builder';

interface Props {
  locale?: Locale;
  customLocaleData?: Record<string, LocaleMessages>;
  theme?: 'light' | 'dark';
  modelValue?: FormType;
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'en',
  customLocaleData: undefined,
  theme: 'light',
  modelValue: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: FormType): void;
}>();

initI18n(props.locale, props.customLocaleData);

watch(
  () => props.locale,
  (newLocale) => {
    if (newLocale) {
      initI18n(newLocale, props.customLocaleData);
    }
  },
);

watch(
  () => props.customLocaleData,
  (newCustomLocaleData) => {
    if (newCustomLocaleData) {
      initI18n(props.locale, newCustomLocaleData);
    }
  },
  { deep: true },
);

const formStore = useFormStore();
const themeStore = useTheme();

const isDark = computed(() => props.theme === 'dark');
watch(() => props.theme, themeStore.change, { immediate: true });

const { previewMode, showExport, isSettingsOpen, isElementsOpen, togglePreview, toggleSettings, toggleElements } =
  useFormBuilderUI();

const { fields, statics, getDisplayedItems } = useFormElements();

const {
  currentStepKey,
  stepsEnabled,
  startSteps,
  addStep,
  removeStep,
  deleteSteps,
  goToPrevStep,
  goToNextStep,
  selectStep,
  ensureDefaultStep,
} = useFormSteps();

const displayedItems = getDisplayedItems(
  () => stepsEnabled.value,
  () => currentStepKey.value,
);

const { clearForm, updateForm, handleDropped, handleDelete, handleDropSide, handleCopy } = useFormOperations();

const onClearForm = () => {
  clearForm();
  stepsEnabled.value = false;
};

const onUpdateForm = (v: any) => {
  updateForm(v);
  stepsEnabled.value = !!formStore.form.steps && Object.keys(formStore.form.steps).length > 0;
  currentStepKey.value = stepsEnabled.value
    ? currentStepKey.value || (formStore.form.steps ? Object.keys(formStore.form.steps)[0] : null) || null
    : null;
};

const onDropped = (item: any) => {
  handleDropped(item, stepsEnabled.value, currentStepKey.value, ensureDefaultStep);
};

const onDropSide = (position: 'top' | 'right' | 'left' | 'bottom', item: any, index: number) => {
  handleDropSide(position, item, index, displayedItems.value, stepsEnabled.value, currentStepKey.value);
};

const onCopy = (item: any) => {
  handleCopy(item, displayedItems.value, stepsEnabled.value, currentStepKey.value);
};

const updating = ref(false);

watch(
  () => formStore.form,
  (newForm) => {
    if (updating.value || props.modelValue === undefined) return;

    const formStr = JSON.stringify(newForm);
    const modelStr = JSON.stringify(props.modelValue);
    if (formStr === modelStr) return;

    updating.value = true;
    emit('update:modelValue', { ...newForm });
    nextTick(() => {
      updating.value = false;
    });
  },
  { deep: true },
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (updating.value || newValue === undefined) return;

    const formStr = JSON.stringify(formStore.form);
    const valueStr = JSON.stringify(newValue);
    if (formStr === valueStr) return;

    updating.value = true;
    formStore.form = {
      schema: { ...(newValue.schema || {}) },
      steps: newValue.steps ? { ...newValue.steps } : undefined,
    };
    stepsEnabled.value = !!newValue.steps && Object.keys(newValue.steps).length > 0;
    currentStepKey.value = stepsEnabled.value
      ? currentStepKey.value || (newValue.steps ? Object.keys(newValue.steps)[0] : null) || null
      : null;
    nextTick(() => {
      updating.value = false;
    });
  },
  { deep: true, immediate: true },
);

const exportData = computed<FormType>(() => formStore.form);

defineExpose({
  exportData,
  form: exportData,
});
</script>

<template>
  <div :class="['vform-builder h-full w-full', { dark: isDark }]">
    <div class="relative flex h-full w-full flex-row gap-2 p-4">
      <ElementsPanel :fields="fields" :is-open="isElementsOpen" :statics="statics" />

      <LeftToolbar
        :is-elements-open="isElementsOpen"
        :preview-mode="previewMode"
        :steps-enabled="stepsEnabled"
        @toggle-preview="togglePreview"
        @start-steps="startSteps"
        @toggle-elements="toggleElements"
        @clear-form="onClearForm"
      />

      <div class="relative flex h-full w-full flex-col p-2!">
        <VCard class="flex w-full flex-wrap items-start justify-start gap-2 overflow-y-auto border-gray-400 p-8!">
          <FormPreview v-if="previewMode" :form="formStore.form" />

          <template v-else>
            <StepsManager
              v-if="stepsEnabled"
              :current-step-key="currentStepKey"
              :form="formStore.form"
              :steps-enabled="stepsEnabled"
              @add-step="addStep"
              @remove-step="removeStep"
              @delete-steps="deleteSteps"
              @select-step="selectStep"
            />

            <FormCanvas
              :displayed-items="displayedItems"
              :form="formStore.form"
              :steps-enabled="stepsEnabled"
              @copy="onCopy"
              @delete="handleDelete"
              @drop="onDropped"
              @drop-side="onDropSide"
            />

            <StepsNavigation
              :current-step-key="currentStepKey"
              :form="formStore.form"
              :steps-enabled="stepsEnabled"
              @prev-step="goToPrevStep"
              @next-step="goToNextStep"
            />
          </template>
        </VCard>
      </div>

      <ExportDialog
        :form="formStore.form"
        :is-dark="isDark"
        :model-value="showExport"
        @update:model-value="showExport = $event"
        @update-form="onUpdateForm"
      />

      <RightToolbar :is-settings-open="isSettingsOpen" @show-export="showExport = true" @toggle-settings="toggleSettings" />

      <PropertiesPanel :is-open="isSettingsOpen" />
    </div>
  </div>
</template>
