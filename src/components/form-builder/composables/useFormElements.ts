import { computed, ref, watch } from 'vue';

import { useFormStore } from '@/store/form';

import type { Item } from '../types';

import { useI18n } from './useI18n';

export function useFormElements() {
  const formStore = useFormStore();
  const { t } = useI18n();
  const containerItems = ref<Item[]>([]);

  const fields = computed<Item[]>(() => [
    {
      id: 'textarea_drag',
      name: t('textarea'),
      description: t('textareaDescription'),
      type: 'textarea',
      icon: 'lucide:file-text',
    },
    {
      id: 'text_drag',
      name: t('textInput'),
      description: t('textInputDescription'),
      type: 'text',
      icon: 'lucide:type',
    },
    {
      id: 'password_drag',
      name: t('passwordInput'),
      description: t('passwordInputDescription'),
      type: 'password',
      icon: 'lucide:lock',
    },
    {
      id: 'email_drag',
      name: t('emailInput'),
      description: t('emailInputDescription'),
      type: 'email',
      icon: 'lucide:mail',
    },
    {
      id: 'number_drag',
      name: t('numberInput'),
      description: t('numberInputDescription'),
      type: 'number',
      icon: 'lucide:hash',
    },
    {
      id: 'phone_drag',
      name: t('phoneInput'),
      description: t('phoneInputDescription'),
      type: 'phone',
      icon: 'lucide:phone',
    },
    {
      id: 'url_drag',
      name: t('urlInput'),
      description: t('urlInputDescription'),
      type: 'url',
      icon: 'lucide:link-2',
    },
    {
      id: 'editor_drag',
      name: t('editorField'),
      description: t('editorFieldDescription'),
      type: 'editor',
      icon: 'lucide:pen-square',
    },
    {
      id: 'checkbox_drag',
      name: t('checkboxField'),
      description: t('checkboxFieldDescription'),
      type: 'checkbox',
      icon: 'lucide:square-check',
    },
    {
      id: 'checkboxgroup_drag',
      name: t('checkboxGroupField'),
      description: t('checkboxGroupFieldDescription'),
      type: 'checkboxgroup',
      icon: 'lucide:list-checks',
    },
    {
      id: 'toggle_drag',
      name: t('toggleField'),
      description: t('toggleFieldDescription'),
      type: 'toggle',
      icon: 'lucide:toggle-right',
    },
    {
      id: 'select_drag',
      name: t('selectField'),
      description: t('selectFieldDescription'),
      type: 'select',
      icon: 'lucide:chevron-down',
    },
    {
      id: 'tags_drag',
      name: t('tagsField'),
      description: t('tagsFieldDescription'),
      type: 'tags',
      icon: 'lucide:tags',
    },
    {
      id: 'slider_drag',
      name: t('sliderField'),
      description: t('sliderFieldDescription'),
      type: 'slider',
      icon: 'lucide:sliders-horizontal',
    },
    {
      id: 'file_drag',
      name: t('fileField'),
      description: t('fileFieldDescription'),
      type: 'file',
      icon: 'lucide:file-up',
    },
    {
      id: 'date_drag',
      name: t('dateField'),
      description: t('dateFieldDescription'),
      type: 'date',
      icon: 'lucide:calendar',
    },
    {
      id: 'hidden_drag',
      name: t('hiddenField'),
      description: t('hiddenFieldDescription'),
      type: 'hidden',
      icon: 'lucide:eye-off',
    },
    {
      id: 'radio_drag',
      name: t('radioInput'),
      description: t('radioInputDescription'),
      type: 'radio',
      icon: 'lucide:circle',
    },
    {
      id: 'radioTabs_drag',
      name: t('radioTabs'),
      description: t('radioTabsDescription'),
      type: 'radiogroup',
      icon: 'lucide:layout-grid',
    },
  ]);

  const statics = computed<Item[]>(() => [
    { id: 'h1_drag', name: t('h1'), description: t('h1Description'), type: 'static', icon: 'lucide:heading-1' },
    { id: 'h2_drag', name: t('h2'), description: t('h2Description'), type: 'static', icon: 'lucide:heading-2' },
    { id: 'h3_drag', name: t('h3'), description: t('h3Description'), type: 'static', icon: 'lucide:heading-3' },
    { id: 'h4_drag', name: t('h4'), description: t('h4Description'), type: 'static', icon: 'lucide:heading-4' },
    { id: 'submit_drag', name: t('submitButton'), description: t('submitButtonDescription'), type: 'button', icon: 'lucide:check' },
    {
      id: 'reset_drag',
      name: t('resetButton'),
      description: t('resetButtonDescription'),
      type: 'button',
      icon: 'lucide:rotate-ccw',
    },
    {
      id: 'primaryButton_drag',
      name: t('primaryButton'),
      description: t('primaryButtonDescription'),
      type: 'button',
      icon: 'lucide:square',
    },
    {
      id: 'secondaryButton_drag',
      name: t('secondaryButton'),
      description: t('secondaryButtonDescription'),
      type: 'button',
      icon: 'lucide:square-dot',
    },
    {
      id: 'dangerButton_drag',
      name: t('dangerButton'),
      description: t('dangerButtonDescription'),
      type: 'button',
      icon: 'lucide:alert-triangle',
    },
    { id: 'quote_drag', name: t('quote'), description: t('quoteDescription'), type: 'static', icon: 'lucide:quote' },
    { id: 'link_drag', name: t('link'), description: t('linkDescription'), type: 'static', icon: 'lucide:link' },
    { id: 'divider_drag', name: t('divider'), description: t('dividerDescription'), type: 'static', icon: 'lucide:divide' },
  ]);

  watch(
    () => formStore.form.schema,
    (value) => {
      containerItems.value = Object.entries(value)
        .map(([id, value]) => {
          if (value) return { ...value, id };
        })
        .filter(Boolean) as unknown as Item[];
    },
    { immediate: true, deep: true },
  );

  const getDisplayedItems = (stepsEnabled: () => boolean, currentStepKey: () => string | null) => {
    return computed(() => {
      const isStepsEnabled = stepsEnabled();
      const stepKey = currentStepKey();

      if (!isStepsEnabled) return containerItems.value;

      if (!formStore.form.steps || !stepKey) return containerItems.value;
      const step = formStore.form.steps[stepKey];
      if (!step) return containerItems.value;
      const allowed = new Set(step.elements);
      return containerItems.value.filter((it) => allowed.has(it.id));
    });
  };

  return {
    fields,
    statics,
    containerItems,
    getDisplayedItems,
  };
}
