<template>
  <!-- No Move In Checklist Available -->
  <div v-if="rentalChecklist?.moveInChecklist === null && !loading" class="text-center text-gray-500 py-12">
    <img src="@/assets/icons/config-illustration.svg" alt="No transactions" class="mx-auto mb-2" />
    <p>No Move In Rental Checklist Available</p>
  </div>

  <!-- No Move Out Checklist Available -->
  <div  class="text-center text-gray-500 py-12 border-[0.5px] border-gray-100 mb-10 rounded-lg">
    <img src="@/assets/icons/config-illustration.svg" alt="No transactions" class="mx-auto mb-2" />
    <p class="text-sm">No Move Out Rental Checklist Available</p>
  </div>

  <!-- Loading state when checklists are missing -->
  <section v-if="loading" class="my-6">
    <div class="animate-pulse flex space-x-4 h-44 bg-slate-200 rounded"></div>
  </section>

  <!-- Show checklist components when available -->
  <!-- <div v-else> -->
<section>
  <CoreChecklistComponent 
      v-if="rentalChecklist?.moveInChecklist !== null && !loading"
      :rentalChecklist="rentalChecklist?.moveInChecklist" 
      checklistType="in" 
    />
    <CoreChecklistComponent 
      v-if="rentalChecklist?.moveOutChecklist !== null && !loading"
      :rentalChecklist="rentalChecklist?.moveOutChecklist" 
      checklistType="out" 
    />
</section>
  <!-- </div> -->
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useFetchRentalChecklist } from '@/composables/modules/tenants/useFetchRentalChecklist'

const { rentalChecklist, loading } = useFetchRentalChecklist()

// Computed property to check if either checklist is null or empty
const isNoChecklist = computed(() => {
  const moveInEmpty = !rentalChecklist?.moveInChecklist || isEmpty(rentalChecklist.moveInChecklist)
  const moveOutEmpty = !rentalChecklist?.moveOutChecklist || isEmpty(rentalChecklist.moveOutChecklist)
  return moveInEmpty && moveOutEmpty
})

// Function to check if an object is empty
const isEmpty = (checklist: object | null) => {
  return checklist && Object.keys(checklist).length === 0
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

