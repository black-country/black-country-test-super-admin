<template>
    <div class="p-4 bg-white shadow rounded-lg">
      <section class="flex justify-between items-center pl-2">
        <div class="flex justify-between items-center gap-x-5">
          <div class="text-lg lg:text-xl font-medium">Users</div>
          <div class="text-lg lg:text-xl font-medium">{{ metricsObj?.totalUsers ?? '0' }}</div>
        </div>
        <div class="flex justify-between mt-4 space-x-4">
          <select class="text-sm outline-none font-medium bg-gray-50 rounded-md px-2.5 py-2">
            <option>Month</option>
            <option>Year</option>
          </select>
        </div>
      </section>
  
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div class="p-2">
          <div class="text-gray-600 text-sm lg:text-base">New users</div>
          <div class="text-lg lg:text-2xl font-bold mt-2">{{ metricsObj?.newUsers?.currentTotal ?? '0' }}</div>
          <div class="text-sm text-gray-500 flex items-center space-x-1">
            <span :class="metricsObj?.newUsers?.previousDiffPercentage > 0 ? 'text-green-500' : 'text-red-500'">
              {{ metricsObj?.newUsers?.previousDiffPercentage ?? '0' }}% 
            </span>
            <img :src="metricsObj?.newUsers?.previousDiffPercentage > 0 ? '@/assets/icons/green-arrow-up.svg' : '@/assets/icons/red-arrow-down.svg'" alt="" />
            <span class="text-sm lg:text-base">vs last month</span>
          </div>
        </div>
  
        <div class="p-2">
          <div class="text-gray-600 text-sm lg:text-base">Active users</div>
          <div class="text-lg lg:text-2xl font-bold mt-2">{{ metricsObj?.activeUsers?.currentTotal ?? '0' }}</div>
          <div class="text-sm text-gray-500 flex items-center space-x-1">
            <span :class="metricsObj?.activeUsers?.previousDiffPercentage > 0 ? 'text-green-500' : 'text-red-500'">
              {{ metricsObj?.activeUsers?.previousDiffPercentage ?? '0' }}% 
            </span>
            <img :src="metricsObj?.activeUsers?.previousDiffPercentage > 0 ? '@/assets/icons/green-arrow-up.svg' : '@/assets/icons/red-arrow-down.svg'" alt="" />
            <span class="text-sm lg:text-base">vs last month</span>
          </div>
        </div>
  
        <div class="p-2">
          <div class="text-gray-600 text-sm lg:text-base">Inactive users</div>
          <div class="text-lg lg:text-2xl font-bold mt-2">{{ metricsObj?.inactiveUsers?.currentTotal ?? '0' }}</div>
          <div class="text-sm text-gray-500 flex items-center space-x-1">
            <span :class="metricsObj?.inactiveUsers?.previousDiffPercentage > 0 ? 'text-green-500' : 'text-red-500'">
              {{ metricsObj?.inactiveUsers?.previousDiffPercentage ?? '0' }}% 
            </span>
            <img :src="metricsObj?.inactiveUsers?.previousDiffPercentage > 0 ? '@/assets/icons/green-arrow-up.svg' : '@/assets/icons/red-arrow-down.svg'" alt="" />
            <span class="text-sm lg:text-base">vs last month</span>
          </div>
        </div>
  
        <div class="p-2">
          <div class="text-gray-600 text-sm lg:text-base">Deleted accounts</div>
          <div class="text-lg lg:text-2xl font-bold mt-2">{{ metricsObj?.deletedUsers?.currentTotal ?? '0' }}</div>
          <div class="text-sm text-gray-500 flex items-center space-x-1">
            <span :class="metricsObj?.deletedUsers?.previousDiffPercentage > 0 ? 'text-green-500' : 'text-red-500'">
              {{ metricsObj?.deletedUsers?.previousDiffPercentage ?? '0' }}% 
            </span>
            <img :src="metricsObj?.deletedUsers?.previousDiffPercentage > 0 ? '@/assets/icons/green-arrow-up.svg' : '@/assets/icons/red-arrow-down.svg'" alt="" />
            <span class="text-sm lg:text-base">vs last month</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    metricsObj: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  });
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>
  