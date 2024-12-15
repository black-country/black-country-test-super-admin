<template>
    <div class="px-3 py-2.5 font-semibold text-xs bg-[#F9FAFB] flex items-center justify-between text-[#1D2739] rounded-full">
      {{ recipient }}
      <button @click="$emit('remove', recipient)" class="text-gray-500 ml-2">
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.6654 3.83203L3.33203 13.1654M3.33203 3.83203L12.6654 13.1654" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    recipient: string;
  }>();
  </script>