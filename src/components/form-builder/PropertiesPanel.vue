<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';

import { useFormStore } from '@/store/form';
import { usePropertiesForm } from '@/store/propertiesPanel';

import { useI18n } from './composables/useI18n';

const formStore = useFormStore();
const propertyForm = usePropertiesForm();
const { t } = useI18n();

const addingStepLabelLang = ref(false);
const addingStepNextLabelLang = ref(false);
const addingStepPreviousLabelLang = ref(false);
const addingItemLabelLang = ref(false);
const addingButtonLabelLang = ref(false);
const addingTextLang = ref(false);

const newStepLabelLang = ref({ code: '', value: '' });
const newStepNextLabelLang = ref({ code: '', value: '' });
const newStepPreviousLabelLang = ref({ code: '', value: '' });
const newItemLabelLang = ref({ code: '', value: '' });
const newButtonLabelLang = ref({ code: '', value: '' });
const newTextLang = ref({ code: '', value: '' });

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

function isLabelObject(label: any): boolean {
  return typeof label === 'object' && label !== null && !Array.isArray(label);
}

function getLabelString(label: any): string {
  return isLabelObject(label) ? label.en || label.fa || Object.values(label)[0] || '' : label || '';
}

function convertLabelToObject(label: string, language: string = 'en'): Record<string, string> {
  return { [language]: label };
}

function addLanguageToLabel(label: any, language: string, value: string = ''): Record<string, string> {
  const labelObj = isLabelObject(label) ? { ...label } : convertLabelToObject(label || '');
  labelObj[language] = value;
  return labelObj;
}

function removeLanguageFromLabel(label: any, language: string): any {
  if (!isLabelObject(label)) return label;
  const newLabel = { ...label };
  delete newLabel[language];
  const remainingKeys = Object.keys(newLabel);
  if (remainingKeys.length === 0) return '';
  if (remainingKeys.length === 1) return newLabel[remainingKeys[0]!];
  return newLabel;
}

function addStepLabelTranslation(language: string, value: string = '') {
  if (propertyForm.step && formStore.form.steps && language.trim()) {
    const stepKey = propertyForm.step.id;
    if (formStore.form.steps[stepKey]) {
      const currentLabel = propertyForm.step.label;
      const newLabel = addLanguageToLabel(currentLabel, language, value);
      updateStepLabel(newLabel);
    }
  }
  addingStepLabelLang.value = false;
  newStepLabelLang.value = { code: '', value: '' };
}

function removeStepLabelTranslation(language: string) {
  if (propertyForm.step && formStore.form.steps) {
    const stepKey = propertyForm.step.id;
    if (formStore.form.steps[stepKey]) {
      const currentLabel = propertyForm.step.label;
      const newLabel = removeLanguageFromLabel(currentLabel, language);
      updateStepLabel(newLabel);
    }
  }
}

function addStepNextLabelTranslation(language: string, value: string = '') {
  if (propertyForm.step && formStore.form.steps && language.trim()) {
    const stepKey = propertyForm.step.id;
    if (formStore.form.steps[stepKey]) {
      if (!propertyForm.step.labels) {
        propertyForm.step.labels = {};
      }
      const currentLabel = propertyForm.step.labels.next;
      const newLabel = addLanguageToLabel(currentLabel, language, value);
      updateStepNextLabel(newLabel);
    }
  }
  addingStepNextLabelLang.value = false;
  newStepNextLabelLang.value = { code: '', value: '' };
}

function removeStepNextLabelTranslation(language: string) {
  if (propertyForm.step && formStore.form.steps) {
    const stepKey = propertyForm.step.id;
    if (formStore.form.steps[stepKey]) {
      if (!propertyForm.step.labels) {
        propertyForm.step.labels = {};
      }
      const currentLabel = propertyForm.step.labels.next;
      const newLabel = removeLanguageFromLabel(currentLabel, language);
      updateStepNextLabel(newLabel);
    }
  }
}

function addStepPreviousLabelTranslation(language: string, value: string = '') {
  if (propertyForm.step && formStore.form.steps && language.trim()) {
    const stepKey = propertyForm.step.id;
    if (formStore.form.steps[stepKey]) {
      if (!propertyForm.step.labels) {
        propertyForm.step.labels = {};
      }
      const currentLabel = propertyForm.step.labels.previous;
      const newLabel = addLanguageToLabel(currentLabel, language, value);
      updateStepPreviousLabel(newLabel);
    }
  }
  addingStepPreviousLabelLang.value = false;
  newStepPreviousLabelLang.value = { code: '', value: '' };
}

function removeStepPreviousLabelTranslation(language: string) {
  if (propertyForm.step && formStore.form.steps) {
    const stepKey = propertyForm.step.id;
    if (formStore.form.steps[stepKey]) {
      if (!propertyForm.step.labels) {
        propertyForm.step.labels = {};
      }
      const currentLabel = propertyForm.step.labels.previous;
      const newLabel = removeLanguageFromLabel(currentLabel, language);
      updateStepPreviousLabel(newLabel);
    }
  }
}

