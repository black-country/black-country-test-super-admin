<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
        <!-- Icon (Optional) -->
        <div v-if="icon" class="flex justify-center items-center bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4">
          <slot name="icon">
            <!-- Default Icon -->
            <svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.921875" width="63.1513" height="64" rx="31.5756" fill="#F3A218"/>
              <path d="M42.2031 32.375C42.2031 26.8521 37.7259 22.375 32.2031 22.375C26.6803 22.375 22.2031 26.8521 22.2031 32.375C22.2031 37.8978 26.6803 42.375 32.2031 42.375C37.7259 42.375 42.2031 37.8978 42.2031 32.375Z" stroke="white" stroke-width="1.5"/>
              <path d="M32.4453 37.375V32.375C32.4453 31.9036 32.4453 31.6679 32.2988 31.5214C32.1524 31.375 31.9167 31.375 31.4453 31.375" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M32.1953 28.377H32.2043" stroke="white" stroke-width="3.25" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </slot>
        </div>
  
        <!-- Title -->
        <h2 class="text-lg font-semibold text-gray-700 mb-2">{{ title }}</h2>
  
        <!-- Message -->
        <p class="text-gray-500 mb-6 leading-snug">{{ message }}</p>
  
        <!-- Slot for custom content -->
        <slot />
  
        <!-- Buttons -->
        <div class="space-y-3 mt-4">
          <button
            type="button"
            :disabled="loading"
            class="w-full disabled:cursor-not-allowed disabled:opacity-25 text-sm bg-[#292929] text-white py-3.5 rounded-md font-semibold"
            @click="confirmAction"
          >
            {{  loading ? 'processing...' : `${confirmButtonText}` }}
          </button>
          <button
            type="button"
            class="w-full bg-[#EBE5E0] text-gray-700 text-sm py-3.5 rounded-md font-semibold"
            @click="closeModal"
          >
            {{ cancelButtonText }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  
  // Define props
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    confirmButtonText: {
      type: String,
      default: 'Confirm',
    },
    cancelButtonText: {
      type: String,
      default: 'Cancel',
    },
    icon: {
      type: Boolean,
      default: true, // Set to true if you want the default icon to show
    },
    loading: {
      type: Boolean,
      default: false, // Set to true if you want the default icon to show
    }
  });
  
  // Emit events
  const emit = defineEmits(['close', 'confirm']);
  
  // Function to close the modal
  const closeModal = () => {
    emit('close');
  };
  
  // Function to confirm action
  const confirmAction = () => {
    emit('confirm');
  };
  </script>
  
  <style scoped>
  /* Additional custom styles if needed */
  </style>
  