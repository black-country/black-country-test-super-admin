<template>
  <main>
    <div class="container mx-auto py-6 space-y-6">
      <!-- Toggle Buttons -->
      <div class="flex space-y-4 flex-col">
        <div class="flex items-center justify-between space-x-4">
          <span class="font-light text-[#1D2739]">Smoking allowed</span>
          <div class="flex gap-x-4">
            <button
              @click="setAnswer('Smoking Allowed', 'Yes')"
              :class="smokingAllowed ? activeClass : inactiveClass"
              class="px-6 py-2 text-[#1D2739] font-medium rounded-md text-sm border border-gray-300"
            >
              Yes
            </button>
            <button
              @click="setAnswer('Smoking Allowed', 'No')"
              :class="!smokingAllowed ? activeClass : inactiveClass"
              class="px-6 py-2 text-[#1D2739] font-medium rounded-md text-sm border border-gray-300"
            >
              No
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between space-x-4">
          <span class="font-light text-[#1D2739]">Pets allowed</span>
          <div class="flex gap-x-4">
            <button
              @click="setAnswer('Pets Allowed', 'Yes')"
              :class="petsAllowed ? activeClass : inactiveClass"
              class="px-6 py-2 text-[#1D2739] font-medium rounded-md text-sm border border-gray-300"
            >
              Yes
            </button>
            <button
              @click="setAnswer('Pets Allowed', 'No')"
              :class="!petsAllowed ? activeClass : inactiveClass"
              class="px-6 py-2 text-[#1D2739] font-medium rounded-md text-sm border border-gray-300"
            >
              No
            </button>
          </div>
        </div>
      </div>

      <!-- Custom Rule Input -->
   <section class="lg:flex space-y-3 lg:space-y-0 justify-between items-center">
    <div class="lg:w-10/12">
      <h3 class="text-sm font-medium mb-2">Add Additional house rules</h3>
      <input
        v-model="newCustomRule"
        placeholder="Enter custom rule"
        class="w-full p-3 border-[0.5px] bg-[#F0F2F5] border-gray-300 outline-none text-sm rounded-md"
      />
    </div>
    <button
    @click="addCustomRule"
    class="lg:mt-6 text-[#1D2739] font-medium bg-[#F0F2F5] border py-2.5 flex justify-between items-center gap-x-3 text-sm px-3 rounded-lg"
  >
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 2V10"
        stroke="#1D2739"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2 6H10"
        stroke="#1D2739"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    Add rule
  </button>

   </section>
      <!-- Custom Rules List -->
      <div v-if="rules.length > 0">
        <div class="space-y-4">
          <div
            v-for="(rule, index) in rules.filter(r => r.rule !== 'Pets Allowed' && r.rule !== 'Smoking Allowed')"
            :key="index"
            class="flex items-start justify-between space-x-2 p-4 bg-white border border-[#E4E7EC] rounded-md"
          >
            <div class="mt-1 flex items-center">
              <span class="block w-3 h-3 bg-black rounded"></span>
              <p class="text-[#1D2739] ml-2">{{ rule.rule }}</p>
              <p v-if="rule.answer" class="ml-4">Answer: {{ rule.answer }}</p>
            </div>
            <button
              @click="removeRule(index)"
              class="text-red-500 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#d0021b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <slot name="action-buttons"></slot>
  </main>
</template>


<!-- <script setup lang="ts">
const emit = defineEmits(['updateRules']);
const smokingAllowed = ref(false);
const petsAllowed = ref(false);
const newCustomRule = ref<string>('');
  import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

// State for rules list (both predefined and custom rules)
const rules = ref<{ rule: string; options?: string[]; answer?: string }[]>([]);

const props = defineProps({
  payload: {
    type: Object,
    default: () => ({ rules: [] }),
  },
});

// Prefill rules on component mounted
onMounted(() => {
  console.log(props.payload.rules, 'rules here');
  
  // Check if there are existing rules in the payload and prefill the rules array
  if (Array.isArray(props.payload.rules.value) && props.payload.rules.value.length > 0) {
    rules.value = props.payload.rules.value;

    // Update the states of smokingAllowed and petsAllowed based on the prefilled values
    const smokingRule = rules.value.find((r) => r.rule === 'Smoking Allowed');
    if (smokingRule) {
      smokingAllowed.value = smokingRule.answer === 'Yes';
    }

    const petsRule = rules.value.find((r) => r.rule === 'Pets Allowed');
    if (petsRule) {
      petsAllowed.value = petsRule.answer === 'Yes';
    }
  }
});

