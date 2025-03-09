<template>
  <Layout class="bg-red-500">
    <template #header-content>
      <div v-if="!loading" class="flex justify-between items-center md:p-4 w-full">
        <div class="flex items-center space-x-5">
          <button
            @click="router.back()"
            class="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 5C12.5 5 7.50001 8.68242 7.5 10C7.49999 11.3177 12.5 15 12.5 15"
                stroke="#292929"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            Back
          </button>
          <span class="md:text-xl font-medium text-[#1D2739]"
            >{{ tenantDetails?.firstName }}
            {{  tenantDetails?.lastName }}</span
          >
        </div>
        <div class="flex md:space-x-4 space-x-1">
          <button @click="router.push({path: '/dashboard/messages', query: { userId: tenantDetails?.id }})"
          >
          <svg width="52" height="44" viewBox="0 0 52 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_5289_76593)">
            <rect width="52" height="44" rx="8" fill="#F9FAFB"/>
            <path d="M27.8101 29.4094C31.296 29.1777 34.0726 26.3617 34.3011 22.8264C34.3458 22.1346 34.3458 21.4181 34.3011 20.7262C34.0726 17.191 31.296 14.3749 27.8101 14.1432C26.6209 14.0642 25.3793 14.0643 24.1925 14.1432C20.7066 14.3749 17.93 17.191 17.7015 20.7262C17.6568 21.4181 17.6568 22.1346 17.7015 22.8264C17.7847 24.114 18.3542 25.3062 19.0246 26.3128C19.4138 27.0176 19.1569 27.8972 18.7515 28.6655C18.4591 29.2195 18.313 29.4965 18.4303 29.6966C18.5477 29.8967 18.8098 29.9031 19.3342 29.9158C20.371 29.9411 21.0702 29.6471 21.6252 29.2378C21.94 29.0057 22.0974 28.8897 22.2058 28.8763C22.3143 28.863 22.5278 28.9509 22.9546 29.1267C23.3383 29.2847 23.7838 29.3822 24.1925 29.4094C25.3793 29.4883 26.6209 29.4885 27.8101 29.4094Z" stroke="#292929" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M25.9976 22H26.005M29.3272 22H29.3347M22.668 22H22.6754" stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_5289_76593">
            <rect width="52" height="44" rx="8" fill="white"/>
            </clipPath>
            </defs>
            </svg>

          </button>
          <button @click="callTenantPhoneNumber"
          >
             <svg width="52" height="44" viewBox="0 0 52 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_5289_76594)">
              <rect width="52" height="44" rx="8" fill="#F9FAFB"/>
              <path d="M19.1493 21.9513C18.3593 20.5738 17.9778 19.4489 17.7478 18.3087C17.4077 16.6223 18.1861 14.975 19.4758 13.9239C20.0208 13.4797 20.6457 13.6315 20.968 14.2097L21.6956 15.5151C22.2724 16.5498 22.5608 17.0672 22.5036 17.6157C22.4464 18.1642 22.0574 18.6109 21.2796 19.5044L19.1493 21.9513ZM19.1493 21.9513C20.7484 24.7396 23.2578 27.2504 26.0493 28.8513M26.0493 28.8513C27.4269 29.6413 28.5517 30.0228 29.692 30.2528C31.3783 30.593 33.0256 29.8145 34.0767 28.5248C34.521 27.9798 34.3692 27.355 33.791 27.0327L32.4855 26.305C31.4508 25.7283 30.9335 25.4399 30.385 25.4971C29.8365 25.5543 29.3897 25.9432 28.4963 26.721L26.0493 28.8513Z" stroke="#292929" stroke-width="1.5" stroke-linejoin="round"/>
              </g>
              <defs>
              <clipPath id="clip0_5289_76594">
              <rect width="52" height="44" rx="8" fill="white"/>
              </clipPath>
              </defs>
              </svg>
          </button>
        </div>
      </div>
      <section>
        <div class="h-16 animate-pulse bg-slate-400 rounded w-full"></div>
      </section>
    </template>
    <main v-if="!loading" class="lg:flex max-w-6xl mx-auto space-y-6 lg:space-y-0">
      <div class="lg:max-w-6xl lg:w-96">
        <UsersProfile :tenantObj="tenantDetails" />
      </div>
      <div class="flex-1 lg:px-6 lg:max-w-6xl">
        <UsersDetails :tenantObj="tenantDetails" />
      </div>
    </main>
  </Layout>
  <CoreFullScreenLoader :visible="loading" text="Fetching user details..." logo="/path-to-your-logo.png" />
</template>

<script setup lang="ts">
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useGetTenentDetails } from '@/composables/modules/tenants/useFetchTenantDetails'
const { tenantDetails, loading } = useGetTenentDetails()
const { showToast } = useCustomToast();
import Layout from "@/layouts/dashboard.vue";
const router = useRouter()
definePageMeta({
  middleware: "auth",
});

// Function to trigger the phone call
const callTenantPhoneNumber = () => {
  if (tenantDetails?.phoneNumber) {
    window.location.href = `tel:${tenantDetails?.value?.phoneNumber}`;
  } else {
    showToast({
          title: "Error",
          message: "Phone number is not available'",
          toastType: "error",
          duration: 3000
        });
  }
};
</script>
