<script lang="ts" setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

import { useFormStore } from '@/store/form';
import { usePropertiesForm } from '@/store/propertiesPanel';

import { useI18n } from './composables/useI18n';

const formStore = useFormStore();
const propertyForm = usePropertiesForm();
const { t } = useI18n();

const isStaticElement = computed(() => propertyForm.item?.type === 'static');
const isFieldElement = computed(
  () =>
    propertyForm.item?.type === 'text' ||
    propertyForm.item?.type === 'textarea' ||
    propertyForm.item?.type === 'radio' ||
    propertyForm.item?.type === 'radiogroup' ||
    propertyForm.item?.type === 'phone' ||
    propertyForm.item?.type === 'editor' ||
    propertyForm.item?.type === 'checkbox' ||
    propertyForm.item?.type === 'checkboxgroup' ||
    propertyForm.item?.type === 'toggle' ||
    propertyForm.item?.type === 'select' ||
    propertyForm.item?.type === 'tags' ||
    propertyForm.item?.type === 'slider' ||
    propertyForm.item?.type === 'file' ||
    propertyForm.item?.type === 'date' ||
    propertyForm.item?.type === 'hidden' ||
    propertyForm.item?.builder?.type === 'email' ||
    propertyForm.item?.builder?.type === 'number' ||
    propertyForm.item?.inputType === 'email' ||
    propertyForm.item?.inputType === 'number',
);
const isButtonElement = computed(() => propertyForm.item?.type === 'button');

const isRadioField = computed(() => propertyForm.item?.type === 'radio');
const isRadioGroup = computed(() => propertyForm.item?.type === 'radiogroup');
const isTextInput = computed(() => {
  const itemType = propertyForm.item?.type;
  return itemType === 'text' || itemType === 'textarea' || isEmailField.value || isNumberField.value;
});

const isEmailField = computed(() => {
  const inputType = propertyForm.item?.inputType;
  const builderType = propertyForm.item?.builder?.type;
  return builderType === 'email' || inputType === 'email';
});

const isNumberField = computed(() => {
  const inputType = propertyForm.item?.inputType;
  const builderType = propertyForm.item?.builder?.type;
  return builderType === 'number' || inputType === 'number';
});

const isTextOrTextarea = computed(() => {
  const itemType = propertyForm.item?.type;
  return (itemType === 'text' || itemType === 'textarea') && !isEmailField.value && !isNumberField.value;
});

const alignValues = ['left', 'center', 'right'] as const;
const alignOptions = computed(() =>
  alignValues.map((value) => ({
    title: t(value === 'left' ? 'alignLeft' : value === 'center' ? 'alignCenter' : 'alignRight'),
    value,
  })),
);

function changeKeyName(obj: Record<string, any>, oldName: string, newName: string) {
  const newObj = Object.fromEntries(Object.entries(obj).map(([k, v]) => (k === oldName ? [newName, v] : [k, v])));
  Object.keys(obj).forEach((k) => delete (obj as any)[k]);
  Object.assign(obj, newObj);
  formStore.form.schema = obj;
}

function updateStepLabel(val: string) {
  if (propertyForm.step && formStore.form.steps) {
    propertyForm.step.label = val;
    const stepKey = propertyForm.step.id;
    if (formStore.form.steps[stepKey]) {
      formStore.form.steps[stepKey] = {
        ...formStore.form.steps[stepKey]!,
        label: val,
        builder: formStore.form.steps[stepKey]!.builder || { type: 'steps' },
      };
    }
  }
}

function updateStepNextLabel(val: string) {
  if (propertyForm.step && formStore.form.steps) {
    if (!propertyForm.step.labels) {
      propertyForm.step.labels = {};
    }
    propertyForm.step.labels.next = val;
    const stepKey = propertyForm.step.id;
    if (formStore.form.steps[stepKey]) {
      formStore.form.steps[stepKey] = {
        ...formStore.form.steps[stepKey]!,
        labels: {
          ...formStore.form.steps[stepKey]!.labels,
          next: val,
        },
        builder: formStore.form.steps[stepKey]!.builder || { type: 'steps' },
      };
    }
  }
}

function updateStepPreviousLabel(val: string) {
  if (propertyForm.step && formStore.form.steps) {
    if (!propertyForm.step.labels) {
      propertyForm.step.labels = {};
    }
    propertyForm.step.labels.previous = val;
    const stepKey = propertyForm.step.id;
    if (formStore.form.steps[stepKey]) {
      formStore.form.steps[stepKey] = {
        ...formStore.form.steps[stepKey]!,
        labels: {
          ...formStore.form.steps[stepKey]!.labels,
          previous: val,
        },
        builder: formStore.form.steps[stepKey]!.builder || { type: 'steps' },
      };
    }
  }
}

function updateStepPreviousButton(val: boolean | null) {
  if (propertyForm.step && formStore.form.steps && val !== null) {
    if (!propertyForm.step.buttons) {
      propertyForm.step.buttons = { previous: true };
    }
    propertyForm.step.buttons.previous = val;
    const stepKey = propertyForm.step.id;
    if (formStore.form.steps[stepKey]) {
      formStore.form.steps[stepKey] = {
        ...formStore.form.steps[stepKey]!,
        buttons: {
          ...formStore.form.steps[stepKey]!.buttons,
          previous: val,
        },
        builder: formStore.form.steps[stepKey]!.builder || { type: 'steps' },
      };
    }
  }
}

