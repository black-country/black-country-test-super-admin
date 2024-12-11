<template>
    <Layout>
        <!-- <template #header-content>
      
       </template>           -->
        <SettingsNotificationSteps
        v-if="notificationType"
        :type="notificationType"
        @back="notificationType = ''"
        @cancel="notificationType = ''"
        @save="notificationType = ''"
      />
    </Layout>
</template>

<script setup lang="ts">
  import Layout from '@/layouts/dashboardWithoutSidebar.vue';
  const route = useRoute()
  const showModal = ref(false)
  const notificationType = ref(route.query.notification)
  
  const startNotification = (type: string) => {
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