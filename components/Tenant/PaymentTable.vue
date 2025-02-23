<template>
  <main>
    <!-- {{ invoices }} -->
      <div  v-if="!fetching && invoicesList.length > 0" class="bg-white rounded-lg">
        <!-- {{ invoicesList }} -->
        <table class="min-w-full">
          <thead class="border-b border-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left  font-medium text-gray-500 tracking-wider"
              >
                Invoice ID
              </th>
              <th
                class="px-6 py-3 text-left  font-medium text-gray-500 tracking-wider"
              >
               Property Name
              </th>
              <th
                class="px-6 py-3 text-left  font-medium text-gray-500 tracking-wider"
              >
               Sent to
              </th>
              <th
                class="px-6 py-3 text-left  font-medium text-gray-500 tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left  font-medium text-gray-500 tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left  font-medium text-gray-500 tracking-wider"
              >
                Status
              </th>
              <!-- <th
                class="px-6 py-3 text-left  font-medium text-gray-500 tracking-wider"
              >
                Action
              </th> -->
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="invoice in invoicesList" :key="invoice.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ invoice?.invoiceNumber ?? "Nil" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ invoice?.house?.name ?? "Nil" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ invoice?.billTo ?? "Nil" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(invoice?.grandTotal) ?? "Nil" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ moment(invoice?.issuedOn).format("DD MMMM YYYY") ?? "Nil" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <!-- {{ invoice }} -->
                <span
                      :class="{
                        'bg-green-100 text-green-700 px-3 py-2 rounded-full font-medium tetx-sm': invoice?.status === 'PAID',
                        'bg-red-100 text-red-700 px-3 py-2 rounded-full font-medium tetx-sm': invoice?.status === 'NOT PAID'
                      }"
                    >
                      {{ invoice?.status ?? "Nil" }}
                    </span>
                <!-- {{ invoice?.status ?? "Nil" }} -->
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
