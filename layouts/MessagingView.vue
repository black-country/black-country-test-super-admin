<template>
  <main class="">
    <div class="">
      <div v-if="isOpen" class="relative z-50 lg:hidden" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-900/80" aria-hidden="true"></div>
        <div class="fixed inset-0 flex">
          <div class="relative mr-16 flex w-full max-w-xs flex-1">
            <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button @click="isOpen = false" type="button" class="-m-2.5 p-2.5">
                <span class="sr-only">Close sidebar</span>
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                  aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
              <div class="flex h-16 shrink-0 items-center">
                <img class="h-8 w-auto" src="@/assets/img/logo.png" alt="Your Company" />
              </div>
              <nav class="flex flex-1 flex-col">
                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" class="-mx-2 space-y-1">
                      <li v-for="(item, idx) in sidebarItems" :key="idx">
                        <NuxtLink :to="item.url"
                          class="group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-white hover:text-white hover:bg-gray-800">
                          <img :src="dynamicIcons(item.icon)" :alt="item.name" class="h-6 w-6" />
                          <span class="flex justify-between items w-full">
                            {{ item.name }}
                            <span v-if="item.name === 'Messages'"
                              class="bg-[#BA110B] text-white rounded-full h-3 w-3 p-3 flex justify-center items-center">{{
                              totalUnreadMessages }}</span>
                          </span>
                        </NuxtLink>
                      </li>
                    </ul>
                  </li>

                  <li class="mt-auto">
                    <NuxtLink to="/dashboard/seettings"
                      class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
                      <img :src="dynamicIcons('settings')" alt="settings" class="h-6 w-6" />
                      Settings
                    </NuxtLink>
                    <button @click="showBLogoutModal = true"
                      class="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
                      <img :src="dynamicIcons('logout')" alt="logout" class="h-6 w-6" />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-[#292929] px-6 pb-4">
          <div class="flex h-16 shrink-0 items-center">
            <img class="h-10 w-auto" src="@/assets/img/logo.png" alt="Your Company" />
          </div>
          <nav class="flex flex-1 flex-col">
            <ul role="list" class="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" class="-mx-2 space-y-1">
                  <li v-for="(item, idx) in sidebarItems" :key="idx">
                    <NuxtLink :to="item.url"
                      class="group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-white hover:text-white hover:bg-gray-800">
                      <img :src="dynamicIcons(item.icon)" :alt="item.name" class="h-6 w-6" />
                      <span class="flex justify-between items w-full">
                        {{ item.name }}
                        <span v-if="item.name === 'Messages' && totalUnreadMessages !== 0"
                          class="bg-[#BA110B] text-white rounded-full h-3 w-3 p-3 flex justify-center items-center">{{
                          totalUnreadMessages }}</span>
                      </span>
                    </NuxtLink>
                  </li>
                </ul>
              </li>
              <li class="mt-auto">
                <NuxtLink to="/dashboard/settings"
                  class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
                  <img :src="dynamicIcons('settings')" alt="settings" class="h-6 w-6" />
                  Settings
                </NuxtLink>
                <button @click="showBLogoutModal = true"
                  class="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
                  <img :src="dynamicIcons('logout')" alt="logout" class="h-6 w-6" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="lg:pl-72">
        <!-- <main class="py-10 bg-[#F9FAFB]"> -->
        <!-- <div class="px-4 sm:px-6 lg:px-8"> -->
        <slot />
        <!-- </div> -->
        <!-- </main> -->
      </div>
    </div>

    <CoreModalWithoutCloseBtn :isOpen="showBLogoutModal" @close="showBLogoutModal = false">
      <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" @click.self="onCancel">
        <div class="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
          <div class="flex justify-center items-center bg-yellow-500 rounded-full w-16 h-16 mx-auto mb-4">
            <svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.921875" width="63.1513" height="64" rx="31.5756" fill="#F3A218" />
              <path
                d="M42.2031 32.375C42.2031 26.8521 37.7259 22.375 32.2031 22.375C26.6803 22.375 22.2031 26.8521 22.2031 32.375C22.2031 37.8978 26.6803 42.375 32.2031 42.375C37.7259 42.375 42.2031 37.8978 42.2031 32.375Z"
                stroke="white" stroke-width="1.5" />
              <path
                d="M32.4453 37.375V32.375C32.4453 31.9036 32.4453 31.6679 32.2988 31.5214C32.1524 31.375 31.9167 31.375 31.4453 31.375"
                stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M32.1953 28.377H32.2043" stroke="white" stroke-width="3.25" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>

          </div>
          <h2 class="text-lg font-semibold text-gray-700 mb-2">Logout</h2>
          <p class="text-gray-500 mb-6">Are you sure you want to logout?</p>
          <div class="space-y-3">
            <button type="button"
              class="w-full disabled:cursor-not-allowed text-sm disabled:opacity-25 bg-[#292929] text-white py-3.5 rounded-md font-semibold"
              @click="onConfirm" :disabled="loading">
              Yes, log out
            </button>
            <button type="button" class="w-full bg-[#EBE5E0] text-gray-700 text-sm py-3.5 rounded-md font-semibold"
              @click="onCancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </CoreModalWithoutCloseBtn>
  </main>
</template>

<script setup lang="ts">
import { useGetActiveChats } from "@/composables/modules/messages/fetchActiveChats";
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();
const { loadingActiveChats, activeChatsList } = useGetActiveChats();
const showBLogoutModal = ref(false);
import { dynamicIcons } from "@/utils/assets";
const router = useRouter();
const loading = ref(false)
const onConfirm = () => {
  showBLogoutModal.value = true
  // Logic for logout
  localStorage.clear()
  setTimeout(() => {
    // loading.value = false
    showBLogoutModal.value = false
    router.push('/login')
    window.location.href = "/login"
  }), 3000
  console.log("Logging out...");
};

const onCancel = () => {
  showBLogoutModal.value = false
};

const totalUnreadMessages = computed(() => {
  return activeChatsList.value.filter(item => item.unreadMessagesCount > 0).length
});


const isOpen = ref(false)

const sidebarItems = ref([
  {
    name: "Dashboard",
    icon: "dashboard-home",
    url: "/dashboard",
  },
  {
    name: "Property Management",
    icon: "property-mgt",
    url: "/dashboard/property",
  },
  {
    name: "Tenants Management",
    icon: "tenants-mgt",
    url: "/dashboard/tenant-mgt",
  },
  {
    name: "Messages",
    icon: "messages",
    url: "/dashboard/messages",
  },
  {
    name: "Finance Management",
    icon: "finance-mgt",
    url: "/dashboard/finance-mgt",
  },
  {
    name: "Members",
    icon: "members",
    url: "/dashboard/members",
  },
]);

definePageMeta({
  middleware: 'auth'
})

const checkOnlineStatus = () => {
  if (navigator.onLine) {
    router.push(router?.options?.history?.state?.current);
  } else {
    showToast({
      title: "Error",
      message: 'You are currently offline.',
      toastType: "error",
      duration: 3000
    });
  }
};

onMounted(() => {
  // Check online status when the component is mounted
  checkOnlineStatus();

  // Listen for online and offline events
  window.addEventListener("online", checkOnlineStatus);
  window.addEventListener("offline", checkOnlineStatus);
});

onUnmounted(() => {
  // Remove event listeners to prevent memory leaks
  window.removeEventListener("online", checkOnlineStatus);
  window.removeEventListener("offline", checkOnlineStatus);
});
</script>

<style scoped>
.router-link-exact-active {
  background-color: #5B8469;
  color: white;
}

.container {
  max-width: 1280px;
  /* Adjust this max-width as needed */
  min-width: 320px;
  /* Set a reasonable min-width */
  margin: 0 auto;
}
</style>