// Watcher to emit updated rules
watch(
  rules,
  (newRules) => {
    emit('updateRules', newRules); // Emit the updated rules to the parent
  },
  { deep: true }
);

// Toggle function to set the answer for predefined rules
function setAnswer(ruleName: string, answer: string) {
  const rule = rules.value.find((r) => r.rule === ruleName);
  if (rule) {
    rule.answer = answer;
  } else {
    // If the rule doesn't exist, create it
    rules.value.push({
      rule: ruleName,
      options: ['Yes', 'No'],
      answer,
    });
  }

  // Update the local state of smokingAllowed or petsAllowed
  if (ruleName === 'Smoking Allowed') {
    smokingAllowed.value = answer === 'Yes';
  } else if (ruleName === 'Pets Allowed') {
    petsAllowed.value = answer === 'Yes';
  }
}

// Function to add a new custom rule
function addCustomRule() {
  if (newCustomRule.value.trim()) {
    rules.value.push({ rule: newCustomRule.value.trim() });
    showToast({
          title: "Success",
          message: `${newCustomRule.value.trim()} rule was added successfully!`,
          toastType: "success",
          duration: 3000
        });
    newCustomRule.value = '';
  }
}

// Function to remove a rule by index
function removeRule(index: number) {
  rules.value.splice(index, 1);
}

// Tailwind CSS classes
const activeClass = 'bg-black text-white';
const inactiveClass = 'bg-white text-black';
</script> -->


<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import { useCustomToast } from '@/composables/core/useCustomToast';

const emit = defineEmits(['updateRules']);
const smokingAllowed = ref(false);
const petsAllowed = ref(false);
const newCustomRule = ref<string>('');
const { showToast } = useCustomToast();

// State for rules list (both predefined and custom rules)
const rules = ref<{ rule: string; options?: string[]; answer?: string }[]>([]);

const props = defineProps({
  payload: {
    type: Object,
    default: () => ({ rules: [] }),
  },
});

// Function to ensure default rules are added if not already present
const ensureDefaultRules = () => {
  const defaultRules = [
    { rule: 'Smoking Allowed', options: ['Yes', 'No'], answer: 'No' },
    { rule: 'Pets Allowed', options: ['Yes', 'No'], answer: 'No' }
  ];

  // Loop through default rules and add them if they don't already exist
  defaultRules.forEach((defaultRule) => {
    const existingRule = rules.value.find((r) => r.rule === defaultRule.rule);
    if (!existingRule) {
      rules.value.push({ ...defaultRule });
    } else {
      // Update the local state of smokingAllowed and petsAllowed
      if (defaultRule.rule === 'Smoking Allowed') {
        smokingAllowed.value = existingRule.answer === 'Yes';
      } else if (defaultRule.rule === 'Pets Allowed') {
        petsAllowed.value = existingRule.answer === 'Yes';
      }
    }
  });
};

// Prefill rules on component mounted
onMounted(() => {
  if (Array.isArray(props.payload.rules.value) && props.payload.rules.value.length > 0) {
    rules.value = props.payload.rules.value;
  }

  // Ensure the default rules are populated
  ensureDefaultRules();
});

// Watcher to emit updated rules
watch(
  rules,
  (newRules) => {
    emit('updateRules', newRules); // Emit the updated rules to the parent
  },
  { deep: true }
);

// Toggle function to set the answer for predefined rules
function setAnswer(ruleName: string, answer: string) {
  const rule = rules.value.find((r) => r.rule === ruleName);
  if (rule) {
    rule.answer = answer;
  } else {
    // If the rule doesn't exist, create it
    rules.value.push({
      rule: ruleName,
      options: ['Yes', 'No'],
      answer,
    });
  }

  // Update the local state of smokingAllowed or petsAllowed
  if (ruleName === 'Smoking Allowed') {
    smokingAllowed.value = answer === 'Yes';
  } else if (ruleName === 'Pets Allowed') {
    petsAllowed.value = answer === 'Yes';
  }
}

// Function to add a new custom rule
function addCustomRule() {
  if (newCustomRule.value.trim()) {
    rules.value.push({ rule: newCustomRule.value.trim() });
    showToast({
      title: "Success",
      message: `${newCustomRule.value.trim()} rule was added successfully!`,
      toastType: "success",
      duration: 3000
    });
    newCustomRule.value = '';
  }
}

// Function to remove a rule by index
function removeRule(index: number) {
  rules.value.splice(index, 1);
}

// Tailwind CSS classes
const activeClass = 'bg-black text-white';
const inactiveClass = 'bg-white text-black';
</script>
