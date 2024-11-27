<script setup lang="ts">
import { useIdle } from '@/composables/core/useIdle'

const { isModalVisible, countdown, stopCountdown, logoutUser } = useIdle()
</script>

<template>
  <div
    v-if="isModalVisible"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg text-center">
      <h3 class="text-xl text-gray-900 font-semibold mb-4">Wakeup</h3>
      <p class="mb-4">
        You have been inactive for a while. You will be logged out in
        {{ countdown }} seconds.
      </p>
      <div class="flex justify-center gap-4">
        <button
          class="px-4 py-3 text-sm bg-blue-500 w-full text-white rounded hover:bg-blue-600"
          @click="stopCountdown"
        >
          Stay Logged In
        </button>
        <button
          class="px-4 py-3 text-sm bg-red-500 w-full text-white rounded hover:bg-red-600"
          @click="logoutUser"
        >
          Logout Now
        </button>
      </div>
    </div>
  </div>
</template>
