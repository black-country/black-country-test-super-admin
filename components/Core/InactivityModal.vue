<!-- components/CoreInactivityModal.vue -->
<template>
    <div v-if="isWarningVisible" class="fixed inset-0 flex items-center z-[9999999] justify-center bg-gray-800 bg-opacity-75">
      <div class="bg-white rounded-lg shadow-lg z-[9999999] p-6 w-96 text-center">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Session Timeout Warning</h2>
        <p class="text-gray-600 mb-4">
          Due to inactivity, your session will expire in <span class="font-bold">{{ formatTime(countdown) }}</span>.
        </p>
        <div class="flex gap-4 mt-6">
          <button 
            @click="stayLoggedIn" 
            class="flex-1 bg-[#292929] text-white px-4 py-2 rounded transition hover:bg-gray-700">
            Stay Logged In
          </button>
          <button 
            @click="handleLogout" 
            class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded transition hover:bg-gray-100">
            Logout
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useInactivity } from '@/composables/core/useInactivity';
  
  const { isWarningVisible, countdown, handleLogout, stayLoggedIn } = useInactivity();
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  </script>