<template>
    <div class="container mx-auto">
      <div class="lg:flex justify-between items-center mb-8 space-y-6 lg:space-y-0">
        <div class="flex space-x-4">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-2',
              activeTab === tab ? 'border-b-4 border-green-700 text-green-700' : 'text-gray-600'
            ]"
          >
            {{ tab }}
          </button>
        </div>
       <div>
        <NuxtLink 
          to="/dashboard/settings/policy/create-policy"
          class="bg-[#292929] text-white px-6 py-3 text-sm rounded-md"
        >
          Create Policy
        </NuxtLink>
       </div>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SettingsPolicyCard
          title="Terms and Conditions"
          :audience="activeTab.toLowerCase()"
          :lastUpdated="'12/12/2024'"
          class="rounded-lg"
        />
        <SettingsPolicyCard
          title="Privacy Policy"
          :audience="activeTab.toLowerCase()"
          :lastUpdated="'12/12/2024'"
          class="rounded-lg"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const tabs = ['Tenants', 'Agents', 'Service Provider']
  const activeTab = ref('Tenants')
  </script>
  