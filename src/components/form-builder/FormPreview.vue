<script lang="ts" setup>
import type { FormType } from '@/store/form';

defineProps<{
  form: FormType;
}>();
</script>

<template>
  <div class="w-full">
    <vueform
      :on-submit="(data: any) => console.log('submit', data?.data)"
      :schema="form.schema as any"
      :steps="form.steps as any"
      class="w-full"
    />
  </div>
</template>
