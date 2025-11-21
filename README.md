# Vue Form Builder – Extended Wrapper

A lightweight wrapper built on top of **Vue Form Builder**, providing additional features such as theming, localization, and easy external control through refs.

This component enhances the base form builder while keeping the original API intact.

## 🚀 Features

- **Theme Support** – Switch between `light` and `dark` themes
- **Localization** – Choose built-in locales like `en`, `fa`, etc.
- **Custom Locale Data** – Override any translation key using your own object
- **Ref Access** – Call FormBuilder methods programmatically
- Fully compatible with Vue Form Builder’s schema and v-model system

## 📦 Installation

```bash
npm install @winkcor/vueform-builder
# or
yarn add @winkcor/vueform-builder
# or
pnpm add @winkcor/vueform-builder
```

# Example Usage of Vue Form Builder Wrapper

This guide shows how to use the extended Form Builder component with:

- `v-model`
- `ref` access
- `locale`
- `theme`
- `custom-locale-data`

# Usage Example

This example shows how to use the extended **Form Builder** with:

- A custom Vue form component (`VForm` `vueform` component with custom styles)
- Automatic locale from `vue-i18n`
- Dynamic theme from `$colorMode`
- Built-in Form Builder stylesheet

## Basic Usage

```vue
<script lang="ts" setup>
import { VForm } from '#components';
import { FormBuilder } from '@winkcor/vueform-builder';

import '@winkcor/vueform-builder/style.css';

</script>

<template>
  <FormBuilder :form-component="VForm" :locale="locale" theme="dark"
</template>
```
