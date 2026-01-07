import type { SchemaItem } from '@/store/form';

import { useFormStore } from '@/store/form';

import type { Item } from '../types';

function createSchemaItem(item: Item, inputKey: string): SchemaItem {
  if (item.type === 'static') {
    if (inputKey === 'quote') {
      return {
        name: inputKey,
        type: item.type,
        tag: 'blockquote',
        content: 'Lorem ipsum dolor',
        builder: {
          type: 'quote',
          label: 'Quote',
        },
      };
    }

    if (inputKey === 'link') {
      return {
        name: inputKey,
        type: item.type,
        tag: 'a',
        content: 'Link',
        target: '_blank',
        href: '',
        builder: {
          type: 'link',
          label: 'Link',
        },
      };
    }

    if (inputKey === 'divider') {
      return {
        name: inputKey,
        type: item.type,
        tag: 'hr',
        builder: {
          type: 'divider',
          label: 'Divider',
        },
      };
    }

    return {
      name: inputKey,
      type: item.type,
      tag: inputKey,
      content: 'Lorem ipsum dolor',
      builder: {
        type: inputKey,
        label: `${inputKey.toUpperCase()} header`,
      },
    };
  }

  if (item.type === 'email') {
    return {
      name: inputKey,
      type: 'text',
      inputType: 'email',
      label: item.name,
      rules: ['nullable', 'email'],
      builder: {
        type: 'email',
        label: 'Email address',
      },
    };
  }

  if (item.type === 'password') {
    return {
      name: inputKey,
      type: 'text',
      inputType: 'password',
      label: 'Password',
      builder: {
        type: 'password',
        label: 'Password',
      },
    };
  }

  if (item.type === 'number') {
    return {
      name: inputKey,
      type: 'text',
      inputType: 'number',
      label: item.name,
      rules: ['nullable', 'numeric'],
      autocomplete: 'off',
      builder: {
        type: 'number',
        label: 'Number input',
      },
    };
  }

  if (item.type === 'phone') {
    return {
      name: inputKey,
      type: 'phone',
      label: 'Phone',
      allowIncomplete: true,
      unmask: true,
      builder: {
        type: 'phone',
        label: 'Phone number',
      },
    } as any;
  }

  if (item.type === 'url') {
    return {
      name: inputKey,
      type: 'text',
      inputType: 'url',
      rules: ['nullable', 'url'],
      placeholder: 'eg. http(s)://domain.com',
      floating: 'a',
      label: 'URL',
      builder: {
        type: 'url',
        label: 'URL',
      },
    };
  }

  if (item.type === 'editor') {
    return {
      name: inputKey,
      type: 'editor',
      label: 'Editor',
      builder: {
        type: 'editor',
        label: 'WYSIWYG editor',
      },
    };
  }

  if (item.type === 'checkbox') {
    return {
      name: inputKey,
      type: 'checkbox',
      text: 'Checkbox',
      builder: {
        type: 'checkbox',
        label: 'Checkbox',
      },
    };
  }

  if (item.type === 'checkboxgroup') {
    return {
      name: inputKey,
      type: 'checkboxgroup',
      items: [{ value: '0', label: 'Label' }],
      builder: {
        type: 'checkboxgroup',
        label: 'Checkbox group',
      },
    };
  }

  if (item.type === 'toggle') {
    return {
      name: inputKey,
      type: 'toggle',
      text: 'Toggle',
      builder: {
        type: 'toggle',
        label: 'Toggle',
      },
    };
  }

  if (item.type === 'select') {
    return {
      name: inputKey,
      type: 'select',
      items: [{ value: '0', label: 'Label' }],
      label: 'Select',
      builder: {
        type: 'select',
        label: 'Select',
      },
    };
  }

  if (item.type === 'tags') {
    return {
      name: inputKey,
      type: 'tags',
      closeOnSelect: false,
      search: true,
      items: [{ value: '0', label: 'Label' }],
      label: 'Tags',
      inputType: 'search',
      autocomplete: 'off',
      builder: {
        type: 'tags',
        label: 'Tags',
      },
    };
  }

  if (item.type === 'slider') {
    return {
      name: inputKey,
      type: 'slider',
      label: 'Slider',
      default: 30,
      min: 1,
      max: 111,
      step: 1,
      format: {
        prefix: 's',
        suffix: 's',
        thousand: 's',
      },
      builder: {
        type: 'slider',
        label: 'Slider',
      },
    };
  }

  if (item.type === 'file') {
    return {
      name: inputKey,
      type: 'file',
      label: 'File',
      url: 'a',
      accept: 'application/gzip',
      removeTempEndpoint: { url: 's' },
      uploadTempEndpoint: { url: 's' },
      removeEndpoint: { url: 's' },
      builder: {
        type: 'file',
        label: 'File upload',
      },
    };
  }

  if (item.type === 'date') {
    return {
      name: inputKey,
      type: 'date',
      label: 'Date',
      placeholder: 'a',
      displayFormat: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      loadFormat: 'YYYY-MM-DD',
      min: '2025-10-29',
      max: '2025-11-12',
      disables: ['2025-11-06'],
      default: '2025-11-05',
      addons: {
        before: 'a',
        after: 'a',
      },
      builder: {
        type: 'date',
        label: 'Date',
      },
    };
  }

  if (item.type === 'hidden') {
    return {
      name: inputKey,
      type: 'hidden',
      default: 'sd',
      meta: true,
      builder: {
        resize: false as any,
        type: 'hidden',
        label: 'Hidden input',
      } as any,
    } as any;
  }

  if (item.type === 'radio') {
    return {
      name: inputKey,
      type: 'radio',
      text: item.name,
      builder: {
        type: 'radio',
        label: 'Radio',
      },
    };
  }

  if (item.type === 'radiogroup') {
    return {
      name: inputKey,
      type: 'radiogroup',
      view: 'tabs',
      items: [],
      label: item.name,
      builder: {
        type: 'radioTabs',
        label: 'Radio tabs',
      },
    };
  }

  if (item.type === 'button') {
    if (inputKey === 'submit') {
      return {
        name: inputKey,
        type: 'button',
        buttonLabel: 'Submit',
        submits: true,
        builder: {
          type: 'submit',
          label: 'Submit button',
        },
      };
    }

    if (inputKey === 'reset') {
      return {
        name: inputKey,
        type: 'button',
        buttonLabel: 'Reset',
        secondary: true,
        resets: true,
        builder: {
          type: 'reset',
          label: 'Reset button',
        },
        align: 'left',
      };
    }

    if (inputKey === 'primaryButton') {
      return {
        name: inputKey,
        type: 'button',
        buttonLabel: 'Button',
        builder: {
          type: 'primaryButton',
          label: 'Primary button',
        },
      };
    }

    if (inputKey === 'secondaryButton') {
      return {
        name: inputKey,
        type: 'button',
        buttonLabel: 'Button',
        secondary: true,
        builder: {
          type: 'secondaryButton',
          label: 'Secondary button',
        },
      };
    }

    if (inputKey === 'dangerButton') {
      return {
        name: inputKey,
        type: 'button',
        buttonLabel: 'Button',
        danger: true,
        builder: {
          type: 'dangerButton',
          label: 'Danger button',
        },
      };
    }

    return {
      name: inputKey,
      type: 'button',
      buttonLabel: item.name,
      builder: {
        type: 'button',
        label: item.name,
      },
    };
  }

  return {
    type: item.type,
    label: item.name,
    name: inputKey,
    builder: {
      type: item.type,
      label: item.name,
    },
  };
}

