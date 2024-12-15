<!-- <template>
  <section class="space-y-4">
    <div class="lg:flex w-full gap-x-2">
      <div class="w-full lg:max-w-5xl lg:flex p-3 border border-gray-25 rounded-lg bg-white">
        <div v-if="!loadingProperties" v-for="(item, idx) in firstSection" :key="idx" class="h-32 cursor-pointer space-y-4 w-full border-gray-100 lg:border-r last:border-r-0 p-4">
          <div class="flex justify-end items-end ">
            <img :src="dynamicIcons(item.icon)" :alt="item.label" class="h-10 w-10 bg-gray-100 p-2 rounded-md" />
          </div>
          <div>
            <p class="text-[#1D2739] font-semibold text-2xl">{{item.value}}</p>
            <h6 class="text-[#667185] font-medium text-sm">{{item.label}}</h6>
          </div>
        </div>
        <section v-if="loadingProperties">
        <div class="animate-pulse h-32 w-full bg-red-700 rounded flex space-x-4"></div>
      </section>
      </div>
      <div class="w-full lg:max-w-lg lg:flex p-3 border border-gray-25 rounded-lg bg-white">
        <div  v-if="!loadingProperties" v-for="(item, idx) in secondSection" :key="idx" class="h-32 space-y-4 w-full border-gray-100 lg:border-r last:border-r-0 p-4">
          <div class="flex justify-end items-end ">
            <img :src="dynamicIcons(item.icon)" :alt="item.label" class="h-10 w-10 bg-gray-100 p-2 rounded-md" />
          </div>
          <div>
            <p class="text-[#1D2739] font-semibold text-2xl">{{item.value}}</p>
            <h6 class="text-[#667185] font-medium text-sm">{{item.label}}</h6>
          </div>
        </div>
        <section v-if="loadingProperties">
        <div class="animate-pulse h-32 w-full bg-red-700 rounded flex space-x-4"></div>
      </section>
      </div>
    </div>
    <div class="lg:flex w-full gap-x-2">
      <div class="w-full lg:max-w-5xl lg:flex p-3 border border-gray-25 rounded-lg bg-white">
        <div v-for="(item, idx) in thirdSection" :key="idx" class="h-32 space-y-4 w-full border-gray-100 lg:border-r last:border-r-0 p-4">
          <div class="flex justify-end items-end ">
            <img :src="dynamicIcons(item.icon)" :alt="item.label" class="h-10 w-10 bg-gray-100 p-2 rounded-md" />
          </div>
          <div>
            <p class="text-[#1D2739] font-semibold text-2xl">{{item.value}}</p>
            <h6 class="text-[#667185] font-medium text-sm">{{item.label}}</h6>
          </div>
        </div>
      </div>
      <div class="w-full lg:max-w-lg lg:flex p-3 border border-gray-25 rounded-lg bg-white">
  <div
    v-if="!loadingMembers"
    v-for="(item, idx) in fourthSection"
    :key="idx"
    class="h-32 space-y-4 w-full border-gray-100 lg:border-r last:border-r-0 p-4"
  >
    <div class="flex justify-end items-end">
      <img :src="dynamicIcons(item.icon)" :alt="item.label" class="h-10 w-10 bg-gray-100 p-2 rounded-md" />
    </div>
    <div>
      <p class="text-[#1D2739] font-semibold text-2xl">{{ item.value }}</p>
      <h6 class="text-[#667185] font-medium text-sm">{{ item.label }}</h6>
    </div>
  </div>
  <section v-if="loadingMembers">
        <div class="animate-pulse h-32 w-full bg-red-700 rounded flex space-x-4"></div>
      </section>
</div>
    </div>
  </section>
  </template>
  
  <script setup lang="ts">
  import { useFetchDashboardStats } from '@/composables/modules/dashboard/useFetchDashboardStats'
  import { useGetProperties } from '@/composables/modules/property/fetchProperties'
  import { useGetTenants } from '@/composables/modules/tenants/fetch'
  import { useGetMembers } from '@/composables/modules/member/fetch'
  import { dynamicIcons } from '@/utils/assets'; // assuming you have a dynamicIcons function in utils
  const { loadingProperties, propertiesList, metadata } = useGetProperties()
  const { metadata: tenantMetadata, tenantsList } = useGetTenants()
  const { membersList, metadata: memberMetadata, serviceProviders, agents, loadingMembers } = useGetMembers()
  const { dashboardStats, loading } = useFetchDashboardStats()
  const router = useRouter()
  const firstSection = ref([
  { icon: 'total-properties', value: '0', label: 'Total Properties', path: '/dashboard/property' },
  { icon: 'total-tenants', value: '0', label: 'Total tenants', path: '#' },
  { icon: 'total-income', value: '₦0.00', label: 'Total Income', path: '#' },
])

