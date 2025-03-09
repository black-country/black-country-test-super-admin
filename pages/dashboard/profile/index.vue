<template>
  <Layout>
    <template #header-content>
      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
        <div class="flex items-center gap-x-4">
          <button @click="router.back()" class="text-[#1D2739] flex items-center gap-x-3 px-4 py-3 text-sm bg-gray-50 rounded-md">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 5C12.5 5 7.50001 8.68242 7.5 10C7.49999 11.3177 12.5 15 12.5 15" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            Back</button>
        </div>

        <div class="flex items-center gap-x-4 lg:gap-x-6">
          <NuxtLink to="/dashboard/notification" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative">
            <span class="sr-only">View notifications</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
              aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <div v-if="notificationCount > 0" class="h-2 w-2 bg-red-600 absolute rounded-full top-2.5 right-2.5"></div>
          </NuxtLink>
          <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true"></div>
          <div class="relative">
            <button type="button" class="-m-1.5 flex items-center p-1.5" id="user-menu-button" aria-expanded="false"
              aria-haspopup="true">
              <span class="sr-only">Open user menu</span>
              <!-- <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#292929" />
                <path
                  d="M20.0817 20.1818C20.0817 21.4242 19.8544 22.4924 19.3999 23.3864C18.9453 24.2765 18.3222 24.9621 17.5305 25.4432C16.7427 25.9205 15.8468 26.1591 14.843 26.1591C13.8355 26.1591 12.9358 25.9205 12.1442 25.4432C11.3563 24.9621 10.7351 24.2746 10.2805 23.3807C9.82599 22.4867 9.59872 21.4205 9.59872 20.1818C9.59872 18.9394 9.82599 17.8731 10.2805 16.983C10.7351 16.089 11.3563 15.4034 12.1442 14.9261C12.9358 14.4451 13.8355 14.2045 14.843 14.2045C15.8468 14.2045 16.7427 14.4451 17.5305 14.9261C18.3222 15.4034 18.9453 16.089 19.3999 16.983C19.8544 17.8731 20.0817 18.9394 20.0817 20.1818ZM18.343 20.1818C18.343 19.2348 18.1896 18.4375 17.8828 17.7898C17.5798 17.1383 17.1631 16.6458 16.6328 16.3125C16.1063 15.9754 15.5097 15.8068 14.843 15.8068C14.1726 15.8068 13.5741 15.9754 13.0476 16.3125C12.5211 16.6458 12.1044 17.1383 11.7976 17.7898C11.4946 18.4375 11.343 19.2348 11.343 20.1818C11.343 21.1288 11.4946 21.928 11.7976 22.5795C12.1044 23.2273 12.5211 23.7197 13.0476 24.0568C13.5741 24.3902 14.1726 24.5568 14.843 24.5568C15.5097 24.5568 16.1063 24.3902 16.6328 24.0568C17.1631 23.7197 17.5798 23.2273 17.8828 22.5795C18.1896 21.928 18.343 21.1288 18.343 20.1818ZM22.2706 26V14.3636H26.4183C27.3198 14.3636 28.0679 14.5189 28.6626 14.8295C29.2611 15.1402 29.7081 15.5701 30.0036 16.1193C30.299 16.6648 30.4467 17.2955 30.4467 18.0114C30.4467 18.7235 30.2971 19.3504 29.9979 19.892C29.7024 20.4299 29.2554 20.8485 28.657 21.1477C28.0623 21.447 27.3142 21.5966 26.4126 21.5966H23.2706V20.0852H26.2536C26.8217 20.0852 27.2839 20.0038 27.6399 19.8409C27.9998 19.678 28.263 19.4413 28.4297 19.1307C28.5964 18.8201 28.6797 18.447 28.6797 18.0114C28.6797 17.572 28.5945 17.1913 28.424 16.8693C28.2573 16.5473 27.9941 16.3011 27.6342 16.1307C27.2782 15.9564 26.8104 15.8693 26.2308 15.8693H24.0263V26H22.2706ZM28.0149 20.75L30.8899 26H28.8899L26.0717 20.75H28.0149Z"
                  fill="#EBE5E0" />
              </svg> -->
              <p class="bg-gray-900 text-white p-3 font-semibold rounded-lg">{{initials}}</p>

              <span class="hidden lg:flex lg:items-center">
                <div>
                    <span v-if="user"
                    class="ml-4 text-sm py-0 my-0 font-semibold block leading-6 text-gray-900"
                    aria-hidden="true"
                    > {{profileObj?.firstName}}  {{profileObj?.lastName}}</span
                  >
                  <span class="text-sm py-0 my-0 font-light text-[#667185] block">{{propertyObj?.group ?? 'Super Admin'}}</span>
                </div>
                <svg @click="router.push('/dashboard/profile')" class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#1D2739" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>

              </span>
            </button>
          </div>
        </div>
      </div>
    </template>
  <main>
    <div v-if="!fetchingSuperAdmin" class="min-h-screen bg-gray-25 pb-10">
      <div class="max-w-xl mx-auto space-y-4 pt-10">
        <div class="max-w-sm mx-auto px-6 pb-6 text-center space-y-4 relative">
          <div class="relative inline-block">
         <img v-if="profileObj.profilePicture" :src="profileObj.profilePicture" alt="" class="h-20 w-20 rounded-full"  />
         <img v-else src="@/assets/icons/profile-placeholder.svg" alt=""  />

      
            <!-- Percentage Text -->
            <!-- <div class="absolute inset-0 flex items-center justify-center">
              <svg width="" height="" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M38.9271 39.7854C40.9459 37.8885 42.5541 35.5977 43.6524 33.0546C44.7507 30.5115 45.3157 27.7701 45.3125 25C45.3125 13.7812 36.2188 4.6875 25 4.6875C13.7813 4.6875 4.68751 13.7812 4.68751 25C4.68431 27.7701 5.24932 30.5115 6.34762 33.0546C7.44592 35.5977 9.05416 37.8885 11.0729 39.7854C14.8374 43.3414 19.8216 45.3195 25 45.3125C30.1785 45.3195 35.1626 43.3414 38.9271 39.7854ZM12.8021 37.1083C14.2648 35.2784 16.1209 33.8015 18.2326 32.7873C20.3443 31.7731 22.6574 31.2477 25 31.25C27.3427 31.2477 29.6557 31.7731 31.7674 32.7873C33.8792 33.8015 35.7353 35.2784 37.1979 37.1083C35.6021 38.7202 33.7022 39.9992 31.6083 40.8711C29.5144 41.743 27.2682 42.1904 25 42.1875C22.7318 42.1904 20.4856 41.743 18.3917 40.8711C16.2978 39.9992 14.3979 38.7202 12.8021 37.1083ZM32.8125 18.75C32.8125 20.822 31.9894 22.8091 30.5243 24.2743C29.0592 25.7394 27.072 26.5625 25 26.5625C22.928 26.5625 20.9409 25.7394 19.4757 24.2743C18.0106 22.8091 17.1875 20.822 17.1875 18.75C17.1875 16.678 18.0106 14.6909 19.4757 13.2257C20.9409 11.7606 22.928 10.9375 25 10.9375C27.072 10.9375 29.0592 11.7606 30.5243 13.2257C31.9894 14.6909 32.8125 16.678 32.8125 18.75Z" fill="#D6D0CC"/>
                  </svg>
            </div> -->
          </div>
      
          <!-- User Info -->
          <div>
            <p class="text-xl font-bold text-[#1D2739]">{{user.firstName ?? 'Nil'}} {{user.lastName ?? 'Nil'}}</p>
            <p class="text-sm text-[#667185]">Super Admin</p>
          </div>
        </div>
  
  
  <section class="space-y-5">
      <div class="space-y-1">
          <h2
            class="border-[0.5px] border-gray-25 rounded-md bg-white text-sm font- text-[#1D2739] p-4"
          >
            Account settings
          </h2>
          <div class="border-[0.5px] border-gray-25 rounded-md bg-white">
            <NuxtLink
              v-for="(item, idx) in accountSettings"
              :key="idx"
              :to="item.path"
              class="flex items-center cursor-pointer justify-between p-4 cursor-pointer rounded-lg"
            >
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <img :src="dynamicIcons(item.icon)" alt="" />
                  <span class="text-sm font- text-[#1D2739]">{{
                    item.label
                  }}</span>
                </div>
                <div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.00003 4C6.00003 4 10 6.94593 10 8C10 9.05413 6 12 6 12"
                      stroke="#667185"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
  
        <div
        class="border-[0.5px] border-gray-25 rounded-md bg-white text-sm font- text-[#BA110B] p-4 flex justify-between items-center"
      >
  <div @click="showBLogoutModal = true" class="flex  cursor-pointer items-center gap-x-3">
      <img :src="dynamicIcons('red-logout')" alt="" />
      <p>Log out</p>
  </div>
  
      <div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.00003 4C6.00003 4 10 6.94593 10 8C10 9.05413 6 12 6 12"
              stroke="#667185"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
  </section>
      </div>
    </div>
    <section class="max-w-xl mx-auto" v-else>
      <div class="rounded-md p-4 w-full mx-auto mt-10">
        <div class="animate-pulse flex space-x-4">
          <!-- <div class="rounded-md bg-slate-200 h-44 w-44"></div> -->
          <div class="flex-1 space-y-6 py-1">
            <div class="h-32 bg-slate-200 rounded"></div>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="h-32 w-full bg-slate-200 rounded col-span-2"></div>
                <div class="h-32 w-full bg-slate-200 rounded col-span-1"></div>
              </div>
              <div class="h-32 w-full bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
     </section>

     <CoreModalWithoutCloseBtn
     :isOpen="showBLogoutModal"
     @close="showBLogoutModal = false"
     >
     <div
     class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
     @click.self="onCancel"
   >
     <div class="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
       <div class="flex justify-center items-center bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4">
         <svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
           <rect x="0.921875" width="63.1513" height="64" rx="31.5756" fill="#F3A218"/>
           <path d="M42.2031 32.375C42.2031 26.8521 37.7259 22.375 32.2031 22.375C26.6803 22.375 22.2031 26.8521 22.2031 32.375C22.2031 37.8978 26.6803 42.375 32.2031 42.375C37.7259 42.375 42.2031 37.8978 42.2031 32.375Z" stroke="white" stroke-width="1.5"/>
           <path d="M32.4453 37.375V32.375C32.4453 31.9036 32.4453 31.6679 32.2988 31.5214C32.1524 31.375 31.9167 31.375 31.4453 31.375" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
           <path d="M32.1953 28.377H32.2043" stroke="white" stroke-width="3.25" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
           
       </div>
       <h2 class="text-lg font-semibold text-gray-700 mb-2">Logout</h2>
       <p class="text-gray-500 mb-6">Are you sure you want to logout?</p>
       <div class="space-y-3">
         <button
           type="button"
           class="w-full disabled:cursor-not-allowed text-sm disabled:opacity-25 bg-[#292929] text-white py-3.5 rounded-md font-semibold"
           @click="onConfirm"
           :disabled="loading"
         >
           Yes, log out
         </button>
         <button
           type="button"
           class="w-full bg-[#EBE5E0] text-gray-700 text-sm py-3.5 rounded-md font-semibold"
           @click="onCancel"
         >
           Cancel
         </button>
       </div>
     </div>
   </div>
     </CoreModalWithoutCloseBtn>

     

    <!-- <CoreModal
    :isOpen="showBLogoutModal"
    @close="showBLogoutModal = false"
    >
    <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    @click.self="onCancel"
  >
    <div class="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">

      <div class="flex justify-center items-center bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4">
        <svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.921875" width="63.1513" height="64" rx="31.5756" fill="#F3A218"/>
          <path d="M42.2031 32.375C42.2031 26.8521 37.7259 22.375 32.2031 22.375C26.6803 22.375 22.2031 26.8521 22.2031 32.375C22.2031 37.8978 26.6803 42.375 32.2031 42.375C37.7259 42.375 42.2031 37.8978 42.2031 32.375Z" stroke="white" stroke-width="1.5"/>
          <path d="M32.4453 37.375V32.375C32.4453 31.9036 32.4453 31.6679 32.2988 31.5214C32.1524 31.375 31.9167 31.375 31.4453 31.375" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M32.1953 28.377H32.2043" stroke="white" stroke-width="3.25" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
      </div>
      
  
      <h2 class="text-lg font-semibold text-gray-700 mb-2">Logout</h2>


      <p class="text-gray-500 mb-6">Are you sure you want to logout?</p>

 
      <div class="space-y-3">
        <button
          type="button"
          class="w-full disabled:cursor-not-allowed text-sm disabled:opacity-25 bg-[#292929] text-white py-3.5 rounded-md font-semibold"
          @click="onConfirm"
          :disabled="loading"
        >
          Yes, log out
        </button>
        <button
        type="'button"
          class="w-full bg-[#EBE5E0] text-gray-700 text-sm py-3.5 rounded-md font-semibold"
          @click="onCancel"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
    </CoreModal> -->
  </main>
