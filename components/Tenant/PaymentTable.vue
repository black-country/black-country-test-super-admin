<template>
  <main>
    <!-- {{ invoices }} -->
      <div  v-if="!fetching && invoicesList.length > 0" class="bg-white rounded-lg">
        <!-- {{ invoicesList }} -->
        <table class="min-w-full">
          <thead class="border-b border-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
              >
                Invoice ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
              >
                Invoice form
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="invoice in invoicesList" :key="invoice.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ invoice?.invoiceNumber ?? "Nil" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ invoice?.billFrom ?? "Nil" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(invoice?.grandTotal) ?? "Nil" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ moment(invoice?.issuedOn).format("DD MMMM YYYY") ?? "Nil" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ invoice?.status ?? "Nil" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button class="p-2 rounded-full">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.332 2.22586C10.3514 1.65863 9.21296 1.33398 7.9987 1.33398C4.3168 1.33398 1.33203 4.31875 1.33203 8.00065C1.33203 11.6825 4.3168 14.6673 7.9987 14.6673C11.6806 14.6673 14.6654 11.6825 14.6654 8.00065C14.6654 7.54405 14.6194 7.09812 14.532 6.66732"
                      stroke="#1D2739"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M5.33203 8.33398C5.33203 8.33398 6.33203 8.33398 7.66536 10.6673C7.66536 10.6673 11.3712 4.5562 14.6654 3.33398"
                      stroke="#1D2739"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <CorePagination
            v-if="!fetching && invoicesList.length > 0"
            :total="metadata.total"
            :page="metadata.page"
            :perPage="metadata.perPage"
            :pages="metadata.pages"
            @page-changed="handlePageChange"
          />
        </div>
      </div>
    <section v-else-if="fetching && !invoicesList?.length">
      <div
        class="animate-pulse h-32 w-full bg-white rounded flex space-x-4"
      ></div>
    </section>
    <div
      v-else
      class="bg-white px-4 py-5 sm:p-6 h-80 rounded-lg flex flex-col gap-y-4 justify-center border items-center border-gray-50"
    >
      <img
        :src="dynamicIcons('leases-empty-state')"
        alt="leases empty state"
        class=""
      />
      <p class="text-[#1D2739]">No invoi to review</p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import moment from "moment";
import { useCurrencyFormatter } from "@/composables/core/useCurrencyFormatter";
import { useFetchInvoices } from "@/composables/modules/maintenance/useFetchInvoices";
const { fetching, invoicesList, metadata, fetchInvoices } = useFetchInvoices();
const { formatCurrency } = useCurrencyFormatter("en-NG", "NGN");
const handlePageChange = (val: any) => {
  metadata.value.page = val || 1;
  fetchInvoices(); // Explicitly call the method to fetch new data
};

const props = defineProps({
  invoices: {
    type: Array,
    default: () => []
  }
})
// onMounted(() => {
//   fetchInvoices()
// })
</script>
