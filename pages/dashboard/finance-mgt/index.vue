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
                <!-- <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#292929"/>
                <path d="M20.0817 20.1818C20.0817 21.4242 19.8544 22.4924 19.3999 23.3864C18.9453 24.2765 18.3222 24.9621 17.5305 25.4432C16.7427 25.9205 15.8468 26.1591 14.843 26.1591C13.8355 26.1591 12.9358 25.9205 12.1442 25.4432C11.3563 24.9621 10.7351 24.2746 10.2805 23.3807C9.82599 22.4867 9.59872 21.4205 9.59872 20.1818C9.59872 18.9394 9.82599 17.8731 10.2805 16.983C10.7351 16.089 11.3563 15.4034 12.1442 14.9261C12.9358 14.4451 13.8355 14.2045 14.843 14.2045C15.8468 14.2045 16.7427 14.4451 17.5305 14.9261C18.3222 15.4034 18.9453 16.089 19.3999 16.983C19.8544 17.8731 20.0817 18.9394 20.0817 20.1818ZM18.343 20.1818C18.343 19.2348 18.1896 18.4375 17.8828 17.7898C17.5798 17.1383 17.1631 16.6458 16.6328 16.3125C16.1063 15.9754 15.5097 15.8068 14.843 15.8068C14.1726 15.8068 13.5741 15.9754 13.0476 16.3125C12.5211 16.6458 12.1044 17.1383 11.7976 17.7898C11.4946 18.4375 11.343 19.2348 11.343 20.1818C11.343 21.1288 11.4946 21.928 11.7976 22.5795C12.1044 23.2273 12.5211 23.7197 13.0476 24.0568C13.5741 24.3902 14.1726 24.5568 14.843 24.5568C15.5097 24.5568 16.1063 24.3902 16.6328 24.0568C17.1631 23.7197 17.5798 23.2273 17.8828 22.5795C18.1896 21.928 18.343 21.1288 18.343 20.1818ZM22.2706 26V14.3636H26.4183C27.3198 14.3636 28.0679 14.5189 28.6626 14.8295C29.2611 15.1402 29.7081 15.5701 30.0036 16.1193C30.299 16.6648 30.4467 17.2955 30.4467 18.0114C30.4467 18.7235 30.2971 19.3504 29.9979 19.892C29.7024 20.4299 29.2554 20.8485 28.657 21.1477C28.0623 21.447 27.3142 21.5966 26.4126 21.5966H23.2706V20.0852H26.2536C26.8217 20.0852 27.2839 20.0038 27.6399 19.8409C27.9998 19.678 28.263 19.4413 28.4297 19.1307C28.5964 18.8201 28.6797 18.447 28.6797 18.0114C28.6797 17.572 28.5945 17.1913 28.424 16.8693C28.2573 16.5473 27.9941 16.3011 27.6342 16.1307C27.2782 15.9564 26.8104 15.8693 26.2308 15.8693H24.0263V26H22.2706ZM28.0149 20.75L30.8899 26H28.8899L26.0717 20.75H28.0149Z" fill="#EBE5E0"/>
                </svg> -->
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

        <section id="loader" class="w-full" v-else-if="loadingTtansactions && !loadingTtansactions">
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
import { useFetchNotificationCount } from "~/composables/modules/notification/fetchCount";
const isDownloadModalOpen = ref(false);

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