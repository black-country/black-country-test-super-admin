<template>
  <Layout class="">
    <template #header-content>
      <div class="flex z-10 flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
        <!-- Header left side -->
        <div class="flex items-center justify-between gap-x-4 w-full z-10">
          <div class="flex items-center gap-x-4 z-10">
            <h4 class="text-[#1D2739] text-sm font-semibold">Property Management</h4>

            <!-- Desktop View Buttons -->
            <div class="hidden lg:flex gap-x-4">
              <button @click="setActiveTab('listings')"
                :class="[activeTab === 'listings' ? 'bg-[#5B8469] text-white' : 'text-[#292929] text-sm bg-[#F0F2F5]']"
                class="font-medium text-sm px-4 py-2 rounded-md ">Listngs</button>
              <button @click="setActiveTab('rental-applications')"
                :class="[activeTab === 'rental-applications' ? 'bg-[#5B8469] text-white' : 'text-[#292929] text-sm bg-[#F0F2F5]']"
                class=" px-4 py-2 text-sm rounded-md">Rental applications</button>
              <button @click="setActiveTab('lease-documents')"
                :class="[activeTab === 'lease-documents' ? 'bg-[#5B8469] text-white' : 'bg-[#F0F2F5] text-[#292929]']"
                class="font-medium text-sm  px-4 py-2 rounded-md">Lease Documents</button>
            </div>
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
              <button type="button" @click="router.push('/dashboard/profile')" class="-m-1.5 flex items-center p-1.5"
                id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                <span class="sr-only">Open user menu</span>
                <!-- <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="8" fill="#292929"/>
                  <path d="M20.0817 20.1818C20.0817 21.4242 19.8544 22.4924 19.3999 23.3864C18.9453 24.2765 18.3222 24.9621 17.5305 25.4432C16.7427 25.9205 15.8468 26.1591 14.843 26.1591C13.8355 26.1591 12.9358 25.9205 12.1442 25.4432C11.3563 24.9621 10.7351 24.2746 10.2805 23.3807C9.82599 22.4867 9.59872 21.4205 9.59872 20.1818C9.59872 18.9394 9.82599 17.8731 10.2805 16.983C10.7351 16.089 11.3563 15.4034 12.1442 14.9261C12.9358 14.4451 13.8355 14.2045 14.843 14.2045C15.8468 14.2045 16.7427 14.4451 17.5305 14.9261C18.3222 15.4034 18.9453 16.089 19.3999 16.983C19.8544 17.8731 20.0817 18.9394 20.0817 20.1818ZM18.343 20.1818C18.343 19.2348 18.1896 18.4375 17.8828 17.7898C17.5798 17.1383 17.1631 16.6458 16.6328 16.3125C16.1063 15.9754 15.5097 15.8068 14.843 15.8068C14.1726 15.8068 13.5741 15.9754 13.0476 16.3125C12.5211 16.6458 12.1044 17.1383 11.7976 17.7898C11.4946 18.4375 11.343 19.2348 11.343 20.1818C11.343 21.1288 11.4946 21.928 11.7976 22.5795C12.1044 23.2273 12.5211 23.7197 13.0476 24.0568C13.5741 24.3902 14.1726 24.5568 14.843 24.5568C15.5097 24.5568 16.1063 24.3902 16.6328 24.0568C17.1631 23.7197 17.5798 23.2273 17.8828 22.5795C18.1896 21.928 18.343 21.1288 18.343 20.1818ZM22.2706 26V14.3636H26.4183C27.3198 14.3636 28.0679 14.5189 28.6626 14.8295C29.2611 15.1402 29.7081 15.5701 30.0036 16.1193C30.299 16.6648 30.4467 17.2955 30.4467 18.0114C30.4467 18.7235 30.2971 19.3504 29.9979 19.892C29.7024 20.4299 29.2554 20.8485 28.657 21.1477C28.0623 21.447 27.3142 21.5966 26.4126 21.5966H23.2706V20.0852H26.2536C26.8217 20.0852 27.2839 20.0038 27.6399 19.8409C27.9998 19.678 28.263 19.4413 28.4297 19.1307C28.5964 18.8201 28.6797 18.447 28.6797 18.0114C28.6797 17.572 28.5945 17.1913 28.424 16.8693C28.2573 16.5473 27.9941 16.3011 27.6342 16.1307C27.2782 15.9564 26.8104 15.8693 26.2308 15.8693H24.0263V26H22.2706ZM28.0149 20.75L30.8899 26H28.8899L26.0717 20.75H28.0149Z" fill="#EBE5E0"/>
                  </svg> -->
                <p class="bg-gray-900 text-white p-3 font-semibold rounded-lg">{{ initials }}</p>

                <span class="hidden lg:flex lg:items-center">
                  <div>
                    <span v-if="user" class="ml-4 text-sm py-0 my-0 font-semibold block leading-6 text-gray-900"
                      aria-hidden="true"> {{ user?.firstName }} {{ user?.lastName }}</span>
                    <span class="text-sm py-0 my-0 font-light text-[#667185] block">Super admin</span>
                  </div>
                  <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#1D2739"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                </span>
              </button>
            </div>
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
        <!-- (no changes needed here) -->
      </div>

      <!-- Mobile View Dropdown Menu -->
      <!-- (no changes needed here) -->
      <div v-if="isMobileMenuOpen" class="relative z-10 lg:hidden" role="dialog" aria-modal="true">
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


            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
              <div class="flex h-16 shrink-0 items-center">
                <img class="h-8 w-auto" src="@/assets/img/logo.png" alt="Your Company" />
              </div>
              <nav class="flex flex-1 flex-col space-y-6">
                <button @click="activeTab = 'listings'; isMobileMenuOpen = false"
                  :class="[activeTab === 'listings' ? 'bg-[#5B8469] text-white' : 'bg-[#F0F2F5] text-[#292929]']"
                  class="block w-full text-left px-4 py-3 rounded-md text-sm font-medium">Listings</button>
                <button @click="activeTab = 'rental-applications'; isMobileMenuOpen = false"
                  :class="[activeTab === 'rental-applications' ? 'bg-[#5B8469] text-white' : 'bg-[#F0F2F5] text-[#292929]']"
                  class="block w-full text-left px-4 py-3 rounded-md text-sm font-medium">Rental applications</button>
                <button @click="activeTab = 'lease-documents'; isMobileMenuOpen = false"
                  :class="[activeTab === 'lease-documents' ? 'bg-[#5B8469] text-white' : 'bg-[#F0F2F5] text-[#292929]']"
                  class="block w-full text-left px-4 py-3 rounded-md text-sm font-medium">Lease Documents</button>

              </nav>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Components for different tabs -->
    <PropertyListComponent @delete="openDeleteModal" @deactivate="openDeactivateModal" @duplicate="openDuplicateModal"
      v-if="activeTab === 'listings'" />
    <PropertyLeaseDocumentsComponents v-if="activeTab === 'lease-documents'" />
    <PropertyRentalComponent v-if="activeTab === 'rental-applications'" />

    <!-- Reusable Modals -->
    <!-- Reusable Modal for Delete Property -->
    <CoreReusableModal :loading="deleting" :isOpen="deleteModal" @close="deleteModal = false"
      @confirm="handleDeleteConfirm" title="Delete Property"
      :message="`By deleting ${selectedObj.name} Co-Living Space, you will permanently remove the listing from the platform. Are you sure you want to proceed?`"
      confirmButtonText="Yes, delete" cancelButtonText="Cancel" />

    <!-- Reusable Modal for Deactivate Property -->
    <CoreReusableModal :loading="deactivating" :isOpen="deactivateModal" @close="deactivateModal = false"
      @confirm="handleDeactivateConfirm"
      :title="`${selectedObj.status === 'published' ? 'Deactivate' : 'Activate'} Property`"
      :message="`${selectedObj.status === 'published' ? 'Deactivating' : 'Activating'} this property will make it ${selectedObj.status === 'published' ? 'Unavailable' : 'Available'} for new inquiries and listings. You can ${selectedObj.status === 'published' ? 'reactivate' : 'deactivate'} it at any time`"
      :confirmButtonText="`Yes, ${selectedObj.status === 'published' ? 'Deactivate' : 'Activate'}`"
      cancelButtonText="Cancel" />

    <!-- Reusable Modal for Duplicate Property -->
    <CoreReusableModal :loading="duplicating" :isOpen="duplicateModal" @close="duplicateModal = false"
      @confirm="handleDuplicateConfirm" title="Duplicate Property"
      :message="`Are you sure you want to duplicate this property, ${selectedObj.name} co-living space ? This will create a new copy of the property, you will retain current information, you can rename it and you can make edits after duplication.`"
      confirmButtonText="Yes, duplicate" cancelButtonText="Cancel" />
  </Layout>
