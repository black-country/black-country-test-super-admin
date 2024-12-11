<template>
    <div class="space-y-6">
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">Frequency</label>
        <select v-model="frequency" class="w-full rounded-md border-gray-300">
          <option value="">Select reminder frequency</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
  
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">Start date</label>
          <div class="relative">
            <input
              type="text"
              v-model="startDate"
              placeholder="dd/mm/yyyy"
              class="w-full rounded-md border-gray-300"
            />
            <button class="absolute right-2 top-2">
              <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
  
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">End date</label>
          <div class="relative">
            <input
              type="text"
              v-model="endDate"
              placeholder="dd/mm/yyyy"
              class="w-full rounded-md border-gray-300"
            />
            <button class="absolute right-2 top-2">
              <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
  
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">Select the desired time</label>
        <input
          type="time"
          v-model="time"
          class="w-full rounded-md border-gray-300"
        />
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
  const frequency = ref('');
  const startDate = ref('');
  const endDate = ref('');
  const time = ref('00:00');
  </script>