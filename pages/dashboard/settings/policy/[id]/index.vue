<!-- pages/terms.vue -->
<template>
  <Layout class="lg:-ml-10">
    <template class="" #header-content>
      <div class="flex items-center justify-between px-4 md:px-8 w-full">
        <!-- Back Button -->
        <div class="flex  items-center gap-x-3">
          <button class="flex items-center py-3 rounded-lg px-6 gap-2 text-gray-600 bg-[#F9FAFB]" @click="goBack">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span class="text-sm font-medium md:text-base">Back</span>
          </button>

          <!-- Title -->
          <h1 class="text-lg hidden lg:block font-medium text-[#1D2739] md:text-lg">
            <!-- Terms & Conditions -->
            {{ selectedPolicy?.name ?? 'Nil' }}
          </h1>

        </div>
        <!-- Action Buttons -->
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 text-sm font-medium text-[#292929] bg-gray-100 rounded-full md:text-base">
            Draft
          </span>
          <button @click="handleDeletePolicy" :disabled="loading"
            class="px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-25 text-[#292929] bg-[#F0F2F5] border-[0.5px] border-gray-100 rounded-lg md:text-base">
            {{ loading ? 'deleting' : 'Delete' }}
          </button>
          <button @click="router.push(`/dashboard/settings/policy/${route.params.id}/edit`)"
            class="px-4 py-2 text-sm font-medium text-white bg-[#292929] rounded-lg hover:bg-gray-800 md:text-base">
            Edit
          </button>
        </div>
      </div>

      <!-- {{ selectedPolicy?.content }} -->
    </template>
      <div
      v-html="selectedPolicy?.content"
      class="p-4"
    ></div>

  </Layout>
</template>

<script setup lang="ts">
import { useDeletePolicy } from '@/composables/modules/settings/useDeletePolicy'
const { deletePolicy, loading, setPayload } = useDeletePolicy()
import Layout from '@/layouts/dashboard.vue';
const goBack = () => {
  // Navigate back in history
  window.history.back();
};

const route = useRoute()
const router = useRouter()

const handleDeletePolicy = () => {
  const payloadObj = [String(route.params.id)]; // Convert route.params.id to a string and wrap it in an array
  setPayload(payloadObj); // Pass the array to setPayload
  deletePolicy();
};

const selectedPolicy = ref({})

onMounted(() => {
  const policyObj = localStorage.getItem('selected-policy') as any
  selectedPolicy.value = JSON.parse(policyObj)
})
// Add any required functionality here
</script>