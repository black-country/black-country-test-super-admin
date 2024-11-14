<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeModal">
      <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow-lg w-11/12 lg:w-4/12  max-w-7xl">
        <h2 class="text-xl font-semibold text-[#1D2739] mb-6">Assign maintenance request</h2>
        <div class="mb-4">
          <label class="block text-sm text-[#1D2739] mb-2 font-">Assign service provider</label>
          <select v-if="!fetching" v-model="form.serviceProvider" class="w-full bg-[#E4E7EC] text-sm px-4 py-3.5 outline-none border-[0.6px] border-gray-300 text-[#98A2B3] rounded-lg">
            <option :value="item.id" v-for="item in serviceProviders" :key="item.id">{{ item.email }}</option>
          </select>
          <section v-else>
          <div class="rounded-md p-4 w-full mx-auto ">
            <div class="h-32 w-full animate-pulse bg-slate-200 rounded"></div>
          </div>
         </section>
        </div>
        <div class="flex justify-end space-x-4 pt-6">
          <button @click="closeModal" class="px-4 py-4 text-sm font-semibold bg-gray-200 w-full text-[#292929] rounded-md">Cancel</button>
          <button :disabled="loading" class="px-4 disabled:cursor-not-allowed disabled:opacity-25 py-4 text-sm font-semibold bg-[#292929] text-white w-full rounded-md">{{ loading ? 'processing...' : 'Continue' }}</button>
        </div>
      </form>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { useGetMembers } from "@/composables/modules/member/fetch";
    const { serviceProviders, loading: fetching } = useGetMembers()
  import { useAssignMaintenanceRequest } from '@/composables/modules/maintenance/useAssignMaintenanceRequest'
  import { ref } from 'vue';
  const route = useRoute() as any
  const form = ref({
    serviceProvider: ''
  })
  
  const isOpen = ref(true);
  const { assignMaintenenceRequest, loading } = useAssignMaintenanceRequest()
  
  const closeModal = () => {
    isOpen.value = false;
  };

  const handleSubmit = async () => {
    await assignMaintenenceRequest(route.params.id, form.value.serviceProvider)
    isOpen.value = false;
    
  }
  </script>
  
  <style scoped>
  /* Additional custom styles if needed */
  </style>
  