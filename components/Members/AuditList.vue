<template>
  <main>
    <div class="flex flex-wrap gap-5 justify-between items-center mb-4">
      <div class="flex space-x-2">
        <button @click="propertyFilterModal = true"
          class="flex items-center text-sm space-x-1 bg-[#F0F2F5] border-[#F0F2F5] border text-gray-700 px-10 py-2 rounded transition-all">
          <img :src="dynamicIcons('gray-filter')" />
          <span>Filter</span>
        </button>
        <div class="relative w-full">
          <input v-model="filters.searchQuery" type="text" placeholder="Search"
            class="bg-[#F0F2F5] pl-10 border-[#F0F2F5] border text-sm text-gray-700 px-4 py-3 rounded w-full sm:w-64 focus:outline-none focus:bg-white transition-all" />
          <span class="absolute inset-y-0 left-3 flex items-center pr-2">
            <img class="" :src="dynamicIcons('gray-search')" />
          </span>
        </div>
      </div>

      <!-- Right: Configure Table, Export, and New Property -->
      <div class="flex space-x-2">
        <!-- Export Button -->
        <button @click="toggleDownloadDropdown"
          class="flex items-center space-x-1 text-sm px-2 bg-[#F0F2F5] border-[#F0F2F5] border text-gray-700 py-2 rounded hover:bg-gray-200 transition-all">
          <img :src="dynamicIcons('gray-download')" />
          <span>Export</span>
        </button>
        <div v-if="downloadDropdown"
          class="absolute right-0 sm:right-4 z-50 top-[150px] mt-2 bg-white border border-gray-200 w-44 rounded-lg shadow-lg">
          <ul class="py-1 text-sm text-gray-700 divide-gray-100 divide-y-[0.5px]">
            <li>
              <a @click="downloadData('pdf')" href="#"
                class="block flex items-center gap-x-2 px-4 py-3 hover:bg-gray-100 text-start">
                <img :src="dynamicIcons('gray-pdf')" />
                PDF
              </a>
            </li>
            <li>
              <a @click="downloadData('excel')" href="#"
                class="block flex items-center gap-x-2 px-4 py-3 hover:bg-gray-100 text-start">
                <img :src="dynamicIcons('gray-excel')" />
                Excel/Spreadsheet
              </a>
            </li>
            <li>
              <a @click="downloadData('csv')" href="#"
                class="block flex items-center gap-x-2 px-4 py-3 hover:bg-gray-100 text-start">
                <img :src="dynamicIcons('gray-csv')" />
                CSV
              </a>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <div>
      <div v-if="auditList && !loading" class="bg-white rounded-lg overflow-hidden">
        <div class="custom-scrollbar-container">
          <table class="min-w-full bg-white">
            <thead class="border-b-[0.5px] border-gray-50 z-30 bg-gray-25 sticky top-0">
              <tr>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Members
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Timestamp
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Action type
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Description
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Entity type
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  IP address
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 z-10">
              <tr class="cursor-pointer" v-for="(audit, index) in auditList" :key="audit.id">
                <td class="py-5 px-5 whitespace-nowrap text-sm text-[#667185] font-semibold relative">
                  <p>{{ `${audit?.metadata?.authUser?.firstName} ${audit?.metadata?.authUser?.lastName}` ?? 'Nil' }}</p>
                  <p>{{ audit?.metadata?.authUser?.role ?? 'Nil' }}</p>
                </td>
                <td class="py-5 px-5 whitespace-normal break-words text-sm text-[#667185] font-semibold relative">
                  <p> {{ moment(audit?.createdAt).format('DD MMMM YYYY, HH:mm:ss A') ?? 'Nil' }}</p>
                </td>
                <td class="py-5 px-5 whitespace-nowrap text-sm text-[#667185] font-semibold relative">
                  {{ audit?.eventType ?? 'Nil' }}
                </td>
                <td class="py-5 px-5 whitespace-normal break-words text-sm text-[#667185] font-semibold relative">
                  <p class=""> {{ audit?.actionDescription?.summary ?? 'Nil' }}</p>
                </td>

                <td class="py-5 px-5 whitespace-nowrap text-sm text-[#667185] font-semibold relative">
                  {{ audit?.entityType ?? 'Nil' }}
                </td>

                <td class="py-5 px-5 whitespace-nowrap text-sm text-[#667185] font-semibold relative">
                  {{ audit?.metadata?.ipAddress ?? 'Nil' }}
                </td>

                <td class="py-5 px-5 whitespace-nowrap text-sm text-[#667185] font-semibold relative">
                  {{ audit?.status ?? 'Nil' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="activeDropdown !== null" @click="closeDropdown" class="fixed inset-0 z-40 bg-black opacity-25"></div>
        <CorePagination v-if="!loading && auditList.length > 0" :total="metadata.total" :page="metadata.page"
          :perPage="metadata.perPage" :pages="metadata.pages" @page-changed="handlePageChange" />
      </div>
      <div v-if="loading && auditList.length === 0" class="h-32 bg-slate-200 rounded animate-pulse w-full m-3"></div>
      <div v-if="!loading && auditList.length === 0" class="flex justify-center items-center flex-col my-20">
        <div class="flex justify-center items-center">
          <!-- SVG and text content for "No properties found" -->
        </div>
      </div>
    </div>


    <PropertyFilterModal v-if="propertyFilterModal" @close="propertyFilterModal = false"
      @applyFilters="handleApplyFilters" />
  </main>
</template>

<script lang="ts" setup>
import moment from "moment";
import { usePaginatedFetchAndDownload } from '@/composables/core/exportData';
import { useGetAudits } from "@/composables/modules/audits/useFetchAudits";
import { dynamicIcons } from "@/utils/assets";
import { exportData } from "@/composables/core/exportData";
import { downloadableColumns } from '@/composables/core/exportData'
import { useRouter, useRoute } from "vue-router";
const { exportPaginatedData, isDownloading } = usePaginatedFetchAndDownload()

// const downloadData = (exportType: any) => {
//   exportPaginatedData('/audits', exportType, 'audits_data_export', ['metadata.authUser.firstName', 'createdAt', 'eventType', 'actionDescription.summary', 'entityType', 'metadata.ipAddress', 'status' ]);
// }
const auditCustomHeaders = {
  'metadata.authUser.firstName': 'Members',
  'createdAt': 'Timestamp',
  'eventType': 'Action Type',
  'actionDescription.summary': 'Description',
  'entityType': 'Entity Type',
  'metadata.ipAddress': 'IP Address',
  'status': 'Status',
};

const downloadData = (exportType: any) => {
  const dataKeys = ['metadata.authUser.firstName', 'createdAt', 'eventType', 'actionDescription.summary', 'entityType', 'metadata.ipAddress', 'status'];

  exportPaginatedData('/audits', exportType, 'audits_data_export', dataKeys, auditCustomHeaders);
};

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

const {
  loading,
  auditList,
  metadata,
  fetchAudits,
  setPaginationObj,
  filters
} = useGetAudits();


const handlePageChange = (val: any) => {
  metadata.value.page = val || 1;
  fetchAudits(); // Explicitly call the method to fetch new data
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

const emit = defineEmits(["delete", "deactivate", "duplicate"]);

// Function to handle dropdown option click
const handleDropdownClick = (action: any, item: any) => {
  console.log(item)
  if (action === "view") {
    return router.push(`/dashboard/members/${item.id}`);
  }

  if (action === "edit") {
    return router.push(`/dashboard/members/${item.id}/edit`);
  }
  closeDropdown();
  emit(action, item);
};

const handleExport = (type: string) => {
  if (type === "csv") {
    exportData(auditList.value, "csv", "audit-listings");
  }

  if (type === "pdf") {
    exportData(auditList.value, "pdf", "audit-listings");
  }

  if (type === "excel") {
    exportData(auditList.value, "excel", "audit-listings");
  }
  downloadDropdown.value = false;
};

const openFilterModal = () => {
  propertyFilterModal.value = true;
};

const handleApplyFilters = (filters: any) => {
  applyFilters(filters);
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
  scrollbar-width: thin;
  /* For Firefox */
  scrollbar-color: #5B8469 #F1F1F1;
  /* For Firefox */
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
  background-color: #5B8469;
  /* Change on hover for better visibility */
}
</style>