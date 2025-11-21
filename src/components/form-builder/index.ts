export { default as FormBuilder } from '../FormBuilder.vue';
export { default as ElementsPanel } from './ElementsPanel.vue';
export { default as LeftToolbar } from './LeftToolbar.vue';
export { default as RightToolbar } from './RightToolbar.vue';
export { default as FormCanvas } from './FormCanvas.vue';
export { default as StepsManager } from './StepsManager.vue';
export { default as StepsNavigation } from './StepsNavigation.vue';
export { default as PropertiesPanel } from './PropertiesPanel.vue';
export { default as ExportDialog } from './ExportDialog.vue';
export { default as FormPreview } from './FormPreview.vue';

export { useFormBuilderUI } from './composables/useFormBuilderUI';
export { useFormElements } from './composables/useFormElements';
export { useFormSteps } from './composables/useFormSteps';
export { useFormOperations } from './composables/useFormOperations';
export { useI18n, initI18n } from './composables/useI18n';

export type { Item } from './types';
export type { Locale, LocaleMessages } from './locales';
export { defaultLocales } from './locales';
