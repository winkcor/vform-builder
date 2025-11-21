import { onMounted, ref } from 'vue';

import { useFormStore } from '@/store/form';
import { useI18n } from '@/components/form-builder';

export function useFormSteps() {
  const formStore = useFormStore();
  const { t } = useI18n();

  const currentStepKey = ref<string | null>(null);
  const stepsEnabled = ref<boolean>(false);

  const getOrderedStepKeys = () => (formStore.form.steps ? Object.keys(formStore.form.steps) : []);

  const ensureDefaultStep = () => {
    if (!stepsEnabled.value) return;

    if (!formStore.form.steps || !Object.keys(formStore.form.steps).length) {
      const allElementKeys = Object.keys(formStore.form.schema).filter((k) => !!formStore.form.schema[k]);
      formStore.form = {
        ...formStore.form,
        steps: {
          page0: { label: `${t('step')} 1`, elements: allElementKeys, builder: { type: 'steps' } },
        },
      };
      currentStepKey.value = 'page0';
    } else if (!currentStepKey.value) {
      currentStepKey.value = getOrderedStepKeys()[0] ?? null;
    }
  };

  const startSteps = () => {
    stepsEnabled.value = true;
    ensureDefaultStep();
  };

  const addStep = () => {
    const keys = getOrderedStepKeys();
    let index = keys.length;
    let key = `page${index}`;
    while (formStore.form.steps && formStore.form.steps[key]) {
      index++;
      key = `page${index}`;
    }
    formStore.form = {
      ...formStore.form,
      steps: {
        ...formStore.form.steps!,
        [key]: { label: `${t('step')} ${index + 1}`, elements: [], builder: { type: 'steps' } },
      },
    } as any;
  };

  const removeStep = (key: string) => {
    if (!formStore.form.steps) return;
    const { [key]: _removed, ...rest } = formStore.form.steps;
    formStore.form = { ...formStore.form, steps: rest } as any;
    const keys = Object.keys(rest);
    currentStepKey.value = keys[0] ?? null;
    if (!keys.length) {
      stepsEnabled.value = false;
      formStore.form = { ...formStore.form, steps: undefined } as any;
    }
  };

  const deleteSteps = () => {
    stepsEnabled.value = false;
    formStore.form = { ...formStore.form, steps: undefined } as any;
    currentStepKey.value = null;
  };

  const goToPrevStep = () => {
    if (!currentStepKey.value) return;
    const keys = getOrderedStepKeys();
    const idx = keys.indexOf(currentStepKey.value);
    if (idx > 0) currentStepKey.value = keys[idx - 1] || null;
  };

  const goToNextStep = () => {
    if (!currentStepKey.value) return;
    const keys = getOrderedStepKeys();
    const idx = keys.indexOf(currentStepKey.value);
    if (idx >= 0 && idx < keys.length - 1) currentStepKey.value = keys[idx + 1] || null;
  };

  const selectStep = (key: string) => {
    currentStepKey.value = key;
  };

  onMounted(() => {
    stepsEnabled.value = formStore.form.steps ? Object.keys(formStore.form.steps).length > 0 : false;
    ensureDefaultStep();
  });

  return {
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
  };
}
