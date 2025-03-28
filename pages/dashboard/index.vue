<template>
  <Layout>
    <template #header-content>
      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
        <div class="flex items-center gap-x-4">
          <h4 class="text-[#1D2739] text-lg">Dashboard</h4>
          <button :class="[activeTabHeader === 'overview' ? 'bg-[#5B8469] text-white' : 'bg-[#F0F2F5] text-[#292929]']"
            @click="activeTabHeader = 'overview'" class="font-medium px-4 py-2.5 text-sm rounded-md">Overview</button>
          <button :class="[activeTabHeader === 'insights' ? 'bg-[#5B8469] text-white' : 'bg-[#F0F2F5] text-[#292929]']"
            @click="activeTabHeader = 'insights'" class="font-medium px-4 py-2.5 text-sm rounded-md">Insights</button>
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
              <p class="bg-gray-900 text-white p-3 font-semibold rounded-lg">{{ initials }}</p>

              <span class="hidden lg:flex lg:items-center">
                <div>
                  <span v-if="user" class="ml-4 text-sm py-0 my-0 font-semibold block leading-6 text-gray-900"
                    aria-hidden="true"> {{ user?.firstName }} {{ user?.lastName }}</span>
                  <span class="text-sm py-0 my-0 font-light text-[#667185] block">Super admin</span>
                </div>
                <svg class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#1D2739" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>

              </span>
            </button>
          </div>
        </div>
      </div>
    </template>
    <!-- {{dashboardStats}} -->
    <main v-if="activeTabHeader === 'overview'" class="space-y-6">
      <DashboardStats />
      <section class="lg:flex gap-x-6">
        <div class="w-full lg:max-w-6xl space-y-6">
          <CategoryTabs :activeTab="activeTab" @setTab="setTab" />
          <CardsRecentApplications v-if="activeTab === 'recent_applications'" />
          <CardsMaintanceRequests v-if="activeTab === 'maintenance_requests'" />
          <!-- <UpcomingPayment v-if="activeTab === 'overdue'" :upcomingPayments="upcomingPayments" /> -->
          <OverduePayment v-if="activeTab === 'overdue'" />

          <div v-if="activeTab === 'upcoming_events'" class="space-y-5">
            <ExpiringLeases :expiringLeases="expiringLeases" />
            <UpcomingPayment :upcomingPayments="upcomingPayments" />
          </div>
        </div>
        <div class="w-full lg:max-w-sm">
          <MembershipActivities />
        </div>
      </section>
    </main>
    <main v-if="activeTabHeader === 'insights'">
      <DashboardInsights />
    </main>
  </Layout>
</template>

<script setup lang="ts">
import { useUserInitials } from '@/composables/core/useUserInitials'
import { useUser } from '@/composables/auth/user'
const { user } = useUser()
const { notificationCount } = useFetchNotificationCount();
import Layout from '@/layouts/dashboard.vue';
import { useFetchNotificationCount } from '~/composables/modules/notification/fetchCount';
definePageMeta({
  middleware: 'auth'
})

const initials = ref('') as any

onMounted(() => {
  // Get initials from the composable
  const { getInitials } = useUserInitials(user.value);
  initials.value = getInitials.value;
})

const activeTabHeader = ref('overview')
const route = useRoute()
const router = useRouter();

const setActive = (item: string) => {
  if (item === 'overview') {
    activeTabHeader.value = 'overview'
    router.push('/dashboard')
  }
  if (item === 'insights') {
    activeTabHeader.value = 'insights'
    router.push('/dashboard/insights')
  }
}

const activeTab = ref("upcoming_events");

const setTab = (item: string) => {
  activeTab.value = item;
};


const upcomingPayments = ref([
  {
    tenant_name: "Jay Witting",
    category: "Security",
    amount: "116,120.52",
    date: "22/03/2024",
  },
  {
    tenant_name: "Jay Witting",
    category: "Security",
    amount: "116,120.52",
    date: "22/03/2024",
  },
  {
    tenant_name: "Jay Witting",
    category: "Security",
    amount: "116,120.52",
    date: "22/03/2024",
  },
  {
    tenant_name: "Jay Witting",
    category: "Security",
    amount: "116,120.52",
    date: "22/03/2024",
  },
  {
    tenant_name: "Jay Witting",
    category: "Security",
    amount: "116,120.52",
    date: "22/03/2024",
  },
]);

const expiringLeases = ref([
  {
    tenant_name: "Gary Schimmel",
    property: "Morar - Parisian",
    payment_frequency: "Yearly",
    payment_count: "1/1",
    expiry_date: "22/03/2024",
  },
  {
    tenant_name: "Gary Schimmel",
    property: "Morar - Parisian",
    payment_frequency: "Yearly",
    payment_count: "1/1",
    expiry_date: "22/03/2024",
  },
  {
    tenant_name: "Gary Schimmel",
    property: "Morar - Parisian",
    payment_frequency: "Yearly",
    payment_count: "1/1",
    expiry_date: "22/03/2024",
  },
  {
    tenant_name: "Gary Schimmel",
    property: "Morar - Parisian",
    payment_frequency: "Yearly",
    payment_count: "1/1",
    expiry_date: "22/03/2024",
  },
  {
    tenant_name: "Gary Schimmel",
    property: "Morar - Parisian",
    payment_frequency: "Yearly",
    payment_count: "1/1",
    expiry_date: "22/03/2024",
  },
]);
</script>
