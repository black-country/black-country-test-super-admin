<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 max-w-6xl w-[700px] max-h-[60%] overflow-auto custom-scrollbar">
        <h2 class="text-xl font-semibold text-[#1D2739] mb-6">Filters</h2>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date range</label>
            <div class="flex space-x-2">
              <input type="date" class="w-full px-3 py-3.5 text-[#667185] border-[0.5px] text-sm rounded-md outline-none" placeholder="From" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date range</label>
            <div class="flex space-x-2">
            <input type="date" class="w-full px-3 py-3.5 text-[#667185] border-[0.5px] text-sm rounded-md outline-none"  placeholder="To" />
            </div>
          </div>
  
          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-[#1D2739] mb-2">Status</label>
            <select class="w-full px-3 py-3.5 text-[#667185] border-[0.5px] text-sm rounded-md outline-none">
              <option value="">All statuses</option>
              <option value="">Paid</option>
              <option value="">Due</option>
              <option value="">Overdue</option>
            </select>
          </div>
  
          <!-- Property -->
          <div>
            <label class="block text-sm font-medium text-[#1D2739] mb-0.5">Property</label>
            <select v-if="!loadingProperties" class="w-full px-3 py-3.5 text-[#667185] border-[0.5px] text-sm rounded-md outline-none">
              <option>All properties</option>
              <option :value="item.id" v-for="(item, idx) in propertiesList" :key="idx">{{ item.name ?? 'Nil' }}</option>
            </select>
          </div>
  
          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-0.5">Category</label>
            <select class="w-full px-3 py-3.5 text-[#667185] border-[0.5px] text-sm rounded-md outline-none">
              <option>All categories</option>
              <option>Rent</option>
              <option>Security</option>
              <option>Maintenance</option>
            </select>
          </div>
  
          <!-- Tenant -->
          <div class="">
            <label class="block text-sm font-medium text-gray-700 mb-0.5">Tenant</label>
            <select v-if="!loadingTenants" class="w-full px-3 py-3.5 text-[#667185] border-[0.5px] text-sm rounded-md outline-none">
              <option>All tenants</option>
              <option :value="item.id" v-for="(item, idx) in tenantsList" :key="idx">{{ item.name ?? 'Nil' }}</option>
            </select>
          </div>
        </div>
  
        <div class="flex justify-between gap-x-6 pt-10">
          <button @click="$emit('close')" class="px-4 py-4 bg-[#EBE5E0] text-[#1D192B] rounded-md w-full">Reset</button>
          <button @click="$emit('close')" class="px-4 py-4 bg-[#1D192B] text-white rounded-md w-full">Apply filter</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useGetTenants } from '@/composables/modules/tenants/fetch'
    import { useGetProperties } from "@/composables/modules/property/fetchProperties";
    const { tenantsList, loadingTenants } = useGetTenants()
    const { loadingProperties, propertiesList } = useGetProperties()
  // No script needed for this component, it's just UI handling the props and events
  </script>
  
  <style scoped>
.custom-scrollbar {
    scrollbar-width: thin; 
    scrollbar-color: #cccccc #f1f1f1; 
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px; 
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background-color: #cccccc;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cccccc; 
    border-radius: 4px; 
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #cccccc; 
  }
</style>
  