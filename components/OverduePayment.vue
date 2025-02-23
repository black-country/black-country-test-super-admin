<template>
    <div class="overflow-hidden rounded-lg space-y-3">
        <div v-if="showHeader"
          class="px-4 py-5 bg-white sm:px-6 flex justify-between rounded-lg items-center border [#F9FAFB] border-gray-50">
          <p>Overdue payment</p>
          <!-- {{ upcomingDuePaymentList }} -->
          <NuxtLink to="/dashboard/overdue-payments">View all</NuxtLink>
        </div>
        <div v-if="overduePaymentList.length && !loading" class="px-4 sm:px-6 lg:px-8 rounded-lg border border-gray-25 bg-white">
            <div class="flow-root">
              <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle">
                  <table class="min-w-full divide-y divide-gray-50">
                    <thead>
                      <tr>
                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">Tenant name</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Category</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Amount</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      <tr @click="router.push('/dashboard/payment-list')" class="cursor-pointer" v-for="(item, idx) in overduePaymentList" :key="idx">
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6 lg:pl-8">
                          <span v-if="item?.tenant">{{ `${item?.tenant?.firstName} ${item?.tenant?.lastName}`}}</span>
                          <span v-else>Nil</span>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ item?.category ?? 'Nil'}}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ handleCurrency(item?.rentAmount) ?? 'Nil'}}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">  {{ moment(item?.dueDate).format('DD MMMM YYYY') ?? 'Nil' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-if="showPagination">
                <CorePagination
                    v-if="!loading && overduePaymentList.length > 0"
                    :total="metadata.total"
                    :page="metadata.page"
                    :perPage="metadata.perPage"
                    :pages="metadata.pages"
                    @page-changed="handlePageChange"
                    />
              </div>
            </div>
          </div>
          <section v-else-if="loading && !overduePaymentList.length">
            <div class="animate-pulse h-32 w-full bg-white rounded flex space-x-4"></div>
          </section>
        <div v-else
          class="bg-white px-4 py-5 sm:p-6 h-80 rounded-lg flex flex-col gap-y-4 justify-center border items-center border-gray-50">
          <img :src="dynamicIcons('payment-empty-state')" alt="leases empty state" class="" />
          <p class="text-[#1D2739]">No applications to review</p>
        </div>
      </div>
</template>

<script setup lang="ts">
          import moment from "moment";
import { useFetchOverduePayment } from '@/composables/modules/payment/useFetchOverduePayments'
const { loading, overduePaymentList, setPaginationObj, metadata, fetchOverduePayments } = useFetchOverduePayment()
import { dynamicIcons } from "@/utils/assets";

const router = useRouter()

const props = defineProps({
    showHeader: {
    type: Boolean,
    default: true
  },
  showPagination: {
    type: Boolean,
    default: false
  }
});

const handleCurrency = (amount: any) => {
  return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
}

const handlePageChange = (val: any) => {
  metadata.value.page = val || 1;
  fetchOverduePayments(); // Explicitly call the method to fetch new data
};
</script>
