<!-- <template>
<Layout class="bg-red-500">
    <template #header-content>
      <div class="flex items-center justify-between w-full">
            <div class="flex gap-x-6">
                <button @click="router.back()" class="flex bg-gray-50 px-6 py-0 rounded-lg items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <span class="text-sm">Back</span>
                </button>
            

                <h1 class="text-lg font-semibold text-gray-900">{{ maintenanceRequest?.type ?? 'Nil' }}</h1>
            </div>
        
      <div>
        <button @click="openModal" class="px-4 py-3 text-sm bg-black text-white rounded-md hover:bg-gray-800">
              Assign request
            </button>
      </div>
          </div>
    </template>
    <div class="space-y-6 max-w-3xl mx-auto">
          <TenantProfileAndDescription :maintenanceRequest="maintenanceRequest" class="max-w-4xl mx-auto"  />
    </div>      
    <TenantAssignModal v-if="isModalOpen" @close="isModalOpen = false" />
  </Layout>
  </template>
  
  <script lang="ts" setup>
  import Layout from '@/layouts/dashboard.vue';
  import { useFetchMaintenanceRequest } from '@/composables/modules/maintenance/useFetchMaintenenceRequest'
  const {
    maintenanceRequest } = useFetchMaintenanceRequest()
  const router = useRouter()
    // Modal control
    const isModalOpen = ref(false);
  
  const openModal = () => {
    isModalOpen.value = true;
  };

  JSON.parse(localStorage.getItem('selected-request'))
  // Script setup can be used to manage any actions or state, if needed
  </script>
  
  <style scoped>
  /* Additional custom styles if needed */
  </style>
   -->

   <template>
    <Layout class="bg-red-500">
      <template #header-content>
        <div class="flex items-center justify-between w-full">
          <!-- Back Button -->
          <div class="flex gap-x-6">
            <button
              @click="router.back()"
              class="flex bg-gray-50 px-6 py-0 rounded-lg items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              <span class="text-sm">Back</span>
            </button>
  
            <!-- Service Title -->
            <h1 class="text-lg font-semibold text-gray-900">
              {{ selectedRequest?.type ?? 'Nil' }}
            </h1>
          </div>
  
          <!-- Assign Request Button -->
          <div>
            <button
              @click="openModal"
              class="px-4 py-3 text-sm bg-black text-white rounded-md hover:bg-gray-800"
            >
              Assign request
            </button>
          </div>
        </div>
      </template>
      <div class="space-y-6 max-w-3xl mx-auto">
        <TenantProfileAndDescription :maintenanceRequest="selectedRequest" class="max-w-4xl mx-auto" />
      </div>
      <TenantAssignModal v-if="isModalOpen" @close="isModalOpen = false" />
    </Layout>
  </template>
  
  <script lang="ts" setup>
  import Layout from '@/layouts/dashboard.vue';
  import { useFetchMaintenanceRequest } from '@/composables/modules/maintenance/useFetchMaintenenceRequest';
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  
  const router = useRouter();
  
  // Modal control
  const isModalOpen = ref(false);
  
  const openModal = () => {
    isModalOpen.value = true;
  };
  
  // Fetch the maintenance request
  const { maintenanceRequest } = useFetchMaintenanceRequest();
  
  // Retrieve and parse 'selected-request' from local storage
  const selectedRequest = ref(null);
  
  onMounted(() => {
    const storedRequest = localStorage.getItem('selected-request');
    if (storedRequest) {
      selectedRequest.value = JSON.parse(storedRequest);
    }
  });
  
  // Use `selectedRequest` if `maintenanceRequest` is not available
  if (!maintenanceRequest.value && selectedRequest.value) {
    maintenanceRequest.value = selectedRequest.value;
  }
  </script>
  
  <style scoped>
  /* Additional custom styles if needed */
  </style>
  