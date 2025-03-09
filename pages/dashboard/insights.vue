<template>
  <Layout>
    <template #header-content>
      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
        <div class="flex items-center gap-x-4">
          <h4 class="text-[#1D2739] text-lg">Dashboard</h4>
          <button @click="router.push('/dashboard')"
            class="bg-[#5B8469] font-medium px-4 py-3 rounded-md text-white">Overview</button>
          <button @click="router.push('/dashboard/insights')"
            class="text-[#292929] font-medium bg-[#F0F2F5] px-4 py-3 rounded-md">Insights</button>
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
            <button type="button" class="-m-1.5 flex items-center p-1.5" id="user-menu-button" aria-expanded="false"
              aria-haspopup="true">
              <span class="sr-only">Open user menu</span>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#292929" />
                <path
                  d="M20.0817 20.1818C20.0817 21.4242 19.8544 22.4924 19.3999 23.3864C18.9453 24.2765 18.3222 24.9621 17.5305 25.4432C16.7427 25.9205 15.8468 26.1591 14.843 26.1591C13.8355 26.1591 12.9358 25.9205 12.1442 25.4432C11.3563 24.9621 10.7351 24.2746 10.2805 23.3807C9.82599 22.4867 9.59872 21.4205 9.59872 20.1818C9.59872 18.9394 9.82599 17.8731 10.2805 16.983C10.7351 16.089 11.3563 15.4034 12.1442 14.9261C12.9358 14.4451 13.8355 14.2045 14.843 14.2045C15.8468 14.2045 16.7427 14.4451 17.5305 14.9261C18.3222 15.4034 18.9453 16.089 19.3999 16.983C19.8544 17.8731 20.0817 18.9394 20.0817 20.1818ZM18.343 20.1818C18.343 19.2348 18.1896 18.4375 17.8828 17.7898C17.5798 17.1383 17.1631 16.6458 16.6328 16.3125C16.1063 15.9754 15.5097 15.8068 14.843 15.8068C14.1726 15.8068 13.5741 15.9754 13.0476 16.3125C12.5211 16.6458 12.1044 17.1383 11.7976 17.7898C11.4946 18.4375 11.343 19.2348 11.343 20.1818C11.343 21.1288 11.4946 21.928 11.7976 22.5795C12.1044 23.2273 12.5211 23.7197 13.0476 24.0568C13.5741 24.3902 14.1726 24.5568 14.843 24.5568C15.5097 24.5568 16.1063 24.3902 16.6328 24.0568C17.1631 23.7197 17.5798 23.2273 17.8828 22.5795C18.1896 21.928 18.343 21.1288 18.343 20.1818ZM22.2706 26V14.3636H26.4183C27.3198 14.3636 28.0679 14.5189 28.6626 14.8295C29.2611 15.1402 29.7081 15.5701 30.0036 16.1193C30.299 16.6648 30.4467 17.2955 30.4467 18.0114C30.4467 18.7235 30.2971 19.3504 29.9979 19.892C29.7024 20.4299 29.2554 20.8485 28.657 21.1477C28.0623 21.447 27.3142 21.5966 26.4126 21.5966H23.2706V20.0852H26.2536C26.8217 20.0852 27.2839 20.0038 27.6399 19.8409C27.9998 19.678 28.263 19.4413 28.4297 19.1307C28.5964 18.8201 28.6797 18.447 28.6797 18.0114C28.6797 17.572 28.5945 17.1913 28.424 16.8693C28.2573 16.5473 27.9941 16.3011 27.6342 16.1307C27.2782 15.9564 26.8104 15.8693 26.2308 15.8693H24.0263V26H22.2706ZM28.0149 20.75L30.8899 26H28.8899L26.0717 20.75H28.0149Z"
                  fill="#EBE5E0" />
              </svg>

              <span class="hidden lg:flex lg:items-center">
                <div>
                  <span class="ml-4 text-sm py-0 my-0 font-semibold block leading-6 text-gray-900"
                    aria-hidden="true">Viola Gottlieb</span>
                  <span class="text-sm py-0 my-0 font-light text-[#667185] block">Super admin</span>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#1D2739" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>

              </span>
            </button>
          </div>
        </div>
      </div>
    </template>
    <main class="space-y-6">
      <section class="max-w mx-auto w-full grid lg:grid-cols-5 gap-6 mt-5">
        <CoreDateInput v-model="startDate" placeholder="Choose the start date" />
        <CoreDateInput v-model="endDate" placeholder="Choose the end date" />
        <FiltersDropdown :options="['Today', 'This Week', 'This Month', 'This Year']" v-model="selectedAgents" />
        <FiltersDropdown :options="[
          'All Tenants',
          'This Week',
          'This Month',
          'This Year',
        ]" v-model="selectedTenants" />
        <FiltersDropdown :options="['All properties', 'This Week', 'This Month', 'This Year']"
          v-model="selectedProperties" />
      </section>


      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div class="rounded-lg space-y-4">
          <CardsUserStats />
          <CardsDownloadStats />
        </div>
        <div class="rounded-lg">
          <ChartsSignup />
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
        <FiltersDropdown :options="['Today', 'This Week', 'This Month', 'This Year']" v-model="selectedTimeFrame" />
        <FiltersDropdown :options="['All Agents', 'This Week', 'This Month', 'This Year']" v-model="selectedAgents" />
        <FiltersDropdown :options="[
          'All Property managers',
          'This Week',
          'This Month',
          'This Year',
        ]" v-model="selectedManagers" />
        <FiltersDropdown :options="['All properties', 'This Week', 'This Month', 'This Year']"
          v-model="selectedProperties" />
      </section>
      <TablesProperty />
    </main>
  </Layout>
</template>

<script lang="ts" setup>
// import { useFetchEngagementMetrics } from '@/composables/modules/dashboard/useGetEngagementMetrics'
import Layout from '@/layouts/dashboard.vue';
import { useFetchNotificationCount } from '~/composables/modules/notification/fetchCount';
const router = useRouter()
const selectedTimeFrame = ref("Today");
const selectedAgents = ref('All Agents')
const selectedManagers = ref('All Property managers')
const selectedProperties = ref('All properties')
const selectedTenants = ref('All Tenants')
const startDate = ref('')
const endDate = ref('')
const {notificationCount} = useFetchNotificationCount();
// const { metricsObj, loading, getEngagementMetrics } = useFetchEngagementMetrics()

definePageMeta({
  middleware: 'auth'
})

</script>