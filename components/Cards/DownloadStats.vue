<template>
    <div class="p-4 bg-white shadow rounded-lg">
      <section class="flex justify-between items-center pl-4">
        <div class="flex justify-between items-center gap-x-3">
            <div class="text-md lg:text-xl font-">App Downloads</div>
            <div class="text-md lg:text-xl font-">{{  computedDownloads  }}</div>
          </div>
          <div class="flex justify-between mt-4 space-x-4">
            <select class="text-sm outline-none font-medium bg-gray-50 rounded-md px-2.5 py-2">
              <option>Month</option>
              <option>Year</option>
            </select>
          </div>
     </section>
      <div class="flex justify-between mt-4">
        <div class="w-1/2 p-2 space-y-6">
          <div class="flex items-center space-x-2">
            <img src="@/assets/icons/apple-store.svg" alt="Apple Store" class="w-6 h-6" />
            <span class="text-gray-600 text-sm lg:text-base">Apple store</span>
          </div>
          <div>
            <div class="text-lg lg:text-2xl font-bold mt-2">{{ metricsObj?.appStoreDownloads ?? 'Nil' }}</div>
          <div class="text-sm text-gray-500 flex items-center space-x-1">
            <span>6% </span>
            <img src="@/assets/icons/gray-arrow-up.svg" alt=""/>
            <span class="text-sm lg:text-base">vs last month</span>
          </div>
          </div>
          <div class="flex mt-2">
            <div class="lg:flex items-center">
              <span class="lg:ml-2 text-gray-600 text-sm lg:text-base">Average Rating</span>
              <div class="flex space-x-1">
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-gray-400">★</span>
              </div>
            </div>
          </div>
        </div>
  
        <div class="w-1/2 p-2 space-y-6">
          <div class="flex items-center space-x-2">
            <img src="@/assets/icons/play-store.svg" alt="Google Playstore" class="w-6 h-6" />
            <span class="text-gray-600 text-sm lg:text-base">Google playstore</span>
          </div>
         <div>
          <div class="text-lg lg:text-2xl font-bold mt-2">{{ metricsObj?.playStoreDownloads ?? 'Nil'  }}</div>
          <div class="text-sm text-gray-500 flex items-center space-x-1">
            <span>6% </span>
            <img src="@/assets/icons/gray-arrow-up.svg" alt=""/>
            <span class="text-sm lg:text-base">vs last month</span>
          </div>
         </div>
          <div class="flex mt-2">
            <div class="lg:flex items-center">
              <span class="lg:ml-2 text-gray-600 text-sm lg:text-base">Average Rating</span>
              <div class="flex space-x-1">
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-gray-400">★</span>
                <span class="text-gray-400">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    },
    metricsObj: {
      type: Object,
      default: () => {}
    }
  })

  const computedDownloads = computed(() => {
    return props.metricsObj.appStoreDownloads + props.metricsObj.playStoreDownloads
  })
  // No specific TypeScript code needed for this component.
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>
  