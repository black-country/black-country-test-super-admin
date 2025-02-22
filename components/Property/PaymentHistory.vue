<template>
  <main class="">

    <div class="border-[0.5px] border-gray-100 rounded-lg">
      <div
        class="bg-white border-[0.5px] border-gray-50 rounded-lg overflow-hidden"
      >
        <div class="custom-scrollbar-container w-full">
          <table class="min-w-full bg-white w-full">
            <thead class="border-b-[0.5px] border-gray-50 z-30 bg-gray-25 sticky top-0">
              <tr>
                <th
                  class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider"
                >
                  Tenant Name
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Current home
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Room Number
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Payment Frequency
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Payment Count
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Current rent status
                </th>
                <th class="py-5 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Expiry date
                </th>
              </tr>
            </thead>
            <tbody  v-if="!loadingPaymentHistory" class="divide-y divide-gray-50 z-10">
              <tr
                class="cursor-pointer"
                v-for="(item, index) in paymentList"
                :key="item.id"
              >
                <td  class="py-5 px-5 whitespace-nowrap text-left text-sm text-[#667185] font-semibold relative">
                      <p>
                      {{ item?.tenant?.firstName }} {{ item?.tenant?.lastName }}
                      </p>
                  </td>
                  <td  class="py-5 px-5 whitespace-nowrap text-left text-sm text-[#667185] font-semibold relative">
                      <p>
                      {{ item?.house?.name ?? 'Nil' }} 
                      </p>
                  </td>
                  <td  class="py-5 px-5 whitespace-nowrap text-left text-sm text-[#667185] font-semibold relative">
                      <p>
                      {{ item?.room?.name ?? 'Nil' }} 
                      </p>
                  </td>
                  <td  class="py-5 px-5 whitespace-nowrap text-left text-sm text-[#667185] font-semibold relative">
                      <p>
                      {{ item?.rentFrequency ?? 'Nil' }} 
                      </p>
                  </td>
                  <td  class="py-5 px-5 whitespace-nowrap text-left text-sm text-[#667185] font-semibold relative">
                      <p>
                      {{ item?.room?.paymentCount ?? 'Nil' }} 
                      </p>
                  </td>
                  <!-- <td  class="py-5 px-5 whitespace-nowrap text-left text-sm text-[#667185] font-semibold relative">
                      <p>
                      {{ item?.status ?? 'Nil' }} 
                      </p>
                  </td> -->
                  <td  class="py-5 px-5 whitespace-nowrap text-left text-sm text-[#667185] font-semibold relative">
                        <p>
                        <span class="rounded-full px-3 py-2 text-sm font-semibold" :class="[item.tenant.status === 'not paid' ? 'text-[#BA110B] bg-[#FBEAE9]' : 'text-[#039855] bg-[#E7F6EC]']">
                          {{ item?.tenant?.status.toUpperCase() ?? 'Nil' }} 
                        </span>
                        </p>
                    </td>
                  <td  class="py-5 px-5 whitespace-nowrap text-left text-sm text-[#667185] font-semibold relative">
                      <p>
                      <!-- {{ item?.dueDate ?? 'Nil' }}  -->
                      {{ moment(item?.dueDate).format('DD MMMM YYYY') ?? 'Nil' }}
                      </p>
                  </td>
              </tr>
            </tbody>
          </table>
          <section id="loader" class="w-full" v-if="loadingPaymentHistory">
            <div class="rounded-md p-4 w-full">
              <div class="animate-pulse flex space-x-4 w-full">
                <div class="h-44 w-full bg-slate-200 rounded"></div>
              </div>
            </div>
          </section>
        </div>
        <CorePagination
          v-if="!loadingPaymentHistory && paymentList.length > 0"
          :total="metadata.total"
          :page="metadata.page"
          :perPage="metadata.perPage"
          :pages="metadata.pages"
          @page-changed="handlePageChange"
        />
      </div>
      <div
        v-if="!loadingPaymentHistory && paymentList.length === 0"
        class="flex justify-center items-center flex-col my-20"
      >
        <div class="flex justify-center flex-col items-center gap-y-4 items-center">
          <img src="@/assets/icons/activities-empty-state.svg" />
          <p class="font-medium text-gray-400">No payment history found.</p>
        </div>
      </div>
    </div>
    

    <TenantConfigTableModal
      v-if="tenantConfigModal"
      @close="tenantConfigModal = false"
    />
    <TenantFilterModal
      v-if="tenantFilterModal"
      @close="tenantFilterModal = false"
      @applyFilters="handleApplyFilters"
    />

    <CoreModal :showCloseBtn="true" title="Configure Table" :isOpen="showModal" @close="showModal = false">
      <div>
        <div
          v-for="(column, index) in columns"
          :key="index"
          class="flex items-center mb-2"
        >
          <span class="flex-1 text-sm text-[#1D2739]">{{ column.label }}</span>
          <!-- <label :for="column.label" class="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-100">
            <span class="relative">
              <input :id="column.label" type="checkbox" v-model="column.visible" class="hidden peer toggle">
              <div class="w-10 h-6 rounded-full shadow-inner dark:bg-[#F0F2F5] peer-checked:dark:bg-[#099137]"></div>
              <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-[#FFFFFF]"></div>
            </span>
          </label> -->
          <label :for="column.label" class="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-100">
            <span class="relative">
              <input :id="column.label" type="checkbox" v-model="column.visible" class="hidden peer toggle">
              <div class="w-10 h-6 rounded-full shadow-inner bg-gray-300 dark:bg-[#F0F2F5] peer-checked:bg-green-500 peer-checked:dark:bg-[#099137]">
              </div>
              <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow bg-white peer-checked:right-0 peer-checked:left-auto dark:bg-[#FFFFFF]"></div>
            </span>
          </label>
        </div>
        <div class="flex justify-between mt-10 gap-x-6">
          <button
            @click="resetColumns"
            class="bg-[#EBE5E0] w-full font-medium text-[#292929] text-sm px-4 py-2.5 rounded-lg"
          >
            Reset
          </button>
          <button
            @click="saveColumns"
            class="bg-[#292929] text-sm font-medium w-full text-white px-4 py-2.5 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </CoreModal>
  </main>
</template>

<script lang="ts" setup>
          import moment from "moment";
import { useGetPropertyPaymentHistory } from '@/composables/modules/property/useFetchPropertyPaymentHistories'
import { useRouter, useRoute } from "vue-router";
const { paymentList, loadingPaymentHistory, fetchPaymentHistory, metadata, setPaginationObj, filters } = useGetPropertyPaymentHistory()


const route = useRoute();

const deleteModal = ref(false);
const onCancel = () => {
  deleteModal.value = false;
};


const handlePageChange = (val: any) => {
  metadata.value.page = val || 1;
  fetchPaymentHistory(); // Explicitly call the method to fetch new data
};

const downloadDropdown = ref(false);


const activeTab = ref("property") as any; // Default to step 1

// Set the active tab based on the query parameter
onMounted(() => {
  if (route.query.activeTab) {
    activeTab.value = route.query.activeTab;
  }
});
    
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
  max-height: 700px;
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
