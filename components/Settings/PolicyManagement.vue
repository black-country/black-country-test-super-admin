<template>
  <div class="container mx-auto">
    <div class="lg:flex justify-between items-center mb-8 space-y-6 lg:space-y-0">
      <div class="flex space-x-4">
        <button v-for="tab in tabsList" :key="tab.key" @click="handleSelectedTab(tab.key)" :class="[
          'px-4 py-2',
          activeTab === tab.key ? 'border-b-4 border-green-700 text-green-700' : 'text-gray-600'
        ]">
          {{ tab.label }}
        </button>
      </div>
      <div>
        <NuxtLink to="/dashboard/settings/policy/create-policy"
          class="bg-[#292929] text-white px-6 py-3 text-sm rounded-md">
          Create Policy
        </NuxtLink>
      </div>
    </div>

    <div v-if="!loading && policyList.length" class="grid grid-cols-1 max-w-2xl md:grid-cols-2 lg::grid-cols-3 gap-8">
      <SettingsPolicyCard v-for="item in policyList" :key="item.id" v-bind="item" class="rounded-lg" :name="item.name"
        :id="item.id" :type="item.type" :content="item.content" :description="item.description" :app="item.app"
        :createdAt="item.createdAt" />
    </div>
    <section v-else-if="loading && !policyList.length">
      <div class="animate-pulse h-44 w-full bg-gray-100 rounded flex space-x-4"></div>
    </section>
    <div v-else class="text-center py-10 flex justify-center items-center flex-col border rounded-md border-gray-100">
      <svg width="153" height="124" viewBox="0 0 153 124" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="76.5" cy="58" r="52" fill="#EAEAEA" />
        <circle cx="21.5" cy="25" r="5" fill="#BDBDBD" />
        <circle cx="18.5" cy="109" r="7" fill="#BDBDBD" />
        <circle cx="145.5" cy="41" r="7" fill="#BDBDBD" />
        <circle cx="134.5" cy="14" r="4" fill="#BDBDBD" />
        <g filter="url(#filter0_b_5289_82141)">
          <rect x="52.5" y="34" width="48" height="48" rx="24" fill="#9D9D9D" />
          <path
            d="M77.0294 48C81.0225 48 83.019 48 84.2595 49.1716C85.5 50.3432 85.5 52.2288 85.5 56V60C85.5 63.7712 85.5 65.6569 84.2595 66.8284C83.019 68 81.0225 68 77.0294 68H75.9706C71.9775 68 69.981 68 68.7405 66.8284C67.5 65.6569 67.5 63.7712 67.5 60V56C67.5 52.2288 67.5 50.3432 68.7405 49.1716C69.981 48 71.9775 48 75.9706 48H77.0294Z"
            stroke="white" stroke-width="2" stroke-linecap="round" />
          <path d="M72.5 53H80.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
          <path d="M72.5 58H80.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
          <path d="M72.5 63H76.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
        </g>
        <defs>
          <filter id="filter0_b_5289_82141" x="44.5" y="26" width="64" height="64" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_5289_82141" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_5289_82141" result="shape" />
          </filter>
        </defs>
      </svg>


      <p class="text-gray-500">No {{ activeTab }} Found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetchPolicy } from '@/composables/modules/settings/useFetchPolicy'
const { loading, appType, policyList } = useFetchPolicy()
// const tabs = ['Tenants', 'Agents', 'Service Provider']

const tabsList = ref([
  {
    key: 'tenant-app',
    label: 'Tenants'
  },
  {
    key: 'agent-app',
    label: 'Agents'
  },
  {
    key: 'service-provider-app',
    label: 'Service Providers'
  }
])

const activeTab = ref('tenant-app')

onMounted(() => {
  appType.value = activeTab.value
})

watch(activeTab, (val) => {
  appType.value = val
})

const handleSelectedTab = (tab: string) => {
  activeTab.value = tab
  appType.value = tab
}
</script>