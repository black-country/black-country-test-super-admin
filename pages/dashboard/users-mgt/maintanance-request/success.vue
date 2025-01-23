<template>
    <AuthLayout>
    <div class="flex justify-center items-center mt-20">
      <div class="bg-white rounded-lg p-6 max-w-sm text-center border-[0.5px] border-gray-50">
        <div class="flex justify-center items-center w-12 h-12 bg-green-500 rounded-full mx-auto mb-4">
            <svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.921875" width="63.1513" height="64" rx="31.5756" fill="#0F973D"/>
                <path d="M44.1616 32.3584C44.1616 25.7405 38.7967 20.3757 32.1789 20.3757C25.5611 20.3757 20.1963 25.7405 20.1963 32.3584C20.1963 38.9762 25.5611 44.341 32.1789 44.341C38.7967 44.341 44.1616 38.9762 44.1616 32.3584Z" stroke="white" stroke-width="1.7974"/>
                <path d="M27.5781 32.9633L30.5239 35.9839L37.0045 28.7344" stroke="white" stroke-width="1.7974" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                
        </div>
        <h2 class="text-lg text-[#1D2739] font-medium mb-2">Request assigned</h2>
        <p class="text-gray-500 mb-6 text-sm">You’ve successfully assigned a maintenance request to  {Service provider’s name}.</p>
        <button @click="router.push('/dashboard/property/')"
          class="bg-[#292929] w-full text-white py-3.5 text-sm px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
        >
         Continue
        </button>
      </div>
    </div>
</AuthLayout>
  </template>
  
  <script setup lang="ts">
  import AuthLayout from '@/layouts/auth.vue'
  const router = useRouter()
  </script>
  
  <style scoped>
  /* Add any scoped styles here if needed */
  </style>
  