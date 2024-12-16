<template>
    <div class="rounded-lg relative group border-[0.5px] border-gray-50 rounded-lg">
      <div class="bg-yellow-200">
        <!-- <h2 class="text-2xl font-medium mb-2">
          <span v-for="(char, index) in title.split('')" 
                :key="index"
                class="inline-block bg-white px-1 mr-1 mb-1 shadow-sm">
            {{ char }}
          </span>
        </h2> -->
        <img v-if="title === 'Privacy Policy'" src="@/assets/img/privacy-policy.png" />
        <img v-if="title === 'Terms and Conditions'" src="@/assets/img/terms-condition.png" />
      </div>
      <div class="text-sm text-gray-600 space-y-1 p-4 bg-white relative">
        <p class="text-lg text-gray-800">{{ title }}</p>
        <div>Policy Audience: <span class="font-medium text-gray-900">{{ audience }}</span></div>
        <div>Last updated: <span class="font-medium text-gray-900">{{ lastUpdated }}</span></div>

        <button class="absolute top-4 right-4">
        <span class="sr-only">More options</span>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string
    audience: string
    lastUpdated: string
  }>()
  </script>