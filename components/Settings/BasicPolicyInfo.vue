<template>
    <div class="w-full">
      <h2 class="text-xl font-medium my-4 lg:mb-4">Basic policy information</h2>
  
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-[#101828]">
            Policy Type
          </label>
          <!-- <input
            v-model="form.title"
            type="text"
            class="w-full text-sm outline-none border py-3.5 pl-4 pr-10 text-[#101828] bg-[#F9FAFB] rounded-lg border-[#E4E7EC] appearance-none"
            placeholder='Enter the policy title (e.g., "Terms & Conditions")'
          > -->
          <div class="relative">
            <select
              v-model="form.title"
              class="w-full text-sm outline-none border py-3.5 pl-4 pr-10 text-[#101828] bg-[#F9FAFB] rounded-lg border-[#E4E7EC] appearance-none"
            >
              <option value="" disabled>Select the intended policy type</option>
              <option v-for="item in policyTypesList" :key="item.key" :value="item.key">
                {{ item.label }}
              </option>
            </select>
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
  
        <div>
          <label class="block text-sm font-medium text-[#101828]">
            Policy audience
          </label>
          <div class="relative">
            <select
              v-model="form.audience"
              class="w-full text-sm outline-none border py-3.5 pl-4 pr-10 text-[#101828] bg-[#F9FAFB] rounded-lg border-[#E4E7EC] appearance-none"
            >
              <option value="" disabled>Select the intended audience</option>
              <option v-for="audience in audiences" :key="audience.key" :value="audience.key">
                {{ audience.label }}
              </option>
            </select>
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  
      <div class="border-t border-[#E4E7EC] bg-white flex justify-between px-8 md:px-32 items-center space-x-4 p-4 fixed bottom-0 left-0 w-full">
        <button
           @click="$router.push('/')"
          class="px-6 py-2.5 border border-[#D0D5DD] rounded-lg text-[#344054] hover:bg-[#F9FAFB]"
        >
        Cancel
        </button>
        <button
         @click="handleNext"
         :disabled="!canProceed"
          class="px-6 py-2.5 rounded-lg bg-[#101828] text-white disabled:opacity-90 disabled:cursor-not-allowed"
          :class="canProceed ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-700'"
        >
          Next
        </button>
      </div>
      <!-- <div class="flex justify-between mt-8">
        <button 
          @click="$router.push('/')"
          class="px-6 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
        >
          Cancel
        </button>
        <button 
          @click="handleNext"
          :disabled="!canProceed"
          class="px-6 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :class="canProceed ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400'"
        >
          Next
        </button>
      </div> -->
    </div>
  </template>
  
  <script setup lang="ts">
  const form = reactive({
    title: '',
    audience: ''
  })
  
  // const audiences = ['Tenants', 'Agents', 'Service Provider']
  const audiences = ref([
    {
       label: 'Tenant',
       key:'tenant-app'
    },
    {
       label: 'Agents',
       key:'agent-app'
    },
    {
       label: 'Service Provider',
       key:'service-provider-app'
    }
  ])

    // const audiences = ['Tenants', 'Agents', 'Service Provider']
    const policyTypesList = ref([
    {
       label: 'Privacy Policy',
       key:'privacy_policy'
    },
    {
       label: 'Terms Of Use',
       key:'terms_of_use'
    }
  ])
  
  const canProceed = computed(() => 
    form.title.trim() !== '' && form.audience !== ''
  )
  
  const emit = defineEmits(['next'])
  
  function handleNext() {
    if (canProceed.value) {
      emit('next', form)
    }
  }
  </script>