function updateItemContent(val: string) {
  if (propertyForm.item) {
    propertyForm.item.content = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      formStore.form.schema[propertyForm.item.id]!.content = val;
    }
  }
}

function updateItemLabel(val: string) {
  if (propertyForm.item) {
    propertyForm.item.label = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      const schemaItem = formStore.form.schema[propertyForm.item.id]!;
      schemaItem.label = val;
      if (schemaItem.builder) {
        schemaItem.builder.label = val;
      }
    }
  }
}

function updateItemInfo(val: string) {
  if (propertyForm.item) {
    propertyForm.item.info = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      formStore.form.schema[propertyForm.item.id]!.info = val;
    }
  }
}

function updateItemName(val: string) {
  if (propertyForm.item && !formStore.form.schema[val]) {
    const id = propertyForm.item.id;
    changeKeyName(formStore.form.schema, id, val);
    formStore.form.schema[id] = undefined;
    propertyForm.item.name = val;
    propertyForm.item.id = val;
  }
}

function updateItemInputType(val: string) {
  if (propertyForm.item) {
    propertyForm.item.inputType = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      const schemaItem = formStore.form.schema[propertyForm.item.id]!;
      schemaItem.inputType = val;
      if (val === 'email' || val === 'number') {
        if (!schemaItem.builder) {
          schemaItem.builder = { type: val, label: schemaItem.label || '' };
        } else {
          schemaItem.builder.type = val;
        }
        if (propertyForm.item.builder) {
          propertyForm.item.builder.type = val;
        }
      }
    }
  }
}

function getRuleValue(rulePrefix: string): string {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]?.rules) return '';
  const rules = formStore.form.schema[propertyForm.item.id]!.rules || [];
  const rule = rules.find((r) => r.startsWith(rulePrefix));
  if (!rule) return '';
  const parts = rule.split(':');
  return parts.length > 1 ? parts[1]! : '';
}

function updateRule(rulePrefix: string, value: string) {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]) return;

  const schemaItem = formStore.form.schema[propertyForm.item.id]!;
  if (!schemaItem.rules) {
    schemaItem.rules = [];
  }

  schemaItem.rules = schemaItem.rules.filter((r) => !r.startsWith(rulePrefix));

  if (value && value.trim() !== '') {
    schemaItem.rules.push(`${rulePrefix}:${value}`);
  }

  if (propertyForm.item) {
    propertyForm.item.rules = [...schemaItem.rules];
  }
}

function updateItemPlaceholder(val: string) {
  if (propertyForm.item) {
    propertyForm.item.placeholder = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      formStore.form.schema[propertyForm.item.id]!.placeholder = val;
    }
  }
}

function updateItemDescription(val: string) {
  if (propertyForm.item) {
    propertyForm.item.description = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      formStore.form.schema[propertyForm.item.id]!.description = val;
    }
  }
}

function updateButtonLabel(val: string) {
  if (propertyForm.item) {
    propertyForm.item.buttonLabel = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      formStore.form.schema[propertyForm.item.id]!.buttonLabel = val;
    }
  }
}

function updateButtonFull(val: boolean | null) {
  if (propertyForm.item && val !== null) {
    propertyForm.item.full = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      formStore.form.schema[propertyForm.item.id]!.full = val;
    }
  }
}

function updateButtonAlign(val: string) {
  if (!propertyForm.item) return;
  const alignValue = alignValues.includes(val as (typeof alignValues)[number]) ? (val as (typeof alignValues)[number]) : 'left';
  propertyForm.item.align = alignValue;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.align = alignValue;
  }
}

function updateButtonType(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.buttonType = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.buttonType = val;
  }
}

function updateButtonHref(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.href = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.href = val;
  }
}

function updateStaticHref(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.href = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.href = val;
  }
}

function updateStaticTarget(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.target = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.target = val;
  }
}

function updateDefault(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.default = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.default = val;
  }
}

function updateExpression(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.expression = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.expression = val;
  }
}

function updateForceNumbers(val: boolean | null) {
  if (!propertyForm.item || val === null) return;
  propertyForm.item.forceNumbers = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.forceNumbers = val;
  }
}

function updateAddons(field: 'before' | 'after', val: string) {
  if (!propertyForm.item) return;
  if (!propertyForm.item.addons) {
    propertyForm.item.addons = {};
  }
  propertyForm.item.addons[field] = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    const schemaItem = formStore.form.schema[propertyForm.item.id]!;
    if (!schemaItem.addons) {
      schemaItem.addons = {};
    }
    schemaItem.addons[field] = val;
  }
}

function updateAllowIncomplete(val: boolean | null) {
  if (!propertyForm.item || val === null) return;
  propertyForm.item.allowIncomplete = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.allowIncomplete = val;
  }
}

function updateUnmask(val: boolean | null) {
  if (!propertyForm.item || val === null) return;
  propertyForm.item.unmask = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.unmask = val;
  }
}

function updateFloating(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.floating = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.floating = val;
  }
}

function updateEndpoint(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.endpoint = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.endpoint = val;
  }
}

function updateMethod(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.method = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.method = val;
  }
}

function updateTrueValue(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.trueValue = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.trueValue = val;
  }
}

function updateFalseValue(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.falseValue = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.falseValue = val;
  }
}

function updateToggleLabel(field: 'on' | 'off', val: string) {
  if (!propertyForm.item) return;
  if (!propertyForm.item.labels) {
    propertyForm.item.labels = {};
  }
  propertyForm.item.labels[field] = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    const schemaItem = formStore.form.schema[propertyForm.item.id]!;
    if (!schemaItem.labels) {
      schemaItem.labels = {};
    }
    schemaItem.labels[field] = val;
  }
}

