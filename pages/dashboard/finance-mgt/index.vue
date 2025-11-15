<template>
  <main>
    <Layout>
      <template #header-content>
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
          <div class="flex items-center gap-x-4">
            <h4 class="text-[#1D2739] text-l font-semibold">Finance Management</h4>
          </div>
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <NuxtLink to="/dashboard/notification" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative">
              <span class="sr-only">View notifications</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <div v-if="notificationCount > 0" class="h-2 w-2 bg-red-600 absolute rounded-full top-2.5 right-2.5">
              </div>
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
                    <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#1D2739"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                </span>
              </button>
            </div>
          </div>
        </div>
      </template>
      <main class="space-y-6 min-h-screen">
        <div class="flex items-center space-x-4">
          <button @click="openModal"
            class="flex text-sm gap-x-2 border-[0.5px] items-center px-4 py-3 bg-gray-25 hover:bg-gray-200 rounded-lg text-[#292929]">
            Filter
            <img :src="dynamicIcons('gray-filter')" />
          </button>
          <div class="relative flex-1">
            <input type="text" v-model="filters.searchQuery" placeholder="Search"
              class="w-6/12 px-4 py-3.5 text-sm outline-none border-[0.5px] bg-gray-25 rounded-lg pl-10 text-gray-700 placeholder-gray-500 " />
            <img class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              :src="dynamicIcons('gray-search')" />
          </div>
          <div class="relative">
            <button @click="toggleDownloadModal"
              class="flex text-sm gap-x-2 border-[0.5px] items-center px-4 py-3 bg-gray-25 hover:bg-gray-200 rounded-lg text-[#292929]">
              <img :src="dynamicIcons('gray-download')" />
              Export
            </button>
            <div v-if="isDownloadModalOpen"
              class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
              <div class="absolute right-10 top-40 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div @click="isDownloadModalOpen = false" v-for="(item, idx) in downloadOptions" :key="idx"
                  class="p-4 cursor-pointer border-b last:border-b-0 border-gray-25 flex items-center">
                  <img :src="dynamicIcons(item.icon)" />
                  <span class="text-[#1D2739] text-sm">{{ item.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full lg:flex p-3 border border-gray-25 rounded-lg bg-white">
          <div v-for="(value, key, idx) in transactionSummaries" :key="idx"
            class="h-32 cursor-pointer space-y-4 w-full border-gray-100 lg:border-r last:border-r-0 p-4">
            <div class="flex justify-end items-end ">
              <img :src="dynamicIcons('total-income')" :alt="key" class="h-10 w-10 bg-gray-100 p-2 rounded-md" />
            </div>
            <div class="space-y-0.5">
              <h2 class="text-[#1D2739] font-medium text-2xl">
                <!-- {{item.value}}.<span class="text-sm">00</span> -->
                {{ handleCurrency(value) }}
              </h2>
              <h6 class="text-[#667185] font-light text-sm">{{ formattedKey(key) }}</h6>
            </div>
          </div>
        </div>
        <section v-if="transactionsList.length && !loadingTtansactions"
          class="border-gray-100 rounded-lg border-[0.5px]">
          <div class="p-6 bg-white rounded-lg overflow-x-auto">
            <table class="min-w-full bg-white table-auto">
              <thead class="border-b-[0.5px] border-gray-50">
                <tr>
                  <th class="py-3 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">Date</th>
                  <th class="py-3 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">Transaction ID</th>
                  <th class="py-3 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">Property name</th>
                  <th class="py-3 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">Tenant name</th>
                  <th class="py-3 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">Payment method</th>
                  <th class="py-3 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">Amount (NGN)</th>
                  <th class="py-3 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">Category</th>
                  <th class="py-3 px-5 text-left text-sm font-medium text-gray-500 tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="(item, index) in transactionsList" :key="index">
                  <td class="py-4 px-5 whitespace-nowrap text-sm text-gray-700">
                    {{ moment(item.transactionDate).format('DD MMMM YYYY') ?? 'Nil' }}
                  </td>
                  <td class="py-4 px-5 whitespace-nowrap text-sm text-gray-700">
                    <span class="block font-medium">{{ item?.trxReference ?? 'Nil' }}</span>
                  </td>
                  <td class="py-4 px-5 whitespace-nowrap text-sm text-gray-700">
                    {{ item?.rentPayment?.house?.name ?? 'Nil' }}
                  </td>
                  <td class="py-4 px-5 whitespace-nowrap text-sm text-gray-700">
                    {{ `${item?.rentPayment?.tenant?.firstName} ${item?.rentPayment?.tenant?.lastName}` ?? 'Nil' }}
                  </td>
                  <td class="py-4 px-5 whitespace-nowrap text-sm text-gray-700">
                    {{ item?.channel ?? 'Nil' }}
                  </td>
                  <td class="py-4 px-5 whitespace-nowrap text-sm text-gray-700">
                    {{ handleCurrency(item?.amount) ?? 'Nil' }}
                  </td>
                  <td class="py-4 px-5 whitespace-nowrap text-sm text-gray-700">
                    {{ item?.transactionType ?? 'Nil' }}
                  </td>
                  <td class="py-4 px-5 whitespace-nowrap text-sm">
                    <span :class="{
                      'bg-green-100 text-green-800': item.status === 'paid',
                      'bg-yellow-100 text-yellow-800': item.status === 'due',
                      'bg-red-100 text-red-800': item.status === 'overdue',
                    }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ item.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <CorePagination class="" v-if="!loadingTtansactions && transactionsList.length > 0" :total="metadata.total"
            :page="metadata.page" :perPage="metadata.perPage" :pages="metadata.pages"
            @page-changed="handlePageChange" />
        </section>

        <section id="loader" class="w-full" v-else-if="loadingTtansactions ">
          <div class="rounded-md p-4 w-full">
            <div class="animate-pulse flex space-x-4 w-full">
              <div class="h-44 w-full bg-slate-200 rounded"></div>
            </div>
          </div>
        </section>
        <div v-else class="flex justify-center items-center flex-col my-20">
          <div class="flex justify-center flex-col items-center gap-y-4 items-center">
            <img src="@/assets/icons/activities-empty-state.svg" />
            <p class="font-medium text-gray-400">No Transactions Available</p>
          </div>
        </div>
      </main>
    </Layout>
    <CoreFilterModal @applyFilters="handleApplyFilters" v-if="showModal" @close="closeModal" />
  </main>
</template>

<script lang="ts" setup>
import moment from "moment";
import { useFetchTransactionSummaries } from '@/composables/modules/finance/useFetchTransactionSummaries'
import { useGetTransactions } from '@/composables/modules/finance/useFetchTransactions'
import { useUserInitials } from '@/composables/core/useUserInitials'
import { useFetchNotificationCount } from "~/composables/modules/notification/fetchCount";
const { loading: fetchingSummaries, transactionSummaries } = useFetchTransactionSummaries()
const { notificationCount } = useFetchNotificationCount();
const {
  getTransactions,
  loadingTtansactions,
  transactionsList,
  searchQuery,
  metadata,
  filters,
  setPaginationObj,
  applyFilters,
} = useGetTransactions()
import { useUser } from '@/composables/auth/user'
const { user } = useUser()
import Layout from "@/layouts/dashboard.vue";
import { dynamicIcons } from '@/utils/assets';
const isDownloadModalOpen = ref(false);
const router = useRouter();

const toggleDownloadModal = () => {
  isDownloadModalOpen.value = !isDownloadModalOpen.value;
};

const handlePageChange = (val: any) => {
  metadata.value.page = val || 1;
  getTransactions();
};


const initials = ref('') as any

// Computed property to format the key
const formattedKey = (data: any) => {
  // Convert camelCase to a readable format with spaces
  const withSpaces = data?.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Lowercase the first letter
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

onMounted(() => {
  // Get initials from the composable
  const { getInitials } = useUserInitials(user.value);
  initials.value = getInitials.value;
})

const downloadOptions = ref([
  { icon: 'gray-pdf', value: '₦5,300,000', label: 'Pdf' },
  { icon: 'gray-excel', value: '₦5,300,000', label: 'Excel/spreadsheet' },
  { icon: 'gray-csv', value: '₦5,300,000', label: 'csv' },
])

const handleCurrency = (amount: any) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
}

const firstSection = ref([
  { icon: 'total-income', value: '₦5,300,000', label: 'Rent received' },
  { icon: 'total-income', value: '₦5,300,000', label: 'Service charge' },
  { icon: 'total-income', value: '₦5,300,000', label: 'Upcoming rent' },
  { icon: 'total-income', value: '₦5,300,000', label: 'Outstanding rent' },
  { icon: 'maintance', value: '₦1,300,000', label: 'Maintance' },
])

const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const transactions = ref([
  {
    date: '22/03/2024',
    time: '11:20 am',
    transactionId: 'TXN123456',
    transactionCode: '789',
    propertyName: 'Sunshine Apartments',
    tenantName: 'Gary Schimmel',
    paymentMethod: 'Card',
    amount: '116, 20.52',
    category: 'Rent',
    status: 'Paid',
  },
  {
    date: '22/03/2024',
    time: '11:20 am',
    transactionId: 'TXN123456',
    transactionCode: '789',
    propertyName: 'Green Acres',
    tenantName: 'Jay Witting',
    paymentMethod: 'Bank transfer',
    amount: '693,490.61',
    category: 'Security',
    status: 'Due',
  },
  {
    date: '22/03/2024',
    time: '11:20 am',
    transactionId: 'TXN123456',
    transactionCode: '789',
    propertyName: 'Sunset Villas',
    tenantName: 'Jennie Boyer',
    paymentMethod: 'Bank Debit',
    amount: '597,700.55',
    category: 'Rent',
    status: 'Overdue',
  },
  {
    date: '22/03/2024',
    time: '11:20 am',
    transactionId: 'TXN123456',
    transactionCode: '789',
    propertyName: 'Wuckert, Moen and Murphy',
    tenantName: 'Jeanette Langworth',
    paymentMethod: 'Bank Debit',
    amount: '633,420.08',
    category: 'Maintenance',
    status: 'Due',
  },
  {
    date: '22/03/2024',
    time: '11:20 am',
    transactionId: 'TXN123456',
    transactionCode: '789',
    propertyName: 'Kuhn Group',
    tenantName: 'Mitchell Nienow',
    paymentMethod: 'Card',
    amount: '886,28.00',
    category: 'Service charge',
    status: 'Paid',
  },
]);

const currentPage = ref(1);
</script>