<template>
    <main>
      <div class="flex flex-wrap gap-5 justify-between items-center mb-4">
        <div class="flex space-x-2">
          <button @click="propertyFilterModal = true" class="flex items-center text-sm space-x-1 px-8 bg-[#F0F2F5] border-[#F0F2F5] border text-gray-700 px-2 py-2 rounded transition-all">
            <img :src="dynamicIcons('gray-filter')" />
            <span>Filter</span>
          </button>
          <div class="relative w-full">
            <input  v-model="searchQuery" type="text" placeholder="Search.." class="bg-[#F0F2F5] pl-10 border-[#F0F2F5] border text-sm text-gray-700 px-4 py-3 rounded w-full sm:w-64 focus:outline-none focus:bg-white transition-all"/>
            <span class="absolute inset-y-0 left-3 flex items-center pr-2">
              <img
              class=""
              :src="dynamicIcons('gray-search')"
            />
            </span>
          </div>
        </div>
    
        <!-- Right: Configure Table, Export, and New Property -->
        <div class="flex space-x-2">
                          <!-- New Property Button -->
                          <button @click="emit('create')" class="bg-[#292929] px-3 flex items-center text-sm text-white py-2 rounded hover:bg-gray-800 transition-all">
                             Create Notification
                          </button>
        </div>
      </div>
  
      <div>
        <div
          v-if="schedulesList && !loadingMembers"
          class="bg-white rounded-lg overflow-hidden"
        >
          <div class="custom-scrollbar-container">
            <table class="min-w-full bg-white">
              <thead class="border-b-[0.5px] border-gray-50 z-30 bg-gray-25 sticky top-0">
                <tr>
                  <th
                    class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider"
                  >
                  Subject
                  </th>
                  <th class="py-5 px-5 text-right text-sm font-medium text-gray-500 tracking-wider">
                    Notification Type
                  </th>
                  <th class="py-5 px-5 text-right text-sm font-medium text-gray-500 tracking-wider">
                    Recipient Type
                  </th>
                  <th class="py-5 px-5 text-right text-sm font-medium text-gray-500 tracking-wider">
                    Recipients
                  </th>
                  <th class="py-5 px-5 text-right text-sm font-medium text-gray-500 tracking-wider">
                    Date and time
                  </th>
                  <th class="py-5 px-5 text-right text-sm font-medium text-gray-500 tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 z-10">
                <tr
                  class="cursor-pointer"
                  @click="router.push(`/dashboard/settings/${schedule.id}`)"
                  v-for="(schedule, index) in filteredSchedulesList"
                  :key="schedule.id"
                >
                  <td class="py-5 px-5 whitespace-nowrap text-sm">
                       {{ schedule?.subject ?? 'Nil' }}
                  </td>
                  <td class="py-5 px-5 whitespace-nowrap text-sm">
                    {{ schedule?.notificationType ?? 'Nil' }}
                    </td>
                    <td class="py-5 px-5 whitespace-nowrap text-sm">
                      {{ schedule?.recipientType ?? 'Nil' }}
                    </td>
                    <td class="py-5 px-5 whitespace-nowrap text-sm">
                      <p v-for="(item, idx) in schedule?.recipients" :key="idx">
                        {{ `${item?.firstName} ${item?.lastName}` ?? 'Nil' }}
                      </p>
                    </td>
                    <td class="py-5 px-5  text-sm max-w-xs text-right">
                      {{ moment(schedule?.scheduleStartDate).format('DD MMMM YYYY, HH:mm:ss A') ?? 'Nil' }}
                    </td>
                    <td class="py-5 px-5 whitespace-nowrap text-sm text-right">
                      <span class="px-3 py-2 rounded-full" :class="statusColorMap(schedule?.status)">
                        {{ scheduleTextMap(schedule?.status) }}
                      </span>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
          <CorePagination
            v-if="!loadingSchedules && filteredSchedulesList.length > 0"
            :total="metadata.total"
            :page="metadata.page"
            :perPage="metadata.perPage"
            :pages="metadata.pages"
            @page-changed="handlePageChange"
          />
        </div>
        <div
          v-if="loadingSchedules && schedulesList.length === 0"
          class="h-32 bg-slate-200 rounded animate-pulse w-full m-3"
        ></div>
        <div
          v-if="!loadingSchedules && schedulesList.length === 0"
          class="flex justify-center items-center flex-col my-20"
        >
          <div class="flex justify-center items-center">
            <!-- SVG and text content for "No properties found" -->
          </div>
        </div>
      </div>
      

      <PropertyFilterModal
        v-if="propertyFilterModal"
        @close="propertyFilterModal = false"
        @applyFilters="handleApplyFilters"
      />
    </main>
  </template>
  
  <script lang="ts" setup>
    import moment from "moment";
  import { useFetchSchedules } from '@/composables/modules/settings/useFetchSchedules'
  import { usePaginatedFetchAndDownload } from '@/composables/core/exportData';
  // import { useGetMembers } from "@/composables/modules/member/fetch";
  import { dynamicIcons } from "@/utils/assets";
  import { useRouter, useRoute } from "vue-router";
  const { exportPaginatedData, isDownloading }  = usePaginatedFetchAndDownload()
  const { schedulesList, loadingSchedules, metadata, searchQuery, fetchSchedules, filteredSchedulesList } = useFetchSchedules()

  const downloadData = (exportType: any) => {
    exportPaginatedData('/members', exportType, 'members_data_export', ['firstName', 'lastName', 'email', 'status', 'role' ]);
  }
  const route = useRoute();
  const router = useRouter();
  const testConfigModal = ref(true);
  
  const deleteModal = ref(false);
  const onCancel = () => {
    deleteModal.value = false;
  };
  
  const onConfirm = () => {
    deleteModal.value = false;
  };
  
  // const {
  //   loadingMembers,
  //   schedulesList,
  //   searchQuery,
  //   filters,
  //   metadata,
  //   getMembers,
  //   applyFilters,
  // } = useGetMembers();
  
  const handlePageChange = (val: any) => {
    metadata.value.page = val || 1;
    fetchSchedules(); // Explicitly call the method to fetch new data
  };
  
  const downloadDropdown = ref(false);
  
  const toggleDownloadDropdown = () => {
    downloadDropdown.value = !downloadDropdown.value;
  };
  
  const activeTab = ref("property") as any; // Default to step 1
  
  // Set the active tab based on the query parameter
  onMounted(() => {
    if (route.query.activeTab) {
      activeTab.value = route.query.activeTab;
    }
  });
  
  const propertyConfigModal = ref(false);
  const propertyFilterModal = ref(false);
  
  const isModalOpen = ref(false);
  
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
  
  const emit = defineEmits(['create']);
  
  // Function to handle dropdown option click
  const handleDropdownClick = (action: any, item: any) => {
    console.log(item)
    if (action === "view") {
      return router.push(`/dashboard/members/${item.id}`);
    }

    if (action === "deactivate") {
      // return router.push(`/dashboard/members/${item.id}`);
    }

    if (action === "remive") {
      // return router.push(`/dashboard/members/${item.id}`);
    }
  
    // if (action === "edit") {
    //   return router.push(`/dashboard/members/${item.id}/edit`);
    // }
    closeDropdown();
    emit(action, item);
  };
  
  // const handleApplyFilters = (filters: any) => {
  //   applyFilters(filters);
  // };
  
  const showModal = ref(false);
  
  
  // Function to extract nested properties
  const getPropertyValue = (property: any, key: string) => {
    return key.split(".").reduce((obj, k) => obj && obj[k], property) || "N/A";
  };

