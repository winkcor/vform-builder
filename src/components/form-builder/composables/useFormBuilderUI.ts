import { ref } from 'vue';

export function useFormBuilderUI() {
  const showExport = ref<boolean>(false);
  const previewMode = ref<boolean>(false);
  const isSettingsOpen = ref<boolean>(true);
  const isElementsOpen = ref<boolean>(true);

  const togglePreview = () => {
    previewMode.value = !previewMode.value;
  };

  const toggleExport = () => {
    showExport.value = !showExport.value;
  };

  const toggleSettings = () => {
    isSettingsOpen.value = !isSettingsOpen.value;
  };

  const toggleElements = () => {
    isElementsOpen.value = !isElementsOpen.value;
  };

  return {
    previewMode,
    showExport,
    isSettingsOpen,
    isElementsOpen,
    togglePreview,
    toggleExport,
    toggleSettings,
    toggleElements,
  };
}