function addItemLabelTranslation(language: string, value: string = '') {
  if (propertyForm.item && language.trim()) {
    const currentLabel = propertyForm.item.label;
    const newLabel = addLanguageToLabel(currentLabel, language, value);
    updateItemLabel(newLabel);
  }
  addingItemLabelLang.value = false;
  newItemLabelLang.value = { code: '', value: '' };
}

function removeItemLabelTranslation(language: string) {
  if (propertyForm.item) {
    const currentLabel = propertyForm.item.label;
    const newLabel = removeLanguageFromLabel(currentLabel, language);
    updateItemLabel(newLabel);
  }
}

function startAddingStepLabelLang() {
  addingStepLabelLang.value = true;
}

function cancelAddingStepLabelLang() {
  addingStepLabelLang.value = false;
  newStepLabelLang.value = { code: '', value: '' };
}

function confirmAddingStepLabelLang() {
  if (newStepLabelLang.value.code.trim()) {
    addStepLabelTranslation(newStepLabelLang.value.code, newStepLabelLang.value.value);
  }
}

function startAddingStepNextLabelLang() {
  addingStepNextLabelLang.value = true;
}

function cancelAddingStepNextLabelLang() {
  addingStepNextLabelLang.value = false;
  newStepNextLabelLang.value = { code: '', value: '' };
}

function confirmAddingStepNextLabelLang() {
  if (newStepNextLabelLang.value.code.trim()) {
    addStepNextLabelTranslation(newStepNextLabelLang.value.code, newStepNextLabelLang.value.value);
  }
}

function startAddingStepPreviousLabelLang() {
  addingStepPreviousLabelLang.value = true;
}

function cancelAddingStepPreviousLabelLang() {
  addingStepPreviousLabelLang.value = false;
  newStepPreviousLabelLang.value = { code: '', value: '' };
}

function confirmAddingStepPreviousLabelLang() {
  if (newStepPreviousLabelLang.value.code.trim()) {
    addStepPreviousLabelTranslation(newStepPreviousLabelLang.value.code, newStepPreviousLabelLang.value.value);
  }
}

function startAddingItemLabelLang() {
  addingItemLabelLang.value = true;
}

function cancelAddingItemLabelLang() {
  addingItemLabelLang.value = false;
  newItemLabelLang.value = { code: '', value: '' };
}

function confirmAddingItemLabelLang() {
  if (newItemLabelLang.value.code.trim()) {
    addItemLabelTranslation(newItemLabelLang.value.code, newItemLabelLang.value.value);
  }
}

function addButtonLabelTranslation(language: string, value: string = '') {
  if (propertyForm.item && language.trim()) {
    const currentLabel = propertyForm.item.buttonLabel;
    const newLabel = addLanguageToLabel(currentLabel, language, value);
    updateButtonLabel(newLabel);
  }
  addingButtonLabelLang.value = false;
  newButtonLabelLang.value = { code: '', value: '' };
}

function removeButtonLabelTranslation(language: string) {
  if (propertyForm.item) {
    const currentLabel = propertyForm.item.buttonLabel;
    const newLabel = removeLanguageFromLabel(currentLabel, language);
    updateButtonLabel(newLabel);
  }
}

function startAddingButtonLabelLang() {
  addingButtonLabelLang.value = true;
}

function cancelAddingButtonLabelLang() {
  addingButtonLabelLang.value = false;
  newButtonLabelLang.value = { code: '', value: '' };
}

function confirmAddingButtonLabelLang() {
  if (newButtonLabelLang.value.code.trim()) {
    addButtonLabelTranslation(newButtonLabelLang.value.code, newButtonLabelLang.value.value);
  }
}

function updateButtonLabelLanguage(language: string, value: string) {
  if (propertyForm.item) {
    const currentLabel = propertyForm.item.buttonLabel;
    const labelObj = isLabelObject(currentLabel)
      ? { ...(currentLabel as Record<string, string>) }
      : convertLabelToObject(getLabelString(currentLabel), language);
    labelObj[language] = value;
    updateButtonLabel(labelObj);
  }
}

function addTextTranslation(language: string, value: string = '') {
  if (propertyForm.item && language.trim()) {
    const currentText = propertyForm.item.text;
    const newText = addLanguageToLabel(currentText, language, value);
    updateRadioText(newText);
  }
  addingTextLang.value = false;
  newTextLang.value = { code: '', value: '' };
}

function removeTextTranslation(language: string) {
  if (propertyForm.item) {
    const currentText = propertyForm.item.text;
    const newText = removeLanguageFromLabel(currentText, language);
    updateRadioText(newText);
  }
}

function startAddingTextLang() {
  addingTextLang.value = true;
}

function cancelAddingTextLang() {
  addingTextLang.value = false;
  newTextLang.value = { code: '', value: '' };
}

function confirmAddingTextLang() {
  if (newTextLang.value.code.trim() && newTextLang.value.value.trim()) {
    addTextTranslation(newTextLang.value.code, newTextLang.value.value);
    addingTextLang.value = false;
    newTextLang.value = { code: '', value: '' };
  }
}

function updateTextLanguage(language: string, value: string) {
  if (propertyForm.item) {
    const currentText = propertyForm.item.text;
    const textObj = isLabelObject(currentText)
      ? { ...(currentText as Record<string, string>) }
      : convertLabelToObject(getLabelString(currentText), language);
    textObj[language] = value;
    updateRadioText(textObj);
  }
}

