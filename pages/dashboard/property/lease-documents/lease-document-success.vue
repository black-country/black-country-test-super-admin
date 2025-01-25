<template>
    <AuthLayout>
    <div class="flex justify-center items-center mt-20">
      <div class="bg-white rounded-lg p-6 max-w-sm text-center border-[0.5px] border-gray-50">
        <div class="flex justify-center items-center w-12 h-12 bg-green-500 rounded-full mx-auto mb-4">
            <svg width="64" height="65" viewBox="0 0 64 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.703125" y="0.5" width="63.1513" height="64" rx="31.5756" fill="black"/>
                <path d="M43.9419 32.8596C43.9419 26.2418 38.577 20.877 31.9592 20.877C25.3414 20.877 19.9766 26.2418 19.9766 32.8596C19.9766 39.4774 25.3414 44.8423 31.9592 44.8423C38.577 44.8423 43.9419 39.4774 43.9419 32.8596Z" stroke="white" stroke-width="1.7974"/>
                <path d="M27.3594 33.4633L30.3051 36.4839L36.7857 29.2344" stroke="white" stroke-width="1.7974" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                
                
        </div>
        <h2 class="text-lg text-[#1D2739] font-medium mb-2">Lease agreement was signed and sent to tenant successfully</h2>
        <p class="text-gray-500 mb-6 text-sm">You've successfully created a new lease </p>
            <div class="space-y-4 w-full">
                <NuxtLink to='/dashboard/property/'
                class="bg-[#292929] w-full  text-white py-3.5 w-full text-sm px-4 rounded-md hover:bg-gray-800 px-6 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
            >
            Continue
            </NuxtLink>
            <!-- <button @click="router.push('/dashboard/property/')"
            class="w-full bg-[#EBE5E0] py-3.5 text-[#292929] text-sm px-4 rounded-md  "
            >
            I’ll do it later
            </button> -->
            </div>
      </div>
    </div>
</AuthLayout>
  </template>
  
  <script setup lang="ts">
  import AuthLayout from '@/layouts/auth.vue'
  const router = useRouter()
  definePageMeta({
     middleware: 'auth'
})
  // No additional setup is needed for this component
  </script>
  
  <style scoped>
  /* Add any scoped styles here if needed */
  </style>
  