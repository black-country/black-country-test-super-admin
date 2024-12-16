<template>
  <div class="relative">
    <button class="w-full py-3 px-4 flex justify-between items-center text-sm border-[0.5px] border-gray-25 bg-[#F0F2F5] rounded-md" @click="isOpen = !isOpen">
      <p>{{ selectedRecipient || 'Select recipients' }}</p>

      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 7.50004C15 7.50004 11.3176 12.5 10 12.5C8.68233 12.5 5 7.5 5 7.5" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
    <ul v-if="isOpen" class="absolute top-full left-0 w-full mt-3 bg-white border-[0.5px] border-gray-100 rounded-md h-96 overflow-y-auto">
      <li v-for="recipient in options" :key="recipient" class="py-3 px-4 bg-white flex justify-between items-center border-b-[0.5px] border-gray-50">
        <label class="text-sm">{{ recipient }}</label>
        <input type="checkbox" v-model="selectedRecipients" :value="recipient" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useEventListener } from '@vueuse/core';

// Define props and emits
defineProps<{
  options: string[];
  modelValue: string[];
}>();

const emit = defineEmits(['update:modelValue']);

// Reactive state
const isOpen = ref(false);
const selectedRecipients = ref<string[]>([]);

// Computed value for the button label
const selectedRecipient = computed(() => {
  if (selectedRecipients.value.length === 1) {
    return selectedRecipients.value[0];
  } else if (selectedRecipients.value.length > 1) {
    return 'Multiple Recipients Selected';
  } else {
    return null;
  }
});

// Emit updates to the parent component
watch(
  selectedRecipients,
  (newValue) => {
    emit('update:modelValue', newValue);
  },
  { immediate: true }
);

// Close the dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    isOpen.value = false;
  }
};

useEventListener('click', handleClickOutside);
</script>
