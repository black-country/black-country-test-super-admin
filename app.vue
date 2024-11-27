<template>
  <main>
    <!-- Position the toast fixed to ensure it's always on top and aligned to the right -->
    <CoreToast class="fixed top-4 right-4 z-[9999999]" />

    <NuxtLayout class="z-10">
      <NuxtPage class="z-10" />

      <CoreTimeOutModal />

      <!-- Inactivity Warning Modal -->
      <div v-if="isWarningVisible" class="fixed inset-0 flex items-center z-[9999999] justify-center bg-gray-800 bg-opacity-75">
        <div class="bg-white rounded-lg shadow-lg z-[9999999] p-6 w-96 text-center">
          <h2 class="text-lg font-semibold mb-4 text-gray-800">You have been inactive</h2>
          <p class="text-gray-600 mb-4">
            You have been inactive for a while. You will be logged out in <span class="font-bold">{{ countdown }}</span> seconds.
          </p>
          <div class="mt-10">
            <button 
              @click="cancelLogout" 
              class="bg-[#292929] text-white w-full text-sm px-4 py-2 rounded transition">
              Stay Logged In
            </button>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </main>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { useInactivity } from '@/composables/core/useInactivity';
import { useInternetConnection } from '@/composables/core/useInternetConnection'

// Call the composable to activate global internet connection detection
useInternetConnection()

// Initialize the inactivity composable with a 10-minute timeout and a 1-minute warning time
const { isWarningVisible, countdown } = useInactivity(600000, 60000);

// Function to cancel the logout and hide the modal
const cancelLogout = () => {
  isWarningVisible.value = false;
};

import { visible, toastData, useCustomToast } from '@/composables/core/useCustomToast';

// Provide the toast state globally
provide('toastVisible', visible);
provide('toastData', toastData);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Baskervville&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kanit&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');
</style>
