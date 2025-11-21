<script lang="ts" setup>
import { Icon } from '@iconify/vue';

defineProps<{
  previewMode: boolean;
  stepsEnabled: boolean;
  isElementsOpen: boolean;
}>();

defineEmits<{
  (e: 'toggle-preview'): void;
  (e: 'start-steps'): void;
  (e: 'toggle-elements'): void;
  (e: 'clear-form'): void;
}>();
</script>

<template>
  <div class="flex flex-col justify-between py-4!">
    <div class="flex flex-col gap-1">
      <VBtn icon variant="elevated" @click="$emit('toggle-preview')">
        <Icon :icon="previewMode ? 'lucide:eye-off' : 'lucide:eye'" />
      </VBtn>
      <VBtn v-if="!stepsEnabled" icon variant="elevated" @click="$emit('start-steps')">
        <Icon icon="lucide:blocks" />
      </VBtn>
    </div>

    <div class="flex flex-col gap-1">
      <VBtn class="rtl:rotate-180" icon variant="elevated" @click="$emit('toggle-elements')">
        <Icon :icon="isElementsOpen ? 'lucide:arrow-left-to-line' : 'lucide:arrow-right-from-line'" />
      </VBtn>
      <VBtn icon variant="elevated" @click="$emit('clear-form')">
        <Icon icon="lucide:trash" />
      </VBtn>
    </div>
  </div>
</template>
