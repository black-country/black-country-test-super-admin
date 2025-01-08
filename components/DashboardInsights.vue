<template>
  <main class="space-y-6">
    <section class="max-w mx-auto w-full grid lg:grid-cols-5 gap-6 mt-5">
      <input type="date" v-model="filterObj.startDate"
        class="form-input px-2 outline-none border-[0.5px] border-gray-100 rounded-lg"
        placeholder="Choose the start date" />
      <input type="date" v-model="filterObj.endDate"
        class="form-input px-2 outline-none border-[0.5px] border-gray-100 rounded-lg"
        placeholder="Choose the end date" />
      <FiltersDropdown :options="['Today', 'This Week', 'This Month', 'This Year']" v-model="selectedAgents" />
      <FiltersDropdown :options="['All Tenants', 'This Week', 'This Month', 'This Year']" v-model="selectedTenants" />
      <FiltersDropdown :options="['All properties', 'This Week', 'This Month', 'This Year']"
        v-model="selectedProperties" />
    </section>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      <div class="rounded-lg space-y-4">
        <CardsUserStats v-if="!loading && Object.keys(engagementMetricsObj)?.length" :metricsObj="engagementMetricsObj"
          :loading="loading" />
        <section v-else-if="loading">
          <div class="animate-pulse h-72 w-full bg-gray-50 rounded flex space-x-4"></div>
        </section>
        <CardsDownloadStats />
      </div>
      <div class="rounded-lg">
        <ChartsSignup v-if="!loading && Object.keys(signupMetricsObj)?.length" :signupMetricsObj="signupMetricsObj"
          :loading="loading" />
        <section v-else-if="loading">
          <div class="animate-pulse h-72 w-full bg-gray-50 rounded flex space-x-4"></div>
        </section>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      <div class="rounded-lg">
        <ChartsRevenue />
      </div>
      <div class="rounded-lg">
        <ChartsOccupancyRate />
      </div>
    </div>

    <section class="mt-10 grid grid-cols-4 gap-4">
      <div>
        <CoreDateInput @date-selected="handleDateSelected" />
      </div>
 <div class="w-full">
  <select class="rounded-lg w-full p-3 border-[0.5px] outline-none text-sm" v-model="houseMetricsFilterObj.houseId">
          <option disabled value="">Select property</option>
          <option v-for="(item, idx) in propertiesList" :value="item.id" :key="idx">{{ item?.name ?? 'Nil'  }}</option>
        </select>
 </div>
   <div class="w-full">
    <select class="rounded-lg w-full p-3 border-[0.5px] outline-none text-sm" v-model="houseMetricsFilterObj.propertyManagerId">
          <option disabled value="">Select service provider</option>
          <option v-for="(item, idx) in serviceProviders" :value="item.id" :key="idx">{{ `${item?.firstName} ${item?.lastName}` ?? 'Nil'  }}</option>
        </select>
   </div>
 <div class="w-full">
  <select class="rounded-lg w-full p-3 border-[0.5px] outline-none text-sm" v-model="houseMetricsFilterObj.agentId">
          <option disabled value="">Select agent</option>
          <option v-for="(item, idx) in agentsList" :value="item.id" :key="idx">{{ `${item?.firstName} ${item?.lastName}` ?? 'Nil'  }}</option>
        </select>
 </div>
    </section>
    <!-- {{ propertiesList }} -->
    <TablesProperty v-if="!fetchingHouseMetrics && houseMetricsList?.length" :houseList="houseMetricsList"
      :loading="fetchingHouseMetrics" />
    <section v-else-if="fetchingHouseMetrics && !houseMetricsList?.length">
      <div class="animate-pulse h-72 w-full bg-gray-50 rounded flex space-x-4"></div>
    </section>
    <div v-else
      class="bg-white px-4 py-5 sm:p-6 h-80 rounded-lg flex flex-col gap-y-4 justify-center border items-center border-gray-50">
      <img :src="dynamicIcons('payment-empty-state')" alt="leases empty state" class="" />
      <p class="text-[#1D2739]">No Houses Available</p>
    </div>
  </main>
</template>


<script lang="ts" setup>
// import DatePicker from 'vue-datepicker-next'
import { useGetProperties } from '@/composables/modules/property/fetchProperties'
import { useFetchAgents } from '@/composables/modules/agents/fetch'
import { useFetchHouseMetrics } from "@/composables/modules/dashboard/useFetchHouseMetrics";
import { useFetchUserMetrics } from "@/composables/modules/dashboard/userMetrics";
import { useGetMembers } from '@/composables/modules/member/fetch'
const { propertiesList, getProperties } = useGetProperties()
const { agentsList, loading: loadingAgents } = useFetchAgents()
const { serviceProviders, loadingMembers } = useGetMembers()

const {
  filterObj,
  loading,
  signupMetricsObj,
  engagementMetricsObj,
  fetchUserMetrics,
} = useFetchUserMetrics();
const {
  houseMetricsList,
  houseMetricsFilterObj,
  fetchingHouseMetrics,
  getHouseMetrics,
} = useFetchHouseMetrics();

const router = useRouter();
const selectedTimeFrame = ref("Today");
const selectedAgents = ref("All Agents");
const selectedManagers = ref("All Property managers");
const selectedProperties = ref("All properties");
const selectedTenants = ref("All Tenants");

const today = new Date().toISOString().split("T")[0];
filterObj.startDate = today;
filterObj.endDate = today;

// Watch for changes in filterObj and sync with signupMetricsFilterObj
watch(
  () => [filterObj.startDate, filterObj.endDate],
  ([newStartDate, newEndDate]) => {
    fetchUserMetrics();
  }
);

const handleDateSelected = ({ startDate, endDate }) => {
  houseMetricsFilterObj.value.startDate = startDate
  houseMetricsFilterObj.value.endDate = endDate
    }
</script>

<style scoped>
/* Add any additional styles here */
</style>
