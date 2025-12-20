import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface RadioTabItem {
  value: number;
  label: string;
}

export interface SchemaItem {
  type: string;
  label?: string | Record<string, string>;
  name?: string;
  buttonLabel?: string;
  submits?: boolean;
  resets?: boolean;
  secondary?: boolean;
  danger?: boolean;
  tag?: string;
  content?: string;
  info?: string;
  inputType?: string;
  placeholder?: string;
  description?: string;
  full?: boolean;
  align?: 'left' | 'center' | 'right';
  autocomplete?: string;
  rules?: string[];
  text?: string;
  radioName?: number;
  radioValue?: number;
  view?: string;
  items?: RadioTabItem[];
  fieldName?: string;
  disabled?: boolean;
  id?: string;
  readonly?: boolean;
  attrs?: Record<string, string>;
  buttonType?: string;
  href?: string;
  target?: string;
  default?: any;
  expression?: string;
  forceNumbers?: boolean;
  addons?: {
    before?: string;
    after?: string;
  };
  allowIncomplete?: boolean;
  unmask?: boolean;
  floating?: string;
  endpoint?: string;
  method?: string;
  trueValue?: any;
  falseValue?: any;
  labels?: {
    on?: string;
    off?: string;
  };
  closeOnSelect?: boolean;
  search?: boolean;
  trackBy?: string;
  min?: number | string;
  max?: number | string;
  step?: number;
  format?: {
    prefix?: string;
    suffix?: string;
    thousand?: string;
  };
  url?: string;
  accept?: string;
  removeTempEndpoint?: {
    url?: string;
  };
  uploadTempEndpoint?: {
    url?: string;
  };
  removeEndpoint?: {
    url?: string;
  };
  displayFormat?: string;
  valueFormat?: string;
  loadFormat?: string;
  disables?: (string | number)[];
  meta?: boolean;
  decorators?: {
    before?: string;
    between?: string;
    after?: string;
  };
  builder?: {
    type: string;
    label: string | Record<string, string>;
  };
  columns?: {
    container: number;
  };
}

export interface StepItem {
  label: string | Record<string, string>;
  elements: string[];
  builder?: {
    type: string;
  };
  buttons?: {
    previous: boolean;
  };
  labels?: {
    next?: string | Record<string, string>;
    previous?: string | Record<string, string>;
  };
}

export interface FormType {
  schema: Record<string, SchemaItem | undefined>;
  steps?: Record<string, StepItem>;
}

export const useFormStore = defineStore('form', () => {
  const form = ref<FormType>({ schema: {} });

  return { form };
});