const secondSection = ref([
  { icon: 'total-rooms', value: '0', label: 'Total members', path: '#' },
  { icon: 'total-rooms', value: '0', label: 'Total rooms', path: '#' },
])

const thirdSection = ref([
  { icon: 'total-rooms', value: '0', label: 'Available rooms', path: '/#' },
  { icon: 'total-rooms', value: '0', label: 'Occupied rooms', path: '#' },
  { icon: 'total-rooms', value: '0%', label: 'Occupancy rate', path: '#' },
])

const fourthSection = ref([
  { icon: 'total-rooms', value: '0', label: 'Agents', path: '#' },
  { icon: 'total-rooms', value: '0', label: 'Service providers' , path: '#'},
])


// Watch for changes in propertiesList and update the total properties count
watch(
  propertiesList,
  (newList) => {
    const totalProperties = newList.length; // Adjust based on how the count should be derived
    const propertiesItem = firstSection.value.find(item => item.label === 'Total Properties');
    if (propertiesItem) {
      propertiesItem.value = metadata.value.total;
    }
  },
  { immediate: true }
);

// Watch for changes in tenantsList and update the total tenants count
watch(
  tenantsList,
  (newList) => {
    const tenantsItem = firstSection.value.find(item => item.label === 'Total tenants');
    if (tenantsItem) {
      tenantsItem.value = tenantMetadata.value.total;
    }
  },
  { immediate: true }
);

