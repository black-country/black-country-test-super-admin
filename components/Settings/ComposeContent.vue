<template>
    <div class="w-full">
      <h2 class="text-lg font-medium mb-4">Compose the policy content</h2>
  
      <div class="mb-8">
        <label class="block text-sm text-gray-700 mb-2">
          Policy content
        </label>
        <QuillEditor
          v-model:content="content"
          :options="editorOptions"
          contentType="html"
          theme="snow"
          toolbar="full"
          class="bg-gray-50/50 rounded-md border border-gray-200"
        />
      </div>
  
      <!-- <div class="flex justify-between">
        <button 
          @click="handleBack"
          class="px-6 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit"
          :disabled="!content"
          class="px-6 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :class="content ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400'"
        >
          Submit
        </button>
      </div> -->

      <div class="border-t border-[#E4E7EC] bg-white flex justify-between px-8 md:px-32 items-center space-x-4 p-4 fixed bottom-0 left-0 w-full">
        <button
           @click="handleBack"
          class="px-6 py-2.5 border border-[#D0D5DD] rounded-lg text-[#344054] hover:bg-[#F9FAFB]"
        >
        Cancel
        </button>
        <button
         @click="handleSubmit"
          :disabled="!content"
          class="px-6 py-2.5 rounded-lg bg-[#101828] text-white disabled:opacity-90 disabled:cursor-not-allowed"
          :class="content ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400'"
        >
        Submit
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { QuillEditor } from '@vueup/vue-quill'
  
  const content = ref('')
  
  const editorOptions = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'header': [1, 2, false] }],
        ['link'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
      ]
    },
    placeholder: 'Enter message'
  }
  
  const emit = defineEmits(['back', 'submit'])
  
  function handleBack() {
    emit('back')
  }
  
  function handleSubmit() {
    if (content.value) {
      emit('submit', content.value)
    }
  }
  </script>