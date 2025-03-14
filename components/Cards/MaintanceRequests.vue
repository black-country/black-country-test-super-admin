<template>
  <main>
    <!-- Maintenance Requests Section -->
    <section v-if="!loading && maintenanceRequests && maintenanceRequests.length">
      <div class="space-y-4">
        <div
          v-for="request in limitedRequests"
          @click="handleSelectedRequest(request)"
          :key="request.id"
          class="text-sm font-medium cursor-pointer text-gray-700 mb-4 bg-white rounded-lg px-4 py-3.5 p-4 border-[0.5px] border-gray-50 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0"
        >
          <!-- Request Info -->
          <div class="flex items-center space-x-4">
            <img
              v-if="request.tenant.profilePicture"
              :src="request.tenant.profilePicture"
              class="w-12 h-12 rounded-full object-cover"
              alt="Profile"
            />
            <svg v-else width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- SVG content here -->
            </svg>
            <div>
              <p class="font-medium text-[#1D2739] text-base">{{ request.type }}</p>
              <p class="text-[#667185] font-light text-sm flex items-center gap-x-2">
                <!-- Location icon and address -->
                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- SVG path here -->
                </svg>
                {{ request.house.address }}
              </p>
            </div>
          </div>
          <!-- Status and Date -->
          <div class="space-y-3">
            <span
              :class="statusClasses[request.status]"
              class="text-xs font-semibold px-3 py-2 rounded-full"
            >
              {{ statusLabels[request.status] }}
            </span>
            <p class="text-gray-400 text-xs">{{ formatDate(request.createdAt) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <section v-else-if="loading">
      <div class="rounded-md p-4 w-full mx-auto">
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-6 py-1">
            <div class="h-44 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </section>


    <section v-else class="flex flex-col justify-between items-center space-y-2 mt-10">
      <svg width="152" height="124" viewBox="0 0 152 124" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="76" cy="58" r="52" fill="#EAEAEA"/>
        <circle cx="21" cy="25" r="5" fill="#BDBDBD"/>
        <circle cx="18" cy="109" r="7" fill="#BDBDBD"/>
        <circle cx="145" cy="41" r="7" fill="#BDBDBD"/>
        <circle cx="134" cy="14" r="4" fill="#BDBDBD"/>
        <g filter="url(#filter0_b_6853_118795)">
          <rect x="52" y="34" width="48" height="48" rx="24" fill="#9D9D9D"/>
          <path d="M85.9598 56.9707C86.0134 57.8009 86.0134 58.6607 85.9598 59.4909C85.6856 63.7332 82.3536 67.1125 78.1706 67.3905C76.7435 67.4854 75.2536 67.4852 73.8294 67.3905C73.339 67.3579 72.8044 67.2409 72.344 67.0513C71.8318 66.8403 71.5756 66.7348 71.4454 66.7508C71.3153 66.7668 71.1264 66.9061 70.7487 67.1846C70.0827 67.6757 69.2437 68.0285 67.9994 67.9982C67.3703 67.9829 67.0557 67.9752 66.9148 67.7351C66.774 67.495 66.9494 67.1626 67.3002 66.4978C67.7867 65.5758 68.095 64.5203 67.6279 63.6746C66.8234 62.4666 66.1401 61.036 66.0402 59.4909C65.9866 58.6607 65.9866 57.8009 66.0402 56.9707C66.3144 52.7284 69.6464 49.3491 73.8294 49.0711C75.0318 48.9911 75.2812 48.9786 76.5 49.0337" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M72.5 61H79.5M72.5 56H76" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M86 51.5C86 53.433 84.433 55 82.5 55C80.567 55 79 53.433 79 51.5C79 49.567 80.567 48 82.5 48C84.433 48 86 49.567 86 51.5Z" stroke="white" stroke-width="1.5"/>
        </g>
      </svg>
      <h2 class="text-[#1D2739]">No Maintenance request found</h2>
    </section>
  </main>
</template>



<script lang="ts" setup>
import { useFetchMaintenanceRequests } from '@/composables/modules/maintenance/useFetchMaintenanceRequests';
import { useRouter } from 'vue-router';

const { maintenanceRequests, loading } = useFetchMaintenanceRequests();
const router = useRouter();

const statusLabels: { [key: string]: string } = {
  pending: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  declined: 'Declined'
};

// Limit to 5 requests
const limitedRequests = computed(() => maintenanceRequests.value.slice(0, 5));

const statusClasses: { [key: string]: string } = {
  pending: 'bg-[#FEF6E7] text-[#DD900D]',
  assigned: 'bg-[#E8EDFB] text-[#1D4ED8]',
  in_progress: 'bg-[#FBEAE9] text-[#BA110B]',
  completed: 'bg-[#E7F6EC] text-[#099137]',
  cancelled: 'bg-[#FBEAE9] text-[#BA110B]',
  declined: 'bg-[#FBEAE9] text-[#BA110B]'
};

// Format date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Handle request selection
const handleSelectedRequest = (item: any) => {
  localStorage.setItem('selected-request', JSON.stringify(item));
  router.push(`/dashboard/tenant-mgt/maintanance-request/${item.id}`);
};
</script>
