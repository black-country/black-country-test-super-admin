<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-[500px]">
      <div class="flex justify-between items-center mb-4 px-3">
        <h2 class="text-base font-bold">Create Notification</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <span class="sr-only">Close</span>
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="space-y-2">
        <button
          @click="selectType('immediate')"
          class="w-full text-[#1D2739] text-left p-4 text-sm flex items-center space-x-2"
        >
          <div class="flex-1">Immediate Notification</div>
          <div class="text-green-500">
            <svg
              v-if="selectedType === 'immediate'"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="#099137" />
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#099137" />
              <path
                d="M14.6654 6.5L8.2487 12.9167L5.33203 10"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="#F9FAFB" />
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#D0D5DD" />
            </svg>
          </div>
        </button>
        <!-- <button
          @click="selectType('scheduled')"
          class="w-full text-left p-4 rounded-lg border flex items-center space-x-2"
          :class="{ 'border-green-500 bg-green-50': selectedType === 'scheduled' }"
        >-->
        <button
          @click="selectType('scheduled')"
          class="w-full text-[#1D2739] text-sm text-left p-4 flex items-center space-x-2"
        >
          <div class="flex-1">Scheduled Notification</div>
          <div class="text-green-500">
            <svg
              v-if="selectedType === 'scheduled'"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="#099137" />
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#099137" />
              <path
                d="M14.6654 6.5L8.2487 12.9167L5.33203 10"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="#F9FAFB" />
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#D0D5DD" />
            </svg>
          </div>
        </button>
        <button
          @click="selectType('reminder')"
          class="w-full text-sm text-[#1D2739] text-left p-4 flex items-center space-x-2"
        >
          <div class="flex-1">Reminder</div>
          <div class="text-green-500">
            <svg
              v-if="selectedType === 'reminder'"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="#099137" />
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#099137" />
              <path
                d="M14.6654 6.5L8.2487 12.9167L5.33203 10"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="#F9FAFB" />
              <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#D0D5DD" />
            </svg>
          </div>
        </button>
      </div>
      <div class="mt-6">
        <button
          @click="continueToNext"
          class="w-full bg-[#292929] text-sm text-white py-3 rounded-lg hover:bg-gray-800"
        >Continue</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedType = ref<string>('')

const emit = defineEmits(['close', 'continue'])

const selectType = (type: string) => {
  selectedType.value = type
}

const continueToNext = () => {
  if (selectedType.value) {
    emit('continue', selectedType.value)
  }
}
</script>