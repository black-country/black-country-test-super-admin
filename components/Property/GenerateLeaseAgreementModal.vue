<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[60%] overflow-y-auto custom-scrollbar">
      <h2 class="text-lg font-medium mb-4">Generate lease agreement</h2>
      <div class="space-y-6">
        <div>
          <PropertySelector @property-selected="handleSelectedProperty" v-model="selectedProperty"
            label="Choose a Property" />
        </div>

        <section>
          <!-- {{ tenantsList[0] }} -->
          <div v-if="!loadingTenants" class="space-y-1">
            <CoreGeneralSelector v-model="selectedItem" :options="tenantsList" :loading="loadingTenants"
              label="Select Tenant" track-by="id" label-key="firstName" @search-change="getTenantsWithActiveRentals"
              @option-selected="handleSelection" />
          </div>
          <div v-if="loadingTenants" class="h-14 animate-pulse w-full bg-slate-200 rounded col-span-2"></div>
        </section>
        <div class="w-full">
          <label class="block text-sm pb-1 font-medium text-[#6E717C]">Start Date</label>
          <input v-model="payload.startDate" type="date" :min="currentDate" placeholder="Select start date"
            class="w-full px-4 py-3.5 border-[0.5px] text-sm bg-[#F0F2F5] rounded-lg outline-none" />
        </div>

        <div class="w-full">
          <label class="block text-sm pb-1 font-medium text-[#6E717C]">End Date</label>
          <input v-model="payload.endDate" type="date" :min="minEndDate" placeholder="Select end date"
            class="w-full px-4 py-3.5 border-[0.5px] text-sm bg-[#F0F2F5] rounded-lg outline-none"
            :disabled="!payload.startDate" />
        </div>
        <div v-if="startDate && endDate && diffInDays < 365" class="text-red-500 text-sm">
          The lease duration must be at least one year.
        </div>

        <div>
          <label class="block text-sm pb-1 font-medium text-[#6E717C]">Lease document title</label>
          <input v-model="payload.documentName" type="text" placeholder="Enter title"
            class="w-full px-4 py-3.5 border-[0.5px] text-sm bg-[#F0F2F5] rounded-lg outline-none" />
        </div>
      </div>

      <div class="mt-10 flex justify-between gap-x-6">
        <button class="bg-[#EBE5E0] font-semibold text-[#292929] w-full px-4 py-3.5 text-sm rounded-md"
          @click="closeModal">Cancel</button>
        <button :disabled="isFormEmpty"
          class="bg-[#292929] disabled:cursor-not-allowed disabled:opacity-25 font-semibold w-full text-white px-4 py-3.5 text-sm rounded-md"
          @click="applyFilters">Continue</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCreateLeaseTemplate } from '@/composables/modules/lease/create'
import { useGetTenantsWithActiveRentals } from '@/composables/modules/property/fetchTenantWithActiveRentalApplication'
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

const { getTenantsWithActiveRentals, tenantsList, houseId, loadingTenants } = useGetTenantsWithActiveRentals()
const { payload } = useCreateLeaseTemplate()
const router = useRouter()
const localStorageData = JSON.parse(localStorage.getItem('lease-template-payload'))

// Check if the form is empty
// const isFormEmpty = computed(() => {
//   const startDate = new Date(payload.value.startDate)
//   const endDate = new Date(payload.value.endDate)
//   const diffInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))

//   return (
//     !payload.value.endDate || 
//     !payload.value.startDate || 
//     !payload.value.documentName || 
//     !selectedItem.value.id || 
//     !selectedProperty.value || 
//     diffInDays < 365
//   )
// })

const isFormEmpty = computed(() => {
  const startDate = new Date(payload.value.startDate)
  const endDate = new Date(payload.value.endDate)
  const diffInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))

  return (
    !payload.value.endDate ||
    !payload.value.startDate ||
    !payload.value.documentName ||
    !selectedItem.value.id ||
    !selectedProperty.value ||
    diffInDays < 364  // Ensure exactly 365 days minimum
  )
})

