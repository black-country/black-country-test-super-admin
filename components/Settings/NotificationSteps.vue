<template>
    <div class="max-w-5xl mx-auto p-6">
      <!-- <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-2">
          <button @click="$emit('back')" class="text-gray-600 hover:text-gray-800">
            <span class="sr-only">Back</span>
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-xl font-semibold">New notification</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="$emit('cancel')" class="text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button @click="$emit('save')" class="text-gray-600 hover:text-gray-800">
            Save & exit
          </button>
        </div>
      </div> -->
  
      <div class="flex gap-x-6">
        <div class="w-3/12">
          <div class="flex flex-col space-y-4">
            <div v-for="(step, index) in steps" :key="step.title" class="flex items-center">
              <div
                class="flex items-center justify-center w-8 h-8 rounded-full mr-4"
                :class="[
                  currentStep === index + 1
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                ]"
              >
                {{ index + 1 }}
              </div>
              <p
                class="text-sm font-medium"
                :class="[
                  currentStep === index + 1 ? 'text-gray-900' : 'text-gray-500'
                ]"
              >
                {{ step.title }}
              </p>
            </div>
          </div>
        </div>
  
        <div class="flex-1 bg-white rounded-lg p-6 shadow-sm">
          <component
            :is="currentComponent"
            @next="nextStep"
            @prev="prevStep"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import AudienceStep from '@/components/Settings/AudienceStep.vue'
  import ComposeStep from '@/components/Settings/ComposeStep.vue'
  import ReminderStep from '@/components/Settings/ReminderStep.vue'
  interface Step {
    title: string;
    component: string;
  }
  
  const props = defineProps<{
    type: 'scheduled' | 'reminder' | 'immediate'
  }>();
  
  const currentStep = ref(1);
  
  const steps = computed<Step[]>(() => {
    if (props.type === 'scheduled') {
      return [
        { title: 'Define your audience', component: AudienceStep },
        { title: 'Compose message', component: ComposeStep },
        { title: 'Schedule Notification', component: 'ScheduleStep' }
      ];
    }

    if (props.type === 'reminder') {
      return [
        { title: 'Define your audience', component: AudienceStep },
        { title: 'Compose message', component: ComposeStep },
        { title: 'Set Reminder', component: ReminderStep }
      ];
    }

    if (props.type === 'immediate') {
      return [
        { title: 'Define your audience', component: AudienceStep },
        { title: 'Compose message', component: ComposeStep },
      ];
    }
  });
  
  const currentComponent = computed(() => {
    return steps.value[currentStep.value - 1].component;
  });
  
  const nextStep = () => {
    if (currentStep.value < steps.value.length) {
      currentStep.value++;
    }
  };
  
  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };
  </script>
  