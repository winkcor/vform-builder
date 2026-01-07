<script lang="ts" setup>
import { Icon } from '@iconify/vue';

import type { FormType, StepItem } from '@/store/form';

import { useFormStore } from '@/store/form';
import { usePropertiesForm } from '@/store/propertiesPanel';

const formStore = useFormStore();
const propertyForm = usePropertiesForm();

defineProps<{
  stepsEnabled: boolean;
  currentStepKey: string | null;
  form: FormType;
}>();

defineEmits<{
  (e: 'add-step'): void;
  (e: 'remove-step', key: string): void;
  (e: 'delete-steps'): void;
  (e: 'select-step', key: string): void;
}>();

const handleStepClick = (key: string, step: StepItem) => {
  const stepWithBuilder = {
    ...step,
    builder: step.builder || { type: 'steps' },
  };

  if (formStore.form.steps && formStore.form.steps[key] && !formStore.form.steps[key]!.builder) {
    formStore.form.steps[key] = {
      ...formStore.form.steps[key]!,
      builder: { type: 'steps' },
    };
  }

  propertyForm.step = { id: key, ...stepWithBuilder };
  propertyForm.item = null;
};
</script>

<template>
  <div v-if="stepsEnabled" class="mb-2 flex w-full items-center gap-2">
    <div class="flex w-full items-center gap-2">
      <VBtn type="button" icon size="small" variant="text" @click="$emit('delete-steps')">
        <Icon icon="lucide:x" />
      </VBtn>

      <div class="relative flex w-full flex-row items-start">
        <span class="absolute top-[7px] right-1 left-1 h-1 bg-[var(--vf-primary)]" />
        <div
          v-for="key in form.steps ? Object.keys(form.steps) : []"
          :key="key"
          class="group flex w-full items-center [&:first-of-type]:items-start [&:last-child]:items-end"
          @click="
            if (form.steps?.[key]) {
              handleStepClick(key, form.steps[key]);
            }
            $emit('select-step', key);
          "
        >
          <div
            class="relative flex h-full w-full flex-col [align-items:inherit] gap-2 border-1 border-transparent group-hover:border-(--vf-primary)"
            :class="[propertyForm.step?.id === key && 'border-(--vf-primary)!']"
          >
            <div
              class="ent-0 absolute bottom-full flex w-full justify-between opacity-0 transition-opacity group-hover:opacity-100!"
              :class="[propertyForm.item?.id === key && 'opacity-100!']"
            >
              <button type="button" class="bg-[var(--vf-primary)]! p-1!" @click.stop="$emit('remove-step', key)">
                <Icon icon="lucide:trash" />
              </button>
            </div>
            <div
              :class="[
                currentStepKey === key && 'after:absolute after:inset-[4px] after:rounded-full after:bg-white after:content-[\'\']',
              ]"
              class="relative z-2 h-4 w-4 rounded-full bg-[var(--vf-primary)]"
            />
            {{ form.steps?.[key]?.label || key }}
          </div>
        </div>
      </div>

      <VBtn type="button" icon size="small" variant="text" @click="$emit('add-step')">
        <Icon icon="lucide:plus" />
      </VBtn>
    </div>
  </div>
</template>