function updateStepLabelLanguage(language: string, value: string) {
  if (propertyForm.step && formStore.form.steps) {
    const currentLabel = propertyForm.step.label;
    const labelObj = isLabelObject(currentLabel)
      ? { ...(currentLabel as Record<string, string>) }
      : convertLabelToObject(getLabelString(currentLabel), language);
    labelObj[language] = value;
    updateStepLabel(labelObj);
  }
}

function updateStepNextLabelLanguage(language: string, value: string) {
  if (propertyForm.step && formStore.form.steps) {
    if (!propertyForm.step.labels) {
      propertyForm.step.labels = {};
    }
    const currentLabel = propertyForm.step.labels.next;
    const labelObj = isLabelObject(currentLabel)
      ? { ...(currentLabel as Record<string, string>) }
      : convertLabelToObject(getLabelString(currentLabel), language);
    labelObj[language] = value;
    updateStepNextLabel(labelObj);
  }
}

function updateStepPreviousLabelLanguage(language: string, value: string) {
  if (propertyForm.step && formStore.form.steps) {
    if (!propertyForm.step.labels) {
      propertyForm.step.labels = {};
    }
    const currentLabel = propertyForm.step.labels.previous;
    const labelObj = isLabelObject(currentLabel)
      ? { ...(currentLabel as Record<string, string>) }
      : convertLabelToObject(getLabelString(currentLabel), language);
    labelObj[language] = value;
    updateStepPreviousLabel(labelObj);
  }
}

function updateItemLabelLanguage(language: string, value: string) {
  if (propertyForm.item) {
    const currentLabel = propertyForm.item.label;
    const labelObj = isLabelObject(currentLabel)
      ? { ...(currentLabel as Record<string, string>) }
      : convertLabelToObject(getLabelString(currentLabel), language);
    labelObj[language] = value;
    updateItemLabel(labelObj);
  }
}

function updateStepLabel(val: string | Record<string, string>) {
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

function updateStepNextLabel(val: string | Record<string, string>) {
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
          ...(formStore.form.steps[stepKey]!.labels || {}),
          next: val,
        },
        builder: formStore.form.steps[stepKey]!.builder || { type: 'steps' },
      };
    }
  }
}