function generateUniqueId(baseId: string, schema: Record<string, SchemaItem | undefined>): string {
  if (!schema[baseId]) {
    return baseId;
  }
  let counter = 1;
  while (schema[`${baseId}_${counter}`]) {
    counter++;
  }
  return `${baseId}_${counter}`;
}

export function useFormOperations() {
  const formStore = useFormStore();

  const clearForm = () => {
    formStore.form = {
      schema: {},
      steps: undefined,
    };
  };

  const updateForm = (v: any) => {
    if (!v) return;
    formStore.form = {
      schema: v.schema && typeof v.schema === 'object' ? v.schema : {},
      steps: v.steps && typeof v.steps === 'object' && Object.keys(v.steps).length ? v.steps : undefined,
    };
  };

  const handleDropped = (item: Item, stepsEnabled: boolean, currentStepKey: string | null, ensureDefaultStep: () => void) => {
    const inputKey = item.id.split('_')[0]!;
    const schemaItem = createSchemaItem(item, inputKey);

    formStore.form = {
      ...formStore.form,
      schema: {
        ...formStore.form.schema,
        [inputKey]: schemaItem,
      },
    };

    ensureDefaultStep();
    if (stepsEnabled && currentStepKey) {
      const step = formStore.form.steps![currentStepKey];
      if (step && !step.elements.includes(inputKey)) {
        formStore.form.steps![currentStepKey] = {
          ...step,
          elements: [...step.elements, inputKey],
        } as any;
      }
    }
  };

  const handleDelete = (item: Item) => {
    formStore.form = {
      ...formStore.form,
      schema: {
        ...formStore.form.schema,
        [item.id]: undefined,
      },
    };

    if (formStore.form.steps) {
      const updated: Record<string, any> = {};
      for (const [k, v] of Object.entries(formStore.form.steps)) {
        updated[k] = { ...v, elements: (v as any).elements.filter((el: string) => el !== item.id) };
      }
      formStore.form = { ...formStore.form, steps: updated } as any;
    }
  };

  function findRowBoundaries(schemaEntries: [string, SchemaItem][], targetIndex: number) {
    let cumulativeSpan = 0;
    let rowStartIndex = 0;
    let lastItemInRowIndex = targetIndex;

    for (let i = 0; i <= targetIndex; i++) {
      const entry = schemaEntries[i];
      if (!entry) break;
      const colSpan = entry[1].columns?.container ?? 12;

      if (cumulativeSpan + colSpan > 12 && cumulativeSpan > 0) {
        rowStartIndex = i;
        cumulativeSpan = colSpan;
      } else {
        cumulativeSpan += colSpan;
      }
    }

    cumulativeSpan = 0;
    for (let i = rowStartIndex; i < schemaEntries.length; i++) {
      const entry = schemaEntries[i];
      if (!entry) break;
      const colSpan = entry[1].columns?.container ?? 12;

      if (cumulativeSpan + colSpan > 12 && cumulativeSpan > 0) {
        break;
      }

      cumulativeSpan += colSpan;
      lastItemInRowIndex = i;
    }

    return lastItemInRowIndex;
  }

  const handleDropSide = (
    position: 'top' | 'right' | 'left' | 'bottom',
    item: Item,
    index: number,
    displayedItems: Item[],
    stepsEnabled: boolean,
    currentStepKey: string | null,
  ) => {
    const targetItem = displayedItems[index];
    if (!targetItem) return;

    const targetId = targetItem.id;
    const inputKey = item.id.split('_')[0]!;
    const newItemId = generateUniqueId(inputKey, formStore.form.schema);
    const newSchemaItem = createSchemaItem(item, inputKey);
    newSchemaItem.name = newItemId;

    const schemaEntries = Object.entries(formStore.form.schema).filter(
      (entry): entry is [string, SchemaItem] => entry[1] !== undefined,
    );
    const targetIndex = schemaEntries.findIndex(([id]) => id === targetId);

    if (targetIndex === -1) {
      formStore.form = {
        ...formStore.form,
        schema: {
          ...formStore.form.schema,
          [newItemId]: newSchemaItem,
        },
      };
      return;
    }

    const newEntries: [string, SchemaItem][] = [];

    if (position === 'top') {
      schemaEntries.forEach((entry, idx) => {
        if (idx === targetIndex) {
          newEntries.push([newItemId, newSchemaItem]);
        }
        newEntries.push(entry);
      });
    } else if (position === 'bottom') {
      const lastItemInRowIndex = findRowBoundaries(schemaEntries, targetIndex);
      newSchemaItem.columns = { container: 12 };
      schemaEntries.forEach((entry, idx) => {
        newEntries.push(entry);
        if (idx === lastItemInRowIndex) {
          newEntries.push([newItemId, newSchemaItem]);
        }
      });
    } else if (position === 'left' || position === 'right') {
      const targetSchema = formStore.form.schema[targetId];
      if (targetSchema) {
        const currentColSpan = targetSchema.columns?.container ?? 12;
        const halfColSpan = Math.floor(currentColSpan / 2);
        const remainingColSpan = currentColSpan - halfColSpan;

        targetSchema.columns = {
          container: position === 'left' ? remainingColSpan : halfColSpan,
        };

        newSchemaItem.columns = {
          container: position === 'left' ? halfColSpan : remainingColSpan,
        };

        schemaEntries.forEach((entry, idx) => {
          if (idx === targetIndex) {
            if (position === 'left') {
              newEntries.push([newItemId, newSchemaItem]);
              newEntries.push([entry[0], targetSchema]);
            } else {
              newEntries.push([entry[0], targetSchema]);
              newEntries.push([newItemId, newSchemaItem]);
            }
          } else {
            newEntries.push(entry);
          }
        });
      }
    }

    formStore.form = {
      ...formStore.form,
      schema: Object.fromEntries(newEntries),
    };

    if (stepsEnabled && currentStepKey) {
      const step = formStore.form.steps![currentStepKey];
      if (step && !step.elements.includes(newItemId)) {
        const targetElementIndex = step.elements.indexOf(targetId);
        if (targetElementIndex !== -1) {
          const newElements = [...step.elements];
          if (position === 'top' || position === 'left') {
            newElements.splice(targetElementIndex, 0, newItemId);
          } else {
            newElements.splice(targetElementIndex + 1, 0, newItemId);
          }
          formStore.form.steps![currentStepKey] = {
            ...step,
            elements: newElements,
          };
        } else {
          formStore.form.steps![currentStepKey] = {
            ...step,
            elements: [...step.elements, newItemId],
          };
        }
      }
    }
  };

  const handleCopy = (item: Item, displayedItems: Item[], stepsEnabled: boolean, currentStepKey: string | null) => {
    const currentItem = displayedItems.find((it) => it.id === item.id);
    if (!currentItem) return;

    const currentSchemaItem = formStore.form.schema[item.id];
    if (!currentSchemaItem) return;

    const baseId = item.id.split('_')[0]!;
    const newItemId = generateUniqueId(baseId, formStore.form.schema);
    const copiedSchemaItem: SchemaItem = JSON.parse(JSON.stringify(currentSchemaItem));

    const schemaEntries = Object.entries(formStore.form.schema).filter(
      (entry): entry is [string, SchemaItem] => entry[1] !== undefined,
    );
    const currentIndex = schemaEntries.findIndex(([id]) => id === item.id);

    if (currentIndex === -1) {
      formStore.form = {
        ...formStore.form,
        schema: {
          ...formStore.form.schema,
          [newItemId]: copiedSchemaItem,
        },
      };
    } else {
      const newEntries: [string, SchemaItem][] = [];
      schemaEntries.forEach((entry, idx) => {
        newEntries.push(entry);
        if (idx === currentIndex) {
          newEntries.push([newItemId, copiedSchemaItem]);
        }
      });

      formStore.form = {
        ...formStore.form,
        schema: Object.fromEntries(newEntries),
      };
    }

    if (stepsEnabled && currentStepKey) {
      const step = formStore.form.steps![currentStepKey];
      if (step) {
        const currentElementIndex = step.elements.indexOf(item.id);
        if (currentElementIndex !== -1) {
          const newElements = [...step.elements];
          newElements.splice(currentElementIndex + 1, 0, newItemId);
          formStore.form.steps![currentStepKey] = {
            ...step,
            elements: newElements,
          };
        } else {
          formStore.form.steps![currentStepKey] = {
            ...step,
            elements: [...step.elements, newItemId],
          };
        }
      }
    }
  };

  return {
    clearForm,
    updateForm,
    handleDropped,
    handleDelete,
    handleDropSide,
    handleCopy,
  };
}
