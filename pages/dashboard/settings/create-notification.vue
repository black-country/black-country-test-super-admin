<template>
  <Layout>
    <template #header-content>
      <header
        class="bg-white px-4 lg:flex items-center justify-between container mx-auto py-3 space-y-6 lg:space-y-0"
      >
        <div
          @click="router.push('/dashboard')"
          class="flex items-center space-x-2"
        >
          <button
            @click="router.back()"
            class="flex items-center text-gray-600 bg-gray-100 text-xs py-3 font-semibold px-4 rounded-md hover:bg-gray-200 hover:text-black"
          >
            <span>&larr;</span>
            <span class="ml-2">Back</span>
          </button>
          <span class="text-lg font-medium">New notification</span>
          <!-- <img src="@/assets/icons/logo.svg" alt="Logo" class="h-8 w-auto" />
                <span class="text-lg font-semibold">BlackCountry</span> -->
        </div>
        <div class="flex space-x-4 items-center">
          <button class="text-[#326543] text-sm hover:text-[#326543]">
            Preview
          </button>
          <button
            @click="openCancelModal = true"
            type="button"
            class="bg-white border text-sm border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="handleSaveAndExit"
            :disabled="savingLoader"
            class="bg-gray-900 disabled:cursor-not-allowed disabled:opacity-25 text-sm text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            {{ savingLoader ? "saving..." : "Save & exit" }}
          </button>
        </div>
      </header>
    </template>

    <CoreReusableModal
      :isOpen="openCancelModal"
      message="By cancelling, you will loose progress."
      confirmButtonText="No, Continue uploading"
      cancelButtonText="Yes, Cancel"
      @close="handleClose"
      @confirm="handleConfirm"
    />

    <SettingsNotificationSteps
      ref="notificationStepsRef"
      v-if="notificationType"
      :onSaveAndExit="handleSaveAndExit"
      :type="notificationType"
      @back="notificationType = ''"
      @cancel="notificationType = ''"
      @save="notificationType = ''"
    />
  </Layout>
</template>

<script setup lang="ts">
import Layout from "@/layouts/dashboardWithoutSidebar.vue";

import { useUserInitials } from "@/composables/core/useUserInitials";
import { useUser } from "@/composables/auth/user";
const { user } = useUser();
import { dynamicIcons } from "@/utils/assets";
const router = useRouter();
import { ref } from "vue";
const openCancelModal = ref(false);
const route = useRoute();
const showModal = ref(false);
const savingAndExitLoader = ref(false);
const notificationType = ref(route.query.notification);

const notificationStepsRef = ref(null) as any // Ref to access child component

const startNotification = (type: string) => {
  notificationType.value = type;
  showModal.value = false;
};

//   const handleSaveAndExit = () => {
//   // saving.value = true;
//   console.log('Saving progress...');
//   setTimeout(() => {
//     // saving.value = false;
//     router.push('/dashboard');
//   }, 2000);
// };

const savingLoader = ref(false)

const handleSaveAndExit = async () => {
  if (notificationStepsRef.value) {
    // savingAndExitLoader.value = true;
   await notificationStepsRef.value.saveScheduleAsDraft(); // Call the child function
    savingLoader.value = notificationStepsRef.value.savingAsDraft; // Call the child function
    // savingAndExitLoader.value = false;
  }
};

const handleConfirm = () => {
  openCancelModal.value = false;
};

const handleClose = () => {
  router.push("/dashboard/settings");
  openCancelModal.value = false;
};

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
const activeTab = ref("notifications-reminders");

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
