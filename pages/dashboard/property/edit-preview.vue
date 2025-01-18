<template>
    <LayoutWithoutSidebar>
      <header
      class="px-4 py-5 flex items-center justify-between container mx-auto fixed top-0 left-0 right-0 z-10"
    >
      <div
        @click="router.push('/dashboard')"
        class="flex items-center space-x-2 cursor-pointer"
      >
        <img src="@/assets/icons/logo.svg" alt="Logo" class="h-8 w-auto" />
        <span class="text-lg font-semibold">BlackCountry</span>
      </div>
      <div class="flex space-x-4 items-center">
        <NuxtLink to="/dashboard/property/review-progress" class="text-[#326543] text-sm hover:text-[#326543]">
          Preview
        </NuxtLink>
        <button
        @click="openCancelModal = true"
          class="bg-white border text-sm border-gray-300 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button :disabled="saving" @click="save_property"
          class="bg-gray-900 text-sm disabled:cursor-not-allowed disabled:opacity-25 text-white px-4 py-3 rounded-md hover:bg-gray-800"
        >
           {{ saving ? 'saving..' : 'Save & exit'}}
        </button>
      </div>
    </header>
  
      <!-- Main Content -->
       {{ payload }}
      <main class="flex flex-col py-3 mt-20 overflow-y-auto max-w-7xl lg:w-6/12 mx-auto px-4">
        <PreviewPropertyPreview :payload="payload" class="" />
      </main>
  
      <!-- Fixed Bottom Section -->
      <section class="fixed bottom-0 left-0 right-0 bg-white py-3 border-t shadow-md z-50 px-6">
        <div class="flex justify-between items-center container mx-auto">
          <button @click="router.back()" class="text-[#292929] bg-[#EBE5E0] px-6 py-3 rounded-md">Previous</button>
          <button :disabled="loading" @click="handlePublish" class="bg-[#292929] disabled:opacity-25 disabled:cursor-not-allowed text-white text-sm px-6 py-3 rounded-md">{{loading ? 'Processing...' : 'Publish'}}</button>
        </div>
      </section>
  
      <CoreReusableModal
      :isOpen="openCancelModal"
      message="By cancelling, you will loose progress of your property upload"
      confirmButtonText="No, Continue uploading"
      cancelButtonText="Yes, Cancel"
      @close="handleClose"
      @confirm="handleConfirm"
    />
    </LayoutWithoutSidebar>
  </template>
  
  <script lang="ts" setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();
  import { useEditProperty } from '@/composables/modules/property/update';
  const { editProperty, payload, loading, initForm, fetchingProperty, saving, savingProperty } = useEditProperty();
  import { useClearLocalStorage } from '@/composables/core/useClearLocalStorage';
  const { clearLocalStorage } = useClearLocalStorage();
  import { useUnsavedChangesWarning } from '@/composables/core/useUnsavedChangesWarning'
  const { enableUnsavedChangesWarning, disableUnsavedChangesWarning } = useUnsavedChangesWarning()
  enableUnsavedChangesWarning()
  // editProperty();
  definePageMeta({
       middleware: 'auth'
  })
  
  const openCancelModal = ref(false)
  
  const handleConfirm = () => {
    clearLocalStorage();
    openCancelModal.value = false
  
  }
  
  const handleClose = () => {
    clearLocalStorage();
    router.push('/dashboard/property')
    openCancelModal.value = false
  }
  
  // const handleSaveAndExit = () => {
  //   create_property();
  // };
  
  const handlePublish = () => {
    create_property();
  };
  
  
  const showPreview = (propertyDetails: any) => {
    openModal(propertyDetails);
  };
  </script>
  
  <style scoped>
  /* Ensure the main content area does not overlap with the fixed sections */
  main {
    padding-top: 4rem; /* Space for the fixed header */
    padding-bottom: 4rem; /* Space for the fixed bottom section */
    height: calc(100vh - 8rem); /* Adjust height considering the fixed header and footer */
    overflow-y: auto; /* Make the main content scrollable */
  }
  </style>
  