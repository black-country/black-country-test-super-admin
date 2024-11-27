<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 max-w-7xl mx-auto p-10 lg:p-0">
      <SelectOptionCard
        image="upload-template.png"
        title="Upload Lease Document"
        description="Already have a lease document prepared? Ensure your file is in the correct format"
        value="upload"
        :selectedValue="selectedOption"
        @select="selectOption"
      />
      <SelectOptionCard
        image="create-template.png"
        title="Create from Scratch"
        description="Start a lease from the ground up, allowing you to fully customize your lease agreement."
        value="create"
        :selectedValue="selectedOption"
        @select="selectOption"
      />
      <SelectOptionCard
        image="create-template.png"
        title="Choose from Template"
        description="Get a head start with a premade lease and make adjustments as needed."
        value="template"
        :selectedValue="selectedOption"
        @select="selectOption"
      />
    </div>
    <CoreUploadModal v-if="showUploadModal" />
  </template>
  
  <script setup lang="ts">  
  const selectedOption = ref(''); // This will hold the currently selected option
  const router = useRouter()
  import { useCreateLeaseTemplate } from '@/composables/modules/lease/create'

const { payload } = useCreateLeaseTemplate();

  const showUploadModal = ref(false)
  
  const selectOption = (option: string) => {
    console.log(option, 'option')
    selectedOption.value = option; // Update selected option when user selects a card
    if(option === 'upload'){
      router.push('/dashboard/property/lease-documents/upload')
      // showUploadModal.value = true
    }

    if(option === 'create'){
      payload.value.body = `<html></html>`;
       router.push('/dashboard/property/lease-documents/create')
    }

    if(option === 'template'){
      router.push('/dashboard/property/lease-documents/templates')
    }
  };
  </script>
  
  <style scoped>
  /* Flexbox layout for centering cards */
  .flex {
    display: flex;
  }
  </style>
  