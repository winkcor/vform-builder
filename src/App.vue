<script setup lang="ts">
import { ref, watch } from 'vue';

import type { FormType } from '@/store/form';

import FormBuilder from '@/components/FormBuilder.vue';

const formData = ref<FormType>({ schema: {} });
const formBuilderRef = ref<InstanceType<typeof FormBuilder> | null>(null);

watch(
  () => formBuilderRef.value?.exportData,
  (newData: FormType | undefined) => {
    if (newData) {
      console.log('Form data updated:', newData);
    }
  },
  { deep: true },
);
</script>

<template>
  <VApp>
    <div class="relative flex h-screen max-h-screen w-full flex-col">
      <FormBuilder ref="formBuilderRef" v-model="formData" locale="en" theme="dark" />
    </div>
  </VApp>
</template>
