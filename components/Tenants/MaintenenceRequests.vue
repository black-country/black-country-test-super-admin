<template>
    <main class="min-h-screen">
      <section class="max-w-3xl mx-auto">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 mb-4">
          <nav class="flex space-x-4">
            <a
              v-for="tab in tabs"
              :key="tab.name"
              href="#"
              class="py-2 px-3 font-medium text-sm"
              :class="{ 'border-[#326543] border-b-4 text-[#326543]': tab.isActive }"
              @click.prevent="setActiveTab(tab)"
            >
              {{ tab.name }}
            </a>
          </nav>
        </div>
  
        <!-- Conditional Component Rendering Based on Active Tab -->
        <!-- <div v-if="tabs[0].isActive" class="flex flex-col items-center justify-center h-64 bg-white rounded-lg">
          <div class="flex items-center justify-center p-6 mb-4">
            <img :src="dynamicIcons('config-illustration')" />
          </div>
          <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">No request found</p>
        </div> -->
  
        <TenantMaintanceInfo v-if="tabs[0].isActive" />
        <TenantProfileAndDescription v-if="tabs[2].isActive" />
        <TenantPaymentTable v-if="tabs[4].isActive" />
        <div v-if="tabs[4].isActive" class="text-center text-gray-500">
            <div class="flex flex-col items-center justify-center h-64 bg-white rounded-lg">
                <div class="flex items-center justify-center p-6 mb-4">
                  <img :src="dynamicIcons('config-illustration')" />
                </div>
                <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">No request found</p>
              </div>
        </div>
        <div v-if="tabs[5].isActive" class="text-center text-gray-500">
            <div class="flex flex-col items-center justify-center h-64 bg-white rounded-lg">
                <div class="flex items-center justify-center p-6 mb-4">
                  <img :src="dynamicIcons('config-illustration')" />
                </div>
                <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">No request found</p>
              </div>
        </div>
       
      </section>
    </main>
  </template>
  
  <script lang="ts" setup>
  import { dynamicIcons } from "@/utils/assets";
  import { ref } from 'vue';  
  // Tabs control
  interface Tab {
    name: string;
    isActive: boolean;
  }
  
  const tabs = ref<Tab[]>([
    { name: 'All', isActive: true },
    { name: 'Accepted', isActive: false },
    { name: 'Pending', isActive: false },
    { name: 'Completed', isActive: false },
    { name: 'Payment & Invoice', isActive: false },
    { name: 'Declined', isActive: false },
  ]);
  
  const setActiveTab = (selectedTab: Tab) => {
    tabs.value.forEach((tab) => {
      tab.isActive = tab === selectedTab;
    });
  };
  </script>
  