
  <template>
    <div class="max-w-2xl mx-auto space-y-6 pb-20">
      <h1 class="text-sm font-semibold text-[#101828]">Set Reminder</h1>
  
      <div class="space-y-6">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-[#101828]">Frequency</label>
          <div class="relative">
            <select
              v-model="frequency"
              class="w-full text-sm outline-none border py-3.5 pl-4 pr-10 text-[#101828] bg-[#F9FAFB] rounded-lg border-[#E4E7EC] appearance-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
  
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-[#101828]">Start date</label>
            <div class="relative">
              <input
                type="date"
                :min="minDate"
                v-model="startDate"
                class="w-full text-sm outline-none border py-3.5 pl-4 pr-10 text-[#101828] bg-[#F9FAFB] rounded-lg border-[#E4E7EC]"
              />
              <!-- <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg @click="triggerDatePicker" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.66667 1.66666V4.16666M13.3333 1.66666V4.16666M2.91667 7.57499H17.0833M17.5 7.08332V14.1667C17.5 16.6667 16.25 18.3333 13.3333 18.3333H6.66667C3.75 18.3333 2.5 16.6667 2.5 14.1667V7.08332C2.5 4.58332 3.75 2.91666 6.66667 2.91666H13.3333C16.25 2.91666 17.5 4.58332 17.5 7.08332Z" stroke="#667085" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div> -->
            </div>
          </div>
  
          <div class="space-y-1">
            <label class="block text-sm font-medium text-[#101828]">End date</label>
            <div class="relative">
              <input
                type="date"
                v-model="endDate"
                :min="minDate"
                class="w-full text-sm outline-none border py-3.5 pl-4 pr-10 text-[#101828] bg-[#F9FAFB] rounded-lg border-[#E4E7EC]"
              />
              <!-- <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.66667 1.66666V4.16666M13.3333 1.66666V4.16666M2.91667 7.57499H17.0833M17.5 7.08332V14.1667C17.5 16.6667 16.25 18.3333 13.3333 18.3333H6.66667C3.75 18.3333 2.5 16.6667 2.5 14.1667V7.08332C2.5 4.58332 3.75 2.91666 6.66667 2.91666H13.3333C16.25 2.91666 17.5 4.58332 17.5 7.08332Z" stroke="#667085" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div> -->
            </div>
          </div>
        </div>
  
        <div v-if="frequency === 'weekly'" class="space-y-1">
          <label class="block text-sm font-medium text-[#101828]">Select specific day(s)</label>
          <div class="relative" v-click-outside="closeDropdown">
            <div
              @click="toggleDropdown"
              class="w-full text-sm border py-3.5 px-4 bg-[#F9FAFB] rounded-lg border-[#E4E7EC] flex items-center justify-between cursor-pointer"
            >
              <div class="flex flex-wrap gap-2">
                <template v-if="selectedDays.length">
                  <div
                    v-for="day in selectedDays"
                    :key="day"
                    class="flex items-center gap-1 bg-[#F9FAFB] px-2 py-1 rounded"
                  >
                    {{ day }}
                    <button @click.stop="removeDay(day)" class="text-[#667085]">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </template>
                <span v-else class="text-[#667085]">Select days</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
  
            <div
              v-if="isOpen"
              class="absolute z-10 mt-1 w-full bg-white border border-[#E4E7EC] rounded-lg shadow-lg"
            >
              <div class="p-2">
                <div
                  v-for="day in daysOfWeek"
                  :key="day"
                  @click="toggleDay(day)"
                  class="flex items-center gap-2 px-3 py-2 hover:bg-[#F9FAFB] cursor-pointer rounded"
                >
                  <input
                    type="checkbox"
                    :checked="selectedDays.includes(day)"
                    class="form-checkbox h-4 w-4 text-[#101828] rounded border-[#D0D5DD]"
                  />
                  <span class="text-sm text-[#101828]">{{ day }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="space-y-1">
          <label class="block text-sm font-medium text-[#101828]">Select the desired time</label>
          <div class="relative">
            <input
              type="time"
              v-model="time"
              class="w-full text-sm outline-none border py-3.5 pl-4 pr-10 text-[#101828] bg-[#F9FAFB] rounded-lg border-[#E4E7EC]"
            />
            <!-- <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.3333 10C18.3333 14.6 14.6 18.3333 10 18.3333C5.4 18.3333 1.66667 14.6 1.66667 10C1.66667 5.4 5.4 1.66666 10 1.66666C14.6 1.66666 18.3333 5.4 18.3333 10Z" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.0917 12.65L10.5083 11.1083C10.0417 10.8333 9.66667 10.2 9.66667 9.67499V6.25833" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div> -->
          </div>
        </div>
      </div>
  
      <div class="border-t border-[#E4E7EC] bg-white flex justify-between px-8 md:px-32 items-center space-x-4 p-4 fixed bottom-0 left-0 w-full">
        <button
          @click="$emit('prev')"
          class="px-6 py-2.5 border border-[#D0D5DD] rounded-lg text-[#344054] hover:bg-[#F9FAFB]"
        >
          Previous
        </button>
        <button
           @click="emitData()"
           :disabled="!isValid || processing"
          class="px-6 py-2.5 disabled:cursor-not-allowed disabled:opacity-25 rounded-lg bg-[#101828] text-white hover:bg-[#000]/90"
        >
        <span v-if="!processing">{{  isLastStep ? 'Submit' : 'Next' }}</span>
        <span v-else>{{ processing ? 'processing' : '' }}</span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useCreateSchedule } from '@/composables/modules/settings/useCreateSchedule'
  const { loading: processing } = useCreateSchedule()
  
  const frequency = ref('weekly');
  const startDate = ref('');
  const endDate = ref('');
  const time = ref('10:00');
  const isOpen = ref(false);
  const selectedDays = ref<string[]>([]);
  
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  // Computed property to dynamically set the min date
const minDate = computed(() => {
  const today = new Date();
  // Format the date as YYYY-MM-DD
  return today.toISOString().split('T')[0];
});


  const dateInput = ref(null);

  const triggerDatePicker = () => {
  if (dateInput.value) {
    dateInput.value.click(); // Programmatically click the input
  }
};
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  
  const closeDropdown = () => {
    isOpen.value = false;
  };
  
  const toggleDay = (day: string) => {
    const index = selectedDays.value.indexOf(day);
    if (index === -1) {
      selectedDays.value.push(day);
    } else {
      selectedDays.value.splice(index, 1);
    }
  };
  
  const removeDay = (day: string) => {
    const index = selectedDays.value.indexOf(day);
    if (index !== -1) {
      selectedDays.value.splice(index, 1);
    }
  };
  
  // Create click-outside directive
  const vClickOutside = {
    mounted(el: HTMLElement, binding: any) {
      el.clickOutsideEvent = (event: Event) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          binding.value(event);
        }
      };
      document.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el: HTMLElement) {
      document.removeEventListener('click', el.clickOutsideEvent);
    },
  };

  const props = defineProps({
    isLastStep: Boolean
  })

  const emit = defineEmits(['next', 'prev'])

  const isValid = computed(() => frequency.value.trim() !== '' && startDate.value.trim() !== '' && endDate.value.trim() !== '' && time.value.trim() !== '');

  const emitData = () => {
  if (isValid.value) {
    emit('next', { frequency: frequency.value,  startDate: startDate.value, endDate: endDate.value, time: time.value, selectedDays:selectedDays.value });
  }
};
  </script>
  
  <style scoped>
  /* Custom checkbox styles */
  .form-checkbox {
    appearance: none;
    padding: 0;
    color-adjust: exact;
    display: inline-block;
    vertical-align: middle;
    background-origin: border-box;
    user-select: none;
    flex-shrink: 0;
    height: 1rem;
    width: 1rem;
    border: 1px solid #D0D5DD;
    border-radius: 0.25rem;
  }
  
  .form-checkbox:checked {
    background-color: #101828;
    border-color: #101828;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  }
  
  /* Hide default time input spinner */
  /* input[type="time"]::-webkit-calendar-picker-indicator {
    display: none;
  } */
  
  /* Hide default date input calendar icon */
  /* input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
  } */
  </style>