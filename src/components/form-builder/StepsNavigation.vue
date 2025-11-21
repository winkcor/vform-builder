<script lang="ts" setup>
import { computed } from 'vue';

import type { FormType } from '@/store/form';

import { useI18n } from './composables/useI18n';

const props = defineProps<{
  stepsEnabled: boolean;
  currentStepKey: string | null;
  form: FormType;
}>();

defineEmits<{
  (e: 'prev-step'): void;
  (e: 'next-step'): void;
}>();

const { t } = useI18n();

const currentStep = computed(() => {
  if (!props.currentStepKey || !props.form.steps) return null;
  return props.form.steps[props.currentStepKey] || null;
});

const nextButtonLabel = computed(() => {
  return currentStep.value?.labels?.next || t('next');
});

const previousButtonLabel = computed(() => {
  return currentStep.value?.labels?.previous || t('prev');
});

const showPreviousButton = computed(() => {
  return currentStep.value?.buttons?.previous ?? true;
});
</script>

<template>
  <div v-if="stepsEnabled" class="col-span-12 flex justify-between">
    <VBtn
      v-if="showPreviousButton"
      class="bg-[var(--vf-bg-btn-secondary)]! text-[var(--vf-color-btn-secondary)]!"
      @click="$emit('prev-step')"
    >
      {{ previousButtonLabel }}
    </VBtn>
    <VBtn class="bg-[var(--vf-primary)]!" @click="$emit('next-step')">{{ nextButtonLabel }}</VBtn>
  </div>
</template>