// Watch for changes in membersList and update the total members count
watch(
  membersList,
  () => {
    const membersItem = secondSection.value.find(item => item.label === 'Total members');
    if (membersItem) {
      // Calculate the total number of members from memberMetadata
      const totalMembers = memberMetadata?.value?.admins?.total +
                           memberMetadata?.value?.serviceProviders?.total +
                           memberMetadata?.value?.agents?.total +
                           memberMetadata?.value?.invitations?.total;
      membersItem.value = totalMembers.toString();
    }

    const agentsItem = fourthSection.value.find(item => item.label === 'Agents');
    if (agentsItem) {
      const totalAgents = agents.value?.length|| 0; // Fallback to 0 if undefined
      agentsItem.value = totalAgents.toString();
    }

    const serviceProvidersItem = fourthSection.value.find(item => item.label === 'Service providers');
    if (serviceProvidersItem) {
      const totalServiceProviders = serviceProviders.value?.length || 0; // Fallback to 0 if undefined
      serviceProvidersItem.value = totalServiceProviders.toString();
    }
  },
  { immediate: true }
);



  </script>
  
  <style scoped>
  /* Customize additional styles if necessary */
  </style>
   -->

   <template>
    <section class="space-y-4">
      <div class="lg:flex w-full gap-x-2">
        <div class="w-full lg:max-w-5xl lg:flex p-3 border border-gray-25 rounded-lg bg-white">
          <div v-if="!loading" v-for="(item, idx) in firstSection" :key="idx" class="h-32 cursor-pointer space-y-4 w-full border-gray-100 lg:border-r last:border-r-0 p-4">
            <div class="flex justify-end items-end">
              <img :src="dynamicIcons(item.icon)" :alt="item.label" class="h-10 w-10 bg-gray-100 p-2 rounded-md" />
            </div>
            <div>
              <p class="text-[#1D2739] font-semibold text-2xl">{{item.value}}</p>
              <h6 class="text-[#667185] font-medium text-sm">{{item.label}}</h6>
            </div>
          </div>
          <section v-if="loading">
            <div class="animate-pulse h-32 w-full bg-red-700 rounded flex space-x-4"></div>
          </section>
        </div>
        <div class="w-full lg:max-w-lg lg:flex p-3 border border-gray-25 rounded-lg bg-white">
          <div v-if="!loading" v-for="(item, idx) in secondSection" :key="idx" class="h-32 space-y-4 w-full border-gray-100 lg:border-r last:border-r-0 p-4">
            <div class="flex justify-end items-end">
              <img :src="dynamicIcons(item.icon)" :alt="item.label" class="h-10 w-10 bg-gray-100 p-2 rounded-md" />
            </div>
            <div>
              <p class="text-[#1D2739] font-semibold text-2xl">{{item.value}}</p>
              <h6 class="text-[#667185] font-medium text-sm">{{item.label}}</h6>
            </div>
          </div>
          <section v-if="loading">
            <div class="animate-pulse h-32 w-full bg-red-700 rounded flex space-x-4"></div>
          </section>
        </div>
      </div>
      <div class="lg:flex w-full gap-x-2">
        <div class="w-full lg:max-w-5xl lg:flex p-3 border border-gray-25 rounded-lg bg-white">
          <div v-if="!loading" v-for="(item, idx) in thirdSection" :key="idx" class="h-32 space-y-4 w-full border-gray-100 lg:border-r last:border-r-0 p-4">
            <div class="flex justify-end items-end">
              <img :src="dynamicIcons(item.icon)" :alt="item.label" class="h-10 w-10 bg-gray-100 p-2 rounded-md" />
            </div>
            <div>
              <p class="text-[#1D2739] font-semibold text-2xl">{{item.value}}</p>
              <h6 class="text-[#667185] font-medium text-sm">{{item.label}}</h6>
            </div>
          </div>
          <section v-if="loading">
            <div class="animate-pulse h-32 w-full bg-red-700 rounded flex space-x-4"></div>
          </section>
        </div>
        <div class="w-full lg:max-w-lg lg:flex p-3 border border-gray-25 rounded-lg bg-white">
          <div v-if="!loading" v-for="(item, idx) in fourthSection" :key="idx" class="h-32 space-y-4 w-full border-gray-100 lg:border-r last:border-r-0 p-4">
            <div class="flex justify-end items-end">
              <img :src="dynamicIcons(item.icon)" :alt="item.label" class="h-10 w-10 bg-gray-100 p-2 rounded-md" />
            </div>
            <div>
              <p class="text-[#1D2739] font-semibold text-2xl">{{item.value}}</p>
              <h6 class="text-[#667185] font-medium text-sm">{{item.label}}</h6>
            </div>
          </div>
          <section v-if="loading">
            <div class="animate-pulse h-32 w-full bg-red-700 rounded flex space-x-4"></div>
          </section>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useFetchDashboardStats } from '@/composables/modules/dashboard/useFetchDashboardStats'
  import { dynamicIcons } from '@/utils/assets'
  
  const { dashboardStats, loading } = useFetchDashboardStats()
  
  // Using computed properties to create reactive sections based on dashboardStats
  const firstSection = computed(() => [
    {
      icon: 'total-properties',
      value: dashboardStats.value?.totalHouses?.toString() || '0',
      label: 'Total Properties',
      path: '/dashboard/property'
    },
    {
      icon: 'total-tenants',
      value: dashboardStats.value?.totalTenants?.toString() || '0',
      label: 'Total tenants',
      path: '#'
    },
    {
      icon: 'total-income',
      value: `₦${dashboardStats.value?.totalIncome?.toLocaleString() || '0.00'}`,
      label: 'Total Income',
      path: '#'
    },
  ])
  
  const secondSection = computed(() => [
    {
      icon: 'total-rooms',
      value: dashboardStats.value?.totalMembers?.toString() || '0',
      label: 'Total members',
      path: '#'
    },
    {
      icon: 'total-rooms',
      value: dashboardStats.value?.totalRooms?.toString() || '0',
      label: 'Total rooms',
      path: '#'
    },
  ])
  
  const thirdSection = computed(() => [
    {
      icon: 'total-rooms',
      value: dashboardStats.value?.totalAvailableRooms?.toString() || '0',
      label: 'Available rooms',
      path: '/#'
    },
    {
      icon: 'total-rooms',
      value: dashboardStats.value?.totalOccupiedRooms?.toString() || '0',
      label: 'Occupied rooms',
      path: '#'
    },
    {
      icon: 'total-rooms',
      value: `${dashboardStats.value?.occupancyRate || 0}%`,
      label: 'Occupancy rate',
      path: '#'
    },
  ])
  
  const fourthSection = computed(() => [
    {
      icon: 'total-rooms',
      value: dashboardStats.value?.totalAgents?.toString() || '0',
      label: 'Agents',
      path: '#'
    },
    {
      icon: 'total-rooms',
      value: dashboardStats.value?.totalServiceProviders?.toString() || '0',
      label: 'Service providers',
      path: '#'
    },
  ])
  </script>
  
  <style scoped>
  /* Add any additional custom styles here */
  </style>