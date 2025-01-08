<template>
    <Layout class="">
        <template #header-content>
      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
        <!-- Header left side -->
        <div class="flex items-center gap-x-4">
          <h4 class="text-[#1D2739] text-sm">Settings</h4>

          <!-- Desktop View Buttons -->
          <div class="hidden lg:flex gap-x-4">
            <button @click="setActiveTab('notifications-reminders')" :class="[activeTab === 'notifications-reminders' ? 'bg-[#5B8469] text-white' : 'text-[#292929] text-sm bg-[#F0F2F5]']"
            class="font-medium text-sm px-4 py-2 rounded-md ">Notifications & Reminders</button>
          <button @click="setActiveTab('policy-management')"
            :class="[activeTab === 'policy-management' ? 'bg-[#5B8469] text-white' : 'text-[#292929] text-sm bg-[#F0F2F5]']"
            class=" px-4 py-2 text-sm rounded-md">Policy Management</button>
          <button @click="setActiveTab('faqs')"
            :class="[activeTab === 'faqs' ? 'bg-[#5B8469] text-white' : 'bg-[#F0F2F5] text-[#292929]']"
            class="font-medium text-sm  px-4 py-2 rounded-md">FAQs</button>
          </div>

          <!-- Mobile View Hamburger Menu -->
          <div class="lg:hidden">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="text-gray-700 p-2 rounded-md focus:outline-none">
              <svg v-if="!isMobileMenuOpen" class="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Header right side (unchanged) -->
        <div class="flex items-center gap-x-4 lg:gap-x-6">
          <NuxtLink to="/dashboard/notification" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span class="sr-only">View notifications</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
              aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </NuxtLink>
          <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true"></div>
          <div class="relative">
            <button type="button" class="-m-1.5 flex items-center p-1.5" id="user-menu-button" aria-expanded="false"
              aria-haspopup="true">
              <span class="sr-only">Open user menu</span>
              <p class="bg-gray-900 text-white px-2 py-2 font- rounded-md">{{ initials }}</p>
              <span class="hidden lg:flex lg:items-center">
                <div>
                  <span v-if="user" class="ml-4 text-sm py-0 my-0 font-semibold block leading-6 text-gray-900"
                    aria-hidden="true">{{ user?.firstName }} {{ user?.lastName }}</span>
                  <span class=" py-0 my-0 font-light text-sm text-[#667185] block">Super admin</span>
                </div>
                <svg @click="router.push('/dashboard/profile')" class="cursor-pointer" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#1D2739" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile View Dropdown Menu -->
      <div v-if="isMobileMenuOpen" class="relative z-50 lg:hidden" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-900/80" aria-hidden="true"></div>
        <div class="fixed inset-0 flex">
          <div class="relative mr-16 flex w-full max-w-sm flex-1">
            <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button @click="isMobileMenuOpen = false" type="button" class="-m-2.5 p-2.5">
                <span class="sr-only">Close sidebar</span>
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                  aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
              <div class="flex h-16 shrink-0 items-center">
                <img class="h-8 w-auto" src="@/assets/img/logo.png" alt="Your Company" />
              </div>
              <nav class="flex flex-1 flex-col space-y-6">
                <button @click="activeTab = 'notifications-reminders'; isMobileMenuOpen = false"
                  :class="[activeTab === 'notifications-reminders' ? 'bg-[#5B8469] text-white' : 'bg-[#F0F2F5] text-[#292929]']"
                  class="block w-full text-left px-4 py-3 rounded-md text-sm font-medium">Notifications & Reminders</button>
                <button @click="activeTab = 'policy-management'; isMobileMenuOpen = false"
                  :class="[activeTab === 'policy-management' ? 'bg-[#5B8469] text-white' : 'bg-[#F0F2F5] text-[#292929]']"
                  class="block w-full text-left px-4 py-3 rounded-md text-sm font-medium">Policy Management</button>
                <button @click="activeTab = 'faqa'; isMobileMenuOpen = false"
                  :class="[activeTab === 'faqa' ? 'bg-[#5B8469] text-white' : 'bg-[#F0F2F5] text-[#292929]']"
                  class="block w-full text-left px-4 py-3 rounded-md text-sm font-medium">FAQs</button>

              </nav>
            </div>
          </div>
        </div>
      </div>
       </template>
    <div class="">
      <!-- <div class="flex justify-between items-center">
        <button
          @click="showModal = true"
          class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Create Notification
        </button>
      </div> -->
  
      <SettingsNotificationTypeModal
        v-if="showModal"
        @close="showModal = false"
        @continue="startNotification"
      />
<!--   
      <SettingsNotificationSteps
        v-if="notificationType"
        :type="notificationType"
        @back="notificationType = ''"
        @cancel="notificationType = ''"
        @save="notificationType = ''"
      /> -->
    </div>
    <SettingsNotificationsTableList @create="showModal = true" v-if="activeTab === 'notifications-reminders'" />
    <SettingsPolicyManagement v-if="activeTab === 'policy-management'" />
    <SettingsFaq v-if="activeTab === 'faqs'" />
    </Layout>
  </template>
  
  <script setup lang="ts">
  import Layout from '@/layouts/dashboard.vue';
  const showModal = ref(false)
  const notificationType = ref('')
  
  const startNotification = (type: string) => {
    router.push({path: '/dashboard/settings/create-notification',  query: { notification: type}})
    notificationType.value = type
    showModal.value = false
  }

  import { useUserInitials } from "@/composables/core/useUserInitials";
import { useUser } from "@/composables/auth/user";
const { user } = useUser();
import { dynamicIcons } from "@/utils/assets";
const router = useRouter();
import { ref } from "vue";
// definePageMeta({
//      layout: 'dashboard'
// })
const route = useRoute();

const initials = ref("") as any;

// Initialize the active tab based on query params
onMounted(() => {
  if (route.query.activeTab) {
    activeTab.value = route.query.activeTab as string;
  }
});

onMounted(() => {
  // Get initials from the composable
  const { getInitials } = useUserInitials(user.value);
  initials.value = getInitials.value;
});

const isMobileMenuOpen = ref(false);
const activeTab = ref("notifications-reminders"); // Initialize with the default active tab value

const isModalOpen = ref(false);

// Function to change the active tab and update the query parameter
const setActiveTab = (tab: string) => {
  activeTab.value = tab;
  // Update the URL query parameter to reflect the active tab
  router.push({ query: { ...route.query, activeTab: tab } });
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};


// State to manage which dropdown is active
const activeDropdown = ref<number | null>(null);

// Function to toggle the dropdown visibility
const toggleDropdown = (index: number) => {
  if (activeDropdown.value === index) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = index;
  }
};

// Function to close the dropdown
const closeDropdown = () => {
  activeDropdown.value = null;
};

// Function to handle dropdown option click
const handleDropdownClick = () => {
  closeDropdown();
  // Additional logic for handling the selected option can be added here
};
  </script>