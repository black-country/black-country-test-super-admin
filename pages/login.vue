
<template>
    <div>
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-16 w-auto" src="@/assets/icons/logo.svg" alt="Your Company" />
        <h2 class="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-[#1D2739] max-w-sm mx-auto">Welcome back admin@blackcountry.com</h2>
      </div>
  
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="login">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-[#1D2739]">Email</label>
            <input
              type="email"
              id="email"
              v-model="credential.email.value"
              placeholder="Enter your email"
              class="mt-1 block w-full bg-[#E4E7EC] text-sm px-4 py-4 border-[0.5px] border-gray-100 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
  
          <div class="mb-4 relative">
            <label for="password" class="block text-sm font-medium text-[#1D2739]"
              >Password</label
            >
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model.trim="credential.password.value"
              placeholder="Enter your password"
              class="mt-1 block w-full bg-[#E4E7EC] text-sm px-4 py-4 border-[0.5px] border-gray-100 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div
              @click="toggleShowPassword"
              class="absolute inset-y-0 right-4 top-6 flex items-center cursor-pointer"
            >
              <svg
                v-if="!showPassword"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.3332 6.66669C18.3332 6.66669 14.9998 11.6667 9.99984 11.6667C4.99984 11.6667 1.6665 6.66669 1.6665 6.66669"
                  stroke="#1D2739"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M12.5 11.25L13.75 13.3333"
                  stroke="#1D2739"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.6665 9.16669L18.3332 10.8334"
                  stroke="#1D2739"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M1.6665 10.8334L3.33317 9.16669"
                  stroke="#1D2739"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.5 11.25L6.25 13.3333"
                  stroke="#1D2739"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
    
              <svg
                v-if="showPassword"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.9532 9.20419C18.2065 9.55944 18.3332 9.7371 18.3332 10C18.3332 10.2629 18.2065 10.4406 17.9532 10.7959C16.8148 12.3922 13.9075 15.8334 9.99984 15.8334C6.09215 15.8334 3.18492 12.3922 2.04654 10.7959C1.79318 10.4406 1.6665 10.2629 1.6665 10C1.6665 9.7371 1.79318 9.55944 2.04654 9.20419C3.18492 7.60789 6.09215 4.16669 9.99984 4.16669C13.9075 4.16669 16.8148 7.60789 17.9532 9.20419Z"
                  stroke="#1D2739"
                  stroke-width="2"
                />
                <path
                  d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z"
                  stroke="#1D2739"
                  stroke-width="1.5"
                />
              </svg>
            </div>
          </div>
  
          <button
          type="submit"
          :disabled="isFormDisabled"
          class="bg-[#292929] disabled:cursor-not-allowed disabled:opacity-25 py-4 px-4  text-white rounded-lg w-full  font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
        {{ loading ? "processing..." : "Continue" }}
        </button>
        </form>
  
        <!-- <p class="mt-10 text-center text-sm text-gray-500">
          Not a member?
          {{ ' ' }}
          <a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Start a 14 day free trial</a>
        </p> -->
      </div>
    </div>
  </template>
  

<script setup lang="ts">
import { use_auth_login } from '@/composables/auth/login'
const { credential, login, loading, isFormDisabled } = use_auth_login()

  const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

  const showPassword = ref(false);
const router = useRouter()
// definePageMeta({
//     layout: 'auth'
// })
</script>