// Get today's date to set as the minimum start date
const currentDate = new Date().toISOString().split('T')[0];

// A reactive variable to hold the minimum end date (1 year from start date)
const minEndDate = ref('');

// Watcher for when the start date is selected or updated
watch(() => payload.value.startDate, (newStartDate) => {
  if (newStartDate) {
    const startDate = new Date(newStartDate);
    // Add one year to the selected start date
    // const nextYear = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
    const nextYear = new Date(startDate.getTime() + 364 * 24 * 60 * 60 * 1000);
    // Format the date to 'YYYY-MM-DD' and set it as the minimum for end date
    minEndDate.value = nextYear.toISOString().split('T')[0];
  } else {
    // Reset minEndDate if no start date is selected
    minEndDate.value = '';
  }
});


watch(() => payload.value.startDate, (newEndDate) => {
  localStorageData.endDate = newEndDate
})

watch(() => payload.value.documentName, (document) => {
  localStorageData.documentName = document
})

// Watcher to update the minEndDate whenever the startDate changes
watch(() => payload.value.startDate, (newStartDate) => {
  if (newStartDate) {
    const startDate = new Date(newStartDate);
    // Add one year to the selected start date
    // const nextYear = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
    const nextYear = new Date(startDate.getTime() + 364 * 24 * 60 * 60 * 1000);
    // Format the date to 'YYYY-MM-DD' and set it as the minimum end date
    minEndDate.value = nextYear.toISOString().split('T')[0];
  } else {
    // Reset the minimum end date if no start date is selected
    minEndDate.value = '';
  }
});

// Watcher to update the minEndDate whenever the startDate changes
watch(() => payload.value.startDate, (newStartDate) => {
  localStorageData.startDate = newStartDate
  if (newStartDate) {
    const startDate = new Date(newStartDate);
    // Add one year to the selected start date
    // const nextYear = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
    const nextYear = new Date(startDate.getTime() + 364 * 24 * 60 * 60 * 1000);
    // Format the date to 'YYYY-MM-DD' and set it as the minimum end date
    minEndDate.value = nextYear.toISOString().split('T')[0];
  } else {
    // Reset the minimum end date if no start date is selected
    minEndDate.value = '';
  }
});

const selectedProperty = ref(null)
const selectedItem = ref({})

const templateObj = ref({})
onMounted(() => {
  const parsedData = JSON.parse(localStorage.getItem('templateObj'))
  templateObj.value = parsedData
})

const handleSelectedProperty = (data: any) => {
  localStorage.setItem('selected-property', JSON.stringify(data))
  payload.value.propertyId = data.id
}

// Watch for changes in the selected property and fetch tenants with active rentals
watch(selectedProperty, (newProperty) => {
  if (newProperty && newProperty.id) {
    console.log('Fetching tenants for property:', newProperty.id)
    houseId.value = newProperty.id
    getTenantsWithActiveRentals()
  }
})

const handleSelection = (item: any) => {
  payload.value.tenantId = item.id
  console.log('Selected item:', item)
}

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const applyFilters = () => {
  const startDate = new Date(payload.value.startDate)
  const endDate = new Date(payload.value.endDate)
  const diffInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))

  if (diffInDays < 364) {
    // Show an error message or handle it
    showToast({
      title: "Error",
      message: "The lease duration must be at least one year.",
      toastType: "error",
      duration: 3000
    });
    return
  }

  router.push('/dashboard/property/lease-documents/create-methods')
  // payload.value.documentName = ""
  // payload.value.startDate = ""
  // payload.value.endDate = ""
  closeModal()
}

// const applyFilters = () => {
//   router.push('/dashboard/property/lease-documents/create-methods')
//   payload.value.documentName = ""
//   payload.value.startDate = ""
//   payload.value.endDate = ""
//   closeModal()
// }
</script>

<style>
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