</template>

<script lang="ts" setup>
import Layout from '@/layouts/dashboard.vue';
import { useRouter, useRoute } from 'vue-router';
import { useDeleteProperty } from '@/composables/modules/property/delete';
import { usePropertyDeactivate } from '@/composables/modules/property/deactivate';
import { useDuplicateProperty } from '@/composables/modules/property/duplicate';
import { useUserInitials } from '@/composables/core/useUserInitials';
import { useUser } from '@/composables/auth/user';
import { useFetchNotificationCount } from '~/composables/modules/notification/fetchCount';

const { deleteProperty, loading: deleting } = useDeleteProperty();
const { deactivateProperty, loading: deactivating } = usePropertyDeactivate();
const { duplicateProperty, loading: duplicating } = useDuplicateProperty();
const {notificationCount} = useFetchNotificationCount();
const { user } = useUser();
const route = useRoute();
const router = useRouter();
const selectedObj = ref({}) as any;

definePageMeta({
  middleware: 'auth'
});

const isMobileMenuOpen = ref(false);
const activeTab = ref('listings'); // Default active tab

// Initialize the active tab based on query params
onMounted(() => {
  if (route.query.activeTab) {
    activeTab.value = route.query.activeTab as string;
  }
});

// Function to change the active tab and update the query parameter
const setActiveTab = (tab: string) => {
  activeTab.value = tab;
  // Update the URL query parameter to reflect the active tab
  router.push({ query: { ...route.query, activeTab: tab } });
};

