<template>
    <div class="space-y-6">
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">Cover image (Optional)</label>
        <div class="border-2 border-dashed rounded-lg p-8 text-center">
          <button class="px-4 py-2 bg-green-600 text-white rounded-md">
            + Add photo
          </button>
          <p class="text-sm text-gray-500 mt-2">Accepts jpg & png 2MB size max/each</p>
        </div>
      </div>
  
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          v-model="subject"
          placeholder="Enter notification subject"
          class="w-full rounded-md border-gray-300"
        />
      </div>
  
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">Notification content</label>
        <textarea
          v-model="content"
          placeholder="Enter message"
          rows="4"
          class="w-full rounded-md border-gray-300"
        ></textarea>
      </div>
  
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">Upload file</label>
        <div class="border-2 border-dashed rounded-lg p-8 text-center">
          <button class="px-4 py-2 bg-green-600 text-white rounded-md">
            + Add photo
          </button>
          <p class="text-sm text-gray-500 mt-2">Accepts pdf, doc, jpg & png 2MB size max/each</p>
        </div>
      </div>
  
      <div class="flex justify-end space-x-4 mt-8">
        <button
          @click="$emit('prev')"
          class="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          @click="$emit('next')"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const subject = ref('');
  const content = ref('');
  </script>
  