<template>
    <div class="overflow-hidden rounded-lg space-y-3">
        <div
          class="px-4 py-5 bg-white sm:px-6 flex justify-between rounded-lg items-center border [#F9FAFB] border-gray-50">
          <p>Expiring leases</p>
          <p>View all</p>
        </div>
         <div v-if="expiringLeaseList?.length && !loading" class="px-4 sm:px-6 lg:px-8 rounded-lg border border-gray-25 bg-white">
            <div class="flow-root">
              <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle">
                  <table class="min-w-full divide-y divide-gray-50">
                    <thead>
                      <tr>
                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">Tenant name</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Property</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Payment frequency</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Payment count</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Expiry date</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      <tr v-for="(item, idx) in expiringLeaseList" :key="idx">
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6 lg:pl-8">{{ `${item?.rentalApplication?.tenant?.firstName} ${item?.rentalApplication?.tenant?.lastName}` ?? 'Nil'}}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ item?.rentalApplication?.house?.name ?? 'Nil'}}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ item.rentalApplication?.room?.rentFrequency ?? 'Nil'}}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ item?.paymentCount ?? 'Nil'}}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {{ moment(item?.endDate).format('DD MMMM YYYY') ?? 'Nil' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <section v-else-if="loading && !expiringLeaseList?.length">
            <div class="animate-pulse h-32 w-full bg-red-700 rounded flex space-x-4"></div>
          </section>
          <div v-else
          class="bg-white px-4 py-5 sm:p-6 h-80 rounded-lg flex flex-col gap-y-4 justify-center border items-center border-gray-50">
          <img :src="dynamicIcons('leases-empty-state')" alt="leases empty state" class="" />
          <p class="text-[#1D2739]">No applications to review</p>
        </div>
      </div>
</template>

<script setup lang="ts">
          import moment from "moment";
import { useFetchExpiringLease } from '@/composables/modules/lease/useFetchExpiringLease'
const {  fetchExpiringLease, loading, expiringLeaseList, setPaginationObj, metadata } = useFetchExpiringLease()
import { dynamicIcons } from "@/utils/assets";

const props = defineProps({
  expiringLeases: {
    type: Array,
  },
});
</script>
