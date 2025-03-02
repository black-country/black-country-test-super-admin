<template>
    <div class="w-full overflow-x-hidden">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-semibold">{{ currentTitle }}</h2>
        <span class="text-gray-800">{{ currentStep }}/{{ totalSteps }} (sub step)</span>
      </div>
      <div class="relative w-full h-1 bg-gray-200">
        <div 
          class="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300"
          :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps } from 'vue'
  
  const props = defineProps({
    titles: {
      type: Array as () => string[],
      required: true
    },
    currentStep: {
      type: Number,
      required: true
    },
    totalSteps: {
      type: Number,
      required: true,
      default: 2
    }
  })
  
  const currentTitle = computed(() => {
    return props.titles[props.currentStep - 1] || 'Step'
  })
  </script>
  
  <style scoped>
  /* Custom styles if necessary */
  </style>
  