//   const scheduleTextMap = (statusText: any) => {
//     const textMap = {
//       'pending' : 'Scheduled',
//       'sent' : 'Sent',
//       'draft' : 'Draft'
//     }

//     return textMap[statusText] ?? ''
// }

const scheduleTextMap = (statusText: any) => {
    const textMap = {
      'pending': 'Scheduled',
      'sent': 'Sent',
      'draft': 'Draft',
    };

    return textMap[statusText] ?? '';
  };

  const statusColorMap = (statusText: any) => {
    const colorMap = {
      'pending': 'text-[#DD900D] bg-[#FEF6E7]',
      'sent': 'text-[#099137] bg-[#E7F6EC]',
      'draft': 'text-[#1D2739] bg-[#F9FAFB]',
    };

    return colorMap[statusText] ?? 'text-black'; // Default color
  };
  
  </script>
  
  <style scoped>
  /* Custom styles */
  .toggle {
    --tw-translate-x: -100%;
    appearance: none;
    background-color: #ccc;
    width: 3rem;
    height: 1.5rem;
    border-radius: 9999px;
    position: relative;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .toggle::before {
    content: '';
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border-radius: 9999px;
    transition: transform 0.3s ease;
  }
  
  .toggle:checked {
    background-color: #48bb78;
  }
  
  .toggle:checked::before {
    transform: translateX(1.5rem);
  }
  
  .custom-scrollbar-container {
    max-height: 600px;
    overflow-y: auto;
    overflow-x: auto;
    scrollbar-width: thin; /* For Firefox */
    scrollbar-color: #5B8469 #F1F1F1; /* For Firefox */
  }
  
  .custom-scrollbar-container::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar-container::-webkit-scrollbar-thumb {
    background-color: #5B8469;
    border-radius: 10px;
  }
  
  .custom-scrollbar-container::-webkit-scrollbar-track {
    background-color: #F1F1F1;
  }
  
  .custom-scrollbar-container:hover::-webkit-scrollbar-thumb {
    background-color: #5B8469; /* Change on hover for better visibility */
  }
  
  </style>
         