function updateStepPreviousLabel(val: string | Record<string, string>) {
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
          ...(formStore.form.steps[stepKey]!.labels || {}),
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

function updateItemLabel(val: string | Record<string, string>) {
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
          schemaItem.builder = { type: val, label: getLabelString(schemaItem.label) || '' };
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

function updateButtonLabel(val: string | Record<string, string>) {
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

function updateRadioText(val: string | Record<string, string>) {
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
      propertyForm.item.radioName = val;
      if (formStore.form.schema[propertyForm.item.id]) {
        formStore.form.schema[propertyForm.item.id]!.radioName = val;
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
      propertyForm.item.radioValue = val;
      if (formStore.form.schema[propertyForm.item.id]) {
        formStore.form.schema[propertyForm.item.id]!.radioValue = val;
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
  const newValue = schemaItem.items.length > 0 ? String(Math.max(...schemaItem.items.map((i) => parseInt(i.value) || 0)) + 1) : '0';
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
      schemaItem.items[index]!.value = val;
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
  <aside
    :class="isOpen ? 'w-120' : 'w-0'"
    class="m-2! overflow-y-auto bg-[rgb(var(--v-theme-surface))] transition-all duration-300"
  >
    <VExpansionPanels v-if="propertyForm.step">
      <VExpansionPanel>
        <VExpansionPanelTitle>{{ t('properties') }}</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="flex items-center gap-2">
            <VTextField
              :model-value="getLabelString(propertyForm.step?.label)"
              :label="t('label')"
              class="flex-1"
              @update:model-value="
                (val) => (isLabelObject(propertyForm.step?.label) ? updateStepLabelLanguage('en', val) : updateStepLabel(val))
              "
            />
            <VBtn
              type="button"
              size="small"
              variant="outlined"
              @click="startAddingStepLabelLang"
              v-if="!isLabelObject(propertyForm.step?.label)"
            >
              <Icon icon="lucide:languages" />
            </VBtn>
          </div>
          <div v-if="addingStepLabelLang" class="mt-2 flex items-center gap-2">
            <VTextField
              v-model="newStepLabelLang.code"
              label="Language Code"
              placeholder="en, fa, fr, etc."
              class="flex-1"
              density="compact"
              @keyup.enter="confirmAddingStepLabelLang"
            />
            <VTextField
              v-model="newStepLabelLang.value"
              label="Translation"
              class="flex-1"
              density="compact"
              @keyup.enter="confirmAddingStepLabelLang"
            />
            <VBtn type="button" size="small" variant="text" color="success" @click="confirmAddingStepLabelLang">
              <Icon icon="lucide:check" />
            </VBtn>
            <VBtn type="button" size="small" variant="text" color="error" @click="cancelAddingStepLabelLang">
              <Icon icon="lucide:x" />
            </VBtn>
          </div>
          <div v-if="isLabelObject(propertyForm.step?.label) && !addingStepLabelLang" class="mt-2 space-y-2">
            <div v-for="(value, lang) in propertyForm.step?.label" :key="lang" class="flex items-center gap-2">
              <VTextField
                :model-value="value"
                :label="`Label (${String(lang).toUpperCase()})`"
                class="flex-1"
                density="compact"
                @update:model-value="(val) => updateStepLabelLanguage(String(lang), val)"
              />
              <VBtn
                type="button"
                size="small"
                variant="text"
                color="error"
                icon
                @click="removeStepLabelTranslation(String(lang))"
                v-if="Object.keys(propertyForm.step?.label || {}).length > 1"
              >
                <Icon icon="lucide:trash" />
              </VBtn>
            </div>
            <VBtn type="button" size="small" variant="text" color="primary" @click="startAddingStepLabelLang">
              <Icon icon="lucide:plus" />
              {{ t('addLanguage') }}
            </VBtn>
          </div>
          <div class="flex items-center gap-2">
            <VTextField
              :model-value="getLabelString(propertyForm.step?.labels?.next)"
              label="Next Button Label"
              class="flex-1"
              @update:model-value="
                (val) =>
                  isLabelObject(propertyForm.step?.labels?.next) ? updateStepNextLabelLanguage('en', val) : updateStepNextLabel(val)
              "
            />
            <VBtn
              type="button"
              size="small"
              variant="outlined"
              @click="startAddingStepNextLabelLang"
              v-if="!isLabelObject(propertyForm.step?.labels?.next)"
            >
              <Icon icon="lucide:languages" />
            </VBtn>
          </div>
          <div v-if="addingStepNextLabelLang" class="mt-2 flex items-center gap-2">
            <VTextField
              v-model="newStepNextLabelLang.code"
              label="Language Code"
              placeholder="en, fa, fr, etc."
              class="flex-1"
              density="compact"
              @keyup.enter="confirmAddingStepNextLabelLang"
            />
            <VTextField
              v-model="newStepNextLabelLang.value"
              label="Translation"
              class="flex-1"
              density="compact"
              @keyup.enter="confirmAddingStepNextLabelLang"
            />
            <VBtn type="button" size="small" variant="text" color="success" @click="confirmAddingStepNextLabelLang">
              <Icon icon="lucide:check" />
            </VBtn>
            <VBtn type="button" size="small" variant="text" color="error" @click="cancelAddingStepNextLabelLang">
              <Icon icon="lucide:x" />
            </VBtn>
          </div>
          <div v-if="isLabelObject(propertyForm.step?.labels?.next) && !addingStepNextLabelLang" class="mt-2 space-y-2">
            <div v-for="(value, lang) in propertyForm.step?.labels?.next" :key="lang" class="flex items-center gap-2">
              <VTextField
                :model-value="value"
                :label="`Next Button (${String(lang).toUpperCase()})`"
                class="flex-1"
                density="compact"
                @update:model-value="(val) => updateStepNextLabelLanguage(String(lang), val)"
              />
              <VBtn
                type="button"
                size="small"
                variant="text"
                color="error"
                icon
                @click="removeStepNextLabelTranslation(String(lang))"
                v-if="Object.keys(propertyForm.step?.labels?.next || {}).length > 1"
              >
                <Icon icon="lucide:trash" />
              </VBtn>
            </div>
            <VBtn type="button" size="small" variant="text" color="primary" @click="startAddingStepNextLabelLang">
              <Icon icon="lucide:plus" />
              {{ t('addLanguage') }}
            </VBtn>
          </div>
          <div class="flex items-center gap-2">
            <VTextField
              :model-value="getLabelString(propertyForm.step?.labels?.previous)"
              label="Previous Button Label"
              class="flex-1"
              @update:model-value="
                (val) =>
                  isLabelObject(propertyForm.step?.labels?.previous)
                    ? updateStepPreviousLabelLanguage('en', val)
                    : updateStepPreviousLabel(val)
              "
            />
            <VBtn
              type="button"
              size="small"
              variant="outlined"
              @click="startAddingStepPreviousLabelLang"
              v-if="!isLabelObject(propertyForm.step?.labels?.previous)"
            >
              <Icon icon="lucide:languages" />
            </VBtn>
          </div>
          <div v-if="addingStepPreviousLabelLang" class="mt-2 flex items-center gap-2">
            <VTextField
              v-model="newStepPreviousLabelLang.code"
              label="Language Code"
              placeholder="en, fa, fr, etc."
              class="flex-1"
              density="compact"
              @keyup.enter="confirmAddingStepPreviousLabelLang"
            />
            <VTextField
              v-model="newStepPreviousLabelLang.value"
              label="Translation"
              class="flex-1"
              density="compact"
              @keyup.enter="confirmAddingStepPreviousLabelLang"
            />
            <VBtn type="button" size="small" variant="text" color="success" @click="confirmAddingStepPreviousLabelLang">
              <Icon icon="lucide:check" />
            </VBtn>
            <VBtn type="button" size="small" variant="text" color="error" @click="cancelAddingStepPreviousLabelLang">
              <Icon icon="lucide:x" />
            </VBtn>
          </div>
          <div v-if="isLabelObject(propertyForm.step?.labels?.previous) && !addingStepPreviousLabelLang" class="mt-2 space-y-2">
            <div v-for="(value, lang) in propertyForm.step?.labels?.previous" :key="lang" class="flex items-center gap-2">
              <VTextField
                :model-value="value"
                :label="`Previous Button (${String(lang).toUpperCase()})`"
                class="flex-1"
                density="compact"
                @update:model-value="(val) => updateStepPreviousLabelLanguage(String(lang), val)"
              />
              <VBtn
                type="button"
                size="small"
                variant="text"
                color="error"
                icon
                @click="removeStepPreviousLabelTranslation(String(lang))"
                v-if="Object.keys(propertyForm.step?.labels?.previous || {}).length > 1"
              >
                <Icon icon="lucide:trash" />
              </VBtn>
            </div>
            <VBtn type="button" size="small" variant="text" color="primary" @click="startAddingStepPreviousLabelLang">
              <Icon icon="lucide:plus" />
              {{ t('addLanguage') }}
            </VBtn>
          </div>
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
          <div class="flex items-center gap-2">
            <VTextField
              :model-value="getLabelString(propertyForm.item?.label)"
              :label="t('label')"
              class="flex-1"
              @update:model-value="
                (val) => (isLabelObject(propertyForm.item?.label) ? updateItemLabelLanguage('en', val) : updateItemLabel(val))
              "
            />
            <VBtn
              type="button"
              size="small"
              variant="outlined"
              @click="startAddingItemLabelLang"
              v-if="!isLabelObject(propertyForm.item?.label)"
            >
              <Icon icon="lucide:languages" />
            </VBtn>
          </div>
          <div v-if="addingItemLabelLang" class="mt-2 flex items-center gap-2">
            <VTextField
              v-model="newItemLabelLang.code"
              label="Language Code"
              placeholder="en, fa, fr, etc."
              class="flex-1"
              density="compact"
              @keyup.enter="confirmAddingItemLabelLang"
            />
            <VTextField
              v-model="newItemLabelLang.value"
              label="Translation"
              class="flex-1"
              density="compact"
              @keyup.enter="confirmAddingItemLabelLang"
            />
            <VBtn type="button" size="small" variant="text" color="success" @click="confirmAddingItemLabelLang">
              <Icon icon="lucide:check" />
            </VBtn>
            <VBtn type="button" size="small" variant="text" color="error" @click="cancelAddingItemLabelLang">
              <Icon icon="lucide:x" />
            </VBtn>
          </div>
          <div v-if="isLabelObject(propertyForm.item?.label) && !addingItemLabelLang" class="mt-2 space-y-2">
            <div v-for="(value, lang) in propertyForm.item?.label" :key="lang" class="flex items-center gap-2">
              <VTextField
                :model-value="value"
                :label="`Label (${String(lang).toUpperCase()})`"
                class="flex-1"
                density="compact"
                @update:model-value="(val) => updateItemLabelLanguage(String(lang), val)"
              />
              <VBtn
                type="button"
                size="small"
                variant="text"
                color="error"
                icon
                @click="removeItemLabelTranslation(String(lang))"
                v-if="Object.keys(propertyForm.item?.label || {}).length > 1"
              >
                <Icon icon="lucide:trash" />
              </VBtn>
            </div>
            <VBtn type="button" size="small" variant="text" color="primary" @click="startAddingItemLabelLang">
              <Icon icon="lucide:plus" />
              {{ t('addLanguage') }}
            </VBtn>
          </div>

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
          <template v-if="!isButtonElement">
            <div class="flex items-center gap-2">
              <VTextField
                :model-value="getLabelString(propertyForm.item?.label)"
                :label="t('label')"
                class="flex-1"
                @update:model-value="
                  (val) => (isLabelObject(propertyForm.item?.label) ? updateItemLabelLanguage('en', val) : updateItemLabel(val))
                "
              />
              <VBtn
                type="button"
                size="small"
                variant="outlined"
                @click="startAddingItemLabelLang"
                v-if="!isLabelObject(propertyForm.item?.label)"
              >
                <Icon icon="lucide:languages" />
              </VBtn>
            </div>
            <div v-if="addingItemLabelLang" class="mt-2 flex items-center gap-2">
              <VTextField
                v-model="newItemLabelLang.code"
                label="Language Code"
                placeholder="en, fa, fr, etc."
                class="flex-1"
                density="compact"
                @keyup.enter="confirmAddingItemLabelLang"
              />
              <VTextField
                v-model="newItemLabelLang.value"
                label="Translation"
                class="flex-1"
                density="compact"
                @keyup.enter="confirmAddingItemLabelLang"
              />
              <VBtn type="button" size="small" variant="text" color="success" @click="confirmAddingItemLabelLang">
                <Icon icon="lucide:check" />
              </VBtn>
              <VBtn type="button" size="small" variant="text" color="error" @click="cancelAddingItemLabelLang">
                <Icon icon="lucide:x" />
              </VBtn>
            </div>
            <div v-if="isLabelObject(propertyForm.item?.label) && !addingItemLabelLang" class="mt-2 space-y-2">
              <div v-for="(value, lang) in propertyForm.item?.label" :key="lang" class="flex items-center gap-2">
                <VTextField
                  :model-value="value"
                  :label="`Label (${String(lang).toUpperCase()})`"
                  class="flex-1"
                  density="compact"
                  @update:model-value="(val) => updateItemLabelLanguage(String(lang), val)"
                />
                <VBtn
                  type="button"
                  size="small"
                  variant="text"
                  color="error"
                  icon
                  @click="removeItemLabelTranslation(String(lang))"
                  v-if="Object.keys(propertyForm.item?.label || {}).length > 1"
                >
                  <Icon icon="lucide:trash" />
                </VBtn>
              </div>
              <VBtn type="button" size="small" variant="text" color="primary" @click="startAddingItemLabelLang">
                <Icon icon="lucide:plus" />
                {{ t('addLanguage') }}
              </VBtn>
            </div>
          </template>
          <VTextField :model-value="propertyForm.item?.info || ''" :label="t('tooltip')" @update:model-value="updateItemInfo" />
          <VDivider class="my-3" />
          <VTextField
            :model-value="propertyForm.item?.description || ''"
            :label="t('description')"
            @update:model-value="updateItemDescription"
          />

          <template v-if="isFieldElement">
            <template v-if="isRadioField">
              <div class="flex items-center gap-2">
                <VTextField
                  :model-value="getLabelString(propertyForm.item?.text)"
                  :label="t('text')"
                  class="flex-1"
                  @update:model-value="
                    (val) => (isLabelObject(propertyForm.item?.text) ? updateTextLanguage('en', val) : updateRadioText(val))
                  "
                />
                <VBtn
                  type="button"
                  size="small"
                  variant="outlined"
                  @click="startAddingTextLang"
                  v-if="!isLabelObject(propertyForm.item?.text)"
                >
                  <Icon icon="lucide:languages" />
                </VBtn>
              </div>
              <div v-if="addingTextLang" class="mt-2 flex items-center gap-2">
                <VTextField
                  v-model="newTextLang.code"
                  label="Language Code"
                  placeholder="en, fa, fr, etc."
                  class="flex-1"
                  density="compact"
                  @keyup.enter="confirmAddingTextLang"
                />
                <VTextField
                  v-model="newTextLang.value"
                  label="Translation"
                  class="flex-1"
                  density="compact"
                  @keyup.enter="confirmAddingTextLang"
                />
                <VBtn type="button" size="small" variant="text" color="success" @click="confirmAddingTextLang">
                  <Icon icon="lucide:check" />
                </VBtn>
                <VBtn type="button" size="small" variant="text" color="error" @click="cancelAddingTextLang">
                  <Icon icon="lucide:x" />
                </VBtn>
              </div>
              <div v-if="isLabelObject(propertyForm.item?.text) && !addingTextLang" class="mt-2 space-y-2">
                <div v-for="(value, lang) in propertyForm.item?.text" :key="lang" class="flex items-center gap-2">
                  <VTextField
                    :model-value="value"
                    :label="`Text (${String(lang).toUpperCase()})`"
                    class="flex-1"
                    density="compact"
                    @update:model-value="(val) => updateTextLanguage(String(lang), val)"
                  />
                  <VBtn
                    type="button"
                    size="small"
                    variant="text"
                    color="error"
                    icon
                    @click="removeTextTranslation(String(lang))"
                    v-if="Object.keys(propertyForm.item?.text || {}).length > 1"
                  >
                    <Icon icon="lucide:trash" />
                  </VBtn>
                </div>
                <VBtn type="button" size="small" variant="text" color="primary" @click="startAddingTextLang">
                  <Icon icon="lucide:plus" />
                  {{ t('addLanguage') }}
                </VBtn>
              </div>
              <VTextField
                :model-value="propertyForm.item?.radioName || ''"
                :label="t('radioName')"
                @update:model-value="updateRadioName"
              />
              <VTextField
                :model-value="propertyForm.item?.radioValue || ''"
                :label="t('radioValue')"
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
              <div class="flex items-center gap-2">
                <VTextField
                  :model-value="getLabelString(propertyForm.item?.text)"
                  :label="t('text')"
                  class="flex-1"
                  @update:model-value="
                    (val) => (isLabelObject(propertyForm.item?.text) ? updateTextLanguage('en', val) : updateRadioText(val))
                  "
                />
                <VBtn
                  type="button"
                  size="small"
                  variant="outlined"
                  @click="startAddingTextLang"
                  v-if="!isLabelObject(propertyForm.item?.text)"
                >
                  <Icon icon="lucide:languages" />
                </VBtn>
              </div>
              <div v-if="addingTextLang" class="mt-2 flex items-center gap-2">
                <VTextField
                  v-model="newTextLang.code"
                  label="Language Code"
                  placeholder="en, fa, fr, etc."
                  class="flex-1"
                  density="compact"
                  @keyup.enter="confirmAddingTextLang"
                />
                <VTextField
                  v-model="newTextLang.value"
                  label="Translation"
                  class="flex-1"
                  density="compact"
                  @keyup.enter="confirmAddingTextLang"
                />
                <VBtn type="button" size="small" variant="text" color="success" @click="confirmAddingTextLang">
                  <Icon icon="lucide:check" />
                </VBtn>
                <VBtn type="button" size="small" variant="text" color="error" @click="cancelAddingTextLang">
                  <Icon icon="lucide:x" />
                </VBtn>
              </div>
              <div v-if="isLabelObject(propertyForm.item?.text) && !addingTextLang" class="mt-2 space-y-2">
                <div v-for="(value, lang) in propertyForm.item?.text" :key="lang" class="flex items-center gap-2">
                  <VTextField
                    :model-value="value"
                    :label="`Text (${String(lang).toUpperCase()})`"
                    class="flex-1"
                    density="compact"
                    @update:model-value="(val) => updateTextLanguage(String(lang), val)"
                  />
                  <VBtn
                    type="button"
                    size="small"
                    variant="text"
                    color="error"
                    icon
                    @click="removeTextTranslation(String(lang))"
                    v-if="Object.keys(propertyForm.item?.text || {}).length > 1"
                  >
                    <Icon icon="lucide:trash" />
                  </VBtn>
                </div>
                <VBtn type="button" size="small" variant="text" color="primary" @click="startAddingTextLang">
                  <Icon icon="lucide:plus" />
                  {{ t('addLanguage') }}
                </VBtn>
              </div>
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
                  <VBtn type="button" size="small" variant="outlined" @click="addRadioTabItem">{{ t('addItem') }}</VBtn>
                </div>
                <div v-for="(item, index) in getRadioGroupItems()" :key="index" class="mb-2 flex items-center gap-2">
                  <VTextField
                    :model-value="item.value"
                    :label="t('value')"
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
                  <VBtn type="button" size="small" variant="text" color="error" icon @click="removeRadioTabItem(index)">
                    <Icon icon="lucide:trash" />
                  </VBtn>
                </div>
              </div>
            </template>

            <template v-if="propertyForm.item?.type === 'toggle'">
              <div class="flex items-center gap-2">
                <VTextField
                  :model-value="getLabelString(propertyForm.item?.text)"
                  :label="t('text')"
                  class="flex-1"
                  @update:model-value="
                    (val) => (isLabelObject(propertyForm.item?.text) ? updateTextLanguage('en', val) : updateRadioText(val))
                  "
                />
                <VBtn
                  type="button"
                  size="small"
                  variant="outlined"
                  @click="startAddingTextLang"
                  v-if="!isLabelObject(propertyForm.item?.text)"
                >
                  <Icon icon="lucide:languages" />
                </VBtn>
              </div>
              <div v-if="addingTextLang" class="mt-2 flex items-center gap-2">
                <VTextField
                  v-model="newTextLang.code"
                  label="Language Code"
                  placeholder="en, fa, fr, etc."
                  class="flex-1"
                  density="compact"
                  @keyup.enter="confirmAddingTextLang"
                />
                <VTextField
                  v-model="newTextLang.value"
                  label="Translation"
                  class="flex-1"
                  density="compact"
                  @keyup.enter="confirmAddingTextLang"
                />
                <VBtn type="button" size="small" variant="text" color="success" @click="confirmAddingTextLang">
                  <Icon icon="lucide:check" />
                </VBtn>
                <VBtn type="button" size="small" variant="text" color="error" @click="cancelAddingTextLang">
                  <Icon icon="lucide:x" />
                </VBtn>
              </div>
              <div v-if="isLabelObject(propertyForm.item?.text) && !addingTextLang" class="mt-2 space-y-2">
                <div v-for="(value, lang) in propertyForm.item?.text" :key="lang" class="flex items-center gap-2">
                  <VTextField
                    :model-value="value"
                    :label="`Text (${String(lang).toUpperCase()})`"
                    class="flex-1"
                    density="compact"
                    @update:model-value="(val) => updateTextLanguage(String(lang), val)"
                  />
                  <VBtn
                    type="button"
                    size="small"
                    variant="text"
                    color="error"
                    icon
                    @click="removeTextTranslation(String(lang))"
                    v-if="Object.keys(propertyForm.item?.text || {}).length > 1"
                  >
                    <Icon icon="lucide:trash" />
                  </VBtn>
                </div>
                <VBtn type="button" size="small" variant="text" color="primary" @click="startAddingTextLang">
                  <Icon icon="lucide:plus" />
                  {{ t('addLanguage') }}
                </VBtn>
              </div>
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
                  <VBtn type="button" size="small" variant="outlined" @click="addRadioTabItem">{{ t('addItem') }}</VBtn>
                </div>
                <div v-for="(item, index) in getRadioGroupItems()" :key="index" class="mb-2 flex items-center gap-2">
                  <VTextField
                    :model-value="item.value"
                    :label="t('value')"
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
                  <VBtn type="button" size="small" variant="text" color="error" icon @click="removeRadioTabItem(index)">
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
            <div class="flex items-center gap-2">
              <VTextField
                :model-value="getLabelString(propertyForm.item?.buttonLabel)"
                :label="t('buttonLabel')"
                class="flex-1"
                @update:model-value="
                  (val) =>
                    isLabelObject(propertyForm.item?.buttonLabel) ? updateButtonLabelLanguage('en', val) : updateButtonLabel(val)
                "
              />
              <VBtn
                type="button"
                size="small"
                variant="outlined"
                @click="startAddingButtonLabelLang"
                v-if="!isLabelObject(propertyForm.item?.buttonLabel)"
              >
                <Icon icon="lucide:languages" />
              </VBtn>
            </div>
            <div v-if="addingButtonLabelLang" class="mt-2 flex items-center gap-2">
              <VTextField
                v-model="newButtonLabelLang.code"
                label="Language Code"
                placeholder="en, fa, fr, etc."
                class="flex-1"
                density="compact"
                @keyup.enter="confirmAddingButtonLabelLang"
              />
              <VTextField
                v-model="newButtonLabelLang.value"
                label="Translation"
                class="flex-1"
                density="compact"
                @keyup.enter="confirmAddingButtonLabelLang"
              />
              <VBtn type="button" size="small" variant="text" color="success" @click="confirmAddingButtonLabelLang">
                <Icon icon="lucide:check" />
              </VBtn>
              <VBtn type="button" size="small" variant="text" color="error" @click="cancelAddingButtonLabelLang">
                <Icon icon="lucide:x" />
              </VBtn>
            </div>
            <div v-if="isLabelObject(propertyForm.item?.buttonLabel) && !addingButtonLabelLang" class="mt-2 space-y-2">
              <div v-for="(value, lang) in propertyForm.item?.buttonLabel" :key="lang" class="flex items-center gap-2">
                <VTextField
                  :model-value="value"
                  :label="`Button Label (${String(lang).toUpperCase()})`"
                  class="flex-1"
                  density="compact"
                  @update:model-value="(val) => updateButtonLabelLanguage(String(lang), val)"
                />
                <VBtn
                  type="button"
                  size="small"
                  variant="text"
                  color="error"
                  icon
                  @click="removeButtonLabelTranslation(String(lang))"
                  v-if="Object.keys(propertyForm.item?.buttonLabel || {}).length > 1"
                >
                  <Icon icon="lucide:trash" />
                </VBtn>
              </div>
              <VBtn type="button" size="small" variant="text" color="primary" @click="startAddingButtonLabelLang">
                <Icon icon="lucide:plus" />
                {{ t('addLanguage') }}
              </VBtn>
            </div>
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
              <VBtn type="button" size="small" variant="outlined" @click="addRadioTabItem">{{ t('addItem') }}</VBtn>
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
              <VBtn type="button" size="small" variant="text" color="error" icon @click="removeRadioTabItem(index)">
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
              <VBtn type="button" size="small" variant="outlined" @click="addCustomAttr">{{ t('addAttribute') }}</VBtn>
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
              <VBtn type="button" size="small" variant="text" color="error" icon @click="removeCustomAttr(key)">
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
          <div class="flex items-center gap-2">
            <VTextField
              :model-value="getLabelString(propertyForm.item?.label)"
              :label="t('label')"
              class="flex-1"
              @update:model-value="
                (val) => (isLabelObject(propertyForm.item?.label) ? updateItemLabelLanguage('en', val) : updateItemLabel(val))
              "
            />
            <VBtn
              type="button"
              size="small"
              variant="outlined"
              @click="startAddingItemLabelLang"
              v-if="!isLabelObject(propertyForm.item?.label)"
            >
              <Icon icon="lucide:languages" />
            </VBtn>
          </div>
          <div v-if="addingItemLabelLang" class="mt-2 flex items-center gap-2">
            <VTextField
              v-model="newItemLabelLang.code"
              label="Language Code"
              placeholder="en, fa, fr, etc."
              class="flex-1"
              density="compact"
              @keyup.enter="confirmAddingItemLabelLang"
            />
            <VTextField
              v-model="newItemLabelLang.value"
              label="Translation"
              class="flex-1"
              density="compact"
              @keyup.enter="confirmAddingItemLabelLang"
            />
            <VBtn type="button" size="small" variant="text" color="success" @click="confirmAddingItemLabelLang">
              <Icon icon="lucide:check" />
            </VBtn>
            <VBtn type="button" size="small" variant="text" color="error" @click="cancelAddingItemLabelLang">
              <Icon icon="lucide:x" />
            </VBtn>
          </div>
          <div v-if="isLabelObject(propertyForm.item?.label) && !addingItemLabelLang" class="mt-2 space-y-2">
            <div v-for="(value, lang) in propertyForm.item?.label" :key="lang" class="flex items-center gap-2">
              <VTextField
                :model-value="value"
                :label="`Label (${String(lang).toUpperCase()})`"
                class="flex-1"
                density="compact"
                @update:model-value="(val) => updateItemLabelLanguage(String(lang), val)"
              />
              <VBtn
                type="button"
                size="small"
                variant="text"
                color="error"
                icon
                @click="removeItemLabelTranslation(String(lang))"
                v-if="Object.keys(propertyForm.item?.label || {}).length > 1"
              >
                <Icon icon="lucide:trash" />
              </VBtn>
            </div>
            <VBtn type="button" size="small" variant="text" color="primary" @click="startAddingItemLabelLang">
              <Icon icon="lucide:plus" />
              {{ t('addLanguage') }}
            </VBtn>
          </div>
          <VTextField :model-value="propertyForm.item?.name || ''" :label="t('name')" @update:model-value="updateItemName" />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </aside>
</template>