function updateCloseOnSelect(val: boolean | null) {
  if (!propertyForm.item || val === null) return;
  propertyForm.item.closeOnSelect = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.closeOnSelect = val;
  }
}

function updateSearch(val: boolean | null) {
  if (!propertyForm.item || val === null) return;
  propertyForm.item.search = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.search = val;
  }
}

function updateTrackBy(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.trackBy = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.trackBy = val;
  }
}

function updateSliderNumber(field: 'min' | 'max' | 'step', val: string) {
  if (!propertyForm.item) return;
  const numVal = val === '' ? undefined : Number(val);
  if (field === 'min' || field === 'max' || field === 'step') {
    (propertyForm.item as any)[field] = numVal as any;
    if (formStore.form.schema[propertyForm.item.id]) {
      (formStore.form.schema[propertyForm.item.id] as any)[field] = numVal as any;
    }
  }
}

function updateSliderDefault(val: string) {
  if (!propertyForm.item) return;
  const numVal = val === '' ? undefined : Number(val);
  propertyForm.item.default = numVal;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.default = numVal;
  }
}

function updateSliderFormat(field: 'prefix' | 'suffix' | 'thousand', val: string) {
  if (!propertyForm.item) return;
  if (!propertyForm.item.format) {
    propertyForm.item.format = {};
  }
  propertyForm.item.format[field] = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    const schemaItem = formStore.form.schema[propertyForm.item.id]!;
    if (!schemaItem.format) {
      schemaItem.format = {};
    }
    schemaItem.format[field] = val;
  }
}

function updateFileUrl(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.url = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.url = val;
  }
}

function updateFileAccept(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.accept = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.accept = val;
  }
}

function updateFileEndpoint(field: 'removeTempEndpoint' | 'uploadTempEndpoint' | 'removeEndpoint', val: string) {
  if (!propertyForm.item) return;
  if (!(propertyForm.item as any)[field]) {
    (propertyForm.item as any)[field] = {};
  }
  (propertyForm.item as any)[field].url = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    const schemaItem = formStore.form.schema[propertyForm.item.id]!;
    if (!(schemaItem as any)[field]) {
      (schemaItem as any)[field] = {};
    }
    (schemaItem as any)[field].url = val;
  }
}

function updateDateFormat(field: 'displayFormat' | 'valueFormat' | 'loadFormat', val: string) {
  if (!propertyForm.item) return;
  (propertyForm.item as any)[field] = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    (formStore.form.schema[propertyForm.item.id] as any)[field] = val;
  }
}

function updateDateBoundary(field: 'min' | 'max', val: string) {
  if (!propertyForm.item) return;
  (propertyForm.item as any)[field] = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    (formStore.form.schema[propertyForm.item.id] as any)[field] = val;
  }
}

function updateDateDefault(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.default = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.default = val;
  }
}

function updateDateDisables(val: string) {
  if (!propertyForm.item) return;
  const list = val
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v !== '');
  propertyForm.item.disables = list;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.disables = list;
  }
}

function updateDateAddon(field: 'before' | 'after', val: string) {
  if (!propertyForm.item) return;
  if (!propertyForm.item.addons) {
    propertyForm.item.addons = {};
  }
  propertyForm.item.addons[field] = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    const schemaItem = formStore.form.schema[propertyForm.item.id]!;
    if (!schemaItem.addons) {
      schemaItem.addons = {};
    }
    schemaItem.addons[field] = val;
  }
}

function updateHiddenDefault(val: string) {
  if (!propertyForm.item) return;
  propertyForm.item.default = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.default = val;
  }
}

function updateHiddenMeta(val: boolean | null) {
  if (!propertyForm.item || val === null) return;
  propertyForm.item.meta = val;
  if (formStore.form.schema[propertyForm.item.id]) {
    formStore.form.schema[propertyForm.item.id]!.meta = val;
  }
}

function hasRule(ruleName: string): boolean {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]?.rules) return false;
  return formStore.form.schema[propertyForm.item.id]!.rules!.includes(ruleName);
}

function toggleRule(ruleName: string, enabled: boolean) {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]) return;

  const schemaItem = formStore.form.schema[propertyForm.item.id]!;
  if (!schemaItem.rules) {
    schemaItem.rules = [];
  }

  if (enabled) {
    if (!schemaItem.rules.includes(ruleName)) {
      schemaItem.rules.push(ruleName);
    }
  } else {
    schemaItem.rules = schemaItem.rules.filter((r) => r !== ruleName);
  }

  if (propertyForm.item) {
    propertyForm.item.rules = [...schemaItem.rules];
  }
}

function updateRadioText(val: string) {
  if (propertyForm.item) {
    propertyForm.item.text = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      formStore.form.schema[propertyForm.item.id]!.text = val;
    }
  }
}

function updateRadioName(val: string) {
  if (propertyForm.item) {
    if (val && val.trim() !== '') {
      const numVal = parseInt(val, 10);
      if (!isNaN(numVal)) {
        propertyForm.item.radioName = numVal;
        if (formStore.form.schema[propertyForm.item.id]) {
          formStore.form.schema[propertyForm.item.id]!.radioName = numVal;
        }
      }
    } else {
      propertyForm.item.radioName = undefined;
      if (formStore.form.schema[propertyForm.item.id]) {
        formStore.form.schema[propertyForm.item.id]!.radioName = undefined;
      }
    }
  }
}