const initials = ref('') as any;
onMounted(() => {
  const { getInitials } = useUserInitials(user.value);
  initials.value = getInitials.value;
});

const deleteModal = ref(false);
const deactivateModal = ref(false);
const duplicateModal = ref(false);

const openDeleteModal = (data: any) => {
  selectedObj.value = data;
  deleteModal.value = true;
};

const openDeactivateModal = (data: any) => {
  selectedObj.value = data;
  deactivateModal.value = true;
};

const openDuplicateModal = (data: any) => {
  selectedObj.value = data;
  duplicateModal.value = true;
};

const handleDeleteConfirm = async () => {
  if (selectedObj.value.id) {
    await deleteProperty(selectedObj.value.id, selectedObj)
    deleteModal.value = false;
  }
};

const handleDeactivateConfirm = async () => {
  try {
    const actionType = selectedObj.value.status === 'published' ? 'deactivate' : 'activate';
    await deactivateProperty(selectedObj.value.id, actionType, selectedObj.value)
    deactivateModal.value = false;
  } catch (error) {
    useNuxtApp().$toast.error('Error processing property action.', {
      autoClose: 5000,
      dangerouslyHTMLString: true,
    });
  }
};

const handleDuplicateConfirm = async () => {
  await duplicateProperty(selectedObj.value.id, selectedObj)
  duplicateModal.value = false;
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
