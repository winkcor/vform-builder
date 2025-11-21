<script lang="ts" setup>
import { Icon } from '@iconify/vue';

defineProps<{
  isSettingsOpen: boolean;
}>();

defineEmits<{
  (e: 'show-export'): void;
  (e: 'toggle-settings'): void;
}>();
</script>

<template>
  <div class="flex flex-col justify-between py-4!">
    <div>
      <VBtn icon variant="elevated" @click="$emit('show-export')">
        <Icon icon="lucide:settings-2" />
      </VBtn>
    </div>

    <div>
      <VBtn class="rtl:rotate-180" icon variant="elevated" @click="$emit('toggle-settings')">
        <Icon :icon="isSettingsOpen ? 'lucide:arrow-right-to-line' : 'lucide:arrow-left-from-line'" />
      </VBtn>
    </div>
  </div>
</template>
