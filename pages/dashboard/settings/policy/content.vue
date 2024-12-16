<template>
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <div class="flex items-start mb-8">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              1
            </div>
            <div class="ml-4">Basic policy information</div>
          </div>
          <div class="mx-4">→</div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center">
              2
            </div>
            <div class="ml-4 font-medium">Compose content</div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg border p-4 mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Policy content
          </label>
          <div class="min-h-[200px] bg-gray-50 rounded-lg p-4">
            <textarea
              v-model="policyContent"
              class="w-full h-full min-h-[180px] bg-transparent resize-none focus:outline-none"
              placeholder="Enter message"
            ></textarea>
          </div>
          <div class="flex items-center space-x-4 mt-4">
            <button v-for="tool in editorTools" 
                    :key="tool.label"
                    class="p-2 hover:bg-gray-100 rounded"
                    :title="tool.label">
              <component :is="tool.icon" class="w-5 h-5" />
            </button>
          </div>
        </div>
  
        <div class="flex justify-between">
          <button 
            class="px-6 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            @click="$router.push('/dashboard/settings/policy/create-policy')"
          >
            Cancel
          </button>
          <button 
            class="px-6 py-2 bg-gray-200 text-gray-500 rounded-md"
            :class="{ 'bg-gray-900 text-white hover:bg-gray-800': policyContent }"
            :disabled="!policyContent"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const policyContent = ref('')
  
  const editorTools = [
    { label: 'Bold', icon: 'Bold' },
    { label: 'Italic', icon: 'Italic' },
    { label: 'Heading', icon: 'Heading' },
    { label: 'Quote', icon: 'Quote' },
    { label: 'Link', icon: 'Link' },
    { label: 'Image', icon: 'Image' },
    { label: 'Bullet List', icon: 'List' },
    { label: 'Numbered List', icon: 'OrderedList' }
  ]
  </script>