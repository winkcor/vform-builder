import './style.css';

export { FormBuilderPlugin, default as FormBuilderPluginDefault } from './plugin';
export { default as FormBuilder } from './components/FormBuilder.vue';
export { default as FormItem } from './components/FormItem.vue';
export { default as FormCanvas } from './components/form-builder/FormCanvas.vue';
export { default as ElementsPanel } from './components/form-builder/ElementsPanel.vue';
export { default as LeftToolbar } from './components/form-builder/LeftToolbar.vue';
export { default as RightToolbar } from './components/form-builder/RightToolbar.vue';
export { default as StepsManager } from './components/form-builder/StepsManager.vue';
export { default as StepsNavigation } from './components/form-builder/StepsNavigation.vue';
export { default as PropertiesPanel } from './components/form-builder/PropertiesPanel.vue';
export { default as ExportDialog } from './components/form-builder/ExportDialog.vue';
export { default as FormPreview } from './components/form-builder/FormPreview.vue';
export { default as DragItem } from './components/DragItem.vue';
export { default as DropArea } from './components/DropArea.vue';
export { default as DropWrapper } from './components/DropWrapper.vue';

export { useFormBuilderUI } from './components/form-builder/composables/useFormBuilderUI';
export { useFormElements } from './components/form-builder/composables/useFormElements';
export { useFormSteps } from './components/form-builder/composables/useFormSteps';
export { useFormOperations } from './components/form-builder/composables/useFormOperations';
export { useI18n, initI18n } from './components/form-builder/composables/useI18n';

export { useFormStore } from './store/form';
export { usePropertiesForm } from './store/propertiesPanel';
export { useDragStore } from './store/dragStore';

export type { Item } from './components/form-builder/types';
export type { Locale, LocaleMessages } from './components/form-builder/locales';
export type { FormType, SchemaItem, StepItem } from './store/form';

export { defaultLocales } from './components/form-builder/locales';
