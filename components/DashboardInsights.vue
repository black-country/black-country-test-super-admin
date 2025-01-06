<template>
    <main class="space-y-6">
      <section class="max-w mx-auto w-full grid lg:grid-cols-5 gap-6 mt-5">
        <input
          type="date"
          v-model="filterObj.startDate"
          class="form-input px-2 outline-none border-[0.5px] border-gray-100 rounded-lg"
          placeholder="Choose the start date"
        />
        <input
          type="date"
          v-model="filterObj.endDate"
          class="form-input px-2 outline-none border-[0.5px] border-gray-100 rounded-lg"
          placeholder="Choose the end date"
        />
        <FiltersDropdown
          :options="['Today', 'This Week', 'This Month', 'This Year']"
          v-model="selectedAgents"
        />
        <FiltersDropdown
          :options="[
            'All Tenants',
            'This Week',
            'This Month',
            'This Year',
          ]"
          v-model="selectedTenants"
        />
        <FiltersDropdown
          :options="['All properties', 'This Week', 'This Month', 'This Year']"
          v-model="selectedProperties"
        />
      </section>
  
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div class="rounded-lg space-y-4">
          <CardsUserStats v-if="!loading && Object.keys(engagementMetricsObj)?.length" :metricsObj="engagementMetricsObj" :loading="loading" />
          <section v-else-if="loading">
            <div class="animate-pulse h-72 w-full bg-gray-50 rounded flex space-x-4"></div>
          </section>
          <CardsDownloadStats />
        </div>
        <div class="rounded-lg">
          <ChartsSignup v-if="!loading && Object.keys(signupMetricsObj)?.length" :signupMetricsObj="signupMetricsObj" :loading="loading" />
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
  
      <section class="max-w mx-auto w-full grid lg:grid-cols-4 gap-6 mt-10">
        <FiltersDropdown
          :options="['Today', 'This Week', 'This Month', 'This Year']"
          v-model="selectedTimeFrame"
        />
        <FiltersDropdown
          :options="['All Agents', 'This Week', 'This Month', 'This Year']"
          v-model="selectedAgents"
        />
        <FiltersDropdown
          :options="[
            'All Property managers',
            'This Week',
            'This Month',
            'This Year',
          ]"
          v-model="selectedManagers"
        />
        <FiltersDropdown
          :options="['All properties', 'This Week', 'This Month', 'This Year']"
          v-model="selectedProperties"
        />
      </section>
      <TablesProperty :houseList="houseMetricsList" :loading="fetchingHouseMetrics" />
    </main>
  </template>
  
  <!-- <script lang="ts" setup>
  import { useFetchHouseMetrics } from '@/composables/modules/dashboard/useFetchHouseMetrics';
  import { useFetchEngagementMetrics } from '@/composables/modules/dashboard/useGetEngagementMetrics';
  import { useFetchSignupMetrics } from '@/composables/modules/dashboard/useFetchSignupMetrics'
  const { signupMetricsObj, filterObj: signupMetricsFilterObj, loading: processing, getSignupMetrics } = useFetchSignupMetrics()
  
  const { metricsObj, loading, getEngagementMetrics, filterObj } = useFetchEngagementMetrics();
  const { houseMetricsList, houseMetricsFilterObj, fetchingHouseMetrics, getHouseMetrics } = useFetchHouseMetrics()
  const router = useRouter();
  const selectedTimeFrame = ref('Today');
  const selectedAgents = ref('All Agents');
  const selectedManagers = ref('All Property managers');
  const selectedProperties = ref('All properties');
  const selectedTenants = ref('All Tenants');
  
  const today = new Date().toISOString().split('T')[0];
  filterObj.startDate = today;
  filterObj.endDate = today;
  
  watch(
    () => [filterObj.startDate, filterObj.endDate],
    ([newStartDate, newEndDate]) => {
      getEngagementMetrics();
    }
  );
  </script> -->
  
  <script lang="ts" setup>
import { useFetchHouseMetrics } from '@/composables/modules/dashboard/useFetchHouseMetrics';
import { useFetchUserMetrics } from '@/composables/modules/dashboard/userMetrics';

const { filterObj, loading, signupMetricsObj, engagementMetricsObj, fetchUserMetrics } = useFetchUserMetrics();
const { houseMetricsList, houseMetricsFilterObj, fetchingHouseMetrics, getHouseMetrics } = useFetchHouseMetrics();

const router = useRouter();
const selectedTimeFrame = ref('Today');
const selectedAgents = ref('All Agents');
const selectedManagers = ref('All Property managers');
const selectedProperties = ref('All properties');
const selectedTenants = ref('All Tenants');

const today = new Date().toISOString().split('T')[0];
filterObj.startDate = today;
filterObj.endDate = today;

// Watch for changes in filterObj and sync with signupMetricsFilterObj
watch(
  () => [filterObj.startDate, filterObj.endDate],
  ([newStartDate, newEndDate]) => {
    fetchUserMetrics();
  }
);
</script>


  <style scoped>
  /* Add any additional styles here */
  </style>  