</Layout>
</template>

<script setup lang="ts">
import { useUserInitials } from '@/composables/core/useUserInitials'
import Layout from '@/layouts/dashboard.vue';
import { useUser } from '@/composables/auth/user'
import { dynamicIcons } from "@/utils/assets";
import { use_admin_profile } from '@/composables/auth/getProfile'
import { useFetchNotificationCount } from '~/composables/modules/notification/fetchCount';
const { profileObj, loading: fetchingSuperAdmin } = use_admin_profile()
const { user } = useUser()
const {notificationCount} = useFetchNotificationCount();
const showBLogoutModal = ref(false);
const router = useRouter()
const loading = ref(false)
const onConfirm = () => {
  // Logic for logout
  // loading.value = true
  localStorage.clear()
  setTimeout(() => {
    // loading.value = false
    showBLogoutModal.value = false
    router.push('/login')
    window.location.href = "/login"
  }), 3000
  console.log("Logging out...");
};

const initials = ref('') as any

onMounted(() => {
  // Get initials from the composable
const { getInitials } = useUserInitials(user.value);
initials.value = getInitials.value;
})

const onCancel = () => {
  showBLogoutModal.value = false
  // Logic to close the modal
  console.log("Cancelled");
};

const accountSettings = ref([
  {
    label: "Profile settings",
    icon: "gray-profile",
    path: "/dashboard/profile/personal-information",
  },
  // {
  //   label: "Payment Information",
  //   icon: "payment",
  //   path: "/dashboard/profile/payment-information",
  // },
  {
    label: "Notification Preference",
    icon: "gray-notification",
    path: "/dashboard/profile/notification-preferences",
  },
  {
    label: "Login and Security",
    icon: "login-security",
    path: "/dashboard/profile/login-security",
  },
]);

// Define the percentage of profile completion
// const percentage = ref(100)

// Computed classes for border based on percentage
const progressBorderClass = computed(() => {
  const baseClass = 'border-t-green-500 border-r-green-500 border-b-gray-200 border-l-gray-200'
  
  if (percentage.value >= 50) {
    return 'border-green-500'
  }
  
  return baseClass
})

const progressSize = computed(() => {
  return percentage.value < 100 ? '4px' : '6px'
})

// Define the percentage of profile completion
const percentage = ref(80) // You can dynamically update this value

// Computed style for circular progress based on percentage
const progressBackground = computed(() => {
  // Use conic-gradient to create the circular effect
  return `conic-gradient(
    green ${percentage.value * 3.6}deg, 
    lightgray 0deg
  )`
})

definePageMeta({
     middleware: 'auth'
})
</script>

<style scoped>
/* Add custom styles if needed */
</style>