function updateRadioValue(val: string) {
  if (propertyForm.item) {
    if (val && val.trim() !== '') {
      const numVal = parseInt(val, 10);
      if (!isNaN(numVal)) {
        propertyForm.item.radioValue = numVal;
        if (formStore.form.schema[propertyForm.item.id]) {
          formStore.form.schema[propertyForm.item.id]!.radioValue = numVal;
        }
      }
    } else {
      propertyForm.item.radioValue = undefined;
      if (formStore.form.schema[propertyForm.item.id]) {
        formStore.form.schema[propertyForm.item.id]!.radioValue = undefined;
      }
    }
  }
}

function updateRadioGroupFieldName(val: string) {
  if (propertyForm.item) {
    propertyForm.item.fieldName = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      formStore.form.schema[propertyForm.item.id]!.fieldName = val;
    }
  }
}

function getRadioGroupItems() {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]) return [];
  return formStore.form.schema[propertyForm.item.id]!.items || [];
}

function addRadioTabItem() {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]) return;
  const schemaItem = formStore.form.schema[propertyForm.item.id]!;
  if (!schemaItem.items) {
    schemaItem.items = [];
  }
  const newValue = schemaItem.items.length > 0 ? Math.max(...schemaItem.items.map((i) => i.value)) + 1 : 0;
  schemaItem.items.push({ value: newValue, label: '' });
  if (propertyForm.item) {
    propertyForm.item.items = [...schemaItem.items];
  }
}

function removeRadioTabItem(index: number) {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]) return;
  const schemaItem = formStore.form.schema[propertyForm.item.id]!;
  if (schemaItem.items) {
    schemaItem.items.splice(index, 1);
    if (propertyForm.item) {
      propertyForm.item.items = [...schemaItem.items];
    }
  }
}

function updateRadioTabItem(index: number, field: 'value' | 'label', val: string) {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]) return;
  const schemaItem = formStore.form.schema[propertyForm.item.id]!;
  if (schemaItem.items && schemaItem.items[index]) {
    if (field === 'value') {
      const numVal = parseInt(val, 10);
      if (!isNaN(numVal)) {
        schemaItem.items[index]!.value = numVal;
      }
    } else {
      schemaItem.items[index]!.label = val;
    }
    if (propertyForm.item) {
      propertyForm.item.items = [...schemaItem.items];
    }
  }
}

function updateItemId(val: string) {
  if (propertyForm.item && formStore.form.schema[propertyForm.item.id]) {
    const schemaItem = formStore.form.schema[propertyForm.item.id]!;
    schemaItem.id = val;
    if (propertyForm.item) {
      propertyForm.item.id = val;
    }
  }
}

function updateItemDisabled(val: boolean | null) {
  if (propertyForm.item && val !== null) {
    propertyForm.item.disabled = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      formStore.form.schema[propertyForm.item.id]!.disabled = val;
    }
  }
}

function updateItemReadonly(val: boolean | null) {
  if (propertyForm.item && val !== null) {
    propertyForm.item.readonly = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      formStore.form.schema[propertyForm.item.id]!.readonly = val;
    }
  }
}

function updateItemAutocomplete(val: string) {
  if (propertyForm.item) {
    propertyForm.item.autocomplete = val;
    if (formStore.form.schema[propertyForm.item.id]) {
      formStore.form.schema[propertyForm.item.id]!.autocomplete = val;
    }
  }
}

function updateDecorator(field: 'before' | 'between' | 'after', val: string) {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]) return;
  const schemaItem = formStore.form.schema[propertyForm.item.id]!;

  (schemaItem as any)[field] = val;

  if (propertyForm.item) {
    (propertyForm.item as any)[field] = val;
  }

  if (schemaItem.decorators) {
    delete schemaItem.decorators;
  }
  if (propertyForm.item && (propertyForm.item as any).decorators) {
    delete (propertyForm.item as any).decorators;
  }
}

function getDecoratorValue(field: 'before' | 'between' | 'after'): string {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]) return '';
  const schemaItem = formStore.form.schema[propertyForm.item.id]!;

  return (schemaItem as any)[field] || '';
}

function updateCustomAttr(key: string, val: string) {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]) return;
  const schemaItem = formStore.form.schema[propertyForm.item.id]!;
  if (!schemaItem.attrs) {
    schemaItem.attrs = {};
  }
  if (val && val.trim() !== '') {
    schemaItem.attrs[key] = val;
  } else {
    delete schemaItem.attrs[key];
  }
  if (propertyForm.item) {
    propertyForm.item.attrs = { ...schemaItem.attrs };
  }
}

function addCustomAttr() {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]) return;
  const schemaItem = formStore.form.schema[propertyForm.item.id]!;
  if (!schemaItem.attrs) {
    schemaItem.attrs = {};
  }
  const newKey = `attr_${Object.keys(schemaItem.attrs).length + 1}`;
  schemaItem.attrs[newKey] = '';
  if (propertyForm.item) {
    propertyForm.item.attrs = { ...schemaItem.attrs };
  }
}

function removeCustomAttr(key: string) {
  if (!propertyForm.item || !formStore.form.schema[propertyForm.item.id]) return;
  const schemaItem = formStore.form.schema[propertyForm.item.id]!;
  if (schemaItem.attrs) {
    delete schemaItem.attrs[key];
    if (propertyForm.item) {
      propertyForm.item.attrs = { ...schemaItem.attrs };
    }
  }
}

