<template>
    <div class="overflow-hidden rounded-lg">
        <div class="py-5">
          <p>Users activities</p>
        </div>
        <section v-if="auditList?.length && !loading" class="bg-white border h-[500px] overflow-auto rounded-lg border-gray-50 px-4 py-5 sm:p-6">
            <div v-for="(item, idx) in auditList" :key="idx" class="flex gap-x-3 border-b last:border-b-0 border-gray-25 py-4">
                <div>
                 <svg width="8" height="60" viewBox="0 0 8 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <circle cx="4" cy="4" r="4" fill="#6A9AEB"/>
                     <line x1="4.5" y1="12" x2="4.5" y2="60" stroke="#6A9AEB" stroke-dasharray="2 2"/>
                     </svg>   
                </div>
               <div class="space-y-0.5">
                 <p class="text-sm text-[#1D2739] max-w-lg">{{ `${item?.actionDescription?.summary.length > 20 ? `${item?.actionDescription?.summary?.slice(0, 50)}...` : item?.actionDescription?.summary}` ?? 'Nil' }}</p>    
                 <p class="text-xs text-gray-500 font-light">{{ moment(item?.createdAt).format('DD MMMM YYYY, HH:mm:ss A') ?? 'Nil' }}</p>         
               </div>
         </div>
         <!-- <CorePagination
            v-if="!loading && auditList.length > 0"
            :total="metadata.total"
            :page="metadata.page"
            :perPage="metadata.perPage"
            :pages="metadata.pages"
            @page-changed="handlePageChange"
          /> -->
        </section>
        <div
          v-else-if="loading && !auditList?.length"
          class="h-32 bg-slate-200 rounded animate-pulse w-full m-3"
        ></div>
        <div v-else class="bg-white border rounded-lg border-gray-50 px-4 py-5 sm:p-6 h-80 flex flex-col gap-y-4 justify-center items-center">
        <img :src="dynamicIcons('activities-empty-state')" alt="leases empty state" class="" />
        <p class="text-[#1D2739]">No recent activities</p>
      </div>
      </div>
</template>

<script setup lang="ts">
   import moment from "moment";
  import { useGetAudits } from "@/composables/modules/audits/useFetchAudits";
  const {
    loading,
    auditList,
    metadata,
    fetchAudits,
    setPaginationObj,
    filters
  } = useGetAudits();
import { dynamicIcons } from "@/utils/assets";

const props = defineProps({
    membersActivities: {
    type: Array,
  },
});

const handlePageChange = (val: any) => {
    metadata.value.page = val || 1;
    fetchAudits(); // Explicitly call the method to fetch new data
  };

</script>