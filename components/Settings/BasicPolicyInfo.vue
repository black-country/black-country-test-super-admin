<!-- <template>
    <div class="w-full">
      <h2 class="text-xl font-medium my-4 lg:mb-4">Basic policy information</h2>
 {{ policyObj }}
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-[#101828]">
            Policy Type
          </label>
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
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, reactive, ref, computed, watch } from "vue";
import { useFetchPolicyById } from '@/composables/modules/settings/useFetchPolicyById'
const { loading: fetching, fetchPolicyById, policyObj } = useFetchPolicyById()

  const props = defineProps({
    formData: {
      type: Object,
      required: true,
    },
  });

  const form = reactive({
    title: "",
    audience: "",
  });

  const audiences = ref([
    {
       label: "Tenant",
       key: "tenant-app",
    },
    {
       label: "Agents",
       key: "agent-app",
    },
    {
       label: "Service Provider",
       key: "service-provider-app",
    },
  ]);

  const policyTypesList = ref([
    {
       label: "Privacy Policy",
       key: "privacy_policy",
    },
    {
       label: "Terms Of Use",
       key: "terms_of_use",
    },
  ]);

  onMounted(() => {
    Object.assign(form, props.formData);
    form.title = props.formData.type
    form.audience = props.formData.app
  });

  watch(policyObj.value,
    (newFormData) => {
      form.title = newFormData.type
      form.audience = newFormData.app
    }
  );

  watch(policyObj,
    (newLocalPolicy) => {
      if (newLocalPolicy) {
        form.title = newLocalPolicy.type || '';
        form.audience = newLocalPolicy.app || '';
      }
    }
  );

  const canProceed = computed(() => 
    form.title.trim() !== "" && form.audience !== ""
  );

  const emit = defineEmits(["next"]);

  function handleNext() {
    if (canProceed.value) {
      emit("next", form);
    }
  }
  </script>

  <style scoped>
  /* Add custom styles if needed */
  </style> -->


  <template>
    <div v-if="!fetching" class="w-full">
      <h2 class="text-xl font-medium my-4 lg:mb-4">Basic policy information</h2>
      <!-- {{ policyObj }} -->
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-[#101828]">
            Policy Type
          </label>
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
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, reactive, ref, computed, watch } from "vue";
  
  const form = reactive({
    title: "",
    audience: "",
  });
  
  const props = defineProps({
    policyObj: {
      type: Object,
      required: true, // Ensure policyObj is always provided
    },
  });
  
  const audiences = ref([
    {
      label: "Tenant",
      key: "tenant-app",
    },
    {
      label: "Agents",
      key: "agent-app",
    },
    {
      label: "Service Provider",
      key: "service-provider-app",
    },
  ]);
  
  const policyTypesList = ref([
    {
      label: "Privacy Policy",
      key: "privacy_policy",
    },
    {
      label: "Terms Of Use",
      key: "terms_of_use",
    },
  ]);
  
  // Initialize the form with the policyObj data when the component is mounted
  onMounted(() => {
    if (props.policyObj) {
      form.title = props.policyObj.type || "";
      form.audience = props.policyObj.app || "";
    }
  });
  
  // Watch for changes to policyObj and update the form reactively
  watch(
    () => props.policyObj,
    (newPolicyObj) => {
      if (newPolicyObj) {
        console.log(newPolicyObj, "Detected from watcher");
        form.title = newPolicyObj.type || ""; // Access type directly
        form.audience = newPolicyObj.app || ""; // Access app directly
      }
    },
    { immediate: true } // Ensures the watcher runs immediately on initialization
  );
  
  // Computed property to check if the form can proceed
  const canProceed = computed(() => 
    form.title.trim() !== "" && form.audience.trim() !== ""
  );
  
  // Define an emit event to trigger "next"
  const emit = defineEmits(["next"]);
  
  function handleNext() {
    console.log(form, "Form data before emitting");
    if (canProceed.value) {
      emit("next", form); // Emit form data to the parent component
    }
  }
  </script>
  
  <style scoped>
  /* Add custom styles if needed */
  </style>
  