defineProps<{
  isOpen: boolean;
}>();
</script>

<template>
  <aside :class="isOpen ? 'w-120' : 'w-0'" class="m-2! bg-[rgb(var(--v-theme-surface))] transition-all duration-300">
    <VExpansionPanels v-if="propertyForm.step">
      <VExpansionPanel>
        <VExpansionPanelTitle>{{ t('properties') }}</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VTextField :model-value="propertyForm.step?.label || ''" :label="t('label')" @update:model-value="updateStepLabel" />
          <VTextField
            :model-value="propertyForm.step?.labels?.next || ''"
            label="Next Button Label"
            @update:model-value="updateStepNextLabel"
          />
          <VTextField
            :model-value="propertyForm.step?.labels?.previous || ''"
            label="Previous Button Label"
            @update:model-value="updateStepPreviousLabel"
          />
          <VSwitch
            :model-value="(propertyForm.step?.buttons?.previous ?? true) as boolean"
            label="Show Previous Button"
            @update:model-value="updateStepPreviousButton"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels v-if="propertyForm.item && isStaticElement">
      <VExpansionPanel>
        <VExpansionPanelTitle>{{ t('properties') }}</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VTextField
            :model-value="propertyForm.item?.content || ''"
            :label="t('content')"
            @update:model-value="updateItemContent"
          />
          <VTextField :model-value="propertyForm.item?.label || ''" :label="t('label')" @update:model-value="updateItemLabel" />
          <VTextField :model-value="propertyForm.item?.info || ''" :label="t('tooltip')" @update:model-value="updateItemInfo" />
          <VTextField
            v-if="propertyForm.item?.builder?.type === 'link'"
            :model-value="propertyForm.item?.href || ''"
            :label="t('href')"
            @update:model-value="updateStaticHref"
          />
          <VTextField
            v-if="propertyForm.item?.builder?.type === 'link'"
            :model-value="propertyForm.item?.target || ''"
            :label="t('target')"
            @update:model-value="updateStaticTarget"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels v-if="propertyForm.item && (isFieldElement || isButtonElement)" variant="accordion">
      <VExpansionPanel>
        <VExpansionPanelTitle>{{ t('properties') }}</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VTextField :model-value="propertyForm.item?.name || ''" :label="t('name')" @update:model-value="updateItemName" />
          <VDivider class="my-3" />
          <VTextField :model-value="propertyForm.item?.label || ''" :label="t('label')" @update:model-value="updateItemLabel" />
          <VTextField :model-value="propertyForm.item?.info || ''" :label="t('tooltip')" @update:model-value="updateItemInfo" />
          <VDivider class="my-3" />
          <VTextField
            :model-value="propertyForm.item?.description || ''"
            :label="t('description')"
            @update:model-value="updateItemDescription"
          />

          <template v-if="isFieldElement">
            <template v-if="isRadioField">
              <VTextField :model-value="propertyForm.item?.text || ''" :label="t('text')" @update:model-value="updateRadioText" />
              <VTextField
                :model-value="propertyForm.item?.radioName?.toString() || ''"
                :label="t('radioName')"
                type="number"
                @update:model-value="updateRadioName"
              />
              <VTextField
                :model-value="propertyForm.item?.radioValue?.toString() || ''"
                :label="t('radioValue')"
                type="number"
                @update:model-value="updateRadioValue"
              />
            </template>

            <template v-else-if="!isRadioGroup">
              <VSelect
                v-if="propertyForm.item?.type === 'text'"
                :model-value="propertyForm.item?.inputType || 'text'"
                :label="t('inputType')"
                :items="['text', 'email', 'password', 'number', 'tel', 'url', 'search']"
                @update:model-value="updateItemInputType"
              />
              <VTextField
                :model-value="propertyForm.item?.placeholder || ''"
                :label="t('placeholder')"
                @update:model-value="updateItemPlaceholder"
              />
            </template>

            <VSwitch
              :model-value="hasRule('required')"
              :label="t('required')"
              @update:model-value="(val) => toggleRule('required', val ?? false)"
            />

            <VSwitch
              v-if="isTextInput || isRadioGroup"
              :model-value="hasRule('nullable')"
              :label="t('nullable')"
              @update:model-value="(val) => toggleRule('nullable', val ?? false)"
            />

            <template v-if="isTextOrTextarea">
              <VTextField
                :model-value="getRuleValue('min')"
                :label="t('minLength')"
                type="number"
                @update:model-value="(val) => updateRule('min', val)"
              />
              <VTextField
                :model-value="getRuleValue('max')"
                :label="t('maxLength')"
                type="number"
                @update:model-value="(val) => updateRule('max', val)"
              />
              <VTextField
                :model-value="getRuleValue('size')"
                :label="t('exactLength')"
                type="number"
                @update:model-value="(val) => updateRule('size', val)"
              />
            </template>

            <template v-else-if="isEmailField">
              <VTextField
                :model-value="getRuleValue('min')"
                :label="t('minLength')"
                type="number"
                @update:model-value="(val) => updateRule('min', val)"
              />
              <VTextField
                :model-value="getRuleValue('max')"
                :label="t('maxLength')"
                type="number"
                @update:model-value="(val) => updateRule('max', val)"
              />
              <VTextField
                :model-value="getRuleValue('size')"
                :label="t('exactLength')"
                type="number"
                @update:model-value="(val) => updateRule('size', val)"
              />
            </template>

            <template v-else-if="isNumberField">
              <VTextField
                :model-value="getRuleValue('min')"
                :label="t('minValue')"
                type="number"
                @update:model-value="(val) => updateRule('min', val)"
              />
              <VTextField
                :model-value="getRuleValue('max')"
                :label="t('maxValue')"
                type="number"
                @update:model-value="(val) => updateRule('max', val)"
              />
              <VTextField
                :model-value="getRuleValue('size')"
                :label="t('exactValue')"
                type="number"
                @update:model-value="(val) => updateRule('size', val)"
              />
            </template>

            <template v-if="propertyForm.item?.type === 'text' && propertyForm.item?.inputType === 'password'">
              <VTextField
                :model-value="(propertyForm.item?.default as any as string) || ''"
                label="Default"
                @update:model-value="updateDefault"
              />
              <VTextField
                :model-value="propertyForm.item?.expression || ''"
                label="Expression"
                @update:model-value="updateExpression"
              />
              <VSwitch
                :model-value="propertyForm.item?.forceNumbers ?? false"
                label="Force numbers"
                @update:model-value="(val) => updateForceNumbers(val ?? false)"
              />
              <VTextField
                :model-value="propertyForm.item?.addons?.before || ''"
                label="Addon before"
                @update:model-value="(val) => updateAddons('before', val)"
              />
              <VTextField
                :model-value="propertyForm.item?.addons?.after || ''"
                label="Addon after"
                @update:model-value="(val) => updateAddons('after', val)"
              />
            </template>

            <template v-if="propertyForm.item?.type === 'phone'">
              <VSwitch
                :model-value="propertyForm.item?.allowIncomplete ?? false"
                label="Allow incomplete"
                @update:model-value="(val) => updateAllowIncomplete(val ?? false)"
              />
              <VSwitch
                :model-value="propertyForm.item?.unmask ?? false"
                label="Unmask"
                @update:model-value="(val) => updateUnmask(val ?? false)"
              />
            </template>

            <template v-if="propertyForm.item?.builder?.type === 'url'">
              <VTextField :model-value="propertyForm.item?.floating || ''" label="Floating" @update:model-value="updateFloating" />
            </template>

            <template v-if="propertyForm.item?.type === 'editor'">
              <VTextField :model-value="propertyForm.item?.endpoint || ''" label="Endpoint" @update:model-value="updateEndpoint" />
              <VTextField :model-value="propertyForm.item?.method || ''" label="Method" @update:model-value="updateMethod" />
            </template>

            <template v-if="propertyForm.item?.type === 'checkbox'">
              <VTextField :model-value="propertyForm.item?.text || ''" :label="t('text')" @update:model-value="updateRadioText" />
              <VTextField
                :model-value="(propertyForm.item?.trueValue as any as string) || ''"
                label="True value"
                @update:model-value="updateTrueValue"
              />
              <VTextField
                :model-value="(propertyForm.item?.falseValue as any as string) || ''"
                label="False value"
                @update:model-value="updateFalseValue"
              />
            </template>

            <template v-if="propertyForm.item?.type === 'checkboxgroup'">
              <div class="mt-4">
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-sm font-medium">{{ t('items') }}</span>
                  <VBtn size="small" variant="outlined" @click="addRadioTabItem">{{ t('addItem') }}</VBtn>
                </div>
                <div v-for="(item, index) in getRadioGroupItems()" :key="index" class="mb-2 flex items-center gap-2">
                  <VTextField
                    :model-value="item.value.toString()"
                    :label="t('value')"
                    type="number"
                    class="flex-1"
                    density="compact"
                    @update:model-value="(val) => updateRadioTabItem(index, 'value', val)"
                  />
                  <span class="text-gray-500">→</span>
                  <VTextField
                    :model-value="item.label"
                    :label="t('label')"
                    class="flex-1"
                    density="compact"
                    @update:model-value="(val) => updateRadioTabItem(index, 'label', val)"
                  />
                  <VBtn size="small" variant="text" color="error" icon @click="removeRadioTabItem(index)">
                    <Icon icon="lucide:trash" />
                  </VBtn>
                </div>
              </div>
            </template>

            <template v-if="propertyForm.item?.type === 'toggle'">
              <VTextField :model-value="propertyForm.item?.text || ''" :label="t('text')" @update:model-value="updateRadioText" />
              <VTextField
                :model-value="propertyForm.item?.labels?.on || ''"
                label="On label"
                @update:model-value="(val) => updateToggleLabel('on', val)"
              />
              <VTextField
                :model-value="propertyForm.item?.labels?.off || ''"
                label="Off label"
                @update:model-value="(val) => updateToggleLabel('off', val)"
              />
              <VTextField
                :model-value="(propertyForm.item?.trueValue as any as string) || ''"
                label="True value"
                @update:model-value="updateTrueValue"
              />
              <VTextField
                :model-value="(propertyForm.item?.falseValue as any as string) || ''"
                label="False value"
                @update:model-value="updateFalseValue"
              />
            </template>

            <template v-if="propertyForm.item?.type === 'select' || propertyForm.item?.type === 'tags'">
              <div class="mt-4">
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-sm font-medium">{{ t('items') }}</span>
                  <VBtn size="small" variant="outlined" @click="addRadioTabItem">{{ t('addItem') }}</VBtn>
                </div>
                <div v-for="(item, index) in getRadioGroupItems()" :key="index" class="mb-2 flex items-center gap-2">
                  <VTextField
                    :model-value="item.value.toString()"
                    :label="t('value')"
                    type="number"
                    class="flex-1"
                    density="compact"
                    @update:model-value="(val) => updateRadioTabItem(index, 'value', val)"
                  />
                  <span class="text-gray-500">→</span>
                  <VTextField
                    :model-value="item.label"
                    :label="t('label')"
                    class="flex-1"
                    density="compact"
                    @update:model-value="(val) => updateRadioTabItem(index, 'label', val)"
                  />
                  <VBtn size="small" variant="text" color="error" icon @click="removeRadioTabItem(index)">
                    <Icon icon="lucide:trash" />
                  </VBtn>
                </div>
              </div>
              <template v-if="propertyForm.item?.type === 'tags'">
                <VSwitch
                  :model-value="propertyForm.item?.closeOnSelect ?? false"
                  label="Close on select"
                  @update:model-value="(val) => updateCloseOnSelect(val ?? false)"
                />
                <VSwitch
                  :model-value="propertyForm.item?.search ?? false"
                  label="Search"
                  @update:model-value="(val) => updateSearch(val ?? false)"
                />
                <VTextField :model-value="propertyForm.item?.trackBy || ''" label="Track by" @update:model-value="updateTrackBy" />
              </template>
            </template>

            <template v-if="propertyForm.item?.type === 'slider'">
              <VTextField
                :model-value="(propertyForm.item?.default as any as string) || ''"
                label="Default"
                type="number"
                @update:model-value="updateSliderDefault"
              />
              <VTextField
                :model-value="(propertyForm.item?.min as any as string) || ''"
                label="Min"
                type="number"
                @update:model-value="(val) => updateSliderNumber('min', val)"
              />
              <VTextField
                :model-value="(propertyForm.item?.max as any as string) || ''"
                label="Max"
                type="number"
                @update:model-value="(val) => updateSliderNumber('max', val)"
              />
              <VTextField
                :model-value="(propertyForm.item?.step as any as string) || ''"
                label="Step"
                type="number"
                @update:model-value="(val) => updateSliderNumber('step', val)"
              />
              <VTextField
                :model-value="propertyForm.item?.format?.prefix || ''"
                label="Prefix"
                @update:model-value="(val) => updateSliderFormat('prefix', val)"
              />
              <VTextField
                :model-value="propertyForm.item?.format?.suffix || ''"
                label="Suffix"
                @update:model-value="(val) => updateSliderFormat('suffix', val)"
              />
              <VTextField
                :model-value="propertyForm.item?.format?.thousand || ''"
                label="Thousand"
                @update:model-value="(val) => updateSliderFormat('thousand', val)"
              />
            </template>

            <template v-if="propertyForm.item?.type === 'file'">
              <VTextField :model-value="propertyForm.item?.url || ''" label="URL" @update:model-value="updateFileUrl" />
              <VTextField :model-value="propertyForm.item?.accept || ''" label="Accept" @update:model-value="updateFileAccept" />
              <VTextField
                :model-value="propertyForm.item?.removeTempEndpoint?.url || ''"
                label="Remove temp URL"
                @update:model-value="(val) => updateFileEndpoint('removeTempEndpoint', val)"
              />
              <VTextField
                :model-value="propertyForm.item?.uploadTempEndpoint?.url || ''"
                label="Upload temp URL"
                @update:model-value="(val) => updateFileEndpoint('uploadTempEndpoint', val)"
              />
              <VTextField
                :model-value="propertyForm.item?.removeEndpoint?.url || ''"
                label="Remove URL"
                @update:model-value="(val) => updateFileEndpoint('removeEndpoint', val)"
              />
            </template>

            <template v-if="propertyForm.item?.type === 'date'">
              <VTextField
                :model-value="propertyForm.item?.displayFormat || ''"
                label="Display format"
                @update:model-value="(val) => updateDateFormat('displayFormat', val)"
              />
              <VTextField
                :model-value="propertyForm.item?.valueFormat || ''"
                label="Value format"
                @update:model-value="(val) => updateDateFormat('valueFormat', val)"
              />
              <VTextField
                :model-value="propertyForm.item?.loadFormat || ''"
                label="Load format"
                @update:model-value="(val) => updateDateFormat('loadFormat', val)"
              />
              <VTextField
                :model-value="(propertyForm.item?.min as any as string) || ''"
                label="Min date"
                @update:model-value="(val) => updateDateBoundary('min', val)"
              />
              <VTextField
                :model-value="(propertyForm.item?.max as any as string) || ''"
                label="Max date"
                @update:model-value="(val) => updateDateBoundary('max', val)"
              />
              <VTextField
                :model-value="(propertyForm.item?.default as any as string) || ''"
                label="Default"
                @update:model-value="updateDateDefault"
              />
              <VTextField
                :model-value="(propertyForm.item?.disables || []).join(',')"
                label="Disables (comma separated)"
                @update:model-value="updateDateDisables"
              />
              <VTextField
                :model-value="propertyForm.item?.addons?.before || ''"
                label="Addon before"
                @update:model-value="(val) => updateDateAddon('before', val)"
              />
              <VTextField
                :model-value="propertyForm.item?.addons?.after || ''"
                label="Addon after"
                @update:model-value="(val) => updateDateAddon('after', val)"
              />
            </template>

            <template v-if="propertyForm.item?.type === 'hidden'">
              <VTextField
                :model-value="(propertyForm.item?.default as any as string) || ''"
                label="Default"
                @update:model-value="updateHiddenDefault"
              />
              <VSwitch
                :model-value="propertyForm.item?.meta ?? false"
                label="Meta"
                @update:model-value="(val) => updateHiddenMeta(val ?? false)"
              />
            </template>
          </template>

          <template v-else-if="isButtonElement">
            <VTextField
              :model-value="propertyForm.item?.buttonLabel || ''"
              :label="t('buttonLabel')"
              @update:model-value="updateButtonLabel"
            />
            <VSwitch
              :model-value="propertyForm.item?.full ?? false"
              :label="t('fullWidth')"
              @update:model-value="(val) => updateButtonFull(val ?? false)"
            />
            <VSelect
              :model-value="propertyForm.item?.align || 'left'"
              :label="t('alignment')"
              :items="alignOptions"
              item-title="title"
              item-value="value"
              @update:model-value="updateButtonAlign"
            />
            <VSelect
              :model-value="propertyForm.item?.buttonType || 'button'"
              :label="t('buttonType')"
              :items="[
                { title: t('buttonTypeButton'), value: 'button' },
                { title: t('buttonTypeAnchor'), value: 'anchor' },
              ]"
              item-title="title"
              item-value="value"
              @update:model-value="updateButtonType"
            />
            <VTextField
              v-if="propertyForm.item?.buttonType === 'anchor'"
              :model-value="propertyForm.item?.href || ''"
              :label="t('href')"
              @update:model-value="updateButtonHref"
            />
          </template>
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel v-if="isRadioGroup">
        <VExpansionPanelTitle>{{ t('data') }}</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VTextField
            :model-value="propertyForm.item?.fieldName || ''"
            :label="t('fieldName')"
            @update:model-value="updateRadioGroupFieldName"
          />
          <div class="mt-4">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm font-medium">{{ t('items') }}</span>
              <VBtn size="small" variant="outlined" @click="addRadioTabItem">{{ t('addItem') }}</VBtn>
            </div>
            <div v-for="(item, index) in getRadioGroupItems()" :key="index" class="mb-2 flex items-center gap-2">
              <VTextField
                :model-value="item.value.toString()"
                :label="t('value')"
                type="number"
                class="flex-1"
                density="compact"
                @update:model-value="(val) => updateRadioTabItem(index, 'value', val)"
              />
              <span class="text-gray-500">→</span>
              <VTextField
                :model-value="item.label"
                :label="t('label')"
                class="flex-1"
                density="compact"
                @update:model-value="(val) => updateRadioTabItem(index, 'label', val)"
              />
              <VBtn size="small" variant="text" color="error" icon @click="removeRadioTabItem(index)">
                <Icon icon="lucide:trash" />
              </VBtn>
            </div>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel>
        <VExpansionPanelTitle>{{ t('decorators') }}</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VTextField
            :model-value="getDecoratorValue('before')"
            :label="t('before')"
            @update:model-value="(val) => updateDecorator('before', val)"
          />
          <VTextField
            :model-value="getDecoratorValue('between')"
            :label="t('between')"
            @update:model-value="(val) => updateDecorator('between', val)"
          />
          <VTextField
            :model-value="getDecoratorValue('after')"
            :label="t('after')"
            @update:model-value="(val) => updateDecorator('after', val)"
          />
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel>
        <VExpansionPanelTitle>{{ t('attributes') }}</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VTextField :model-value="propertyForm.item?.id || ''" :label="t('id')" @update:model-value="updateItemId" />
          <VSwitch
            :model-value="propertyForm.item?.disabled ?? false"
            :label="t('disabled')"
            @update:model-value="(val) => updateItemDisabled(val ?? false)"
          />
          <VSwitch
            :model-value="propertyForm.item?.readonly ?? false"
            :label="t('readonly')"
            @update:model-value="(val) => updateItemReadonly(val ?? false)"
          />
          <VTextField
            v-if="isTextInput"
            :model-value="propertyForm.item?.autocomplete || ''"
            :label="t('autocomplete')"
            @update:model-value="updateItemAutocomplete"
          />
          <div class="mt-4">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm font-medium">{{ t('customAttributes') }}</span>
              <VBtn size="small" variant="outlined" @click="addCustomAttr">{{ t('addAttribute') }}</VBtn>
            </div>
            <div v-for="(value, key) in propertyForm.item?.attrs || {}" :key="key" class="mb-2 flex items-center gap-2">
              <VTextField
                :model-value="key"
                :label="t('key')"
                class="flex-1"
                density="compact"
                @update:model-value="
                  (newKey) => {
                    if (newKey && newKey !== key) {
                      const oldValue = value;
                      removeCustomAttr(key);
                      updateCustomAttr(newKey, oldValue);
                    }
                  }
                "
              />
              <VTextField
                :model-value="value"
                :label="t('value')"
                class="flex-1"
                density="compact"
                @update:model-value="(val) => updateCustomAttr(key, val)"
              />
              <VBtn size="small" variant="text" color="error" icon @click="removeCustomAttr(key)">
                <Icon icon="lucide:trash" />
              </VBtn>
            </div>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels v-if="propertyForm.item && !isStaticElement && !isFieldElement && !isButtonElement">
      <VExpansionPanel>
        <VExpansionPanelTitle>{{ t('properties') }}</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VTextField :model-value="propertyForm.item?.label || ''" :label="t('label')" @update:model-value="updateItemLabel" />
          <VTextField :model-value="propertyForm.item?.name || ''" :label="t('name')" @update:model-value="updateItemName" />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </aside>
</template>
